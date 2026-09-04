import { createOpenAI } from "@ai-sdk/openai";

/** Default model via OpenRouter (DeepSeek chat, tool-capable). */
export const OPENROUTER_MODEL = "deepseek/deepseek-chat";

/**
 * OpenRouter client using Chat Completions (not OpenAI Responses API).
 * Default createOpenAI()(model) would hit /responses and break tool loops.
 */
export function getModel(apiKey: string) {
  const openrouter = createOpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    name: "openrouter",
    headers: {
      "HTTP-Referer": "http://localhost:8787",
      "X-Title": "Exam Concept Agent"
    }
  });
  return openrouter.chat(OPENROUTER_MODEL);
}
