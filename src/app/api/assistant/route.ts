import { generateText } from "ai";
import { NextResponse } from "next/server";

import {
  buildFallbackAssistantReply,
  getAssistantSystemPrompt,
} from "@/lib/ai/prompts";
import { getAiModelCandidates } from "@/lib/ai/provider";
import { assistantInputSchema } from "@/lib/validation/schemas";

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = assistantInputSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { language, message } = parsed.data;
  const candidates = getAiModelCandidates().slice(0, 3);

  if (!candidates.length) {
    return NextResponse.json({
      reply: buildFallbackAssistantReply(message, language),
      source: "fallback",
      reason: "No AI provider key is configured.",
    });
  }

  const errors: string[] = [];

  for (const candidate of candidates) {
    try {
      const { text } = await withTimeout(
        generateText({
          model: candidate.model,
          system: getAssistantSystemPrompt(language),
          prompt: message,
        }),
        25000,
      );

      if (text.trim()) {
        return NextResponse.json({
          reply: text,
          source: `${candidate.provider}:${candidate.modelId}`,
        });
      }
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : `Unknown ${candidate.provider} error.`;
      console.error(`AI candidate error [${candidate.provider}:${candidate.modelId}]:`, reason);
      errors.push(`${candidate.provider}:${candidate.modelId} -> ${reason}`);
    }
  }

  return NextResponse.json({
    reply: buildFallbackAssistantReply(message, language),
    source: "fallback",
    reason: errors[0] ?? "All AI providers failed.",
  });
}
