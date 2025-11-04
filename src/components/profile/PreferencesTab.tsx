"use client";

import { useEffect, useState } from "react";
import { Palette, Globe, Target } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export function PreferencesTab() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC");

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add("light");
    }
  }, []);

  // Save theme and apply it dynamically
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as "light" | "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div className="space-y-6 text-[var(--color-text)]">
      {/* Appearance */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Palette size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-text)]">Appearance</h4>
            <p className="text-sm text-[var(--color-muted)]">
              Customize how StudyMate looks and feels
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-text)]">Theme</p>
            <p className="text-xs text-[var(--color-muted)]">
              Choose your preferred color scheme
            </p>
          </div>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="custom-select min-w-[120px] text-[var(--color-text)] bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </section>

      {/* Language & Region */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Globe size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-text)]">Language & Region</h4>
            <p className="text-sm text-[var(--color-muted)]">
              Set your language and regional preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="custom-select w-full bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)]"
            >
              <option>English</option>
              <option>Polski</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="custom-select w-full bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)]"
            >
              <option>UTC</option>
              <option>GMT+1</option>
              <option>EST</option>
            </select>
          </div>
        </div>
      </section>

      {/* Study Goals */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Target size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-text)]">Study Goals</h4>
            <p className="text-sm text-[var(--color-muted)]">
              Set your daily and weekly study targets
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">
              Daily Study Goal (minutes)
            </label>
            <select className="custom-select w-full bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)]">
              {[30, 40, 50, 60, 70, 80].map((min) => (
                <option key={min}>{min}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">Weekly Quiz Goal</label>
            <select className="custom-select w-full bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)]">
              {[2, 5, 8, 10, 12, 15].map((goal) => (
                <option key={goal}>{goal}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Reminder Notifications</p>
              <p className="text-xs text-[var(--color-muted)]">
                Get reminded to study daily
              </p>
            </div>
            <ToggleSwitch defaultChecked />
          </div>
        </div>
      </section>
    </div>
  );
}
