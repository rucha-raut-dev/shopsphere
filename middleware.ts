import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Kept in sync with the cookie name AuthContext writes on sign-in/sign-out.
const AUTH_COOKIE = "ss-auth";

/**
 * Runs on the server, before the matched page (or any of its data) loads —
 * unlike a client-side redirect in a page/component, this can't be skipped
 * by disabling JS, and it never even lets the checkout page's HTML reach
 * the browser for a signed-out visitor.
 *
 * The trade-off that makes this possible: middleware only ever sees the
 * incoming request's cookies and headers, never localStorage (that's a
 * browser-only API). That's exactly why AuthContext now also writes a
 * small "ss-auth=1" cookie alongside its localStorage session — this file
 * is the reason that cookie exists at all.
 */
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has(AUTH_COOKIE);
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
}

// Only run this middleware for the two paths it actually cares about —
// it would be wasted work (and wasted latency) on every other route.
export const config = {
  matcher: ["/checkout", "/account"],
};