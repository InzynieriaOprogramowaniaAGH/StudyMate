"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User as UserIcon } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { useTranslations } from "next-intl";

export function AccountTab({ user: _user }: { user: any }) {
  const { data: session, update } = useSession();
  const t = useTranslations("profile.account");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    university: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      const fullName = session.user.name ?? "";
      const [firstName = "", ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ");

      setForm({
        firstName,
        lastName,
        email: session.user.email ?? "",
        // Te pola nie istnieją w modelu User — utrzymujemy je tylko w UI:
        bio: "",
        university: "",
      });
      setLoading(false);
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      // Aktualizujemy nazwę i email w sesji (zgodnie z typami NextAuth)
      const newName = [form.firstName, form.lastName].filter(Boolean).join(" ");
      await update({
        user: {
          ...(session?.user ?? {}),
          name: newName || session?.user?.name,
          email: form.email || session?.user?.email,
        } as any,
      });

      // Zostawiamy wartości z backendu (jeśli coś zwrócił) + nasze pola formularza
      setForm({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        bio: data.user?.bio ?? form.bio ?? "",
        university: data.user?.university ?? form.university ?? "",
      });

      setMessage(`✅ ${t("successMessage")}`);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 text-[var(--color-muted)] shadow-sm">
        {t("loading")}
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)] flex-shrink-0">
          <UserIcon size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-[var(--color-text)]">
            {t("title")}
          </h4>
          <p className="text-xs sm:text-sm text-[var(--color-muted)]">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label={t("firstName")}
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <InputField
            label={t("lastName")}
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <InputField
          label={t("email")}
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <InputField
          label={t("bio")}
          name="bio"
          placeholder={t("bioPlaceholder")}
          value={form.bio}
          onChange={handleChange}
          textarea
        />

        <InputField
          label={t("university")}
          name="university"
          placeholder={t("universityPlaceholder")}
          value={form.university}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={saving}
          className={`w-full sm:w-auto bg-[var(--color-primary)] text-[var(--color-white)] font-medium py-2 px-5 rounded-lg shadow-md transition-colors text-sm sm:text-base ${
            saving
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[var(--color-primary-dark)]"
          }`}
        >
          {saving ? t("saving") : t("saveChanges")}
        </button>

        {message && (
          <p
            className={`text-xs sm:text-sm mt-3 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
