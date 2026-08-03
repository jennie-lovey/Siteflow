"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProjectForm } from "./ProjectForm";
import type { Project } from "@/types/domain";

export function EditProjectButton({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Pencil className="h-3.5 w-3.5" />
        Edit Details
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit Project">
        <ProjectForm project={project} onSaved={() => setOpen(false)} />
      </Modal>
    </>
  );
}
