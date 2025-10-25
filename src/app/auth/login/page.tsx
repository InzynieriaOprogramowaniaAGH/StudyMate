"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/motionutils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Image from "next/image";

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

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeInUp}
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 overflow-auto"
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-primary inline-block mb-2">
              StudyMate
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2 font-clarity">
              Welcome back!
            </h1>
            <p className="text-sm sm:text-base text-muted font-clarity">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Form */}
          <div className="bg-bg-light p-6 sm:p-8 rounded-2xl shadow-lg border border-border">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium text-text mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 sm:py-3.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-base font-medium text-text mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 sm:py-3.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
                  placeholder="••••••••"
                />
              </div>

              {/* Options */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <label className="flex items-center text-sm sm:text-base">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-border rounded bg-bg"
                  />
                  <span className="ml-2 text-muted">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm sm:text-base text-primary hover:text-accent transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary hover:bg-accent text-white px-6 py-3 sm:py-3.5 rounded-xl font-medium transition ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm sm:text-base">
                <span className="px-2 bg-bg-light text-muted">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="flex items-center justify-center w-full px-4 py-3 border border-[#171b1f] rounded-xl hover:border-primary transition text-text bg-[#040609]">
                <Image
                  src="/images/googleLogo.svg"
                  alt="Google"
                  width={25}
                  height={25}
                  className="mr-2"
                />
                Google
              </button>
              <button className="flex items-center justify-center w-full px-4 py-3 border border-[#171b1f] rounded-xl hover:border-primary transition text-text bg-[#040609]">
                <Image
                  src="/images/githubLogo.svg"
                  alt="GitHub"
                  width={25}
                  height={25}
                  className="mr-2"
                />
                GitHub
              </button>
            </div>

            {/* Signup link */}
            <div className="mt-6 text-center text-sm sm:text-base">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-accent transition"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
