"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { ProjectsListTable } from "./ProjectsListTable";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import type { Project, ProjectFinancials } from "@/types/domain";

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

  const visibleProjects = searchQuery.trim()
    ? projects.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : projects;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {projects.length} project{projects.length === 1 ? "" : "s"} total
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full rounded-full bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
        />
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
