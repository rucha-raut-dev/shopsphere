"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, PackageSearch } from "lucide-react";
import type { Order } from "@/lib/types";
import { getOrderById } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

const PAYMENT_LABELS: Record<Order["paymentMethod"], string> = {
  cod: "Pay on delivery",
  card: "Card (demo)",
};

export default function OrderConfirmationClient({ orderId }: { orderId: string }) {
  // undefined = still reading localStorage, null = no such order on this device.
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrderById(orderId));
  }, [orderId]);

  if (order === undefined) {
    return (
      <div className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <PackageSearch className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-medium text-foreground">
          We couldn&apos;t find that order
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Orders are saved in this browser only, so the link won&apos;t work on
          another device or after clearing your site data.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to Shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const { customer } = order;
  const firstName = customer.fullName.split(" ")[0];
  const placedOn = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
            Thank you, {firstName}!
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Your order has been placed. This is a demo store, so no email is
            sent and no payment was taken.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order number
            </p>
            <p className="mt-1 font-semibold text-foreground">{order.id}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Placed on
            </p>
            <p className="mt-1 font-semibold text-foreground">{placedOn}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Payment
            </p>
            <p className="mt-1 font-semibold text-foreground">
              {PAYMENT_LABELS[order.paymentMethod]}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card px-6 py-2">
          <ul className="divide-y divide-border">
            {order.lines.map((line) => (
              <li
                key={`${line.productId}-${line.color}-${line.size}`}
                className="flex gap-4 py-4"
              >
                <Link
                  href={`/products/${line.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                >
                  <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex-1 text-sm">
                  <Link
                    href={`/products/${line.slug}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[line.color, line.size].filter(Boolean).join(" · ") || "Standard"} · Qty {line.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t border-border py-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-foreground">
                {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm">
          <h2 className="font-serif text-lg font-medium text-foreground">Shipping to</h2>
          <address className="mt-3 not-italic leading-relaxed text-muted-foreground">
            <span className="text-foreground">{customer.fullName}</span>
            <br />
            {customer.address}
            <br />
            {customer.city}, {customer.state} {customer.postalCode}
            <br />
            {customer.country}
            <br />
            {customer.phone} · {customer.email}
          </address>
          <p className="mt-4 text-xs text-muted-foreground">
            Estimated delivery: 5 to 7 business days.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}