"use client";

import { Palette, Globe, Target } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export function PreferencesTab() {
  return (
    <div className="space-y-5">
      {/* Appearance */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Palette size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text)]">Appearance</h4>
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
          <select className="min-w-[200px] h-10 px-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)]">
            <option>Dark</option>
            <option>Light</option>
          </select>
        </div>
      </section>

      {/* Language & Region */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Globe size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text)]">Language & Region</h4>
            <p className="text-sm text-[var(--color-muted)]">
              Set your language and regional preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">
              Language
            </label>
            <select className="min-w-[160px] h-10 px-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)]">
              <option>English</option>
              <option>Polski</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">
              Timezone
            </label>
            <select className="min-w-[160px] h-10 px-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)]">
              <option>UTC</option>
              <option>GMT+1</option>
              <option>EST</option>
            </select>
          </div>
        </div>
      </section>

      {/* Study Goals */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Target size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text)]">Study Goals</h4>
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
            <select className="min-w-[160px] h-10 px-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)]">
              <option>30</option>
              <option>40</option>
              <option>50</option>
              <option>60</option>
              <option>70</option>
              <option>80</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--color-muted)] mb-1">
              Weekly Quiz Goal
            </label>
            <select className="min-w-[160px] h-10 px-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)]">
              <option>2</option>
              <option>5</option>
              <option>8</option>
              <option>10</option>
              <option>12</option>
              <option>15</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                Reminder Notifications
              </p>
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
