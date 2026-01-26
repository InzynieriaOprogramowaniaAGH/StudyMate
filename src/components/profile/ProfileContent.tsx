"use client";

import { useState } from "react";
import { AccountTab } from "./AccountTab";
import { SecurityTab }  from "./SecurityTab";
import { BillingTab } from "./BillingTab";
import {ProfileHeader} from "./ProfileHeader";
import { useTranslations } from "next-intl";
import { AppTab } from "./AppTab";
import { PreferencesTab } from "./PreferencesTab";

export default function ProfileContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("account");
  const t = useTranslations("profile");

  const tabs = [
    { key: "account", label: t("tabs.account") },
    { key: "preferences", label: t("tabs.preferences") },
    { key: "app", label: t("tabs.app") },
    { key: "security", label: t("tabs.security") },
    { key: "billing", label: t("tabs.billing") },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-0 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl overflow-hidden p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-0 py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-[var(--color-primary)] text-[var(--color-bg)] shadow-inner"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-darker)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {activeTab === "account" && <AccountTab user={user} />}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "app" && <AppTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "billing" && <BillingTab />}
      </div>
    </main>
  );
}
