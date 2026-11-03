import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAiModelCandidates, type AiModelCandidate } from "@/lib/ai/provider";
import { analyzeScamContent } from "@/lib/scam-analysis";
import { analyzerSchema } from "@/lib/validation/schemas";

const scamModelSchema = z.object({
  probability: z.number().min(0).max(100),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  explanation: z.string(),
  recommendedActions: z.array(z.string()),
});

type ScamAnalysisResult = z.infer<typeof scamModelSchema>;

async function getModelAnalysis(
  candidate: AiModelCandidate,
  content: string,
  language: string,
): Promise<ScamAnalysisResult | null> {
  const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    mr: "Marathi"
  };
  const langName = LANGUAGE_NAMES[language] ?? "English";

  const systemPrompt =
    language === "hi"
      ? "आप एक पेशेवर साइबर सुरक्षा विश्लेषक हैं। संदिग्ध संदेश, ईमेल या यूआरएल का विश्लेषण करें। स्कीमा के अनुसार केवल वैध JSON प्रदान करें।"
      : `You are a professional cyber safety analyst. Analyze the suspicious message, email, or URL and output a detailed assessment in ${langName} according to the schema.`;

  const promptText = `Analyze the following content:
"${content}"

Provide the assessment in ${langName} representing:
1. Probability of being a scam (0 to 100).
2. Risk level ("Low", "Medium", or "High").
3. A short, practical explanation paragraph.
4. 2-3 specific recommended actions.`;

  try {
    const { object } = await generateObject({
      model: candidate.model,
      schema: scamModelSchema,
      system: systemPrompt,
      prompt: promptText,
    });
    return object;
  } catch (error) {
    console.error(`Scam analysis failed for candidate [${candidate.provider}]:`, error);
    return null;
  }
}

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

  // 1. Run local rules-based heuristic first
  const heuristicAnalysis = analyzeScamContent(content, language);

  // 2. Fetch AI candidates
  const candidates = getAiModelCandidates();
  const openaiCandidate = candidates.find((c) => c.provider === "openai");
  const googleCandidate = candidates.find((c) => c.provider === "google");

  if (!openaiCandidate && !googleCandidate) {
    return NextResponse.json({
      ...heuristicAnalysis,
      source: "heuristic",
      gpt: null,
      gemini: null,
    });
  }

  // 3. Run AI validations in parallel
  const [gptResult, geminiResult] = await Promise.all([
    openaiCandidate ? getModelAnalysis(openaiCandidate, content, language) : Promise.resolve(null),
    googleCandidate ? getModelAnalysis(googleCandidate, content, language) : Promise.resolve(null),
  ]);

  if (!gptResult && !geminiResult) {
    return NextResponse.json({
      ...heuristicAnalysis,
      source: "heuristic",
      gpt: null,
      gemini: null,
    });
  }

  // 4. Consolidate results
  const activeResults = [gptResult, geminiResult].filter((r): r is ScamAnalysisResult => r !== null);
  
  const avgProbability = Math.round(
    activeResults.reduce((sum, r) => sum + r.probability, 0) / activeResults.length
  );

  // Determine final risk level (highest of the two)
  let resolvedRiskLevel: "Low" | "Medium" | "High" = "Low";
  if (activeResults.some((r) => r.riskLevel === "High")) {
    resolvedRiskLevel = "High";
  } else if (activeResults.some((r) => r.riskLevel === "Medium")) {
    resolvedRiskLevel = "Medium";
  }

  // Combine explanations
  const explanationParts: string[] = [];
  if (gptResult) explanationParts.push(`[GPT-4o]: ${gptResult.explanation}`);
  if (geminiResult) explanationParts.push(`[Gemini]: ${geminiResult.explanation}`);
  const consolidatedExplanation = explanationParts.join(" ");

  // Combine unique recommended actions
  const allActions = new Set<string>();
  activeResults.forEach((r) => r.recommendedActions.forEach((act) => allActions.add(act)));
  const consolidatedActions = Array.from(allActions);

  // Ensure immediate fallback actions from heuristic if AI responses are empty
  const recommendedActions = consolidatedActions.length > 0 
    ? consolidatedActions 
    : heuristicAnalysis.recommendedActions;

  return NextResponse.json({
    probability: avgProbability,
    riskLevel: resolvedRiskLevel,
    explanation: consolidatedExplanation,
    matchedSignals: heuristicAnalysis.matchedSignals,
    recommendedActions,
    source: activeResults.length === 2 ? "dual-ai" : activeResults[0] === gptResult ? "openai" : "google",
    gpt: gptResult,
    gemini: geminiResult,
  });
}
