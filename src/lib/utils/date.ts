export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
