// Single source of truth for shipping rules, shared by the cart and checkout.

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 6.99;

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_COST;
}

// Avoids floating-point noise like 49.99000000000001.
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}