"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ErrorInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Unknown error";
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4">
      <h1 className="text-xl font-semibold">Sign-in error</h1>
      <p className="text-sm text-[var(--color-muted)]">Reason: {error}</p>
      <Link
        href="/auth/login"
        className="mt-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-black hover:text-white transition"
      >
        Back to login
      </Link>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ErrorInner />
    </Suspense>
  );
}
