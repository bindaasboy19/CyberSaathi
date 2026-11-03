import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const variants = {
  neutral:
    "bg-slate-900/[0.04] text-slate-700 dark:bg-white/[0.06] dark:text-slate-200",
  accent:
    "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  warning:
    "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  danger: "bg-rose-500/15 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
} as const;

export function Badge({
  className,
  children,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
