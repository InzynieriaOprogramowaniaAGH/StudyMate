import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // ✅ Validate input
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        // ✅ Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // ✅ Verify password
        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // ✅ Return safe user object (exclude password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // ✅ Use JWT-based sessions
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  // ✅ JWT secret
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  // ✅ Custom sign-in page
  pages: {
    signIn: "/auth/login",
  },

  // ✅ Cookies config — safer for production
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
        secure: process.env.NODE_ENV === "production", // secure only in production
      },
    },
  },

  // ✅ Callbacks — attach user to JWT and session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
        };
      }
      return session;
    },
  },

  // ✅ Enable debug mode only in development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
