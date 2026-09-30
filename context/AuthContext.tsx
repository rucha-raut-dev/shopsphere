"use client";

import { createContext, useContext } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import type { User } from "@/lib/types";

// Real accounts now live in Postgres and are verified with a hashed
// password (see lib/auth.ts and app/actions/auth.ts). This context is kept
// only so existing components (Navbar, CartClient, CheckoutClient, etc.)
// can keep calling useAuth() without every one of them needing to import
// next-auth/react directly.
type AuthContextValue = {
  user: User | null;
  isHydrated: boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user: User | null =
    status === "authenticated" && session?.user
      ? { name: session.user.name ?? "", email: session.user.email ?? "" }
      : null;

  const signOut = () => {
    nextAuthSignOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider value={{ user, isHydrated: status !== "loading", signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}