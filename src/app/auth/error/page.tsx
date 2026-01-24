"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function ErrorInner() {
  const t = useTranslations("auth.error");
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Unknown error";
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4">
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <p className="text-sm text-[var(--color-muted)]">{t("reason")} {error}</p>
      <Link
        href="/auth/login"
        className="mt-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-black hover:text-white transition"
      >
        {t("backToLogin")}
      </Link>
    </div>
  );
}

export default function ErrorPage() {
  const t = useTranslations("auth.error");
  return (
    <Suspense fallback={<div className="p-6">{t("loading")}</div>}>
      <ErrorInner />
    </Suspense>
  );
}
