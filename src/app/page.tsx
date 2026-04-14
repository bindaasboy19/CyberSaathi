"use client";

import { ArrowRight, BellRing, Bot, FileText, Newspaper, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { homeMetrics, responseChecklist, scenarioGuides } from "@/lib/data/content";
import { pickText } from "@/lib/utils";

const quickLinks = [
  {
    href: "/assistant",
    title: "Talk to the AI assistant",
    description: "Get real-time prevention and victim-response guidance.",
    icon: Bot,
  },
  {
    href: "/report",
    title: "Create a scam report",
    description: "Capture incident facts before evidence disappears.",
    icon: ShieldAlert,
  },
  {
    href: "/news",
    title: "Review the latest news",
    description: "Track fresh cybercrime trends affecting Indian users.",
    icon: Newspaper,
  },
];

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-0">
        <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute right-10 top-20 glass-orb h-28 w-28 rounded-full bg-sky-500/20 blur-2xl" />
        <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-sky-500 dark:text-slate-950">
              Live guidance for prevention and response
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Cybercrime awareness that actually helps in the moment.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                CyberSathi combines AI guidance, legal orientation, community knowledge, scam
                reporting, and cyber news into a single support platform built for Indian users.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/assistant">
                <Button size="lg">
                  Open AI assistant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="secondary">
                  Explore awareness hub
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4 rounded-[30px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/75">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                  Incident response essentials
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Use this if something feels wrong right now.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {responseChecklist.map((step) => (
                <div
                  key={step.en}
                  className="rounded-[22px] border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100"
                >
                  {pickText(step, language)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {homeMetrics.map((metric) => (
          <StatCard
            key={metric.value}
            description={pickText(metric.description, language)}
            label={pickText(metric.label, language)}
            value={metric.value}
          />
        ))}
      </div>

      <SectionHeading
        eyebrow="Platform Modules"
        title="Designed for real situations, not just passive reading"
        description="Each module feeds a different part of the response cycle: learn, assess, act, report, and collaborate."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.href}>
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={item.href}>
                  <Button variant="secondary">
                    Open module
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <SectionHeading
        eyebrow="Scenario Guides"
        title="Two high-stakes flows users often need quickly"
        description="CyberSathi translates panic-driven incidents into practical action sequences."
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

      <Card>
        <CardHeader>
          <CardTitle>Production shape</CardTitle>
          <CardDescription>
            The frontend is optimized for Vercel, while Firebase handles authentication, data, and storage-backed expansion paths.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "App Router foundation",
              text: "Modular pages, reusable components, responsive shell, and dark mode support.",
              icon: FileText,
            },
            {
              title: "Interactive backend",
              text: "Firestore collections for users, posts, comments, questions, answers, reports, and chat history.",
              icon: ShieldAlert,
            },
            {
              title: "AI + heuristics",
              text: "Live AI route handlers with graceful fallback for scam guidance and analysis.",
              icon: Bot,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-[24px] border border-slate-200/80 p-5 dark:border-slate-800">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
