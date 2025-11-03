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
        email: { label: "Email", type: "text" },
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

        // ✅ Return all relevant fields
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          university: user.university,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
  // 🔹 When user first logs in, attach user data to token
  if (user) {
    token.id = user.id;
    token.email = user.email;
    token.name = user.name;
    token.image = user.image;
    token.firstName = (user as any).firstName || null;
    token.lastName = (user as any).lastName || null;
    token.bio = (user as any).bio || null;
    token.university = (user as any).university || null;
  }

  // 🔹 When `update()` is called on client side
  if (trigger === "update" && session?.user) {
    token.firstName = session.user.firstName;
    token.lastName = session.user.lastName;
    token.bio = session.user.bio;
    token.university = session.user.university;
    token.email = session.user.email;
    token.image = session.user.image;
    token.name = session.user.name;
  }

  // 🔹 Otherwise (normal session refresh), sync with DB if needed
  if (!user && !trigger) {
    const dbUser = await prisma.user.findUnique({
      where: { email: token.email as string },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        firstName: true,
        lastName: true,
        bio: true,
        university: true,
      },
    });

    if (dbUser) {
      token.id = dbUser.id;
      token.name = dbUser.name;
      token.image = dbUser.image;
      token.firstName = dbUser.firstName;
      token.lastName = dbUser.lastName;
      token.bio = dbUser.bio;
      token.university = dbUser.university;
    }
  }

  return token;
},

   async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.name = token.name as string;
    session.user.email = token.email as string;
    session.user.image = token.image as string | null;
    session.user.firstName = token.firstName as string | null;
    session.user.lastName = token.lastName as string | null;
    session.user.bio = token.bio as string | null;
    session.user.university = token.university as string | null;
  }

  return session;
},
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
