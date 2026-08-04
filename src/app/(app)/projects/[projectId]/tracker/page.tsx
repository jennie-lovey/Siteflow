import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ExpensesSection } from "@/components/tracker/ExpensesSection";
import { NotesSection } from "@/components/tracker/NotesSection";

export const dynamic = "force-dynamic";

export default async function TrackerPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: expenses }, { data: notes }] = await Promise.all([
    supabase
      .from("expenses")
      .select("*")
      .eq("project_id", projectId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("notes")
      .select("*")
      .eq("project_id", projectId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-5">
      <ExpensesSection projectId={projectId} initialExpenses={expenses ?? []} />
      <NotesSection projectId={projectId} initialNotes={notes ?? []} />
    </div>
  );
}
