"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";

export type AuthActionState = {
  status: "idle" | "error";
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) {
    return { status: "error", error: "Please enter your full name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { status: "error", error: "Password must be at least 8 characters." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { status: "error", error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.create({ data: { name, email, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch {
    return {
      status: "error",
      error: "Account created, but sign-in failed. Please sign in manually.",
    };
  }

  return { status: "idle" };
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { status: "idle" };
  } catch (err) {
    if (err instanceof AuthError) {
      return { status: "error", error: "Invalid email or password." };
    }
    throw err;
  }
}