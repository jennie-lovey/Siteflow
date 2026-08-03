import { formatNaira } from "@/lib/utils/currency";
import { computeVariance } from "@/lib/utils/totals";

export function BudgetComparisonCard({
  estimateTotal,
  actualSpent,
}: {
  estimateTotal: number;
  actualSpent: number;
}) {
  const variance = computeVariance(estimateTotal, actualSpent);
  const isOverBudget = variance < 0;
  const percentSpent = estimateTotal > 0 ? Math.min((actualSpent / estimateTotal) * 100, 999) : 0;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current Estimate</p>
          <p className="mt-1.5 text-xl font-semibold text-slate-900">{formatNaira(estimateTotal)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Actual Spent</p>
          <p className="mt-1.5 text-xl font-semibold text-slate-900">{formatNaira(actualSpent)}</p>
        </div>
        <div className={`rounded-lg p-4 ${isOverBudget ? "bg-red-50" : "bg-emerald-50"}`}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {isOverBudget ? "Over Budget" : "Remaining"}
          </p>
          <p className={`mt-1.5 text-xl font-semibold ${isOverBudget ? "text-red-600" : "text-emerald-600"}`}>
            {formatNaira(Math.abs(variance))}
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ width: `${Math.min(percentSpent, 100)}%` }}
        />
      </div>
    </div>
  );
}
