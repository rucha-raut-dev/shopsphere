import type { Metadata } from "next";
import AccountClient from "@/components/AccountClient";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create a ShopSphere account and view your orders.",
  robots: { index: false, follow: false },
};

export default function AccountPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  const mode = searchParams.mode === "signup" ? "signup" : "signin";

  // The URL is the single source of truth for which form is showing, so the
  // navbar links and the in-page toggle always agree. `key` remounts the
  // form (clearing its fields) when the mode changes.
  return <AccountClient key={mode} mode={mode} />;
}