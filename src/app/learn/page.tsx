"use client";

import { BookCheck, Landmark } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { awarenessCards, lawGuides, scenarioGuides } from "@/lib/data/content";
import { pickText } from "@/lib/utils";

export default function LearnPage() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Awareness Hub"
        title="Understand common cybercrime patterns before they become incidents"
        description="CyberSaathi keeps the awareness section practical: signals, prevention habits, and emergency steps instead of broad theory."
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {awarenessCards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <BookCheck className="h-5 w-5" />
              </div>
              <CardTitle>{pickText(card.title, language)}</CardTitle>
              <CardDescription>{pickText(card.description, language)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-950 dark:text-white">Warning signs</p>
                <div className="space-y-2">
                  {card.signals.map((signal) => (
                    <div
                      key={signal.en}
                      className="rounded-2xl border border-amber-200/70 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100"
                    >
                      {pickText(signal, language)}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-950 dark:text-white">Prevention</p>
                <div className="space-y-2">
                  {card.prevention.map((step) => (
                    <div
                      key={step.en}
                      className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100"
                    >
                      {pickText(step, language)}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-950 dark:text-white">Emergency</p>
                <div className="space-y-2">
                  {card.emergency.map((step) => (
                    <div
                      key={step.en}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200"
                    >
                      {pickText(step, language)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionHeading
        eyebrow="Legal Basics"
        title="Indian cyber law guidance in plain language"
        description="This section is informational and scenario-oriented so users can organize their response before speaking to authorities or counsel."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {lawGuides.map((guide) => (
          <Card key={guide.id}>
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300">
                <Landmark className="h-5 w-5" />
              </div>
              <CardTitle>{pickText(guide.title, language)}</CardTitle>
              <CardDescription>{pickText(guide.summary, language)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {guide.sections.map((section) => (
                <div
                  key={section.en}
                  className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200"
                >
                  {pickText(section, language)}
                </div>
              ))}
              <div className="pt-2">
                <p className="mb-2 text-sm font-semibold text-slate-950 dark:text-white">Next steps</p>
                <div className="space-y-2">
                  {guide.nextSteps.map((step) => (
                    <div
                      key={step.en}
                      className="rounded-[22px] border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100"
                    >
                      {pickText(step, language)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionHeading
        eyebrow="Scenarios"
        title="Short response maps for common incidents"
        description="These scenario cards are meant to reduce hesitation when users are stressed and unsure what to do first."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {scenarioGuides.map((guide) => (
          <Card key={guide.id}>
            <CardHeader>
              <CardTitle>{pickText(guide.title, language)}</CardTitle>
              <CardDescription>{pickText(guide.scenario, language)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {guide.steps.map((step) => (
                <div
                  key={step.en}
                  className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200"
                >
                  {pickText(step, language)}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
