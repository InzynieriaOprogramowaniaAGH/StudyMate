"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-light)] shadow-xl text-center w-[90%] max-w-md"
      >
        <h1 className="text-2xl font-bold mb-3 text-red-500">Authentication Error</h1>
        <p className="text-[var(--color-muted)] mb-6">
          {error
            ? `Something went wrong: ${error}`
            : "An unexpected authentication error occurred."}
        </p>

        <Link
          href="/auth/login"
          className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-xl font-medium text-black hover:text-white transition duration-300"
        >
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
