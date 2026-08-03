"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Select } from "@/components/ui/Field";
import { PROJECT_TYPE_PRESETS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { projectFormSchema } from "@/lib/validation";
import type { Project } from "@/types/domain";
import type { ProjectPriority, ProjectStatus } from "@/types/database";

interface ProjectFormProps {
  project?: Project;
  initialStatus?: ProjectStatus;
  onSaved?: (project: Project) => void;
}

export function ProjectForm({ project, initialStatus, onSaved }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const initialPresetType = project && PROJECT_TYPE_PRESETS.includes(project.project_type as (typeof PROJECT_TYPE_PRESETS)[number])
    ? project.project_type
    : project
    ? "Other"
    : PROJECT_TYPE_PRESETS[0];

  const [name, setName] = useState(project?.name ?? "");
  const [typePreset, setTypePreset] = useState<string>(initialPresetType);
  const [customType, setCustomType] = useState(
    project && typePreset === "Other" ? project.project_type : ""
  );
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? initialStatus ?? "later");
  const [priority, setPriority] = useState<ProjectPriority>(project?.priority ?? "medium");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const projectType = typePreset === "Other" ? customType : typePreset;
    const parsed = projectFormSchema.safeParse({ name, projectType, status, priority });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      if (isEdit && project) {
        const { data, error } = await supabase
          .from("projects")
          .update({
            name: parsed.data.name,
            project_type: parsed.data.projectType,
            status: parsed.data.status,
            priority: parsed.data.priority,
          })
          .eq("id", project.id)
          .select()
          .single();

        if (error) throw error;
        onSaved?.(data);
        router.refresh();
      } else {
        const { data: newProject, error } = await supabase
          .from("projects")
          .insert({
            name: parsed.data.name,
            project_type: parsed.data.projectType,
            status: parsed.data.status,
            priority: parsed.data.priority,
          })
          .select()
          .single();

        if (error) throw error;

        // Every project starts life with an empty estimate v1 so the
        // Estimate tab always has something to build on immediately.
        const { error: versionError } = await supabase
          .from("estimate_versions")
          .insert({ project_id: newProject.id, version_number: 1 });

        if (versionError) throw versionError;

        if (onSaved) {
          onSaved(newProject);
          router.refresh();
        } else {
          router.push(`/projects/${newProject.id}`);
          router.refresh();
        }
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mrs. Adeyemi's Duplex, Lekki"
        />
        <FieldError message={errors.name} />
      </div>

      <div>
        <Label htmlFor="projectType">Project Type</Label>
        <Select id="projectType" value={typePreset} onChange={(e) => setTypePreset(e.target.value)}>
          {PROJECT_TYPE_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </Select>
        {typePreset === "Other" && (
          <Input
            className="mt-2"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            placeholder="Describe the project type"
          />
        )}
        <FieldError message={errors.projectType} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as ProjectPriority)}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
