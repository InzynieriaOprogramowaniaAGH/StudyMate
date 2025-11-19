
import "server-only";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Brak OPENAI_API_KEY w .env");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
