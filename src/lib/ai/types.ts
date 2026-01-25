/**
 * Unified interface for AI providers
 * All providers must implement these methods for consistency
 */

export interface AIFlashcardGenerationRequest {
  noteTitle: string;
  noteSubject: string | undefined;
  noteDescription: string | undefined;
  noteContent: string;
}

export interface AIFlashcard {
  front: string;
  back: string;
}

export interface AIFlashcardResponse {
  cards: AIFlashcard[];
}

export interface AIQuizGenerationRequest {
  noteTitle: string;
  noteSubject: string | undefined;
  noteDescription: string | undefined;
  noteContent: string;
}

export interface AIQuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface AIQuizResponse {
  title: string;
  description?: string;
  questions: AIQuizQuestion[];
}

/**
 * Main AI Provider interface
 */
export interface IAIProvider {
  isAvailable(): boolean;
  generateFlashcards(req: AIFlashcardGenerationRequest): Promise<AIFlashcardResponse>;
  generateQuiz(req: AIQuizGenerationRequest): Promise<AIQuizResponse>;
}
