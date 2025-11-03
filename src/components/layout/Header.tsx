"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Portal from "@/components/ui/Portal";
import LogoutConfirm from "@/components/ui/logOutConfirm";

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
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
      setLogoutRequested(false);
      window.location.href = "/";
    }
  };

  // ✅ Get user's image (NextAuth automatically provides this)
  const avatarUrl = session?.user?.image;

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

              {/* Profile Avatar */}
              <div className="relative">
                <button
                  ref={avatarRef}
                  type="button"
                  onMouseDown={(ev) => ev.stopPropagation()}
                  onClick={toggleMenu}
                  className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 hover:border-[var(--color-primary)] transition"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-300">
                      <User size={20} />
                    </div>
                  )}
                </button>

                {/* Dropdown */}
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
                          onClick={() => closeAllMenus()}
                        >
                          Profile
                        </Link>
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

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300 hover:text-white"
          aria-label="Toggle menu"
          type="button"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile menu */}
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
