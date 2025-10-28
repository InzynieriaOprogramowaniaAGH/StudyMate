"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-gray-800 sticky top-0 bg-[var(--color-bg)] backdrop-blur-md z-50">
      {/* --- Logo --- */}
      <Link
        href="/"
        className="text-2xl font-bold bg-[linear-gradient(to_right,var(--color-primary),var(--color-accent),var(--color-primary))] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-slow hover:opacity-90 transition"
      >
        StudyMate
      </Link>

      {/* --- Desktop nav --- */}
      <nav className="hidden md:flex space-x-6 items-center">
        {isAuthenticated ? (
          <>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/notes"
              className="text-gray-300 hover:text-white transition"
            >
              Notes
            </Link>
            <Link
              href="/progress"
              className="text-gray-300 hover:text-white transition"
            >
              Progress
            </Link>

            {/* Profile Icon + Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-gray-800 flex justify-center items-center text-gray-300 hover:text-white hover:bg-gray-700 transition"
              >
                <User size={20} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50">
                  <div className="flex flex-col p-2">
                    <Link
                      href="/profile"
                      className="px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="text-gray-300 hover:text-white transition"
            >
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

      {/* --- Mobile Menu Button --- */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-gray-300 hover:text-white"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- Mobile Dropdown --- */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-3 flex flex-col md:hidden space-y-2 z-50">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/notes"
                onClick={() => setOpen(false)}
                className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
              >
                Notes
              </Link>
              <Link
                href="/progress"
                onClick={() => setOpen(false)}
                className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
              >
                Progress
              </Link>
              <Link
                href="/Profile"
                onClick={() => setOpen(false)}
                className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: window.location.origin })}
                className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition"
              >
                    Logout
              </button>

            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="w-full h-10 flex justify-center items-center rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
