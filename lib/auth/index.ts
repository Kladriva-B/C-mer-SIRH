import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        remember: { label: "Se souvenir", type: "text" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
          remember: credentials?.remember === "true" || credentials?.remember === true,
        });

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: { role: true },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            resource: "User",
            resourceId: user.id,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role.name,
          remember: parsed.data.remember,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        if (user.remember === false) {
          token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
        }
      }

      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: String(token.email).toLowerCase() },
          include: { role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role.name;
          token.name = dbUser.name;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as typeof session.user.role;
        if (token.name) {
          session.user.name = String(token.name);
        }
      }
      return session;
    },
  },
});
