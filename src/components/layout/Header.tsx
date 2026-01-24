"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useTransition } from "react";
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
import { locales, type Locale } from "@/i18n/config";

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();
  const t = useTranslations("nav");

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutRequested, setLogoutRequested] = useState(false);
  const avatarRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const newLocale: Locale = locale === "en" ? "pl" : "en";
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setMenuPos(null);
    setOpen(false);
  };

  useEffect(() => {
    closeAllMenus();
  }, [pathname]);

  const openMenuAtAvatar = () => {
    const btn = avatarRef.current;
    if (!btn) {
      setMenuPos({ top: 64, left: window.innerWidth - 200 });
    } else {
      const rect = btn.getBoundingClientRect();
      const top = rect.bottom + 8;
      const left = rect.right - 176;
      setMenuPos({ top, left });
    }
    setMenuOpen(true);
  };

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!menuOpen) openMenuAtAvatar();
    else closeAllMenus();
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (menuOpen) {
        if (avatarRef.current?.contains(target) || menuRef.current?.contains(target)) return;
        closeAllMenus();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAllMenus();
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const requestLogout = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    closeAllMenus();
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

  const avatarUrl = session?.user?.image;

  return (
    <>
      <header className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-bg)] backdrop-blur-md z-50">
        <Link
          href="/"
          className="text-2xl font-bold bg-[linear-gradient(to_right,var(--color-primary),var(--color-accent),var(--color-primary))] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-slow hover:opacity-90 transition"
        >
          StudyMate
        </Link>

        <nav className="hidden md:flex space-x-6 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                {t("dashboard")}
              </Link>
              <Link href="/notes" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                {t("notes")}
              </Link>
              <Link href="/flashcards" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                {t("flashcards")}
              </Link>
              <Link href="/quizzes" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                {t("quizzes")}
              </Link>
              <Link href="/progress" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                {t("progress")}
              </Link>
              <ThemeToggle />
              <div className="flex items-center gap-3 mr-2">

                <button
                  onClick={toggleLanguage}
                  disabled={isPending}
                  className={`w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] transition flex items-center justify-center overflow-hidden ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                  title={t("changeLanguage")}
                >
                  <div className="w-full h-full flex items-center justify-center scale-150">
                    {locale === "en" ? <GB /> : <PL />}
                  </div>
                </button>

                <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-bg)] rounded-full text-[var(--color-text)] text-base">
                  <Flame className="w-8 h-8 text-[var(--color-primary)]" /> 3

                </div>
              </div>
              <div className="relative">
                <button
                  ref={avatarRef}
                  type="button"
                  onMouseDown={(ev) => ev.stopPropagation()}
                  onClick={toggleMenu}
                  className="w-10 h-10 rounded-full overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)] transition"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-darker)] text-[var(--color-text)]">
                      <User size={20} />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {menuOpen && menuPos && (
                    <Portal>
                      <motion.div
                        ref={menuRef}
                        style={{
                          position: "fixed",
                          top: `${Math.max(8, menuPos.top)}px`,
                          left: `${Math.max(8, menuPos.left)}px`,
                          width: 176,
                        }}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-light)]/95 backdrop-blur-2xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden z-[99999]"
                        initial={{ opacity: 0, y: -12, scale: 0.92 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.25, ease: "easeOut" },
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          scale: 0.95,
                          transition: { duration: 0.18, ease: "easeInOut" },
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col p-2">
                          {[{ href: "/profile", label: t("profile") }].map((item) => (
                            <GlowItem key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => closeAllMenus()}
                                className="block px-3 py-2 text-[var(--color-text)] rounded-lg transition"
                              >
                                {item.label}
                              </Link>
                            </GlowItem>
                          ))}

                          <GlowItem>
                            <button
                              onClick={requestLogout}
                              className="w-full text-left px-3 py-2 text-red-400 rounded-lg transition"
                            >
                              {t("logout")}
                            </button>
                          </GlowItem>
                        </div>
                      </motion.div>
                    </Portal>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                className="text-black bg-[var(--color-primary)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition"
              >
                {t("register")}
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--color-text)] opacity-70 hover:opacity-100 transition"
          aria-label="Toggle menu"
          type="button"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--color-bg)] border-b border-[var(--color-border)] overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition py-2"
                  >
                    {t("dashboard")}
                  </Link>
                  <Link
                    href="/notes"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition py-2"
                  >
                    {t("notes")}
                  </Link>
                  <Link
                    href="/flashcards"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition py-2"
                  >
                    {t("flashcards")}
                  </Link>
                  <Link
                    href="/quizzes"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition py-2"
                  >
                    {t("quizzes")}
                  </Link>
                  <Link
                    href="/progress"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition py-2"
                  >
                    {t("progress")}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition py-2"
                  >
                    {t("profile")}
                  </Link>
                  <div className="flex items-center gap-4 py-2">
                    <ThemeToggle />
                    <button
                      onClick={toggleLanguage}
                      disabled={isPending}
                      className={`w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] transition flex items-center justify-center overflow-hidden ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                      title={t("changeLanguage")}
                    >
                      <div className="w-full h-full flex items-center justify-center scale-150">
                        {locale === "en" ? <GB /> : <PL />}
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      requestLogout();
                    }}
                    className="text-red-400 opacity-70 hover:opacity-100 transition py-2 text-left"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition py-2"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="text-black bg-[var(--color-primary)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition text-center"
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
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

function GlowItem({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!hovered) return;
    const anim = requestAnimationFrame(() => {
      setCoords((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.15,
        y: prev.y + (target.y - prev.y) * 0.15,
      }));
    });
    return () => cancelAnimationFrame(anim);
  }, [coords, target, hovered]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTarget({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      className="relative rounded-md overflow-hidden group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMove}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <motion.div
        className="absolute inset-0 bg-white/5 mix-blend-overlay"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none rounded-md"
        style={{
          background: hovered
            ? `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.15), transparent 70%)`
            : "transparent",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="relative z-10 text-[15px] text-[var(--color-text)] px-3 py-1.5 font-medium select-none transition-colors duration-300 opacity-70 group-hover:opacity-100"
        animate={{ opacity: hovered ? 1 : 0.7 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
