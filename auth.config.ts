import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Edge-safe subset of the Auth.js config: no Prisma, no bcrypt. Middleware
// runs on the Edge runtime, which can't load either, so middleware.ts
// builds its session-checking NextAuth instance from just this file.
// lib/auth.ts extends this with the real `authorize` logic and the Prisma
// adapter, used everywhere else (sign-in, sign-up, Server Actions).
export const authConfig = {
  pages: {
    signIn: "/account",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      // Middleware only ever verifies an *existing* signed session cookie —
      // it never calls authorize() to check a password — so this
      // placeholder is never actually invoked there. The real check lives
      // in lib/auth.ts.
      authorize: async () => null,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = (user as { id: string }).id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;