"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Portal from "@/components/ui/Portal";
import LogoutConfirm from "@/components/ui/LogoutConfirm";

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const pathname = usePathname();

  const [open, setOpen] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // desktop profile menu
  const [logoutRequested, setLogoutRequested] = useState(false); // top-level modal flag
  const avatarRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  // Close menus when route changes
  useEffect(() => {
    closeAllMenus();
  }, [pathname]);

  // helper to close both menus
  const closeAllMenus = () => {
    setMenuOpen(false);
    setMenuPos(null);
    setOpen(false);
  };

  // position desktop dropdown near avatar
  const openMenuAtAvatar = () => {
    const btn = avatarRef.current;
    if (!btn) {
      setMenuPos({ top: 64, left: window.innerWidth - 200 });
    } else {
      const rect = btn.getBoundingClientRect();
      const top = rect.bottom + 8;
      const left = rect.right - 176; // align right edge roughly
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

  // Outside click handler — use 'click' so inner mouseDown handlers run first
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (menuOpen) {
        if (avatarRef.current?.contains(target) || menuRef.current?.contains(target)) {
          return;
        }
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

  // Called from dropdown buttons: close dropdowns and open top-level modal
  const requestLogout = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    closeAllMenus();
    // small delay to ensure menus are closed visually before modal shows
    setTimeout(() => setLogoutRequested(true), 10);
  };

  // actual sign-out logic (passed to LogoutConfirm)
  const performSignOut = async () => {
    try {
      await nextAuthSignOut({ redirect: false });

      // fallback server POST to ensure server clears cookies if needed
      try {
        const body = new URLSearchParams({ callbackUrl: "/" });
        await fetch("/api/auth/signout", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
      } catch (err) {
        console.warn("[logout] fallback POST failed", err);
      }

      setLogoutRequested(false);
      // navigate home and reload as a safety-net
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
      setLogoutRequested(false);
      window.location.href = "/";
    }
  };

  return (
    <>
      <header className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-gray-800 sticky top-0 bg-[var(--color-bg)] backdrop-blur-md z-50">
        <Link
          href="/"
          className="text-2xl font-bold bg-[linear-gradient(to_right,var(--color-primary),var(--color-accent),var(--color-primary))] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-slow hover:opacity-90 transition"
        >
          StudyMate
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/notes" className="text-gray-300 hover:text-white transition">
                Notes
              </Link>
              <Link href="/progress" className="text-gray-300 hover:text-white transition">
                Progress
              </Link>

              {/* Profile Icon + Dropdown (desktop) */}
              <div className="relative">
                <button
                  ref={avatarRef}
                  type="button"
                  onMouseDown={(ev) => ev.stopPropagation()}
                  onClick={toggleMenu}
                  className="w-10 h-10 rounded-full bg-gray-800 flex justify-center items-center text-gray-300 hover:text-white hover:bg-gray-700 transition"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <User size={20} />
                </button>

                {menuOpen && menuPos && (
                  <Portal>
                    <div
                      ref={menuRef}
                      style={{
                        position: "fixed",
                        top: `${Math.max(8, menuPos.top)}px`,
                        left: `${Math.max(8, menuPos.left)}px`,
                        width: 176,
                      }}
                      className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-[99999] pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col p-2">
                        <Link
                          href="/profile"
                          className="px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
                          onClick={() => {
                            // close immediately and allow navigation
                            closeAllMenus();
                          }}
                        >
                          Profile
                        </Link>

                        {/* Logout no longer opens modal from inside dropdown; request top-level modal */}
                        <button
                          onMouseDown={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                          }}
                          onClick={requestLogout}
                          className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </Portal>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition">
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

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300 hover:text-white"
          aria-label="Toggle menu"
          type="button"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile dropdown */}
        {open && (
          <div
            className="absolute top-full right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-3 flex flex-col md:hidden space-y-2 z-[9999] pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => closeAllMenus()}
                  className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/notes"
                  onClick={() => closeAllMenus()}
                  className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
                >
                  Notes
                </Link>
                <Link
                  href="/progress"
                  onClick={() => closeAllMenus()}
                  className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
                >
                  Progress
                </Link>
                <Link
                  href="/profile"
                  onClick={() => closeAllMenus()}
                  className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
                >
                  Profile
                </Link>

                {/* mobile logout uses same top-level request flow */}
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                  }}
                  onClick={() => {
                    closeAllMenus();
                    setTimeout(() => setLogoutRequested(true), 10);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => closeAllMenus()}
                  className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => closeAllMenus()}
                  className="w-full h-10 flex justify-center items-center rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Top-level LogoutConfirm (controlled) using your Portal/LogoutConfirm */}
      {/*
        We render LogoutConfirm at top-level and control it with `logoutRequested`.
        LogoutConfirm handles the modal UI; we pass onConfirm to run sign-out logic.
      */}
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
