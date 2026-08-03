import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EstimateBuilder } from "@/components/estimate/EstimateBuilder";

export const dynamic = "force-dynamic";

export default async function EstimatePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = createServerSupabaseClient();

  const [{ data: project }, { data: versions }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase
      .from("estimate_versions")
      .select("*, estimate_items(*)")
      .eq("project_id", projectId)
      .order("version_number", { ascending: true })
      .order("order_index", { ascending: true, referencedTable: "estimate_items" }),
  ]);

  if (!project) return null;

  return <EstimateBuilder project={project} versions={versions ?? []} />;
}
