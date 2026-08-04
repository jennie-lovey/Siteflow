import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AgreedPriceEditor } from "@/components/projects/AgreedPriceEditor";
import { formatNaira } from "@/lib/utils/currency";
import { formatDisplayDate } from "@/lib/utils/date";
import { computeProfit } from "@/lib/utils/totals";

export const dynamic = "force-dynamic";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: project }, { data: financials }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase.from("project_financials").select("*").eq("project_id", projectId).maybeSingle(),
  ]);

  if (!project) return null;

  const originalEstimate = financials?.original_estimate_total ?? 0;
  const currentEstimate = financials?.current_estimate_total ?? 0;
  const actualSpent = financials?.actual_spent ?? 0;
  const profit = computeProfit(project.agreed_price, actualSpent);
  const isCompleted = project.status === "completed";

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-900">Project Summary</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isCompleted
              ? `Final numbers for this completed project${
                  project.completed_at ? ` — completed ${formatDisplayDate(project.completed_at.slice(0, 10))}` : ""
                }.`
              : "Numbers so far — profit shown below is an estimate until the project is marked Completed."}
          </p>
        </CardHeader>
        <CardBody>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Original Estimated Cost</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatNaira(originalEstimate)}</dd>
              {currentEstimate !== originalEstimate && (
                <p className="mt-1 text-xs text-slate-400">
                  Current estimate (latest version): {formatNaira(currentEstimate)}
                </p>
              )}
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Actual Amount Spent</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900">{formatNaira(actualSpent)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Amount Charged to Client</dt>
              <dd className="mt-1">
                <AgreedPriceEditor projectId={project.id} agreedPrice={project.agreed_price} />
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                {isCompleted ? "Profit" : "Expected Profit"}
              </dt>
              <dd
                className={`mt-1 text-2xl font-semibold ${
                  profit === null ? "text-slate-400" : profit >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {profit === null ? "Set an agreed price to calculate" : formatNaira(profit)}
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
