// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const isHttps =
  (process.env.NEXTAUTH_URL ?? "").toLowerCase().startsWith("https://");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) throw new Error("Invalid credentials");
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid email or password");
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
        };
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  jwt: { secret: process.env.NEXTAUTH_SECRET },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  // Uwaga: secure bazuje na schemacie NEXTAUTH_URL (HTTP -> false, HTTPS -> true)
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps,
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string | null | undefined;
        session.user.email = token.email as string | null | undefined;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};
