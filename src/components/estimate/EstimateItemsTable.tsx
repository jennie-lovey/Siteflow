"use client";

import { ESTIMATE_CATEGORY_PRESETS } from "@/lib/constants";
import { selectChevronStyle } from "@/components/ui/Field";
import { formatNaira } from "@/lib/utils/currency";
import { computeLineTotal } from "@/lib/utils/totals";
import type { EstimateItem } from "@/types/domain";

interface EstimateItemsTableProps {
  items: EstimateItem[];
  editable: boolean;
  onUpdate: (id: string, patch: Partial<Pick<EstimateItem, "category" | "description" | "quantity" | "unit_price">>) => void;
  onDelete: (id: string) => void;
}

export function EstimateItemsTable({ items, editable, onUpdate, onDelete }: EstimateItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3">Category</th>
            <th className="py-2 pr-3">Description</th>
            <th className="py-2 pr-3 text-right">Quantity</th>
            <th className="py-2 pr-3 text-right">Unit Price</th>
            <th className="py-2 pr-3 text-right">Line Total</th>
            {editable && <th className="py-2 pl-3" />}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={editable ? 6 : 5} className="py-6 text-center text-slate-400">
                No line items yet.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0">
              <td className="py-2 pr-3">
                {editable ? (
                  <CategoryCell item={item} onUpdate={onUpdate} />
                ) : (
                  <span className="text-slate-700">{item.category}</span>
                )}
              </td>
              <td className="py-2 pr-3">
                {editable ? (
                  <input
                    defaultValue={item.description}
                    onBlur={(e) => onUpdate(item.id, { description: e.target.value })}
                    placeholder="Optional description"
                    className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 focus:border-blue-400 focus:bg-white focus:outline-none"
                  />
                ) : (
                  <span className="text-slate-500">{item.description}</span>
                )}
              </td>
              <td className="py-2 pr-3 text-right">
                {editable ? (
                  <input
                    type="number"
                    min={0}
                    step="any"
                    defaultValue={item.quantity}
                    onBlur={(e) => onUpdate(item.id, { quantity: Number(e.target.value) || 0 })}
                    className="w-24 rounded border border-transparent bg-transparent px-1.5 py-1 text-right focus:border-blue-400 focus:bg-white focus:outline-none"
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td className="py-2 pr-3 text-right">
                {editable ? (
                  <input
                    type="number"
                    min={0}
                    step="any"
                    defaultValue={item.unit_price}
                    onBlur={(e) => onUpdate(item.id, { unit_price: Number(e.target.value) || 0 })}
                    className="w-28 rounded border border-transparent bg-transparent px-1.5 py-1 text-right focus:border-blue-400 focus:bg-white focus:outline-none"
                  />
                ) : (
                  formatNaira(item.unit_price)
                )}
              </td>
              <td className="py-2 pr-3 text-right font-medium text-slate-900">
                {formatNaira(computeLineTotal(item))}
              </td>
              {editable && (
                <td className="py-2 pl-3 text-right">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryCell({
  item,
  onUpdate,
}: {
  item: EstimateItem;
  onUpdate: EstimateItemsTableProps["onUpdate"];
}) {
  const isPreset = (ESTIMATE_CATEGORY_PRESETS as readonly string[]).includes(item.category);

  return (
    <div className="flex flex-col gap-1">
      <select
        defaultValue={isPreset ? item.category : "Other"}
        onChange={(e) => {
          const value = e.target.value;
          if (value !== "Other") onUpdate(item.id, { category: value });
        }}
        className="appearance-none rounded border border-transparent bg-transparent py-1 pl-1.5 pr-6 focus:border-blue-400 focus:bg-white focus:outline-none"
        style={{ ...selectChevronStyle, backgroundPosition: "right 0.15rem center", backgroundSize: "0.85rem" }}
      >
        {ESTIMATE_CATEGORY_PRESETS.map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
      </select>
      {!isPreset && (
        <input
          defaultValue={item.category}
          onBlur={(e) => onUpdate(item.id, { category: e.target.value || "Other" })}
          placeholder="Custom category"
          className="rounded border border-slate-200 bg-white px-1.5 py-1 text-xs focus:border-blue-400 focus:outline-none"
        />
      )}
    </div>
  );
}
