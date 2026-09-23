"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

// DEMO AUTH: accounts live in this browser's localStorage and have no
// password, so this is a UI/state demo, not real security. A real app would
// verify credentials on a server.
const ACCOUNTS_KEY = "shopsphere-accounts";
const SESSION_KEY = "shopsphere-session";

type StoredAccount = User & { createdAt: string };

export type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: User | null;
  isHydrated: boolean;
  signUp: (name: string, email: string) => AuthResult;
  signIn: (email: string) => AuthResult;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readAccounts(): StoredAccount[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeSession(user: User | null) {
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable, the session just won't persist across reloads
  }
}

const firstNameOf = (name: string) => name.trim().split(" ")[0];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed.name === "string" &&
          typeof parsed.email === "string"
        ) {
          setUser({ name: parsed.name, email: parsed.email });
        }
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const signUp = (name: string, email: string): AuthResult => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const accounts = readAccounts();

    if (accounts.some((a) => a.email === cleanEmail)) {
      return {
        ok: false,
        error: "An account with this email already exists. Try signing in instead.",
      };
    }

    const account: StoredAccount = {
      name: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify([...accounts, account])
      );
    } catch {
      return {
        ok: false,
        error: "We couldn't save your account. Check that your browser allows site storage.",
      };
    }

    const next: User = { name: cleanName, email: cleanEmail };
    writeSession(next);
    setUser(next);
    showToast(`Welcome, ${firstNameOf(cleanName)}!`, "success");
    return { ok: true };
  };

  const signIn = (email: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const account = readAccounts().find((a) => a.email === cleanEmail);

    if (!account) {
      return {
        ok: false,
        error: "We couldn't find an account with that email. Create one instead.",
      };
    }

    const next: User = { name: account.name, email: account.email };
    writeSession(next);
    setUser(next);
    showToast(`Welcome back, ${firstNameOf(account.name)}!`, "success");
    return { ok: true };
  };

  const signOut = () => {
    writeSession(null);
    setUser(null);
    showToast("You've been signed out", "info");
  };

  return (
    <AuthContext.Provider value={{ user, isHydrated, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}