"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Hammer, Plus, Search, TrendingUp, User, Wallet } from "lucide-react";
import { Greeting } from "./Greeting";
import { NotificationBell, type ReminderItem } from "./NotificationBell";
import { StatCard } from "./StatCard";
import { ProjectKanbanBoard } from "./ProjectKanbanBoard";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { formatNaira } from "@/lib/utils/currency";
import type { Project, ProjectFinancials } from "@/types/domain";
import type { ProjectStatus } from "@/types/database";

export function BoardPageContent({
  projects,
  financialsByProjectId,
  reminders,
}: {
  projects: Project[];
  financialsByProjectId: Map<string, ProjectFinancials>;
  reminders: ReminderItem[];
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<ProjectStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  function openModal(status?: ProjectStatus) {
    setModalStatus(status);
    setModalOpen(true);
  }

  const ongoingCount = projects.filter((p) => p.status === "ongoing").length;
  const totalEstimate = projects.reduce(
    (sum, p) => sum + (financialsByProjectId.get(p.id)?.current_estimate_total ?? 0),
    0
  );
  const totalSpent = projects.reduce(
    (sum, p) => sum + (financialsByProjectId.get(p.id)?.actual_spent ?? 0),
    0
  );

  const visibleProjects = searchQuery.trim()
    ? projects.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : projects;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-full bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell reminders={reminders} />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <User className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Greeting />
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Projects" value={String(projects.length)} icon={<FolderKanban className="h-4 w-4" />} />
        <StatCard label="Ongoing" value={String(ongoingCount)} icon={<Hammer className="h-4 w-4" />} />
        <StatCard label="Total Estimated Value" value={formatNaira(totalEstimate)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Total Spent" value={formatNaira(totalSpent)} icon={<Wallet className="h-4 w-4" />} />
      </div>

      <h2 className="text-lg font-semibold text-slate-900">Project</h2>

      <ProjectKanbanBoard
        projects={visibleProjects}
        financialsByProjectId={financialsByProjectId}
        onAddClick={openModal}
      />

      <NewProjectModal
        open={modalOpen}
        initialStatus={modalStatus}
        onClose={() => setModalOpen(false)}
        onCreated={(project) => {
          setModalOpen(false);
          router.push(`/projects/${project.id}`);
        }}
      />
    </div>
  );
}
