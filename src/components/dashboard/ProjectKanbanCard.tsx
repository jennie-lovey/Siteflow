import Link from "next/link";
import { PriorityBadge } from "@/components/projects/PriorityBadge";
import { formatNairaCompact } from "@/lib/utils/currency";
import { computeVariance } from "@/lib/utils/totals";
import type { Project, ProjectFinancials } from "@/types/domain";

export function ProjectKanbanCard({
  project,
  financials,
}: {
  project: Project;
  financials?: ProjectFinancials;
}) {
  const estimateTotal = financials?.current_estimate_total ?? 0;
  const actualSpent = financials?.actual_spent ?? 0;
  const hasBudgetData = estimateTotal > 0 || actualSpent > 0;
  const variance = computeVariance(estimateTotal, actualSpent);
  const isOverBudget = variance < 0;
  const percentSpent = estimateTotal > 0 ? Math.min((actualSpent / estimateTotal) * 100, 100) : 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-lg bg-white p-3.5 transition-colors hover:bg-slate-50"
    >
      <PriorityBadge priority={project.priority} />
      <p className="mt-2.5 text-sm font-semibold text-slate-900">{project.name}</p>
      <p className="text-xs text-slate-500">{project.project_type}</p>

      {hasBudgetData && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>{formatNairaCompact(actualSpent)} spent</span>
            <span>{formatNairaCompact(estimateTotal)} est.</span>
          </div>
        </div>
      )}
    </Link>
  );
}
