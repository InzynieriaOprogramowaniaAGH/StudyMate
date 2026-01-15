// src/lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const isHttps =
  (process.env.NEXTAUTH_URL ?? "").toLowerCase().startsWith("https://");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
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
          image: user.image ?? undefined,
          firstName: (user as any).firstName ?? null,
          lastName: (user as any).lastName ?? null,
          bio: (user as any).bio ?? null,
          university: (user as any).university ?? null,
        } as any;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  cookies: {
    sessionToken: {
      name:"next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.email = user.email;
        token.image = (user as any).image ?? null;
        token.firstName = (user as any).firstName ?? null;
        token.lastName = (user as any).lastName ?? null;
        token.bio = (user as any).bio ?? null;
        token.university = (user as any).university ?? null;
        return token;
      }

      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.image = dbUser.image ?? null;
            token.firstName = (dbUser as any).firstName ?? null;
            token.lastName = (dbUser as any).lastName ?? null;
            token.bio = (dbUser as any).bio ?? null;
            token.university = (dbUser as any).university ?? null;
          }
        } catch (error) {
          console.error("[JWT] Error fetching user:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string | null | undefined;
        session.user.email = token.email as string | null | undefined;
        (session.user as any).image =
          (token.image as string | null | undefined) ?? null;
        (session.user as any).firstName =
          (token.firstName as string | null | undefined) ?? null;
        (session.user as any).lastName =
          (token.lastName as string | null | undefined) ?? null;
        (session.user as any).bio =
          (token.bio as string | null | undefined) ?? null;
        (session.user as any).university =
          (token.university as string | null | undefined) ?? null;
      }

      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};
