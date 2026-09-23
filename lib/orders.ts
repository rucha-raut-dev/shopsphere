import type { Order } from "@/lib/types";

const STORAGE_KEY = "shopsphere-orders";

// These helpers touch localStorage, so only call them from client code
// (event handlers or useEffect), never during server rendering.

export function createOrderId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `SS-${time}${rand}`;
}

export function getOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): Order | null {
  return getOrders().find((o) => o.id === id) ?? null;
}

// Orders are matched to an account by the email used at checkout
// (case-insensitive). Newest first, because saveOrder prepends.
export function getOrdersForEmail(email: string): Order[] {
  const target = email.trim().toLowerCase();
  return getOrders().filter(
    (o) => o.customer.email.trim().toLowerCase() === target
  );
}

// Returns false if the order couldn't be persisted (storage full/blocked).
export function saveOrder(order: Order): boolean {
  try {
    const existing = getOrders();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([order, ...existing])
    );
    return true;
  } catch {
    return false;
  }
}