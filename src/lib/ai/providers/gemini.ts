import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  IAIProvider,
  AIFlashcardGenerationRequest,
  AIFlashcardResponse,
  AIQuizGenerationRequest,
  AIQuizResponse,
} from "../types";

/**
 * Google Gemini Provider Implementation
 * Uses Gemini 2.0 Flash for flashcard and quiz generation
 */
export class GeminiProvider implements IAIProvider {
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async generateFlashcards(req: AIFlashcardGenerationRequest): Promise<AIFlashcardResponse> {
    if (!this.client) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `Generate flashcards from the note below.
Return ONLY valid JSON (no markdown, no code blocks): { "cards": [{ "front": string, "back": string }] }
Requirements:
- 16 to 24 cards
- Front: short question/term, Back: clear answer
- Language: match the note language
- Return ONLY JSON, no other text

Note title: ${req.noteTitle}
Subject: ${req.noteSubject || "Unknown"}
Description: ${req.noteDescription || ""}
Content:
${req.noteContent}`;

    const model = this.client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const parsed = JSON.parse(cleanedText);

    if (!Array.isArray(parsed.cards)) {
      throw new Error("Invalid response format from Gemini");
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
      throw new Error("Gemini API key not configured");
    }

    const prompt = `Generate a quiz from the note below.
Return ONLY valid JSON (no markdown, no code blocks): { "title": string, "description": string, "questions": [{ "question": string, "options": string[], "correctAnswerIndex": number }] }
Requirements:
- 5 to 8 questions
- Each question must have 4 options
- correctAnswerIndex is 0-based (0, 1, 2, or 3)
- Keep language same as note
- Return ONLY JSON, no other text

Note title: ${req.noteTitle}
Subject: ${req.noteSubject || "Unknown"}
Description: ${req.noteDescription || ""}
Content:
${req.noteContent}`;

    const model = this.client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const parsed = JSON.parse(cleanedText);

    if (!parsed?.title || !Array.isArray(parsed?.questions)) {
      throw new Error("Invalid response format from Gemini");
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
}
