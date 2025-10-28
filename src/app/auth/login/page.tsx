"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Image from "next/image";
import { fadeInUp } from "@/lib/motionutils";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await signIn("credentials", {
    redirect: false, // ❗ Prevents auto-redirect loops
    // redirectTo: "/dashboard",
    email,
    password,
  });

  if (result?.error) {
    setError("Invalid email or password");
  } else {
    router.push("/dashboard");
  }

  setIsLoading(false);
};

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Header />

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeInUp}
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12"
      >
        <div className="w-full max-w-md bg-[var(--color-bg-light)] rounded-2xl border border-[var(--color-border)] p-8 shadow-lg">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
              Welcome back
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                className="w-full px-4 py-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>

            <div className="flex justify-end text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-black hover:text-white py-3 rounded-xl font-medium transition duration-500  ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-bg-light)] text-[var(--color-muted)]">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center flex-1 bg-[var(--color-bg)] hover:bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl py-3 text-[var(--color-text)] transition">
              <Image
                src="/images/googleLogo.svg"
                alt="Google"
                width={22}
                height={22}
                className="mr-2"
              />
              Google
            </button>

            <button className="flex items-center justify-center flex-1 bg-[var(--color-bg)] hover:bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl py-3 text-[var(--color-text)] transition">
              <Image
                src="/images/githubLogo.svg"
                alt="GitHub"
                width={22}
                height={22}
                className="mr-2"
              />
              GitHub
            </button>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
            <p>
              Don’t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
