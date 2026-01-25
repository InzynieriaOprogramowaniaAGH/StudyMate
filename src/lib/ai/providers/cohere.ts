import "server-only";
import { CohereClient } from "cohere-ai";
import {
  IAIProvider,
  AIFlashcardGenerationRequest,
  AIFlashcardResponse,
  AIQuizGenerationRequest,
  AIQuizResponse,
} from "../types";

/**
 * Cohere Provider Implementation
 * Uses Command R+ for flashcard and quiz generation
 */
export class CohereProvider implements IAIProvider {
  private client: CohereClient | null = null;

  constructor() {
    const apiKey = process.env.COHERE_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      this.client = new CohereClient({ token: apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async generateFlashcards(
    request: AIFlashcardGenerationRequest
  ): Promise<AIFlashcardResponse> {
    if (!this.client) {
      throw new Error("Cohere API key not configured");
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

    const response = await this.client.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      preamble: "Return only valid JSON with the described structure.",
      temperature: 0.3,
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from Cohere");
    }

    let cleanText = text;
    // Cohere sometimes wraps JSON in markdown code blocks
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.error("Failed to parse Cohere flashcard response:", err, cleanText);
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
      throw new Error("Cohere API key not configured");
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

    const response = await this.client.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      preamble: "Return only valid JSON with the described structure.",
      temperature: 0.4,
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from Cohere");
    }

    let cleanText = text;
    // Cohere sometimes wraps JSON in markdown code blocks
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.error("Failed to parse Cohere quiz response:", err, cleanText);
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
}
