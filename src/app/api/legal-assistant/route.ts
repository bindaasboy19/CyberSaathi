import { generateText } from "ai";
import { NextResponse } from "next/server";

import { getAiModel } from "@/lib/ai/provider";
import {
  buildLegalComplaintDraft,
  buildLegalFallbackReply,
} from "@/lib/legal-guidance";
import { legalAssistantSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const parsed = legalAssistantSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid legal request." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const draft = buildLegalComplaintDraft(input);
  const activeModel = getAiModel();

  if (!activeModel) {
    return NextResponse.json({
      reply: buildLegalFallbackReply(input),
      draft,
      source: "fallback",
    });
  }

  try {
    const { text } = await generateText({
      model: activeModel.model,
      system:
        input.language === "hi"
          ? "आप CyberSaathi Legal AI हैं। आप लाइसेंस प्राप्त वकील होने का दावा नहीं करते। भारतीय साइबर अपराध पीड़ितों को सरल भाषा में व्यावहारिक कानूनी-प्रक्रिया मार्गदर्शन दें। निश्चित कानूनी परिणामों का वादा न करें। cybercrime.gov.in, 1930, बैंक/प्लेटफॉर्म और FIR/पुलिस शिकायत के कदम बताएं।"
          : "You are CyberSaathi Legal AI. You are not a licensed lawyer and must not claim to be one. Give simple, practical legal-process guidance for Indian cybercrime victims. Do not guarantee outcomes. Explain filing steps through cybercrime.gov.in, 1930, bank/platform escalation, and FIR/police complaint guidance when appropriate.",
      prompt: `User incident:
${input.description}

Known details:
- Problem type: ${draft.problemType}
- Incident date/time: ${draft.dateTime}
- Transaction details: ${draft.transactionDetails}
- Evidence notes: ${input.evidenceNotes || "Not provided"}

Write a concise guided response with:
1. Classification
2. Immediate actions
3. Reporting steps
4. Follow-up questions if information is missing
5. A clear statement that this is AI guidance, not legal representation.`,
    });

    return NextResponse.json({
      reply: text.trim() || buildLegalFallbackReply(input),
      draft,
      source: activeModel.provider,
    });
  } catch {
    return NextResponse.json({
      reply: buildLegalFallbackReply(input),
      draft,
      source: "fallback",
    });
  }
}
