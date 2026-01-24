"use client";

import { useTranslations } from "next-intl";

export function PreferencesTab() {
  const t = useTranslations("profile.preferences");
  
  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="space-y-3">
        <h4 className="font-semibold text-sm sm:text-base text-[var(--color-text)]">
          {t("title")}
        </h4>
        <p className="text-xs sm:text-sm text-[var(--color-muted)]">
          {t("comingSoon")}
        </p>
      </div>
    </section>
  );
}

export default PreferencesTab;
