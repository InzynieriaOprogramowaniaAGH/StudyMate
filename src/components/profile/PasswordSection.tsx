import { useState } from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export function PasswordSection() {
  const t = useTranslations("profile.security");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage(`❌ ${t("fillAllFields")}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(`❌ ${t("passwordsNoMatch")}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessage(`✅ ${t("successMessage")}`);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
          <Lock size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-[var(--color-text)]">{t("title")}</h4>
          <p className="text-xs sm:text-sm text-[var(--color-muted)]">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="password"
          placeholder={t("currentPassword")}
          className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs sm:text-sm text-[var(--color-text)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("newPassword")}
          className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs sm:text-sm text-[var(--color-text)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("confirmPassword")}
          className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs sm:text-sm text-[var(--color-text)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className={`w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition ${
            loading
              ? "opacity-70 cursor-not-allowed bg-[var(--color-primary)] text-[var(--color-bg)]"
              : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-dark)]"
          }`}
        >
          {loading ? t("updating") : t("updatePassword")}
        </button>

        {message && (
          <p className={`text-xs sm:text-sm mt-2 ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
