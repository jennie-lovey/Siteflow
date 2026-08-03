"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { EstimateItemsTable } from "./EstimateItemsTable";
import { DownloadEstimatePdfButton } from "./DownloadEstimatePdfButton";
import { formatNaira } from "@/lib/utils/currency";
import { computeGrandTotal } from "@/lib/utils/totals";
import { ESTIMATE_CATEGORY_PRESETS } from "@/lib/constants";
import type { EstimateItem, Project } from "@/types/domain";

// Mount this keyed by the selected version's id (see EstimateBuilder) so that
// switching versions naturally resets `items` to that version's data instead
// of syncing derived state in an effect.
export function EstimateVersionEditor({
  project,
  versionId,
  versionNumber,
  initialItems,
  isCurrent,
  onCreateNewVersion,
  creatingVersion,
}: {
  project: Project;
  versionId: string;
  versionNumber: number;
  initialItems: EstimateItem[];
  isCurrent: boolean;
  onCreateNewVersion: (items: EstimateItem[]) => void;
  creatingVersion: boolean;
}) {
  const [items, setItems] = useState<EstimateItem[]>(initialItems);
  const [error, setError] = useState<string | null>(null);

  const grandTotal = computeGrandTotal(items);

  async function handleAddItem() {
    const nextOrderIndex = items.length;
    const { data, error: insertError } = await supabase
      .from("estimate_items")
      .insert({
        estimate_version_id: versionId,
        category: ESTIMATE_CATEGORY_PRESETS[0],
        description: "",
        quantity: 1,
        unit_price: 0,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setItems((prev) => [...prev, data]);
  }

  async function handleUpdateItem(
    id: string,
    patch: Partial<Pick<EstimateItem, "category" | "description" | "quantity" | "unit_price">>
  ) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    const { error: updateError } = await supabase.from("estimate_items").update(patch).eq("id", id);
    if (updateError) setError(updateError.message);
  }

  async function handleDeleteItem(id: string) {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    const { error: deleteError } = await supabase.from("estimate_items").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      setItems(previous);
    }
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <DownloadEstimatePdfButton project={project} versionNumber={versionNumber} items={items} />
        {isCurrent && (
          <Button onClick={() => onCreateNewVersion(items)} disabled={creatingVersion || items.length === 0}>
            <RefreshCw className="h-3.5 w-3.5" />
            {creatingVersion ? "Creating..." : "Client Negotiated — New Version"}
          </Button>
        )}
      </div>

      {!isCurrent && (
        <p className="mb-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
          You are viewing a past version. It is frozen and cannot be edited — this is what was
          actually sent to the client. Switch to the current version to make changes.
        </p>
      )}
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <EstimateItemsTable
        items={items}
        editable={isCurrent}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
      />

      {isCurrent && (
        <button
          onClick={handleAddItem}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Line Item
        </button>
      )}

      <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Grand Total</p>
          <p className="text-2xl font-semibold text-slate-900">{formatNaira(grandTotal)}</p>
        </div>
      </div>
    </div>
  );
}
