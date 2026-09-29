// Order IDs are generated here so both the seed data and the checkout
// action produce them the same way.
export function createOrderId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `SS-${time}${rand}`;
}