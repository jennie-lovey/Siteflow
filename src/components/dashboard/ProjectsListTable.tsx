"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { PriorityBadge } from "@/components/projects/PriorityBadge";
import { formatNaira } from "@/lib/utils/currency";
import { computeVariance } from "@/lib/utils/totals";
import type { Project, ProjectFinancials } from "@/types/domain";

const PAGE_SIZE = 10;

export function ProjectsListTable({
  projects,
  financialsByProjectId,
}: {
  projects: Project[];
  financialsByProjectId: Map<string, ProjectFinancials>;
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageProjects = projects.slice(startIndex, startIndex + PAGE_SIZE);

  const pageNumbers = useMemo(() => buildPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 text-center">
        <h2 className="text-base font-semibold text-slate-900">No projects yet</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Every project you create will show up here, most recent first.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3 text-right">Estimate</th>
              <th className="px-6 py-3 text-right">Spent</th>
              <th className="px-6 py-3 text-right">Budget</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageProjects.map((project) => {
              const financials = financialsByProjectId.get(project.id);
              const estimateTotal = financials?.current_estimate_total ?? 0;
              const actualSpent = financials?.actual_spent ?? 0;
              const variance = computeVariance(estimateTotal, actualSpent);
              const isOverBudget = variance < 0;
              const hasBudgetData = estimateTotal > 0 || actualSpent > 0;

              return (
                <tr key={project.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{project.name}</p>
                    <p className="text-xs text-slate-500">{project.project_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={project.priority} />
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {hasBudgetData ? formatNaira(estimateTotal) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {hasBudgetData ? formatNaira(actualSpent) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {hasBudgetData ? (
                      <span
                        className={`text-xs font-medium ${isOverBudget ? "text-red-600" : "text-emerald-600"}`}
                      >
                        {isOverBudget
                          ? `${formatNaira(Math.abs(variance))} over`
                          : `${formatNaira(variance)} left`}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-6 py-2.5">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:pointer-events-none disabled:text-slate-300"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          {pageNumbers.map((n, i) =>
            n === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-400">
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${
                  n === currentPage ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:pointer-events-none disabled:text-slate-300"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) result.push("...");
    result.push(n);
    prev = n;
  }
  return result;
}
