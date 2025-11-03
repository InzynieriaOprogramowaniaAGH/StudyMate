"use client";

import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Bell } from "lucide-react";

export function NotificationsTab() {
  const notificationOptions = [
    {
      title: "Email Notifications",
      description: "Receive updates via email",
      enabled: true,
    },
    {
      title: "Study Reminders",
      description: "Daily reminders to study",
      enabled: true,
    },
    {
      title: "Quiz Results",
      description: "Get notified when quiz results are ready",
      enabled: true,
    },
    {
      title: "Achievement Unlocked",
      description: "Celebrate your milestones",
      enabled: true,
    },
    {
      title: "Weekly Progress Report",
      description: "Summary of your weekly activity",
      enabled: true,
    },
    {
      title: "Marketing Emails",
      description: "Tips, features, and updates",
      enabled: false,
    },
  ];

  return (
    <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
          <Bell size={18} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h4 className="font-medium text-[var(--color-text)]">
            Notification Preferences
          </h4>
          <p className="text-sm text-[var(--color-muted)]">
            Manage how you receive notifications
          </p>
        </div>
      </div>

      {/* Notification options */}
      <div className="divide-y divide-[var(--color-border)]">
        {notificationOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3"
          >
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {option.title}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {option.description}
              </p>
            </div>
            <ToggleSwitch defaultChecked={option.enabled} />
          </div>
        ))}
      </div>
    </section>
  );
}
