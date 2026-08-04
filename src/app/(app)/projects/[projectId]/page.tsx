import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { BudgetComparisonCard } from "@/components/dashboard/BudgetComparisonCard";
import { EditProjectButton } from "@/components/projects/EditProjectButton";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { PriorityBadge } from "@/components/projects/PriorityBadge";
import { formatDisplayDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: project }, { data: financials }, { data: recentNotes }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase.from("project_financials").select("*").eq("project_id", projectId).maybeSingle(),
    supabase
      .from("notes")
      .select("*")
      .eq("project_id", projectId)
      .order("date", { ascending: false })
      .limit(3),
  ]);

  if (!project) return null;

  const hasEstimate = (financials?.current_estimate_total ?? 0) > 0;
  const hasExpenses = (financials?.actual_spent ?? 0) > 0;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900">Project Details</h2>
          <div className="flex gap-2">
            <EditProjectButton project={project} />
            <DeleteProjectButton projectId={project.id} projectName={project.name} />
          </div>
        </CardHeader>
        <CardBody>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Project Name</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{project.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Type</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{project.project_type}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={project.status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Priority</dt>
              <dd className="mt-1">
                <PriorityBadge priority={project.priority} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Created</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatDisplayDate(project.created_at.slice(0, 10))}</dd>
            </div>
            {project.completed_at && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Completed</dt>
                <dd className="mt-1 text-sm text-slate-700">
                  {formatDisplayDate(project.completed_at.slice(0, 10))}
                </dd>
              </div>
            )}
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">Budget Health</h2>
        </CardHeader>
        <CardBody>
          {hasEstimate || hasExpenses ? (
            <BudgetComparisonCard
              estimateTotal={financials?.current_estimate_total ?? 0}
              actualSpent={financials?.actual_spent ?? 0}
            />
          ) : (
            <p className="text-sm text-slate-500">
              No estimate items or expenses recorded yet. Start with the{" "}
              <Link href={`/projects/${project.id}/estimate`} className="font-medium text-blue-600 hover:underline">
                Estimate
              </Link>{" "}
              tab.
            </p>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href={`/projects/${project.id}/estimate`}>
          <Card className="h-full transition-colors hover:bg-slate-50">
            <CardBody>
              <h3 className="font-medium text-slate-900">Estimate</h3>
              <p className="mt-1 text-sm text-slate-500">
                Build or revise the quotation, and download it as a PDF.
              </p>
            </CardBody>
          </Card>
        </Link>
        <Link href={`/projects/${project.id}/tracker`}>
          <Card className="h-full transition-colors hover:bg-slate-50">
            <CardBody>
              <h3 className="font-medium text-slate-900">Daily Tracker</h3>
              <p className="mt-1 text-sm text-slate-500">
                Log today&apos;s expenses and site notes.
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">Recent Site Notes</h2>
        </CardHeader>
        <CardBody>
          {recentNotes && recentNotes.length > 0 ? (
            <ul className="space-y-4">
              {recentNotes.map((note) => (
                <li key={note.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {formatDisplayDate(note.date)}
                  </p>
                  {note.work_done && <p className="mt-1 text-sm text-slate-700">{note.work_done}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No notes yet. Add daily updates from the{" "}
              <Link href={`/projects/${project.id}/tracker`} className="font-medium text-blue-600 hover:underline">
                Tracker
              </Link>{" "}
              tab.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
