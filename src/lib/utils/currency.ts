const formatter = new Intl.NumberFormat("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNaira(amount: number): string {
  if (!Number.isFinite(amount)) return "₦0.00";
  return `₦${formatter.format(amount)}`;
}

export function formatNairaCompact(amount: number): string {
  if (!Number.isFinite(amount)) return "₦0";
  return `₦${compactFormatter.format(amount)}`;
}
