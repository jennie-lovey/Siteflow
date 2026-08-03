export interface LineItemLike {
  quantity: number;
  unit_price: number;
}

export function computeLineTotal(item: LineItemLike): number {
  return item.quantity * item.unit_price;
}

export function computeGrandTotal(items: LineItemLike[]): number {
  return items.reduce((sum, item) => sum + computeLineTotal(item), 0);
}

export function computeVariance(estimateTotal: number, actualSpent: number): number {
  return estimateTotal - actualSpent;
}

export function computeProfit(agreedPrice: number | null, actualSpent: number): number | null {
  if (agreedPrice === null) return null;
  return agreedPrice - actualSpent;
}
