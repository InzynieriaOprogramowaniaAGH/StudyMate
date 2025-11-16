"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/ui/Portal";
import LogoutConfirm from "@/components/ui/logOutConfirm";
import ThemeToggle from "@/components/ui/ThemeToggle";
import GB from "country-flag-icons/react/3x2/GB";
import PL from "country-flag-icons/react/3x2/PL";

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutRequested, setLogoutRequested] = useState(false);
  const avatarRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const [language, setLanguage] = useState<"en" | "pl">("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as "en" | "pl" | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "pl" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
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
                Dashboard
              </Link>
              <Link href="/notes" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                Notes
              </Link>
              <Link href="/progress" className="text-[var(--color-text)] opacity-70 hover:opacity-100 transition">
                Progress
              </Link>
              <ThemeToggle />
              <div className="flex items-center gap-3 mr-2">

                <button
                  onClick={toggleLanguage}
                  className="w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] transition flex items-center justify-center overflow-hidden"
                  title="Change language"
                >
                  <div className="w-full h-full flex items-center justify-center scale-150">
                    {language === "en" ? <GB /> : <PL />}
                  </div>
                </button>
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
                          {[{ href: "/profile", label: "Profile" }].map((item) => (
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
                              Logout
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
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="text-black bg-[var(--color-primary)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition"
              >
                Get Started
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
