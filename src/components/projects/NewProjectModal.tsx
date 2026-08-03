"use client";

import { Modal } from "@/components/ui/Modal";
import { ProjectForm } from "./ProjectForm";
import type { ProjectStatus } from "@/types/database";
import type { Project } from "@/types/domain";

export function NewProjectModal({
  open,
  initialStatus,
  onClose,
  onCreated,
}: {
  open: boolean;
  initialStatus?: ProjectStatus;
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="New Project">
      <ProjectForm initialStatus={initialStatus} onSaved={onCreated} />
    </Modal>
  );
}
