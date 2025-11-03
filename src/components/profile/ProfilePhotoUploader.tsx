"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

interface Props {
  currentPhoto?: string;
  userId: string;
}

export default function ProfilePhotoUploader({ currentPhoto, userId }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);

    const res = await fetch("/api/profile/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (res.ok) {
      const data = await res.json();
      setPreviewUrl(data.url);
      alert("Profile photo updated!");
    } else {
      alert("Failed to upload photo.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Image Preview */}
      <div className="relative w-28 h-28 rounded-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-darker)]">
        {previewUrl ? (
          <Image src={previewUrl} alt="Profile" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)]">
            <Upload size={24} />
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm text-[var(--color-muted)]"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="px-4 py-2 bg-[var(--color-primary)] text-black rounded-md font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
      >
        {uploading && <Loader2 className="animate-spin" size={16} />}
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
    </div>
  );
}
