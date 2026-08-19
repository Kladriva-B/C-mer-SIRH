import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = token.role as typeof session.user.role;
        if (token.name) {
          session.user.name = String(token.name);
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
