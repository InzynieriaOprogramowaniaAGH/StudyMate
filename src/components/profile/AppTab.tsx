"use client";

import { useTranslations } from "next-intl";
import { DesktopInstallerButton } from "./DesktopInstaller";

export function AppTab() {
  const t = useTranslations("profile.app");

  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      <h4 className="font-semibold text-base mb-2 text-[var(--color-text)]">{t("title")}</h4>
      <DesktopInstallerButton />
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        {t("desc1")}
        <br />
        {t("desc2")}
      </p>
    </section>
  );
}