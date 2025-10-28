"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p>Something went wrong during login.</p>
      <a href="/auth/login" className="text-blue-500 underline mt-4">
        Back to Login
      </a>
    </div>
  );
}

