"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { Menu, X, User, Flame } from "lucide-react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/ui/Portal";
import LogoutConfirm from "@/components/ui/logOutConfirm";
import ThemeToggle from "@/components/ui/ThemeToggle";
import GB from "country-flag-icons/react/3x2/GB";
import PL from "country-flag-icons/react/3x2/PL";
import { useLocale, useTranslations } from "next-intl";
import { type Locale } from "@/i18n/config";
import { DesktopInstallerButton } from "../profile/DesktopInstaller";

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();
  const t = useTranslations("nav");

  const [open, setOpen] = useState(false);
  const [logoutRequested, setLogoutRequested] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const newLocale: Locale = locale === "en" ? "pl" : "en";
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Fetch current streak from stats API
  useEffect(() => {
    if (isAuthenticated) {
      const fetchStreak = async () => {
        try {
          const response = await fetch("/api/stats");
          if (response.ok) {
            const data = await response.json();
            setCurrentStreak(data.currentStreak || 0);
          }
        } catch (error) {
          console.error("Failed to fetch streak:", error);
        }
      };

      fetchStreak();
    }
  }, [isAuthenticated]);

  // Close menu on escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const requestLogout = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setOpen(false);
    setTimeout(() => setLogoutRequested(true), 10);
  };

  const performSignOut = async () => {
    try {
      await nextAuthSignOut({ redirect: false });
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ callbackUrl: "/" }).toString(),
      });
      setLogoutRequested(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
      setLogoutRequested(false);
      window.location.href = "/";
    }
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const avatarUrl = session?.user?.image;

  return (
    <>
      <header className="relative flex items-center justify-center px-6 md:px-8 py-5 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-bg)] backdrop-blur-md z-50">
        {/* Burger menu button - always visible on left */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute left-6 text-[var(--color-text)] opacity-70 hover:opacity-100 transition"
          aria-label="Toggle menu"
          type="button"
        >
          <Menu size={28} />
        </button>

        {/* Centered app name - always visible */}
        <Link
          href="/"
          className="text-4xl md:text-5xl font-bold bg-[linear-gradient(to_right,var(--color-primary),var(--color-accent),var(--color-primary))] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-slow hover:opacity-90 transition leading-relaxed pb-6"
        >
          StudyMate
        </Link>

        {/* Streak indicator on right for authenticated users */}
        {isAuthenticated && (
          <div className="absolute right-6 flex items-center justify-center gap-1 text-[var(--color-text)] text-lg font-medium">
            <Flame className="w-6 h-6 text-[var(--color-primary)]" />
            <span>{currentStreak}</span>
          </div>
        )}
      </header>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--color-bg)] border-r border-[var(--color-border)] z-[70] flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-end p-4 border-b border-[var(--color-border)]">
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition p-2 rounded-lg hover:bg-[var(--color-bg-light)]"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Content */}
            <nav className="flex-1 overflow-y-auto p-4">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-1">
                  {/* Profile Section at top */}
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-[var(--color-text)] hover:bg-[var(--color-bg-light)] transition py-3 px-3 rounded-lg mb-4"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--color-border)]">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-darker)] text-[var(--color-text)]">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--color-text)]">
                        {session?.user?.name || t("profile")}
                      </span>
                      <span className="text-sm text-[var(--color-muted)]">
                        {t("profile")}
                      </span>
                    </div>
                  </Link>

                  {/* Divider */}
                  <div className="border-t border-[var(--color-border)] my-2" />

                  {/* Navigation Links */}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-[var(--color-bg-light)] transition py-3 px-3 rounded-lg text-base"
                  >
                    {t("dashboard")}
                  </Link>
                  <Link
                    href="/notes"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-[var(--color-bg-light)] transition py-3 px-3 rounded-lg text-base"
                  >
                    {t("notes")}
                  </Link>
                  <Link
                    href="/flashcards"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-[var(--color-bg-light)] transition py-3 px-3 rounded-lg text-base"
                  >
                    {t("flashcards")}
                  </Link>
                  <Link
                    href="/quizzes"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-[var(--color-bg-light)] transition py-3 px-3 rounded-lg text-base"
                  >
                    {t("quizzes")}
                  </Link>
                  <Link
                    href="/progress"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-[var(--color-bg-light)] transition py-3 px-3 rounded-lg text-base"
                  >
                    {t("progress")}
                  </Link>
                  <DesktopInstallerButton />
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-80 hover:opacity-100 hover:bg-[var(--color-bg-light)] transition py-3 px-3 rounded-lg text-base"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition py-3 px-3 rounded-lg text-base text-center font-medium"
                  >
                    {t("register")}
                  </Link>
                </div>
              )}
            </nav>

            {/* Drawer Footer */}
            {isAuthenticated && (
              <div className="p-4 border-t border-[var(--color-border)]">
                {/* Settings Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[var(--color-muted)]">{t("settings")}</span>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      onClick={toggleLanguage}
                      disabled={isPending}
                      className={`w-9 h-9 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] transition flex items-center justify-center overflow-hidden ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                      title={t("changeLanguage")}
                    >
                      <div className="w-full h-full flex items-center justify-center scale-150">
                        {locale === "en" ? <GB /> : <PL />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={requestLogout}
                  className="w-full text-red-400 hover:bg-red-500/10 transition py-3 px-3 rounded-lg text-base text-left mb-4"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {logoutRequested && (
        <Portal>
          <LogoutConfirm
            open={logoutRequested}
            showTrigger={false}
            onClose={() => setLogoutRequested(false)}
            onConfirm={performSignOut}
          />
        </Portal>
      )}
    </>
  );
}
