import { useState } from "react";

export function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
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

      setMessage("✅ Password updated successfully!");
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
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      {/* ... header content ... */}

      <div className="space-y-3">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            loading
              ? "opacity-70 cursor-not-allowed bg-[var(--color-primary)] text-[var(--color-bg)]"
              : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-dark)] transition"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </div>
    </section>
  );
}
