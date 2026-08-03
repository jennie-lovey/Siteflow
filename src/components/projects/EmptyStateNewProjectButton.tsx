"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { NewProjectModal } from "./NewProjectModal";

export function EmptyStateNewProjectButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        New Project
      </button>
      <NewProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(project) => {
          setOpen(false);
          router.push(`/projects/${project.id}`);
        }}
      />
    </>
  );
}
