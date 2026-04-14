"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { safetyQuestions } from "@/lib/data/content";

export function SafetyScore() {
  const { pick } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalScore = useMemo(
    () =>
      safetyQuestions.reduce((total, question) => {
        const answerIndex = answers[question.id];

        if (answerIndex === undefined) {
          return total;
        }

        return total + question.options[answerIndex].score;
      }, 0),
    [answers],
  );

  const answeredCount = Object.keys(answers).length;
  const improvementHints = safetyQuestions
    .map((question) => {
      const answerIndex = answers[question.id];

      if (answerIndex === undefined) {
        return null;
      }

      return question.options[answerIndex].insight;
    })
    .filter(Boolean)
    .map((hint) => pick(hint!))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cyber safety score</CardTitle>
        <CardDescription>
          Take a quick self-check across passwords, MFA, UPI habits, KYC behavior, and incident response speed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Current score
              </p>
              <p className="mt-2 font-display text-4xl font-semibold text-slate-950 dark:text-white">
                {totalScore}/100
              </p>
            </div>
            <div className="rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-700 dark:text-sky-300">
              {answeredCount}/{safetyQuestions.length} answered
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <ProgressBar value={totalScore} />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {totalScore >= 80
                ? "Your habits are strong. Keep the same discipline during urgent situations."
                : totalScore >= 50
                  ? "You have a decent base, but a few shortcuts are still exposing you to fraud."
                  : "You are currently leaving some high-impact gaps open. Small changes here can meaningfully reduce risk."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {safetyQuestions.map((question) => (
            <div key={question.id} className="rounded-[24px] border border-slate-200/80 p-5 dark:border-slate-800">
              <p className="font-medium text-slate-950 dark:text-white">{pick(question.question)}</p>
              <div className="mt-4 grid gap-3">
                {question.options.map((option, index) => {
                  const selected = answers[question.id] === index;

                  return (
                    <button
                      key={pick(option.label)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        selected
                          ? "border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white"
                          : "border-slate-200 bg-white/70 text-slate-700 hover:border-sky-200 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                      }`}
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: index,
                        }))
                      }
                      type="button"
                    >
                      {pick(option.label)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {improvementHints.length > 0 ? (
          <div className="rounded-[24px] border border-emerald-200/70 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
              <p className="font-semibold">Improvement suggestions</p>
            </div>
            <div className="mt-3 space-y-2 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
              {improvementHints.map((hint) => (
                <p key={hint}>{hint}</p>
              ))}
            </div>
          </div>
        ) : null}

        <Button
          variant="secondary"
          onClick={() => setAnswers({})}
        >
          <RotateCcw className="h-4 w-4" />
          Reset quiz
        </Button>
      </CardContent>
    </Card>
  );
}
