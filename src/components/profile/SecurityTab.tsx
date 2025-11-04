"use client";

import { useState } from "react";
import { Lock, Shield, Link as LinkIcon, Mail, Github } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { PasswordSection } from "./PasswordSection";

export function SecurityTab() {
  const [enable2FA, setEnable2FA] = useState(false);
  const [connectedGoogle, setConnectedGoogle] = useState(true);
  const [connectedGithub, setConnectedGithub] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setStatusMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setStatusMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    // simulate API delay
    setTimeout(() => {
      setLoading(false);
      setStatusMsg({ type: "success", text: "Password updated successfully!" });
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* PASSWORD SECTION */}

      <PasswordSection />

      {/* 2FA SECTION */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
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
            <p className="text-xs text-[var(--color-muted)]">Protect your account with 2FA</p>
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
          <div className="p-2 rounded-xl bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
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
              className="border border-[var(--color-border)] text-sm rounded-md px-3 py-1 text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] transition"
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
              className="border border-[var(--color-border)] text-sm rounded-md px-3 py-1 text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] transition"
            >
              {connectedGithub ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
