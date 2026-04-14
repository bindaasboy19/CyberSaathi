import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export function getAiModel() {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();

  if (
    provider === "google" &&
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ) {
    return {
      provider: "google",
      model: google(process.env.GOOGLE_MODEL || "gemini-2.5-flash"),
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: openai(process.env.OPENAI_MODEL || "gpt-5-mini"),
    };
  }

  return null;
}
