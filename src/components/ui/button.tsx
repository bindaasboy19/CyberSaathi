import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-sky-500 text-white shadow-[0_12px_30px_-18px_rgba(14,165,233,0.9)] hover:bg-sky-400",
  secondary:
    "border border-slate-200/80 bg-white/75 text-slate-900 hover:border-sky-200 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900",
  ghost:
    "text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
  danger:
    "bg-rose-500 text-white shadow-[0_12px_30px_-18px_rgba(244,63,94,0.9)] hover:bg-rose-400",
} as const;

const buttonSizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
