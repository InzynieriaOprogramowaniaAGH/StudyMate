"use client";

export function PreferencesTab() {
  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="space-y-3">
        <h4 className="font-semibold text-sm sm:text-base text-[var(--color-text)]">
          Preferences
        </h4>
        <p className="text-xs sm:text-sm text-[var(--color-muted)]">
          Preferences panel will be available soon.
        </p>
      </div>
    </section>
  );
}

export default PreferencesTab;
