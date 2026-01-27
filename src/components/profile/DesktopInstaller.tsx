"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

export function DesktopInstallerButton() {
  const t = useTranslations("nav");
  // Ścieżka do instalatora (np. Windows .exe)
  // Po zbudowaniu Tauri wrzuć plik .exe do public/installers/StudyMate-Setup.exe
  const installerUrl = "/installers/StudyMate-Setup.exe";

  return (
    <a
      href={installerUrl}
      download
      className="flex items-center justify-center gap-2 mt-4 px-3 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors text-base font-medium w-full"
    >
      <Download size={18} aria-hidden="true" />
      {t("downloadApp")}
    </a>
  );
}