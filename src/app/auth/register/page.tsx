"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/motionutils";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const agreedToTerms = formData.get("terms") === "on";

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        setError(data?.error || "Failed to register");
        setIsLoading(false);
        return;
      }

      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
              Create an account
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Start your journey to smarter studying
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <input
              type="text"
              name="fullName"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
            />

            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
            />

            <input
              type="password"
              name="password"
              required
              placeholder="Create a strong password"
              className="w-full px-4 py-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
            />

            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 bg-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
            />

            <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <input
                type="checkbox"
                name="terms"
                className="w-4 h-4 accent-[var(--color-primary)] border border-[var(--color-border)] rounded-sm bg-[var(--color-bg-darker)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-black hover:text-white py-3 rounded-xl font-medium transition duration-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

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

          <div className="mt-6 text-center text-sm text-[var(--color-muted)]">
            <p>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
