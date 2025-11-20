// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs"; // OK w App Routerze

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
