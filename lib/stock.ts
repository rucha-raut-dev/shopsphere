// Products with `stock` at or below this show an "Only N left" hint.
export const LOW_STOCK_THRESHOLD = 20;

export type StockState = "in-stock" | "low" | "out";

export type StockStatus = {
  state: StockState;
  label: string;
};

// A product with no `stock` value is treated as always available.
export function getStockStatus(stock?: number): StockStatus {
  if (stock === undefined) return { state: "in-stock", label: "In stock" };
  if (stock <= 0) return { state: "out", label: "Out of stock" };
  if (stock <= LOW_STOCK_THRESHOLD) return { state: "low", label: `Only ${stock} left` };
  return { state: "in-stock", label: "In stock" };
}