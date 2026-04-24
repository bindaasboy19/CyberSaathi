import { generateText } from "ai";
import { NextResponse } from "next/server";

import { getAiModel } from "@/lib/ai/provider";
import { analyzeScamContent } from "@/lib/scam-analysis";
import { analyzerSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = analyzerSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { content, language } = parsed.data;
  const analysis = analyzeScamContent(content, language);
  const activeModel = getAiModel();

  if (!activeModel) {
    return NextResponse.json({
      ...analysis,
      source: "heuristic",
    });
  }

  try {
    const { text } = await generateText({
      model: activeModel.model,
      system:
        language === "hi"
          ? "आप एक साइबर सुरक्षा विश्लेषक हैं। संक्षिप्त, स्पष्ट, गैर-तकनीकी हिंदी में केवल जोखिम का कारण समझाएँ। कोई औपचारिक अस्वीकरण न जोड़ें।"
          : "You are a cyber safety analyst. In plain English, explain why the content looks risky or safe. Be concise and practical.",
      prompt: `Content to review:
${content}

Current heuristic assessment:
- Scam probability: ${analysis.probability}
- Risk level: ${analysis.riskLevel}
- Signals: ${analysis.matchedSignals.join("; ") || "No strong signals"}

Write one short paragraph explanation in ${language === "hi" ? "Hindi" : "English"}.`,
    });

    return NextResponse.json({
      ...analysis,
      explanation: text.trim() || analysis.explanation,
      source: activeModel.provider,
    });
  } catch {
    return NextResponse.json({
      ...analysis,
      source: "heuristic",
    });
  }
}
