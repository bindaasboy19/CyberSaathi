"use client";

import { LogOut, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { sharedCopy } from "@/lib/i18n";
import { getInitials } from "@/lib/utils";

const roleStyles = {
  user: "bg-slate-900/[0.04] text-slate-700 dark:bg-white/[0.06] dark:text-slate-200",
  expert: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  admin: "bg-rose-500/15 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
};

export function Topbar() {
  const { user, profile, logout } = useAuth();
  const { pick } = useLanguage();

  return (
    <header className="rounded-[30px] border border-white/60 bg-white/75 p-4 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI guidance + incident response
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {pick(sharedCopy.brandName)}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {pick(sharedCopy.brandTagline)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          {profile ? (
            <div className="flex items-center gap-3 rounded-[26px] border border-slate-200/80 bg-white/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/80">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
                {getInitials(profile.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                  {profile.name}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${roleStyles[profile.role]}`}
                  >
                    {profile.role}
                  </span>
                  <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </span>
                </div>
              </div>
              <Button className="h-10 rounded-2xl px-3" variant="secondary" onClick={() => void logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 dark:flex dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Guest-safe assistant enabled
              </div>
              <Link href="/login">
                <Button variant="secondary">{pick(sharedCopy.login)}</Button>
              </Link>
              <Link href="/register">
                <Button>{pick(sharedCopy.register)}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
