"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { formatNaira } from "@/lib/utils/currency";

export function AgreedPriceEditor({ projectId, agreedPrice }: { projectId: string; agreedPrice: number | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(agreedPrice !== null ? String(agreedPrice) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const numeric = value.trim() === "" ? null : Number(value);
    if (numeric !== null && (Number.isNaN(numeric) || numeric < 0)) {
      setError("Enter a valid, non-negative amount.");
      return;
    }
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase
      .from("projects")
      .update({ agreed_price: numeric })
      .eq("id", projectId);
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-2xl font-semibold text-slate-900">
          {agreedPrice !== null ? formatNaira(agreedPrice) : "Not set"}
        </p>
        <Button variant="ghost" onClick={() => setEditing(true)}>
          {agreedPrice !== null ? "Edit" : "Set amount"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div>
        <Input
          type="number"
          min={0}
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Amount charged to client"
          className="w-48"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
      <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
        Cancel
      </Button>
    </div>
  );
}
