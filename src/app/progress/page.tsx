export default async function ProgressPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Progress</h1>
          <a
            href="/dashboard"
            className="text-[var(--color-primary)] hover:underline"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Progress Content */}
        <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6">
          <p className="text-gray-400">Your progress will appear here.</p>
        </section>
      </div>
    </main>
  );
}