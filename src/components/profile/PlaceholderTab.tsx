"use client";

export function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 text-gray-400 text-center">
      {title} settings coming soon.
    </div>
  );
}
