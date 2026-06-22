"use client";

import { AlertTriangle, LoaderCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Textarea } from "@/components/ui/textarea";
import type { ScamAnalysis } from "@/types";

type ModelResult = {
  probability: number;
  riskLevel: "Low" | "Medium" | "High";
  explanation: string;
  recommendedActions: string[];
} | null;

type AnalyzerState = ScamAnalysis & {
  source: string;
  gpt?: ModelResult;
  gemini?: ModelResult;
};

const riskVariants = {
  Low: "accent",
  Medium: "warning",
  High: "danger",
} as const;

export function ScamAnalyzer() {
  const { language, pick } = useLanguage();
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalyzerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"combined" | "gpt" | "gemini">("combined");

  const legalHref = `/legal?${new URLSearchParams({
    description: content,
    problemType: result?.riskLevel ? "scam analysis" : "cyber incident",
  }).toString()}`;

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveTab("combined");

    try {
      const response = await fetch("/api/analyze-scam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          language,
        }),
      });

      const data = (await response.json()) as AnalyzerState & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to analyze the content.");
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to analyze the content.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Determine which data to show based on the active tab
  const displayData = (() => {
    if (!result) return null;
    if (activeTab === "gpt" && result.gpt) {
      return {
        probability: result.gpt.probability,
        riskLevel: result.gpt.riskLevel,
        explanation: result.gpt.explanation,
        recommendedActions: result.gpt.recommendedActions,
      };
    }
    if (activeTab === "gemini" && result.gemini) {
      return {
        probability: result.gemini.probability,
        riskLevel: result.gemini.riskLevel,
        explanation: result.gemini.explanation,
        recommendedActions: result.gemini.recommendedActions,
      };
    }
    return {
      probability: result.probability,
      riskLevel: result.riskLevel,
      explanation: result.explanation,
      recommendedActions: result.recommendedActions,
    };
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {pick({ en: "Scam analyzer", hi: "स्कैम विश्लेषक" })}
        </CardTitle>
        <CardDescription>
          {pick({
            en: "Paste a suspicious message, email, link, or support script to estimate scam probability and next actions.",
            hi: "स्कैम की संभावना और अगले कदमों का अनुमान लगाने के लिए कोई संदिग्ध संदेश, ईमेल, लिंक या सपोर्ट स्क्रिप्ट पेस्ट करें।",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            className="min-h-36"
            onChange={(event) => setContent(event.target.value)}
            placeholder={pick({
              en: "Example: Dear customer, your KYC will be blocked today. Click bit.ly/... and enter your OTP to reactivate.",
              hi: "उदाहरण: प्रिय ग्राहक, आपका केवाईसी आज ब्लॉक कर दिया जाएगा। पुनः सक्रिय करने के लिए bit.ly/... पर क्लिक करें और अपना ओटीपी दर्ज करें।",
            })}
            value={content}
          />
          <Button disabled={loading} onClick={() => void handleAnalyze()}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
            {pick({ en: "Analyze content", hi: "सामग्री का विश्लेषण करें" })}
          </Button>
          
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          ) : null}
          
          {result && displayData ? (
            <div className="space-y-5 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              
              {/* Dual-AI Tabs */}
              {(result.gpt || result.gemini) && (
                <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 mb-2 gap-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("combined")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "combined"
                        ? "bg-sky-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {pick({ en: "Combined Verdict", hi: "संयुक्त निर्णय" })}
                  </button>
                  {result.gpt && (
                    <button
                      onClick={() => setActiveTab("gpt")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === "gpt"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      GPT-4o Analysis
                    </button>
                  )}
                  {result.gemini && (
                    <button
                      onClick={() => setActiveTab("gemini")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === "gemini"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Gemini 2.5 Analysis
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {pick({ en: "Scam probability", hi: "स्कैम की संभावना" })}
                  </p>
                  <p className="mt-2 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                    {displayData.probability}%
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  <Badge variant={riskVariants[displayData.riskLevel]}>
                    {pick({
                      en: `${displayData.riskLevel} risk`,
                      hi: `${displayData.riskLevel === "High" ? "उच्च" : displayData.riskLevel === "Medium" ? "मध्यम" : "कम"} जोखिम`,
                    })}
                  </Badge>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Source: {activeTab === "combined" 
                      ? (result.source === "heuristic" ? "Rules engine" : "Dual-AI Consolidated")
                      : activeTab === "gpt" ? "OpenAI GPT-4o" : "Google Gemini"}
                  </p>
                </div>
              </div>

              <ProgressBar value={displayData.probability} />

              <div className="rounded-[22px] bg-white/80 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/70 dark:text-slate-200 whitespace-pre-wrap">
                {displayData.explanation}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {pick({ en: "Matched signals", hi: "प्राप्त संकेत" })}
                  </p>
                  <div className="space-y-2">
                    {result.matchedSignals.length > 0 ? (
                      result.matchedSignals.map((signal) => (
                        <div
                          key={signal}
                          className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{signal}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {pick({
                          en: "No strong scam phrases were detected, but caution is still advised.",
                          hi: "कोई मजबूत स्कैम संकेत नहीं मिले, लेकिन सावधानी आवश्यक है।",
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {pick({ en: "Recommended actions", hi: "सुझाए गए कदम" })}
                  </p>
                  <div className="space-y-2">
                    {displayData.recommendedActions.map((action) => (
                      <div
                        key={action}
                        className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200"
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {displayData.riskLevel !== "Low" ? (
                <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/60 dark:bg-sky-950/30">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {pick({ en: "Need legal filing help?", hi: "कानूनी शिकायत दर्ज करने में सहायता चाहिए?" })}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {pick({
                          en: "Convert this scam analysis into a complaint draft and evidence checklist.",
                          hi: "इस स्कैम विश्लेषण को शिकायत पत्र ड्राफ्ट और साक्ष्य चेकलिस्ट में बदलें।",
                        })}
                      </p>
                    </div>
                    <Link href={legalHref}>
                      <Button variant="secondary">
                        {pick({ en: "Proceed to Legal AI", hi: "लीगल एआई पर जाएँ" })}
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
