"use client";

import { AlertTriangle, LoaderCircle, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

              {/* Dynamic Threat Checklist & Gauge Grid */}
              <div className="grid gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr] items-start">
                
                {/* Visual Gauge Dial */}
                <div className="flex flex-col items-center justify-center p-4 bg-white/40 dark:bg-slate-950/30 rounded-3xl border border-slate-200/60 dark:border-slate-800/80">
                  <div className="relative flex items-center justify-center w-36 h-20 overflow-hidden">
                    <svg className="absolute top-0 left-0 w-full h-full transform -rotate-180" viewBox="0 0 120 70">
                      <path
                        d="M 10 60 A 50 50 0 0 1 110 60"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        className="dark:stroke-slate-800"
                      />
                      <path
                        d="M 10 60 A 50 50 0 0 1 110 60"
                        fill="none"
                        stroke={
                          displayData.riskLevel === "High"
                            ? "#ef4444"
                            : displayData.riskLevel === "Medium"
                            ? "#f59e0b"
                            : "#06b6d4"
                        }
                        strokeWidth="8"
                        strokeDasharray={Math.PI * 50}
                        strokeDashoffset={Math.PI * 50 - (Math.min(100, Math.max(0, displayData.probability)) / 100) * (Math.PI * 50)}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute bottom-0 text-center">
                      <span className="text-3xl font-black text-slate-950 dark:text-white leading-none">
                        {displayData.probability}%
                      </span>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">
                        {pick({ en: "Risk Level", hi: "जोखिम स्तर" })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <Badge variant={riskVariants[displayData.riskLevel]}>
                      {pick({
                        en: `${displayData.riskLevel} Risk Verdict`,
                        hi: `${displayData.riskLevel === "High" ? "उच्च" : displayData.riskLevel === "Medium" ? "मध्यम" : "कम"} जोखिम`,
                      })}
                    </Badge>
                  </div>
                </div>

                {/* Threat Indicators Audit Checklist */}
                {(() => {
                  const textToCheck = (content + " " + result.matchedSignals.join(" ")).toLowerCase();
                  const urgencyAudit = textToCheck.includes("block") || textToCheck.includes("today") || textToCheck.includes("urgency") || textToCheck.includes("now") || textToCheck.includes("immediate") || textToCheck.includes("suspend") || textToCheck.includes("cancel");
                  const linkAudit = textToCheck.includes("http") || textToCheck.includes("bit.ly") || textToCheck.includes("link") || textToCheck.includes("click") || textToCheck.includes("url") || textToCheck.includes("apk");
                  const authorityAudit = textToCheck.includes("kyc") || textToCheck.includes("bank") || textToCheck.includes("police") || textToCheck.includes("arrest") || textToCheck.includes("support") || textToCheck.includes("officer");
                  const financialAudit = textToCheck.includes("pin") || textToCheck.includes("otp") || textToCheck.includes("money") || textToCheck.includes("upi") || textToCheck.includes("pay") || textToCheck.includes("transfer") || textToCheck.includes("bank");

                  return (
                    <div className="space-y-3 p-4 bg-slate-100/40 dark:bg-slate-950/20 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 w-full">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {pick({ en: "Threat Vector Audit", hi: "खतरा विश्लेषण ऑडिट" })}
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-xs">
                          {urgencyAudit ? <XCircle className="h-4 w-4 text-red-500 shrink-0" /> : <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                          <span className={urgencyAudit ? "text-red-700 dark:text-red-300 font-semibold" : "text-slate-500"}>
                            {pick({ en: "High-pressure urgency language", hi: "दबाव व जल्दबाजी की भाषा" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {linkAudit ? <XCircle className="h-4 w-4 text-red-500 shrink-0" /> : <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                          <span className={linkAudit ? "text-red-700 dark:text-red-300 font-semibold" : "text-slate-500"}>
                            {pick({ en: "Suspicious links or APK download requests", hi: "संदिग्ध लिंक या एपीके अनुरोध" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {authorityAudit ? <XCircle className="h-4 w-4 text-red-500 shrink-0" /> : <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                          <span className={authorityAudit ? "text-red-700 dark:text-red-300 font-semibold" : "text-slate-500"}>
                            {pick({ en: "Impersonation of authority (Bank/Police)", hi: "अधिकारी का स्वांग (बैंक/पुलिस)" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {financialAudit ? <XCircle className="h-4 w-4 text-red-500 shrink-0" /> : <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                          <span className={financialAudit ? "text-red-700 dark:text-red-300 font-semibold" : "text-slate-500"}>
                            {pick({ en: "Requests for UPI, PIN, OTP or Transfers", hi: "UPI, पिन, ओटीपी या मनी ट्रांसफर मांग" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              <div className="rounded-[22px] bg-white/80 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/70 dark:text-slate-200 whitespace-pre-wrap border border-slate-150 dark:border-slate-800">
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

              {/* Dynamic Classroom course recommendation */}
              {(() => {
                const textToCheck = (content + " " + result.matchedSignals.join(" ")).toLowerCase();
                const isFinancial = textToCheck.includes("upi") || textToCheck.includes("money") || textToCheck.includes("bank") || textToCheck.includes("fraud") || textToCheck.includes("scam");
                const isSocial = textToCheck.includes("whatsapp") || textToCheck.includes("facebook") || textToCheck.includes("instagram") || textToCheck.includes("stalk") || textToCheck.includes("threat");
                
                const recId = isFinancial ? "c-financial-literacy" : isSocial ? "c-privacy-safety" : "c-security-basics";
                const recTitle = isFinancial 
                  ? { en: "Digital Financial Literacy", hi: "डिजिटल वित्तीय साक्षरता" } 
                  : isSocial 
                  ? { en: "Social Media & Privacy Safety", hi: "सोशल मीडिया और गोपनीयता सुरक्षा" }
                  : { en: "Cybersecurity Fundamentals", hi: "साइबर सुरक्षा बुनियादी बातें" };

                return (
                  <div className="rounded-2xl border border-indigo-250 bg-indigo-50/80 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <p className="font-bold text-indigo-650 dark:text-indigo-400 text-xs uppercase tracking-wide">
                        {pick({ en: "Recommended Safety Course", hi: "अनुशंसित सुरक्षा पाठ्यक्रम" })}
                      </p>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                        {pick({
                          en: `Take our interactive course "${pick(recTitle)}" to learn how to identify and avoid this type of threat in the future.`,
                          hi: `भविष्य में इस प्रकार के खतरे को पहचानने और उससे बचने के लिए हमारा कोर्स "${pick(recTitle)}" लें।`,
                        })}
                      </p>
                    </div>
                    <Link href={`/learn?course=${recId}`}>
                      <Button variant="secondary" className="rounded-xl text-xs font-bold">
                        {pick({ en: "Enter Classroom →", hi: "क्लासरूम में प्रवेश करें →" })}
                      </Button>
                    </Link>
                  </div>
                );
              })()}

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
