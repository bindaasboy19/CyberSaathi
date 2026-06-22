"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Language } from "@/types";
import { Globe } from "lucide-react";

const LANGUAGE_LABELS = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
  ta: "தமிழ்",
  te: "తెలుగు",
  mr: "मराठी",
};

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 px-3 py-1.5 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50">
      <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="cursor-pointer bg-transparent text-xs font-bold text-slate-700 outline-none dark:text-slate-300 [&>option]:bg-white dark:[&>option]:bg-slate-950"
      >
        {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
