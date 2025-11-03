"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProfileHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    level?: number;
    streak?: number;
    role?: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: session, update } = useSession();
  const [avatar, setAvatar] = useState(user.image || "/default-avatar.png");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🧩 Automatically update UI if session changes (after profile save)
  useEffect(() => {
    if (session?.user?.image) setAvatar(session.user.image);
  }, [session?.user?.image]);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setAvatar(previewURL);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setAvatar(data.url);
        // 🔹 Instantly update session
        await update({
          user: {
            ...session?.user,
            image: data.url,
          },
        });
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const displayFirstName = session?.user?.firstName || user.firstName;
  const displayLastName = session?.user?.lastName || user.lastName;
  const displayEmail = session?.user?.email || user.email;

  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 text-center shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className="relative group cursor-pointer" onClick={handleClick}>
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-bg-darker)] flex items-center justify-center">
            {uploading ? (
              <Loader2 className="animate-spin text-[var(--color-primary)] w-8 h-8" />
            ) : (
              <Image
                src={avatar}
                alt="Profile photo"
                width={96}
                height={96}
                className="object-cover"
              />
            )}
          </div>

          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm text-white transition">
            Change
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div>
          <h2 className="font-semibold text-[var(--color-text)]">
            {displayFirstName || displayLastName
              ? `${displayFirstName || ""} ${displayLastName || ""}`.trim()
              : session?.user?.name || user.name || "Unnamed User"}
          </h2>
          <p className="text-sm text-[var(--color-muted)]">{displayEmail}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="px-3 py-1 text-xs rounded-md bg-[var(--color-bg-darker)] border border-[var(--color-border)] text-[var(--color-text)]">
            {user.role || "Pro Member"}
          </span>
          <span className="px-3 py-1 text-xs rounded-md bg-[var(--color-bg-darker)] border border-[var(--color-border)] text-[var(--color-text)]">
            {user.role || "ADMIN"}
          </span>
          {user.level && (
            <span className="px-3 py-1 text-xs rounded-md bg-[var(--color-bg-darker)] border border-[var(--color-border)] text-[var(--color-text)]">
              Level {user.level}
            </span>
          )}
          {user.streak && (
            <span className="px-3 py-1 text-xs rounded-md bg-[var(--color-bg-darker)] border border-[var(--color-border)] text-[var(--color-text)]">
              {user.streak} Day Streak
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
