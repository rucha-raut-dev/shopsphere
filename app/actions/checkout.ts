"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { CartLine, Order, OrderLine, PaymentMethod, ShippingAddress } from "@/lib/types";
import { products } from "@/data/products";
import { calculateShipping, roundMoney } from "@/lib/pricing";
import { createOrderId } from "@/lib/orders";
import { validateShippingAddress } from "@/lib/shipping-validation";
import type { CheckoutFormState } from "./checkout.types";

/**
 * Server Action for placing an order. Bound with the current cart lines via
 * `.bind(null, cartLines)` on the client, so the real signature Next.js
 * calls is (cartLines, prevState, formData) — prevState/formData are the
 * two arguments useFormState always supplies.
 *
 * The one rule this function exists to enforce: NEVER trust price, product
 * name, or quantity data coming from the client. Cart state lives in the
 * browser and can be edited freely (devtools, a tampered request, a stale
 * tab). Every dollar amount here is recomputed from the server's own
 * `data/products.ts`, not from whatever the client claims it should be.
 */
export async function placeOrder(
  cartLines: CartLine[],
  prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState>
{
  // middleware.ts already blocks GET requests to /checkout for signed-out
  // visitors, but a Server Action is still technically its own endpoint —
  // someone could in principle invoke it directly. Checking the same
  // cookie here too means the "sign-in required to check out" rule is
  // enforced even if that ever happened, not just when navigating normally.
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

  // Rebuild every order line from the server's product catalog: real name,
  // real price, and a quantity clamped to real stock. A line for a product
  // that no longer exists is silently dropped rather than trusted.
  const orderLines: OrderLine[] = [];
  for (const line of cartLines) {
    const product = products.find((p) => p.id === line.productId);
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
      price: product.price, // <- server price, never the client's
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

  // Simulate real server work: payment authorization, inventory reservation,
  // an order-service call, etc.
  await new Promise((resolve) => setTimeout(resolve, 700));

  
  const order: Order = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    lines: orderLines,
    subtotal,
    shipping,
    total,
    customer: shippingAddress,
    paymentMethod,
  };

    // On-demand revalidation: the OTHER half of the caching story, alongside
  // the scheduled `revalidate = 3600` in the product/category pages (and
  // now in lib/products-cache.ts). That ISR setting regenerates a page on
  // a timer; this instead says "invalidate this specific cache entry right
  // now, because something just changed." Placing an order is exactly the
  // kind of event that would do that in a real app — it should reduce
  // available stock, and the next visitor to that product page should see
  // the new number immediately, not wait up to an hour for it.
  //
  // Tags instead of paths: `revalidatePath("/products/slug")` only ever
  // invalidates that one URL. `revalidateTag("product:slug")` invalidates
  // every cache entry that was tagged with it, however many different
  // pages read from it — here that's both app/products/[id]/page.tsx and
  // the app/@modal quick-view route, from one call. The blanket "products"
  // tag on top of that also covers /shop and every /categories/[category]
  // page, since lib/products-cache.ts tags all of them with it too.
  //
  // `data/products.ts` is a static file here, so stock never actually
  // changes and these calls are inert — but this is precisely where you'd
  // call them the moment stock became a real, mutable value in a database.
  for (const line of orderLines) {
    revalidateTag(`product:${line.slug}`);
  }
  revalidateTag("products");
}