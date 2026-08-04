"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Plus, Search } from "lucide-react";
import { ProjectsListTable } from "./ProjectsListTable";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { STATUS_OPTIONS } from "@/lib/constants";
import type { Project, ProjectFinancials } from "@/types/domain";
import type { ProjectStatus } from "@/types/database";

type StatusFilter = "all" | ProjectStatus;

export function ProjectsListSection({
  projects,
  financialsByProjectId,
}: {
  projects: Project[];
  financialsByProjectId: Map<string, ProjectFinancials>;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filters: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: projects.length },
    ...STATUS_OPTIONS.map((s) => ({
      value: s.value,
      label: s.label,
      count: projects.filter((p) => p.status === s.value).length,
    })),
  ];

  const statusFiltered =
    statusFilter === "all" ? projects : projects.filter((p) => p.status === statusFilter);
  const visibleProjects = searchQuery.trim()
    ? statusFiltered.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : statusFiltered;

  const activeFilterLabel = filters.find((f) => f.value === statusFilter)?.label ?? "All";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-slate-900">Projects</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-full bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors ${
              statusFilter !== "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filter{statusFilter !== "all" ? `: ${activeFilterLabel}` : ""}
          </button>

          {filterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
              <div className="absolute left-0 z-50 mt-2 w-48 rounded-xl bg-white p-1.5">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      setStatusFilter(f.value);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                      statusFilter === f.value ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {f.label}
                    <span className="text-xs text-slate-400">{f.count}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ProjectsListTable projects={visibleProjects} financialsByProjectId={financialsByProjectId} />

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(project) => {
          setModalOpen(false);
          router.push(`/projects/${project.id}`);
        }}
      />
    </div>
  );
}
