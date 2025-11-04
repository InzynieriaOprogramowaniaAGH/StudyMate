"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  onClose?: () => void;
  onOpen?: () => void;
  onConfirm?: () => Promise<void> | void;
  showTrigger?: boolean;
  open?: boolean;
  triggerClassName?: string;
  triggerChildren?: React.ReactNode;
};

export default function LogoutConfirm({
  onClose,
  onOpen,
  onConfirm,
  showTrigger = true,
  open,
  triggerClassName,
  triggerChildren,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const isOpen = typeof open === "boolean" ? open : internalOpen;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const openModalFromTrigger = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (onOpen) {
      setTimeout(() => onOpen(), 10);
      if (open === undefined) {
        setInternalOpen(true);
      }
    } else {
      if (open === undefined) setInternalOpen(true);
    }
  };

  const closeModal = () => {
    if (open === undefined) setInternalOpen(false);
    onClose?.();
  };

  async function handleConfirm(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setLoading(true);

    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        await nextAuthSignOut({ redirect: false });
        try {
          const body = new URLSearchParams({ callbackUrl: "/" });
          await fetch("/api/auth/signout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
          });
        } catch (err) {
        }

        router.replace("/");
        setTimeout(() => window.location.reload(), 200);
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoading(false);
      closeModal();
    }
  }

  const trigger = (
    <button
      type="button"
      onMouseDown={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
      onClick={openModalFromTrigger}
      className={
        triggerClassName ??
        "w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition"
      }
    >
      {triggerChildren ?? "Logout"}
    </button>
  );

  const modal = (
    <div className="fixed inset-0 z-[9900] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onMouseDown={() => {
          closeModal();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[min(92%,520px)] mx-4 rounded-2xl bg-[var(--color-bg-light)] p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2 text-[var(--color-text)]">Confirm sign out</h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">Are you sure you want to sign out?</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onMouseDown={(ev) => ev.stopPropagation()}
            onClick={() => closeModal()}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)]"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            onMouseDown={(ev) => ev.stopPropagation()}
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-70)] transition duration-400 hover:text-[var(--color-text)]"
            disabled={loading}
          >
            {loading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return showTrigger ? trigger : null;
  }

  return (
    <>
      {showTrigger && trigger}
      {isOpen && createPortal(modal, document.body)}
    </>
  );
}
