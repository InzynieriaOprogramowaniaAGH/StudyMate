"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

export function DesktopInstallerButton() {
  const t = useTranslations("profile.app");
  // Ścieżka do instalatora (np. Windows .exe)
  // Po zbudowaniu Tauri wrzuć plik .exe do public/installers/StudyMate-Setup.exe
  const installerUrl = "/installers/StudyMate-Setup.exe";

  return (
    <a
      href={installerUrl}
      download
      className="inline-flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-sm font-medium"
    >
      <Download size={16} aria-hidden="true" />
      <span className="sr-only">{t("downloadLabel")}</span>
    </a>
  );
}