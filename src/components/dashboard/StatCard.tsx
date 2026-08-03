import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          {icon}
        </span>
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
