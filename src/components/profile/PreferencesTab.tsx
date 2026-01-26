"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export function PreferencesTab() {
  const t = useTranslations("profile.preferences");
  
  const [goals, setGoals] = useState({
    dailyNotesGoal: 3,
    dailyQuizzesGoal: 3,
    dailyFlashcardsGoal: 20,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile/goals")
      .then((res) => res.json())
      .then((data) => {
        if (data.dailyNotesGoal !== undefined) {
          setGoals(data);
        }
      })
      .catch((err) => console.error("Failed to fetch goals:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goals),
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: t("saveSuccess") });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || t("saveError") });
      }
    } catch {
      setMessage({ type: "error", text: t("saveError") });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const inputStyles = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition";

  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-sm sm:text-base text-[var(--color-text)]">
            {t("title")}
          </h4>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            {t("description")}
          </p>
        </div>

        <div className="space-y-4">
          <h5 className="font-medium text-sm text-[var(--color-text)]">
            {t("dailyGoals.title")}
          </h5>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="notesGoal" className="text-xs text-[var(--color-muted)]">
                {t("dailyGoals.notes")}
              </label>
              <input
                id="notesGoal"
                type="number"
                min="1"
                max="50"
                value={goals.dailyNotesGoal}
                onChange={(e) => setGoals({ ...goals, dailyNotesGoal: parseInt(e.target.value) || 1 })}
                className={inputStyles}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quizzesGoal" className="text-xs text-[var(--color-muted)]">
                {t("dailyGoals.quizzes")}
              </label>
              <input
                id="quizzesGoal"
                type="number"
                min="1"
                max="50"
                value={goals.dailyQuizzesGoal}
                onChange={(e) => setGoals({ ...goals, dailyQuizzesGoal: parseInt(e.target.value) || 1 })}
                className={inputStyles}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="flashcardsGoal" className="text-xs text-[var(--color-muted)]">
                {t("dailyGoals.flashcards")}
              </label>
              <input
                id="flashcardsGoal"
                type="number"
                min="1"
                max="200"
                value={goals.dailyFlashcardsGoal}
                onChange={(e) => setGoals({ ...goals, dailyFlashcardsGoal: parseInt(e.target.value) || 1 })}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl font-medium transition bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t("saving") : t("save")}
          </button>
          
          {message && (
            <span className={`text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {message.text}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default PreferencesTab;
