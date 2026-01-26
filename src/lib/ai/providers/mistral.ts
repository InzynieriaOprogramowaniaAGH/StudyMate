import "server-only";
import { Mistral } from "@mistralai/mistralai";
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
 * Mistral AI Provider Implementation
 * Uses Mistral Large for flashcard and quiz generation
 */
export class MistralProvider implements IAIProvider {
  private client: Mistral | null = null;

  constructor() {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      this.client = new Mistral({ apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async generateFlashcards(
    request: AIFlashcardGenerationRequest
  ): Promise<AIFlashcardResponse> {
    if (!this.client) {
      throw new Error("Mistral API key not configured");
    }

    const prompt = `Generate flashcards from the note below.
Return JSON: { cards: [{ front: string, back: string }] }
- Generate 16 to 24 flashcards
- Keep language same as note
- front: question or term
- back: detailed answer or definition

Note title: ${request.noteTitle}
Subject: ${request.noteSubject || "Unknown"}
Description: ${request.noteDescription || ""}
Content:
${request.noteContent}`;

    const chatResponse = await this.client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "Return only valid JSON with the described structure.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: { type: "json_object" },
      temperature: 0.3,
    });

    const content = chatResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Mistral");
    }

    // Ensure content is string
    const textContent = typeof content === "string" ? content : JSON.stringify(content);

    let parsed: any;
    try {
      parsed = JSON.parse(textContent);
    } catch (err) {
      console.error("Failed to parse Mistral flashcard response:", err, textContent);
      throw new Error("Failed to parse AI response");
    }

    if (!parsed?.cards || !Array.isArray(parsed.cards)) {
      throw new Error("Invalid response structure from AI");
    }

    const cards = parsed.cards
      .filter((c: any) => c?.front && c?.back)
      .map((c: any) => ({
        front: String(c.front),
        back: String(c.back),
      }));

    return { cards };
  }

  async generateQuiz(
    request: AIQuizGenerationRequest
  ): Promise<AIQuizResponse> {
    if (!this.client) {
      throw new Error("Mistral API key not configured");
    }

    const prompt = `Generate a quiz from the note below.
Return JSON: { title: string, description: string, questions: [{ question: string, options: string[], correctAnswerIndex: number }] }
- 5 to 8 questions
- Each question must have 4 options
- correctAnswerIndex is 0-based
- Keep language same as note

Note title: ${request.noteTitle}
Subject: ${request.noteSubject || "Unknown"}
Description: ${request.noteDescription || ""}
Content:
${request.noteContent}`;

    const chatResponse = await this.client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "Return only valid JSON with the described structure.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: { type: "json_object" },
      temperature: 0.4,
    });

    const content = chatResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Mistral");
    }

    // Ensure content is string
    const textContent = typeof content === "string" ? content : JSON.stringify(content);

    let parsed: any;
    try {
      parsed = JSON.parse(textContent);
    } catch (err) {
      console.error("Failed to parse Mistral quiz response:", err, textContent);
      throw new Error("Failed to parse AI response");
    }

    if (!parsed?.title || !Array.isArray(parsed?.questions)) {
      throw new Error("Invalid response structure from AI");
    }

    const questions = parsed.questions
      .filter(
        (q: any) =>
          q?.question && Array.isArray(q.options) && q.options.length >= 2
      )
      .map((q: any) => ({
        question: String(q.question),
        options: q.options.map((o: any) => String(o)),
        correctAnswerIndex:
          typeof q.correctAnswerIndex === "number" ? q.correctAnswerIndex : 0,
      }));

    return {
      title: String(parsed.title),
      description: parsed.description ? String(parsed.description) : undefined,
      questions,
    };
  }

  async generateNote(
    request: AINoteGenerationRequest
  ): Promise<AINoteResponse> {
    if (!this.client) {
      throw new Error("Mistral API key not configured");
    }

    const prompt = `Jesteś ekspertem w tworzeniu zwięzłych, uporządkowanych notatek do nauki.
Zwracaj wynik wyłącznie jako JSON z kluczami: title, subject, description, content.
- title: krótki tytuł (max 120 znaków)
- subject: nazwa przedmiotu/obszaru (np. Algebra, Analiza, Fizyka, Biologia)
- description: 1-2 zdania streszczenia
- content: notatka w Markdown, nagłówki + wypunktowania, bez nadmiarowych komentarzy.
Nie duplikuj subject ani title wewnątrz content.

Materiał wejściowy:
---
${request.inputText.slice(0, 5000)}
---`;

    const chatResponse = await this.client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "Return only valid JSON with the described structure.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      responseFormat: { type: "json_object" },
      temperature: 0.25,
    });

    const content = chatResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Mistral");
    }

    const textContent = typeof content === "string" ? content : JSON.stringify(content);

    let parsed: any;
    try {
      parsed = JSON.parse(textContent);
    } catch (err) {
      console.error("Failed to parse Mistral note response:", err, textContent);
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
