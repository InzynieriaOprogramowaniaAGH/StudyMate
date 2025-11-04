"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import InputField from "@/components/ui/InputField";

export function AccountTab({ user }: { user: any }) {
  const { data: session, update } = useSession();
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
      setForm({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        email: session.user.email || "",
        bio: session.user.bio || "",
        university: session.user.university || "",
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

      await update({
        user: {
          ...session?.user,
          ...data.user,
        },
      });

      setForm(data.user);
      setMessage("✅ Profile updated successfully!");
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
        Loading profile...
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
          <User size={18} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h4 className="font-semibold text-[var(--color-text)]">Personal Information</h4>
          <p className="text-sm text-[var(--color-muted)]">
            Update your personal details and profile information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <InputField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <InputField
          label="Bio"
          name="bio"
          placeholder="Tell us about yourself"
          value={form.bio}
          onChange={handleChange}
          textarea
        />

        <InputField
          label="University/School"
          name="university"
          placeholder="Your institution"
          value={form.university}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={saving}
          className={`bg-[var(--color-primary)] text-[var(--color-white)] font-medium py-2 px-5 rounded-lg shadow-md transition-colors ${
            saving
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[var(--color-primary-dark)]"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p
            className={`text-sm mt-3 ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
