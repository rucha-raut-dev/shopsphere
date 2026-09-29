import type { Order as DbOrder, OrderLine as DbOrderLine } from "@prisma/client";
import { db } from "@/lib/db";
import type { Order, OrderLine } from "@/lib/types";

type DbOrderWithLines = DbOrder & { lines: DbOrderLine[] };

function toOrder(o: DbOrderWithLines): Order {
  return {
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    total: Number(o.total),
    paymentMethod: o.paymentMethod,
    customer: {
      fullName: o.fullName,
      email: o.email,
      phone: o.phone,
      address: o.address,
      city: o.city,
      state: o.state,
      postalCode: o.postalCode,
      country: o.country,
    },
    lines: o.lines.map(
      (l): OrderLine => ({
        productId: l.productId,
        name: l.name,
        slug: l.slug,
        image: l.image,
        price: Number(l.price),
        quantity: l.quantity,
        color: l.color ?? undefined,
        size: l.size ?? undefined,
      })
    ),
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await db.order.findUnique({ where: { id }, include: { lines: true } });
  return row ? toOrder(row) : null;
}

// Case-insensitive, newest first — same behavior as the old localStorage version.
export async function getOrdersForEmail(email: string): Promise<Order[]> {
  const rows = await db.order.findMany({
    where: { email: { equals: email.trim(), mode: "insensitive" } },
    include: { lines: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}