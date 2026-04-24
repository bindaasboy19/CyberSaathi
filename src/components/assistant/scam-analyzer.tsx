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

type AnalyzerState = ScamAnalysis & {
  source: string;
};

const riskVariants = {
  Low: "accent",
  Medium: "warning",
  High: "danger",
} as const;

export function ScamAnalyzer() {
  const { language } = useLanguage();
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalyzerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const legalHref = `/legal?${new URLSearchParams({
    description: content,
    problemType: result?.riskLevel ? "scam analysis" : "cyber incident",
  }).toString()}`;

  async function handleAnalyze() {
    setLoading(true);
    setError(null);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scam analyzer</CardTitle>
        <CardDescription>
          Paste a suspicious message, email, link, or support script to estimate scam probability and next actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            className="min-h-36"
            onChange={(event) => setContent(event.target.value)}
            placeholder="Example: Dear customer, your KYC will be blocked today. Click bit.ly/... and enter your OTP to reactivate."
            value={content}
          />
          <Button disabled={loading} onClick={() => void handleAnalyze()}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
            Analyze content
          </Button>
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          ) : null}
          {result ? (
            <div className="space-y-5 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Scam probability
                  </p>
                  <p className="mt-2 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                    {result.probability}%
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  <Badge variant={riskVariants[result.riskLevel]}>{result.riskLevel} risk</Badge>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Source: {result.source === "heuristic" ? "Rules engine" : result.source}
                  </p>
                </div>
              </div>
              <ProgressBar value={result.probability} />
              <div className="rounded-[22px] bg-white/80 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
                {result.explanation}
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Matched signals
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
                        No strong scam phrases were detected, but caution is still advised.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Recommended actions
                  </p>
                  <div className="space-y-2">
                    {result.recommendedActions.map((action) => (
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
              {result.riskLevel !== "Low" ? (
                <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/60 dark:bg-sky-950/30">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        Need legal filing help?
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Convert this scam analysis into a complaint draft and evidence checklist.
                      </p>
                    </div>
                    <Link href={legalHref}>
                      <Button variant="secondary">Proceed to Legal AI</Button>
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
