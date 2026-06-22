import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getAiModel } from "@/lib/ai/provider";

export async function POST(request: Request) {
  let body: { text?: string; targetLanguage?: string; sourceLanguage?: string };
  try {
    body = await request.json() as { text?: string; targetLanguage?: string; sourceLanguage?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { text, targetLanguage, sourceLanguage } = body;

  if (!text || !targetLanguage) {
    return NextResponse.json({ error: "Missing 'text' or 'targetLanguage'." }, { status: 400 });
  }

  const activeModel = getAiModel();
  if (!activeModel) {
    return NextResponse.json({ translatedText: text, source: "fallback" });
  }

  const langNames = {
    en: "English",
    hi: "Hindi",
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    mr: "Marathi",
  };

  const targetLangName = langNames[targetLanguage as keyof typeof langNames] || "English";
  const sourceLangName = sourceLanguage ? (langNames[sourceLanguage as keyof typeof langNames] || "auto-detected") : "auto-detected";

  try {
    const systemPrompt = `You are a professional translator. Translate the given text from ${sourceLangName} to ${targetLangName}. Keep formatting, line breaks, code snippets, markdown, emojis, HTML tags, and technical jargon intact. Output ONLY the translated text. Do not add any greetings, prefaces, explanations, or quotes.`;

    const { text: translatedText } = await generateText({
      model: activeModel.model,
      system: systemPrompt,
      prompt: text,
    });

    return NextResponse.json({
      translatedText: translatedText.trim() || text,
      source: activeModel.provider,
    });
  } catch (error) {
    console.error("AI translation API failed:", error);
    return NextResponse.json({ translatedText: text, source: "fallback" });
  }
}
