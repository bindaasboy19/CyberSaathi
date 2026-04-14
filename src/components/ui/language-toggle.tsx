"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button className="h-11 rounded-2xl px-4" variant="secondary" onClick={toggleLanguage}>
      <span className="text-xs font-bold tracking-[0.25em] text-slate-400">EN</span>
      <span className={language === "hi" ? "text-sky-500" : ""}>हि</span>
    </Button>
  );
}
