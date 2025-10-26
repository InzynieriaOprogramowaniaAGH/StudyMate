"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-gray-800 sticky top-0 bg-[var(--color-bg)] backdrop-blur-md z-50">
<Link
  href="/"
  className="
    text-2xl font-bold 
    bg-[linear-gradient(to_right,var(--color-primary),var(--color-accent),var(--color-primary))]
    bg-[length:200%_200%]
    bg-clip-text text-transparent 
    animate-gradient-fast
    transition-all duration-300 ease-out
    hover:scale-105
    hover:saturate-150
  "
>
  StudyMate
</Link>





      {/* Desktop nav */}
      <div className="hidden md:flex space-x-3 items-center">
        <Link
          href="/auth/login"
          className="flex justify-center items-center h-10 px-4 rounded-xl text-white font-medium hover:text-white transition"
        >
          Log in
        </Link>
        <Link
          href="/auth/register"
          className="flex justify-center text-black items-center h-10 px-4 rounded-xl bg-primary font-medium hover:bg-primary-dark hover:text-white transition duration-500"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-gray-300 hover:text-white"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-3 flex flex-col md:hidden space-y-2">
          <Link
            href="/auth/login"
            className="w-full h-10 flex justify-center items-center rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="w-full h-10 flex justify-center items-center rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
