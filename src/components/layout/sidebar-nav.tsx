"use client";

import {
  BookOpen,
  Bot,
  Gauge,
  Gavel,
  Home,
  Landmark,
  MessageSquareText,
  Newspaper,
  PenSquare,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { navCopy, sharedCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: navCopy.home, icon: Home },
  { href: "/dashboard", label: navCopy.dashboard, icon: Gauge },
  { href: "/learn", label: navCopy.learn, icon: BookOpen },
  { href: "/assistant", label: navCopy.assistant, icon: Bot },
  { href: "/legal", label: navCopy.legal, icon: Gavel },
  { href: "/community", label: navCopy.community, icon: MessageSquareText },
  { href: "/blog", label: navCopy.blog, icon: PenSquare },
  { href: "/news", label: navCopy.news, icon: Newspaper },
  { href: "/report", label: navCopy.report, icon: ShieldAlert },
  { href: "/portals", label: navCopy.portals, icon: Landmark },
  { href: "/help", label: navCopy.help, icon: HelpCircle },
];

export function SidebarNav({ mode = "sidebar" }: { mode?: "sidebar" | "mobile" }) {
  const pathname = usePathname();
  const { pick } = useLanguage();

  if (mode === "mobile") {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              className={cn(
                "inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                isActive
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200",
              )}
              href={item.href}
            >
              <Icon className="h-4 w-4" />
              {pick(item.label)}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xl font-semibold text-slate-950 dark:text-white">
              {pick(sharedCopy.brandName)}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {pick(sharedCopy.brandTagline)}
            </p>
          </div>
          <Badge variant="accent">India</Badge>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_15px_30px_-15px_rgba(15,23,42,0.7)] dark:bg-sky-500 dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                {pick(item.label)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
