import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export type AiModelCandidate = {
  provider: "openai" | "google";
  modelId: string;
  model: ReturnType<typeof openai> | ReturnType<typeof google>;
};

function unique(values: string[]) {
  const cleaned = values.map((value) => value.trim()).filter(Boolean);
  return [...new Set(cleaned)];
}

function getOpenAiCandidates() {
  if (!process.env.OPENAI_API_KEY) {
    return [] as AiModelCandidate[];
  }

  const modelIds = unique([
    process.env.OPENAI_MODEL || "gpt-4.1-mini",
    "gpt-4.1-mini",
    "gpt-4o-mini",
  ]);

  return modelIds.map((modelId) => ({
    provider: "openai" as const,
    modelId,
    model: openai(modelId),
  }));
}

function getGoogleCandidates() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return [] as AiModelCandidate[];
  }

  const modelIds = unique([
    process.env.GOOGLE_MODEL || "gemini-2.5-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
  ]);

  return modelIds.map((modelId) => ({
    provider: "google" as const,
    modelId,
    model: google(modelId),
  }));
}

export function getAiModelCandidates() {
  const providerPreference = (process.env.AI_PROVIDER ?? "openai").toLowerCase();
  const openAiCandidates = getOpenAiCandidates();
  const googleCandidates = getGoogleCandidates();
  const primary = providerPreference === "google" ? googleCandidates : openAiCandidates;
  const secondary = providerPreference === "google" ? openAiCandidates : googleCandidates;
  const ordered: AiModelCandidate[] = [];
  const maxLen = Math.max(primary.length, secondary.length);

  for (let index = 0; index < maxLen; index += 1) {
    if (primary[index]) {
      ordered.push(primary[index]);
    }
    if (secondary[index]) {
      ordered.push(secondary[index]);
    }
  }

  return ordered;
}

export function getAiModel() {
  return getAiModelCandidates()[0] ?? null;
}
