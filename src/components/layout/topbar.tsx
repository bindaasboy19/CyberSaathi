"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { sharedCopy } from "@/lib/i18n";
import { getInitials } from "@/lib/utils";

export function Topbar() {
  const { profile, logout } = useAuth();
  const { pick } = useLanguage();

  return (
    <header className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white font-extrabold text-sm shadow-md shadow-sky-500/20">
            CS
          </div>
          <div>
            <h1 className="font-display text-base font-extrabold tracking-tight text-slate-950 dark:text-white">
              {pick(sharedCopy.brandName)}
            </h1>
          </div>
        </Link>

        {/* Right Side: Actions (compact layout) */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          
          {profile ? (
            <div className="flex items-center gap-2">
              <div
                title={`${profile.name} (${profile.role})`}
                className="flex h-8 w-8 select-none items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-950"
              >
                {getInitials(profile.name)}
              </div>
              <Button
                className="h-8 w-8 rounded-xl p-0"
                variant="secondary"
                onClick={() => void logout()}
                title={pick({ en: "Logout", hi: "लॉगआउट" })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="h-8 rounded-xl px-3 text-xs font-bold">
                {pick(sharedCopy.login)}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
