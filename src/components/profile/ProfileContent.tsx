"use client";

import { useState } from "react";
import { AccountTab } from "./AccountTab";
import { PreferencesTab } from "./PreferencesTab";
import { SecurityTab }  from "./SecurityTab";
import { NotificationsTab } from "./NotificationsTab";
import { BillingTab } from "./BillingTab";
import {ProfileHeader} from "./ProfileHeader";

export default function ProfileContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Account");

  const tabs = ["Account", "Preferences", "Notifications", "Security", "Billing"];

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-4 md:px-8 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tabs */}
        <div className="flex bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl overflow-hidden p-1">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
        activeTab === tab
          ? "bg-[var(--color-primary)] text-[var(--color-bg)] shadow-inner"
          : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-darker)]"
      }`}
    >
      {tab}
    </button>
  ))}
</div>


        {/* Dynamic Content */}
        {activeTab === "Account" && <AccountTab user={user} />}
        {activeTab === "Preferences" && <PreferencesTab />}
        {activeTab === "Security" && <SecurityTab />}
        {activeTab === "Notifications" && <NotificationsTab />}
        {activeTab === "Billing" && <BillingTab />}
      </div>
    </main>
  );
}
