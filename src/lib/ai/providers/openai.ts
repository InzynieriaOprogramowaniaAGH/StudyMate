import "server-only";
import OpenAI from "openai";
import {
  IAIProvider,
  AIFlashcardGenerationRequest,
  AIFlashcardResponse,
  AIQuizGenerationRequest,
  AIQuizResponse,
  AINoteGenerationRequest,
  AINoteResponse,
} from "../types";

/**
 * OpenAI Provider Implementation
 * Uses GPT-4o-mini for flashcard and quiz generation
 */
export class OpenAIProvider implements IAIProvider {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      this.client = new OpenAI({ apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async generateFlashcards(req: AIFlashcardGenerationRequest): Promise<AIFlashcardResponse> {
    if (!this.client) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `Generate flashcards from the note below.
Return JSON: { cards: [{ front: string, back: string }] }
Requirements:
- 16 to 24 cards
- Front: short question/term, Back: clear answer
- Language: match the note language

Note title: ${req.noteTitle}
Subject: ${req.noteSubject || "Unknown"}
Description: ${req.noteDescription || ""}
Content:\n${req.noteContent}`;

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return only JSON in English keys." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.cards)) {
      throw new Error("Invalid response format from OpenAI");
    }

    const cards = parsed.cards
      .filter((c: any) => c?.front && c?.back)
      .map((c: any) => ({ front: String(c.front), back: String(c.back) }));

    if (!cards.length) {
      throw new Error("No flashcards generated");
    }

    return { cards };
  }

  async generateQuiz(req: AIQuizGenerationRequest): Promise<AIQuizResponse> {
    if (!this.client) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `Generate a quiz from the note below.
Return JSON: { title: string, description: string, questions: [{ question: string, options: string[], correctAnswerIndex: number }] }
Requirements:
- 5 to 8 questions
- Each question must have 4 options
- correctAnswerIndex is 0-based
- Keep language same as note

Note title: ${req.noteTitle}
Subject: ${req.noteSubject || "Unknown"}
Description: ${req.noteDescription || ""}
Content:\n${req.noteContent}`;

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return only JSON with the described structure." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    if (!parsed?.title || !Array.isArray(parsed?.questions)) {
      throw new Error("Invalid response format from OpenAI");
    }

    const questions = parsed.questions
      .filter((q: any) => q?.question && Array.isArray(q.options) && q.options.length >= 2)
      .map((q: any) => ({
        question: String(q.question),
        options: q.options.map((o: any) => String(o)),
        correctAnswerIndex: typeof q.correctAnswerIndex === "number" ? q.correctAnswerIndex : 0,
      }));

    if (!questions.length) {
      throw new Error("No questions generated");
    }

    return {
      title: String(parsed.title),
      description: parsed.description ? String(parsed.description) : undefined,
      questions,
    };
  }

  async generateNote(req: AINoteGenerationRequest): Promise<AINoteResponse> {
    if (!this.client) {
      throw new Error("OpenAI API key not configured");
    }

    const systemPrompt = `Jesteś ekspertem w tworzeniu zwięzłych, uporządkowanych notatek do nauki.
Zwracaj wynik *wyłącznie* jako JSON z kluczami: title, subject, description, content.
- title: krótki tytuł (max 120 znaków)
- subject: nazwa przedmiotu/obszaru (np. Algebra, Analiza, Fizyka, Biologia)
- description: 1-2 zdania streszczenia
- content: notatka w Markdown, nagłówki + wypunktowania, bez nadmiarowych komentarzy.
Nie duplikuj subject ani title wewnątrz content.`;

    const userPrompt = `Opracuj notatkę na podstawie materiału poniżej.
Wypełnij pola title, subject, description oraz content (Markdown, zwięzły):

---
${req.inputText.slice(0, 5000)}
---`;

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.25,
      max_tokens: 2000,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    let parsed: any = {};
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse error from OpenAI note response", err, raw);
      throw new Error("Failed to parse AI response");
    }

    if (!parsed?.content) {
      throw new Error("AI nie wygenerował zawartości");
    }

    return {
      title: parsed.title || "",
      subject: parsed.subject || "",
      description: parsed.description || "",
      content: parsed.content,
    };
  }
}
