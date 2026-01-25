import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  IAIProvider,
  AIFlashcardGenerationRequest,
  AIFlashcardResponse,
  AIQuizGenerationRequest,
  AIQuizResponse,
} from "../types";

/**
 * Anthropic Claude Provider Implementation
 * Uses Claude 3.5 Sonnet for flashcard and quiz generation
 */
export class ClaudeProvider implements IAIProvider {
  private client: Anthropic | null = null;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      this.client = new Anthropic({ apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async generateFlashcards(
    request: AIFlashcardGenerationRequest
  ): Promise<AIFlashcardResponse> {
    if (!this.client) {
      throw new Error("Claude API key not configured");
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

    const message = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    let text = content.text.trim();
    
    // Claude sometimes wraps JSON in markdown code blocks
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Claude flashcard response:", err, text);
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
      throw new Error("Claude API key not configured");
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

    const message = await this.client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    let text = content.text.trim();
    
    // Claude sometimes wraps JSON in markdown code blocks
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Claude quiz response:", err, text);
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
