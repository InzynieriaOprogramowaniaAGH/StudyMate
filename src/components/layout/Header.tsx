"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800 sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
      <Link href="/" className="text-2xl font-bold text-blue-400">
        StudyMate
      </Link>

      <nav className="hidden md:flex space-x-6 text-gray-300">
        {["Features", "How It Works", "Testimonials", "Help"].map((item) => (
          <Link key={item} href={`#${item.toLowerCase().replace(/ /g, "")}`} className="hover:text-white">
            {item}
          </Link>
        ))}
      </nav>

      <div className="space-x-3">
        <Link href="/auth/login" className="text-gray-300 hover:text-white">Log in</Link>
        <Link href="/auth/register" className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition">
          Get Started
        </Link>
      </div>
    </header>
  );
}
