/**
 * Amal Yatri AI Assistant — provider abstraction.
 *
 * The platform MUST be able to swap between providers without touching
 * controller code:
 *
 *   - stub      → safe local fallback used in dev, demos, and offline tests
 *   - openai    → GPT-4o / 4o-mini via OpenAI API (or Azure OpenAI)
 *   - anthropic → Claude via Anthropic API
 *   - local     → any OpenAI-compatible local server (Ollama, vLLM, LM Studio)
 *
 * Every provider implements `complete()` returning an AiCompletion. RAG
 * hooks live in the service layer; providers stay stateless.
 */

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletion {
  content: string;
  model: string;
  tokensIn?: number;
  tokensOut?: number;
  meta?: Record<string, unknown>;
}

export interface AiProvider {
  /** Lowercase provider id, matches AI_PROVIDER env var */
  readonly id: 'stub' | 'openai' | 'anthropic' | 'local';

  /** Generate a completion given a system prompt and a chat history. */
  complete(args: { system: string; messages: AiMessage[] }): Promise<AiCompletion>;
}

// Module-level safety: every response (real or stub) MUST carry the same
// medical disclaimer the platform commits to in our compliance docs.
export const SAFETY_DISCLAIMER =
  "I'm an AI wellness companion, not a doctor. For diagnosis, prescriptions, or anything urgent, please reach out to your Amal Tamara doctor or local emergency services.";
