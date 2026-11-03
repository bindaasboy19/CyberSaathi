import { ShieldAlert } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300/80 bg-white/60 p-8 text-center dark:border-slate-700 dark:bg-slate-950/50">
      <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-sky-500" />
      <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
