import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// A second, edge-safe NextAuth instance built only from the shared config
// in auth.config.ts. Unlike lib/auth.ts, this one never touches Prisma or
// bcrypt, so it can run in the Edge runtime middleware requires — it's only
// used here to verify the signed session cookie. Real sign-in still goes
// through lib/auth.ts and the Server Actions in app/actions/auth.ts.
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const isAuthenticated = !!request.auth;
  const { pathname, search } = request.nextUrl;

  // Checkout requires an account. Send signed-out visitors to sign in,
  // remembering where they were headed so we can bounce them right back.
  if (pathname.startsWith("/checkout") && !isAuthenticated) {
    const signInUrl = new URL("/account", request.url);
    signInUrl.searchParams.set("mode", "signin");
    signInUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  // Someone already signed in has no reason to see a sign-in/sign-up form —
  // send them straight to their account dashboard instead.
  if (
    pathname === "/account" &&
    isAuthenticated &&
    request.nextUrl.searchParams.has("mode")
  ) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
});

// Only run this middleware for the two paths it actually cares about —
// it would be wasted work (and wasted latency) on every other route.
export const config = {
  matcher: ["/checkout", "/account"],
};