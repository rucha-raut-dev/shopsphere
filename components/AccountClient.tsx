"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, PackageOpen } from "lucide-react";
import type { Order, User } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { getOrdersForEmail } from "@/lib/orders";
import { cn, formatPrice } from "@/lib/utils";

type Mode = "signin" | "signup";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary",
    hasError ? "border-accent" : "border-border"
  );

export default function AccountClient({ mode }: { mode: Mode }) {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-md">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mt-8 h-72 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  return user ? <AccountDashboard user={user} /> : <AuthForm mode={mode} />;
}

function AuthForm({ mode }: { mode: Mode }) {
  const { signIn, signUp } = useAuth();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; form?: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const next: typeof errors = {};
    if (isSignup && name.trim().length < 2) next.name = "Please enter your full name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";

    if (next.name || next.email) {
      setErrors(next);
      document.getElementById(next.name ? "auth-name" : "auth-email")?.focus();
      return;
    }

    const result = isSignup ? signUp(name, email) : signIn(email);
    // On success the provider sets `user`, which swaps this form for the dashboard.
    if (!result.ok) setErrors({ form: result.error });
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignup
            ? "Save your details for faster checkout and keep track of your orders."
            : "Sign in to see your orders and check out faster."}
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          {errors.form && (
            <p role="alert" className="rounded-lg bg-accent/10 px-3.5 py-2.5 text-sm text-accent">
              {errors.form}
            </p>
          )}

          {isSignup && (
            <div>
              <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "auth-name-error" : undefined}
                className={inputClass(Boolean(errors.name))}
              />
              {errors.name && (
                <p id="auth-name-error" className="mt-1 text-xs text-accent">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email || errors.form)
                  setErrors((p) => ({ ...p, email: undefined, form: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "auth-email-error" : undefined}
              className={inputClass(Boolean(errors.email))}
            />
            {errors.email && (
              <p id="auth-email-error" className="mt-1 text-xs text-accent">
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {isSignup ? "Create Account" : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Demo store: accounts are saved in this browser only and have no password.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account? " : "New to ShopSphere? "}
          <Link
            href={isSignup ? "/account?mode=signin" : "/account?mode=signup"}
            className="font-semibold text-primary hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function AccountDashboard({ user }: { user: User }) {
  const { signOut } = useAuth();
  // undefined = still reading localStorage.
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const email = user.email;

  useEffect(() => {
    setOrders(getOrdersForEmail(email));
  }, [email]);

  const firstName = user.name.trim().split(" ")[0];

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              My Account
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium text-foreground sm:text-4xl">
              Hi, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Sign Out
            </button>
          </div>
        </div>

        <h2 className="mt-10 font-serif text-xl font-medium text-foreground">Your orders</h2>

        {orders === undefined ? (
          <div className="mt-4 h-40 animate-pulse rounded-2xl bg-muted" />
        ) : orders.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg font-medium text-foreground">No orders yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Orders placed with {user.email} will show up here.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => {
              const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);
              const placedOn = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return (
                <li key={order.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{order.id}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {placedOn} · {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{formatPrice(order.total)}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex -space-x-2">
                      {order.lines.slice(0, 4).map((line) => (
                        <div
                          key={`${line.productId}-${line.color}-${line.size}`}
                          className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-card bg-muted"
                        >
                          <Image src={line.image} alt={line.name} fill sizes="48px" className="object-cover" />
                        </div>
                      ))}
                      {order.lines.length > 4 && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
                          +{order.lines.length - 4}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      View order
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}