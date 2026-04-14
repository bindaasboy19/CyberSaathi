import { generateText } from "ai";
import { NextResponse } from "next/server";

import {
  buildFallbackAssistantReply,
  getAssistantSystemPrompt,
} from "@/lib/ai/prompts";
import { getAiModel } from "@/lib/ai/provider";
import { assistantInputSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = assistantInputSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { language, message } = parsed.data;
  const activeModel = getAiModel();

  if (!activeModel) {
    return NextResponse.json({
      reply: buildFallbackAssistantReply(message, language),
      source: "fallback",
    });
  }

  try {
    const { text } = await generateText({
      model: activeModel.model,
      system: getAssistantSystemPrompt(language),
      prompt: message,
    });

    return NextResponse.json({
      reply: text,
      source: activeModel.provider,
    });
  } catch {
    return NextResponse.json({
      reply: buildFallbackAssistantReply(message, language),
      source: "fallback",
    });
  }
}
