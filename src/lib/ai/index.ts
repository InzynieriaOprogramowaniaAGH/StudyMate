import "server-only";
import { IAIProvider } from "./types";
import { OpenAIProvider } from "./providers/openai";
import { GeminiProvider } from "./providers/gemini";
import { ClaudeProvider } from "./providers/claude";
import { MistralProvider } from "./providers/mistral";
import { CohereProvider } from "./providers/cohere";

/**
 * AI Provider Factory
 * Selects the appropriate AI provider based on environment configuration
 * Falls back to available provider if configured one is unavailable
 */

type AIProviderType = "openai" | "gemini" | "claude" | "mistral" | "cohere";

function getConfiguredProvider(): AIProviderType {
  const configured = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const validProviders: AIProviderType[] = ["openai", "gemini", "claude", "mistral", "cohere"];
  return validProviders.includes(configured as AIProviderType) 
    ? (configured as AIProviderType) 
    : "openai";
}

function createProvider(type: AIProviderType): IAIProvider {
  switch (type) {
    case "gemini":
      return new GeminiProvider();
    case "claude":
      return new ClaudeProvider();
    case "mistral":
      return new MistralProvider();
    case "cohere":
      return new CohereProvider();
    case "openai":
    default:
      return new OpenAIProvider();
  }
}

/**
 * Get the active AI provider
 * - Uses configured provider if available
 * - Falls back to first available provider
 * - Throws error if no provider is available
 */
export function getAIProvider(): IAIProvider {
  const configured = getConfiguredProvider();
  const provider = createProvider(configured);

  // If configured provider is available, use it
  if (provider.isAvailable()) {
    return provider;
  }

  // Try all other providers as fallback
  const allProviders: AIProviderType[] = ["openai", "gemini", "claude", "mistral", "cohere"];
  for (const providerType of allProviders) {
    if (providerType === configured) continue; // Skip already tried
    const fallbackProvider = createProvider(providerType);
    if (fallbackProvider.isAvailable()) {
      console.warn(
        `Configured AI provider '${configured}' not available, falling back to '${providerType}'`
      );
      return fallbackProvider;
    }
  }

  // No provider available
  throw new Error(
    "No AI provider available. Please configure at least one API key: OPENAI_API_KEY, GEMINI_API_KEY, CLAUDE_API_KEY, MISTRAL_API_KEY, or COHERE_API_KEY in .env"
  );
}

/**
 * Check which providers are available
 */
export function getAvailableProviders(): Record<AIProviderType, boolean> {
  return {
    openai: new OpenAIProvider().isAvailable(),
    gemini: new GeminiProvider().isAvailable(),
    claude: new ClaudeProvider().isAvailable(),
    mistral: new MistralProvider().isAvailable(),
    cohere: new CohereProvider().isAvailable(),
  };
}

/**
 * Get all available provider instances
 */
export function getAllAvailableProviders(): IAIProvider[] {
  const providers: IAIProvider[] = [
    new OpenAIProvider(),
    new GeminiProvider(),
    new ClaudeProvider(),
    new MistralProvider(),
    new CohereProvider(),
  ];
  return providers.filter(p => p.isAvailable());
}

/**
 * Get name of currently active provider
 */
export function getActiveProviderName(): string {
  const provider = getAIProvider();
  if (provider instanceof OpenAIProvider) return "OpenAI";
  if (provider instanceof GeminiProvider) return "Google Gemini";
  if (provider instanceof ClaudeProvider) return "Anthropic Claude";
  if (provider instanceof MistralProvider) return "Mistral AI";
  if (provider instanceof CohereProvider) return "Cohere";
  return "Unknown";
}

export type { IAIProvider };
export * from "./types";
