"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const { error: deleteError } = await supabase
      .from("projects")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", projectId);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        <Trash2 className="h-3.5 w-3.5" />
        Delete Project
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete Project">
        <p className="text-sm text-slate-600">
          Are you sure you want to delete <span className="font-medium">{projectName}</span>? Its
          estimates, expenses, and notes will be hidden from the dashboard. This can be undone by
          restoring the record directly in Supabase if needed.
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
