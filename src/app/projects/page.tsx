import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProjectsListSection } from "@/components/dashboard/ProjectsListSection";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage() {
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
        Could not load projects: {projectsError.message}.
      </div>
    );
  }

  const allProjects = projects ?? [];
  const financialsByProjectId = new Map((financials ?? []).map((f) => [f.project_id, f]));

  return <ProjectsListSection projects={allProjects} financialsByProjectId={financialsByProjectId} />;
}
