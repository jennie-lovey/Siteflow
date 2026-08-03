"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EstimatePdfDocument } from "@/lib/pdf/EstimatePdfDocument";
import type { EstimateItem, Project } from "@/types/domain";

export function DownloadEstimatePdfButton({
  project,
  versionNumber,
  items,
}: {
  project: Project;
  versionNumber: number;
  items: EstimateItem[];
}) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      const blob = await pdf(
        <EstimatePdfDocument project={project} versionNumber={versionNumber} items={items} generatedAt={new Date()} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeName = project.name.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      link.download = `${safeName || "quotation"}-v${versionNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={generating || items.length === 0}>
      <Download className="h-3.5 w-3.5" />
      {generating ? "Generating PDF..." : "Download PDF"}
    </Button>
  );
}
