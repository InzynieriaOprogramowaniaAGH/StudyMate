
import "server-only";
import OpenAI from "openai";

/**
 * Zwraca klienta OpenAI albo null, jeśli klucza brak.
 * ZERO wyjątków w czasie importu modułu – bezpieczne dla builda.
 */
export function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.trim() === "") {
    return null;
  }
  return new OpenAI({ apiKey: key });
}

/** Flaga pomocnicza do łatwych if-ów w kodzie */
export const OPENAI_AVAILABLE = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
