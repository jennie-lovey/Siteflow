import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BoardPageContent } from "@/components/dashboard/BoardPageContent";
import { EmptyStateNewProjectButton } from "@/components/projects/EmptyStateNewProjectButton";
import { computeVariance } from "@/lib/utils/totals";
import { formatNaira } from "@/lib/utils/currency";
import type { ReminderItem } from "@/components/dashboard/NotificationBell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const [{ data: projects, error: projectsError }, { data: financials }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.from("project_financials").select("*"),
  ]);

  if (projectsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load projects: {projectsError.message}. Check that{" "}
        <code className="font-mono">.env.local</code> has your Supabase URL and anon key, and that{" "}
        <code className="font-mono">supabase/schema.sql</code> has been run.
      </div>
    );
  }

  const allProjects = projects ?? [];
  const financialsByProjectId = new Map((financials ?? []).map((f) => [f.project_id, f]));

  if (allProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 text-center">
        <h2 className="text-lg font-semibold text-slate-900">No projects yet</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Create your first project to start building an estimate and tracking site expenses.
        </p>
        <EmptyStateNewProjectButton />
      </div>
    );
  }

  const reminders: ReminderItem[] = [];
  for (const project of allProjects) {
    if (project.status === "pending") {
      reminders.push({
        projectId: project.id,
        projectName: project.name,
        message: "Pending — hasn't started yet",
      });
    }
    if (project.status === "ongoing") {
      const financial = financialsByProjectId.get(project.id);
      const estimateTotal = financial?.current_estimate_total ?? 0;
      const actualSpent = financial?.actual_spent ?? 0;
      if (estimateTotal > 0) {
        const variance = computeVariance(estimateTotal, actualSpent);
        if (variance < 0) {
          reminders.push({
            projectId: project.id,
            projectName: project.name,
            message: `Over budget by ${formatNaira(Math.abs(variance))}`,
          });
        }
      }
    }
  }

  return (
    <BoardPageContent projects={allProjects} financialsByProjectId={financialsByProjectId} reminders={reminders} />
  );
}
