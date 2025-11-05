"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Link as LinkIcon, Mail, Github } from "lucide-react";
import { PasswordSection } from "./PasswordSection";

export function SecurityTab() {
  const { data: session } = useSession();
  const [connectedGoogle, setConnectedGoogle] = useState(false);
  const [connectedGithub, setConnectedGithub] = useState(false);

  const handleConnectGoogle = async () => {
    await signIn("google", { redirect: false });
    setConnectedGoogle(true);
  };

  const handleDisconnectGoogle = async () => {
    await signOut({ redirect: false });
    setConnectedGoogle(false);
  };

  const handleConnectGithub = async () => {
    await signIn("github", { redirect: false });
    setConnectedGithub(true);
  };

  const handleDisconnectGithub = async () => {
    await signOut({ redirect: false });
    setConnectedGithub(false);
  };

  return (
    <div className="space-y-6">
      {/* PASSWORD SECTION */}
      <PasswordSection />

      {/* CONNECTED ACCOUNTS */}
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
              onClick={connectedGoogle ? handleDisconnectGoogle : handleConnectGoogle}
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
              onClick={connectedGithub ? handleDisconnectGithub : handleConnectGithub}
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
