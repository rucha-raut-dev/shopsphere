"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { CartLine, Order, OrderLine, PaymentMethod, ShippingAddress } from "@/lib/types";
import { db } from "@/lib/db";
import { calculateShipping, roundMoney } from "@/lib/pricing";
import { createOrderId } from "@/lib/orders";
import { validateShippingAddress } from "@/lib/shipping-validation";
import type { CheckoutFormState } from "./checkout.types";

/**
 * Server Action for placing an order. Bound with the current cart lines via
 * `.bind(null, cartLines)` on the client, so the real signature Next.js
 * calls is (cartLines, prevState, formData).
 *
 * The one rule this function exists to enforce: NEVER trust price, product
 * name, or quantity data coming from the client. Every dollar amount here
 * is recomputed from the database, not from whatever the client claims.
 */
export async function placeOrder(
  cartLines: CartLine[],
  prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  if (!cookies().has("ss-auth")) {
    return {
      status: "error",
      fieldErrors: {},
      formError: "Please sign in to place an order.",
      values: prevState.values,
    };
  }

  const shippingAddress: ShippingAddress = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
    country: String(formData.get("country") ?? ""),
  };
  const paymentMethod: PaymentMethod = formData.get("paymentMethod") === "card" ? "card" : "cod";

  const fieldErrors = validateShippingAddress(shippingAddress);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values: shippingAddress };
  }

  if (cartLines.length === 0) {
    return {
      status: "error",
      fieldErrors: {},
      formError: "Your cart is empty.",
      values: shippingAddress,
    };
  }

  // Look up every cart product straight from the database.
  const dbProducts = await db.product.findMany({
    where: { id: { in: cartLines.map((l) => l.productId) } },
  });

  const orderLines: OrderLine[] = [];
  for (const line of cartLines) {
    const product = dbProducts.find((p) => p.id === line.productId);
    if (!product) continue;

    const available = product.stock ?? Infinity;

    if (line.quantity > available) {
      return {
        status: "error",
        fieldErrors: {},
        formError: `Sorry, only ${available} of "${product.name}" ${available === 1 ? "is" : "are"} left in stock. Please update your cart and try again.`,
        values: shippingAddress,
      };
    }

    if (line.quantity <= 0) continue;

    orderLines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: Number(product.price), // <- server price, never the client's
      quantity: line.quantity,
      color: line.color,
      size: line.size,
    });
  }

  if (orderLines.length === 0) {
    return {
      status: "error",
      fieldErrors: {},
      formError: "None of the items in your cart are available anymore.",
      values: shippingAddress,
    };
  }

  const subtotal = roundMoney(orderLines.reduce((sum, l) => sum + l.price * l.quantity, 0));
  const shipping = calculateShipping(subtotal);
  const total = roundMoney(subtotal + shipping);
  const orderId = createOrderId();

  // Products with stock === null are treated as always available, so they
  // don't get a decrement statement.
  const stockUpdates = orderLines
    .map((l) => {
      const product = dbProducts.find((p) => p.id === l.productId);
      return product?.stock != null
        ? db.product.update({
            where: { id: l.productId },
            data: { stock: { decrement: l.quantity } },
          })
        : null;
    })
    .filter((u): u is NonNullable<typeof u> => u !== null);

  // One transaction: the order, its lines, and every stock decrement either
  // all happen together, or none of them do.
  await db.$transaction([
    db.order.create({
      data: {
        id: orderId,
        subtotal,
        shipping,
        total,
        paymentMethod,
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        lines: {
          create: orderLines.map((l) => ({
            productId: l.productId,
            name: l.name,
            slug: l.slug,
            image: l.image,
            price: l.price,
            quantity: l.quantity,
            color: l.color,
            size: l.size,
          })),
        },
      },
    }),
    ...stockUpdates,
  ]);

  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    lines: orderLines,
    subtotal,
    shipping,
    total,
    customer: shippingAddress,
    paymentMethod,
  };

  // Stock just changed for real, so invalidate every cached page that
  // reads these products (see lib/products-cache.ts for the tags).
  for (const line of orderLines) {
    revalidateTag(`product:${line.slug}`);
  }
  revalidateTag("products");

  return { status: "success", fieldErrors: {}, values: shippingAddress, order };
}