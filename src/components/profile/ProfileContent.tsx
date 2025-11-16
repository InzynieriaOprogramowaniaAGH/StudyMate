"use client";

import { useState } from "react";
import { AccountTab } from "./AccountTab";
import { SecurityTab }  from "./SecurityTab";
import { BillingTab } from "./BillingTab";
import {ProfileHeader} from "./ProfileHeader";

export default function ProfileContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Account");

  const tabs = ["Account", "Security", "Billing"];

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-0 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl overflow-hidden p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-0 py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
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
        {activeTab === "Security" && <SecurityTab />}
        {activeTab === "Billing" && <BillingTab />}
      </div>
    </main>
  );
}
