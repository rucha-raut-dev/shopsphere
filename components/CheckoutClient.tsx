"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CreditCard,
  Lock,
  ShoppingBag,
} from "lucide-react";
import type { Order, PaymentMethod, ShippingAddress } from "@/lib/types";
import { products } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { calculateShipping, roundMoney } from "@/lib/pricing";
import { createOrderId, getOrdersForEmail, saveOrder } from "@/lib/orders";
import { cn, formatPrice } from "@/lib/utils";

type FormErrors = Partial<Record<keyof ShippingAddress, string>>;

const INITIAL_FORM: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

const COUNTRIES = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Other",
];

// Order matters: on a failed submit we focus the first invalid field in this order.
const FIELD_ORDER: Array<keyof ShippingAddress> = [
  "fullName",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "postalCode",
  "country",
];

// True while the user hasn't typed anything, so autofill never overwrites their input.
function isPristine(form: ShippingAddress): boolean {
  return FIELD_ORDER.every((key) => form[key] === INITIAL_FORM[key]);
}

function validate(form: ShippingAddress): FormErrors {
  const errors: FormErrors = {};
  const phoneDigits = form.phone.replace(/\D/g, "");

  if (form.fullName.trim().length < 2) errors.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!/^[+\d\s\-()]+$/.test(form.phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
    errors.phone = "Enter a valid phone number (7 to 15 digits).";
  if (form.address.trim().length < 5) errors.address = "Please enter your street address.";
  if (form.city.trim().length < 2) errors.city = "Please enter your city.";
  if (form.state.trim().length < 2) errors.state = "Please enter your state or region.";
  if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(form.postalCode.trim()))
    errors.postalCode = "Enter a valid postal code.";
  if (!form.country) errors.country = "Please choose a country.";

  return errors;
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary",
    hasError ? "border-accent" : "border-border"
  );

function Field({
  name,
  label,
  error,
  className,
  children,
}: {
  name: keyof ShippingAddress;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`checkout-${name}`} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p id={`checkout-${name}-error`} className="mt-1 text-xs text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutClient() {
  const { lines, subtotal, isHydrated, clearCart } = useCart();
  const { showToast } = useToast();
  const { user, isHydrated: authReady } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<ShippingAddress>(INITIAL_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPlacing, setIsPlacing] = useState(false);

  // Signed-in users get their details prefilled: the address from their most
  // recent order if they have one, otherwise just their name and email.
  useEffect(() => {
    if (!authReady || !user) return;
    const latest = getOrdersForEmail(user.email)[0];
    const prefill: ShippingAddress = latest
      ? { ...latest.customer }
      : { ...INITIAL_FORM, fullName: user.name, email: user.email };
    setForm((prev) => (isPristine(prev) ? prefill : prev));
  }, [authReady, user]);

  // Cart lines joined with their product; drops any line whose product no longer exists.
  const items = lines.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    return product ? [{ line, product }] : [];
  });

  const shipping = calculateShipping(subtotal);
  const total = roundMoney(subtotal + shipping);

  const update =
    (key: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  // Props shared by every text input, so each field stays a one-liner below.
  const fieldProps = (key: keyof ShippingAddress) => ({
    id: `checkout-${key}`,
    name: key,
    value: form[key],
    onChange: update(key),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `checkout-${key}-error` : undefined,
    className: inputClass(Boolean(errors[key])),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPlacing) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid}`)?.focus();
      return;
    }

    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      lines: items.map(({ line, product }) => ({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        quantity: line.quantity,
        color: line.color,
        size: line.size,
      })),
      subtotal,
      shipping,
      total,
      customer: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country,
      },
      paymentMethod,
    };

    setIsPlacing(true);

    // Short artificial delay so the "placing order" state is visible, like a real request.
    window.setTimeout(() => {
      if (!saveOrder(order)) {
        showToast("We couldn't save your order. Please try again.", "error");
        setIsPlacing(false);
        return;
      }
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    }, 700);
  };

  if (!isHydrated) {
    return (
      <div className="container-page py-10 sm:py-14">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  // `isPlacing` keeps the page visible while the cart clears just before redirecting.
  if (items.length === 0 && !isPlacing) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-medium text-foreground">
          Nothing to check out yet
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your cart is empty. Add a few items and come back when you&apos;re ready.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/cart"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to cart
      </Link>
      <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-8"
        >
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-lg font-medium text-foreground">
                Contact &amp; shipping
              </h2>
              {authReady && !user && (
                <Link
                  href="/account?mode=signin"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Have an account? Sign in to autofill
                </Link>
              )}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field name="fullName" label="Full Name" error={errors.fullName}>
                <input type="text" autoComplete="name" {...fieldProps("fullName")} />
              </Field>
              <Field name="email" label="Email Address" error={errors.email}>
                <input type="email" autoComplete="email" {...fieldProps("email")} />
              </Field>
              <Field name="phone" label="Phone Number" error={errors.phone} className="sm:col-span-2">
                <input type="tel" autoComplete="tel" {...fieldProps("phone")} />
              </Field>
              <Field name="address" label="Street Address" error={errors.address} className="sm:col-span-2">
                <input type="text" autoComplete="street-address" {...fieldProps("address")} />
              </Field>
              <Field name="city" label="City" error={errors.city}>
                <input type="text" autoComplete="address-level2" {...fieldProps("city")} />
              </Field>
              <Field name="state" label="State / Region" error={errors.state}>
                <input type="text" autoComplete="address-level1" {...fieldProps("state")} />
              </Field>
              <Field name="postalCode" label="Postal Code" error={errors.postalCode}>
                <input type="text" autoComplete="postal-code" {...fieldProps("postalCode")} />
              </Field>
              <Field name="country" label="Country" error={errors.country}>
                <select autoComplete="country-name" {...fieldProps("country")}>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-serif text-lg font-medium text-foreground">Payment</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              This is a demo store. No real payment is taken and no card details are collected.
            </p>

            <div role="radiogroup" aria-label="Payment method" className="mt-5 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: "cod",
                    title: "Pay on delivery",
                    hint: "Pay in cash when your order arrives.",
                    Icon: Banknote,
                  },
                  {
                    value: "card",
                    title: "Card (demo)",
                    hint: "Simulated card payment, nothing is charged.",
                    Icon: CreditCard,
                  },
                ] as const
              ).map(({ value, title, hint, Icon }) => (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    paymentMethod === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Icon className="h-4 w-4" />
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-lg font-medium text-foreground">Order Summary</h2>

          <ul className="mt-4 divide-y divide-border">
            {items.map(({ line, product }) => (
              <li
                key={`${line.productId}-${line.color}-${line.size}`}
                className="flex gap-3 py-3 first:pt-0"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium text-foreground">{product.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {[line.color, line.size].filter(Boolean).join(" · ") || "Standard"} · Qty {line.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(product.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-foreground">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold text-foreground">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          {/* Lives outside the <form> element but submits it via the `form` attribute,
              so on mobile the button sits right under the totals. */}
          <button
            type="submit"
            form="checkout-form"
            disabled={isPlacing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Lock className="h-4 w-4" />
            {isPlacing ? "Placing order…" : `Place Order · ${formatPrice(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Estimated delivery: 5 to 7 business days.
          </p>
        </aside>
      </div>
    </div>
  );
}