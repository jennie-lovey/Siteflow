import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { formatNaira } from "@/lib/utils/currency";
import { computeGrandTotal, computeLineTotal } from "@/lib/utils/totals";
import type { EstimateItem, Project } from "@/types/domain";

// The standard PDF fonts (Helvetica, etc.) don't include the ₦ glyph, so it
// renders blank. Noto Sans does — verified to cover U+20A6 (Naira Sign).
Font.register({
  family: "Noto Sans",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Noto Sans", color: "#0f172a" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  // Reserved space for a business logo/name once branding is added.
  brandBlock: { width: 200 },
  brandName: { fontSize: 16, fontWeight: 700 },
  metaBlock: { alignItems: "flex-end" },
  title: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  metaText: { color: "#64748b" },
  section: { marginBottom: 16 },
  sectionLabel: { fontSize: 9, color: "#64748b", textTransform: "uppercase", marginBottom: 2 },
  projectName: { fontSize: 12, fontWeight: 700 },
  table: { marginTop: 12, borderTop: "1 solid #e2e8f0" },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1 solid #cbd5e1",
    paddingVertical: 6,
    backgroundColor: "#f8fafc",
  },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #f1f5f9", paddingVertical: 6 },
  colCategory: { width: "24%" },
  colDescription: { width: "30%" },
  colQty: { width: "14%", textAlign: "right" },
  colPrice: { width: "16%", textAlign: "right" },
  colTotal: { width: "16%", textAlign: "right" },
  headerCell: { fontSize: 8, textTransform: "uppercase", color: "#64748b" },
  totalsBlock: { marginTop: 16, alignItems: "flex-end" },
  grandTotalLabel: { fontSize: 10, color: "#64748b" },
  grandTotalValue: { fontSize: 16, fontWeight: 700, marginTop: 2 },
  footer: { marginTop: 40, fontSize: 9, color: "#94a3b8" },
});

export function EstimatePdfDocument({
  project,
  versionNumber,
  items,
  generatedAt,
}: {
  project: Project;
  versionNumber: number;
  items: EstimateItem[];
  generatedAt: Date;
}) {
  const grandTotal = computeGrandTotal(items);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>SiteFlow</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.title}>Quotation</Text>
            <Text style={styles.metaText}>Version {versionNumber}</Text>
            <Text style={styles.metaText}>
              {generatedAt.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Project</Text>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.metaText}>{project.project_type}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colCategory, styles.headerCell]}>Category</Text>
            <Text style={[styles.colDescription, styles.headerCell]}>Description</Text>
            <Text style={[styles.colQty, styles.headerCell]}>Qty</Text>
            <Text style={[styles.colPrice, styles.headerCell]}>Unit Price</Text>
            <Text style={[styles.colTotal, styles.headerCell]}>Total</Text>
          </View>
          {items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colCategory}>{item.category}</Text>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatNaira(item.unit_price)}</Text>
              <Text style={styles.colTotal}>{formatNaira(computeLineTotal(item))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>{formatNaira(grandTotal)}</Text>
        </View>

        <View style={styles.footer}>
          <Text>This quotation is an estimate and may be revised. Prices are subject to change based on material availability.</Text>
        </View>
      </Page>
    </Document>
  );
}
