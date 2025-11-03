"use client";

import { useState } from "react";
import { Lock, Shield, Link as LinkIcon, Mail, Github } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export function SecurityTab() {
  const [enable2FA, setEnable2FA] = useState(false);
  const [connectedGoogle, setConnectedGoogle] = useState(true);
  const [connectedGithub, setConnectedGithub] = useState(false);

  return (
    <div className="space-y-6">
      {/* PASSWORD SECTION */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Lock size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text)]">Password</h4>
            <p className="text-sm text-[var(--color-muted)]">
              Change your password to keep your account secure
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-[var(--color-muted)] block mb-1">Current Password</label>
            <input
              type="password"
              className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--color-muted)] block mb-1">New Password</label>
            <input
              type="password"
              className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--color-muted)] block mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button className="bg-[var(--color-primary)] text-black font-medium text-sm py-2 px-4 rounded-lg hover:opacity-90 transition mt-2">
            Update Password
          </button>
        </div>
      </section>

      {/* 2FA SECTION */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Shield size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text)]">Two-Factor Authentication</h4>
            <p className="text-sm text-[var(--color-muted)]">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-sm font-medium text-[var(--color-text)]">Enable 2FA</p>
            <p className="text-xs text-[var(--color-muted)]">
              Protect your account with 2FA
            </p>
          </div>
          <ToggleSwitch
            defaultChecked={enable2FA}
            onChange={(checked: boolean) => setEnable2FA(checked)}
          />
        </div>

        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
          <button className="bg-[var(--color-bg-darker)] text-[var(--color-text)] font-medium text-sm py-2 px-4 rounded-lg hover:bg-[var(--color-bg-hover)] transition">
            Set Up Authenticator App
          </button>
        </div>
      </section>

      {/* CONNECTED ACCOUNTS SECTION */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <LinkIcon size={18} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text)]">Connected Accounts</h4>
            <p className="text-sm text-[var(--color-muted)]">
              Manage your connected social accounts
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Google */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-[var(--color-primary)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Google</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {connectedGoogle ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setConnectedGoogle(!connectedGoogle)}
              className="border border-[var(--color-border)] text-sm rounded-md px-3 py-1 hover:bg-[var(--color-bg-hover)] transition"
            >
              {connectedGoogle ? "Disconnect" : "Connect"}
            </button>
          </div>

          {/* GitHub */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
            <div className="flex items-center gap-2">
              <Github size={18} className="text-[var(--color-primary)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">GitHub</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {connectedGithub ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setConnectedGithub(!connectedGithub)}
              className="border border-[var(--color-border)] text-sm rounded-md px-3 py-1 hover:bg-[var(--color-bg-hover)] transition"
            >
              {connectedGithub ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
