"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { EstimateVersionEditor } from "./EstimateVersionEditor";
import type { EstimateItem, EstimateVersionWithItems, Project } from "@/types/domain";

export function EstimateBuilder({
  project,
  versions,
}: {
  project: Project;
  versions: EstimateVersionWithItems[];
}) {
  const router = useRouter();
  const sortedVersions = useMemo(
    () => [...versions].sort((a, b) => b.version_number - a.version_number),
    [versions]
  );
  const latestVersionNumber = sortedVersions[0]?.version_number ?? 1;

  const [selectedVersionNumber, setSelectedVersionNumber] = useState(latestVersionNumber);
  const [creatingVersion, setCreatingVersion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedVersion = sortedVersions.find((v) => v.version_number === selectedVersionNumber);
  const isCurrent = selectedVersionNumber === latestVersionNumber;

  async function handleCreateNewVersion(items: EstimateItem[]) {
    if (!selectedVersion) return;
    setCreatingVersion(true);
    setError(null);

    try {
      const newVersionNumber = latestVersionNumber + 1;
      const { data: newVersion, error: versionError } = await supabase
        .from("estimate_versions")
        .insert({ project_id: project.id, version_number: newVersionNumber })
        .select()
        .single();

      if (versionError) throw versionError;

      if (items.length > 0) {
        const clonedItems = items.map((item, index) => ({
          estimate_version_id: newVersion.id,
          category: item.category,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          order_index: index,
        }));
        const { error: cloneError } = await supabase.from("estimate_items").insert(clonedItems);
        if (cloneError) throw cloneError;
      }

      router.refresh();
      setSelectedVersionNumber(newVersionNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create a new version.");
    } finally {
      setCreatingVersion(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-slate-900">Estimate</h2>
            <Select
              value={selectedVersionNumber}
              onChange={(e) => setSelectedVersionNumber(Number(e.target.value))}
              className="w-auto"
            >
              {sortedVersions.map((v) => (
                <option key={v.id} value={v.version_number}>
                  Version {v.version_number}
                  {v.version_number === latestVersionNumber ? " (current)" : ""}
                </option>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          {selectedVersion && (
            <EstimateVersionEditor
              key={selectedVersion.id}
              project={project}
              versionId={selectedVersion.id}
              versionNumber={selectedVersion.version_number}
              initialItems={selectedVersion.estimate_items}
              isCurrent={isCurrent}
              onCreateNewVersion={handleCreateNewVersion}
              creatingVersion={creatingVersion}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
