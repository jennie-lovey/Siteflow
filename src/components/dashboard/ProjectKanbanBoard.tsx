"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectKanbanCard } from "./ProjectKanbanCard";
import { STATUS_DOT_STYLES, STATUS_OPTIONS } from "@/lib/constants";
import type { Project, ProjectFinancials } from "@/types/domain";
import type { ProjectStatus } from "@/types/database";

const COLUMN_CARD_LIMIT = 5;

export function ProjectKanbanBoard({
  projects,
  financialsByProjectId,
  onAddClick,
}: {
  projects: Project[];
  financialsByProjectId: Map<string, ProjectFinancials>;
  onAddClick: (status: ProjectStatus) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATUS_OPTIONS.map((status) => {
        // `projects` is already ordered most-recent-first, so slicing here
        // keeps the newest work visible without the Board piling up with
        // every project ever created — the rest is one click away.
        const columnProjects = projects.filter((p) => p.status === status.value);
        const visibleProjects = columnProjects.slice(0, COLUMN_CARD_LIMIT);
        const hiddenCount = columnProjects.length - visibleProjects.length;

        return (
          <div key={status.value} className="rounded-xl bg-neutral-200/60 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT_STYLES[status.value]}`} />
                <span className="text-sm font-medium text-slate-700">{status.label}</span>
                <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                  {columnProjects.length}
                </span>
              </div>
              <button
                onClick={() => onAddClick(status.value)}
                className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                aria-label={`New project with status ${status.label}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {columnProjects.length === 0 && (
                <p className="rounded-lg px-3 py-4 text-center text-xs text-slate-400">
                  No projects
                </p>
              )}
              {visibleProjects.map((project) => (
                <ProjectKanbanCard
                  key={project.id}
                  project={project}
                  financials={financialsByProjectId.get(project.id)}
                />
              ))}
              {hiddenCount > 0 && (
                <Link
                  href={`/projects?status=${status.value}`}
                  className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-500 hover:bg-slate-200/70 hover:text-slate-800"
                >
                  +{hiddenCount} more — view all
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
