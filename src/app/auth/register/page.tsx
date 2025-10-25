"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/motionutils";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Image from "next/image";

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
      // TODO: Implement registration logic
      router.push("/dashboard");
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
            <div className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-4 sm:mb-6">
              StudyMate
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2 font-clarity">
              Create an account
            </h1>
            <p className="text-sm sm:text-base text-muted font-clarity">
              Start your journey to smarter studying
            </p>
          </div>

          {/* Form */}
          <div className="bg-bg-light p-6 sm:p-8 rounded-2xl shadow-lg border border-border">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm sm:text-base font-medium text-text mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 sm:py-3.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium text-text mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 sm:py-3.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
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
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 sm:py-3.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm sm:text-base font-medium text-text mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 sm:py-3.5 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  className="w-4 h-4 text-primary border-border rounded bg-bg mt-1"
                />
                <label htmlFor="terms" className="ml-2 text-sm sm:text-base text-muted">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-accent transition">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:text-accent transition">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary hover:bg-accent text-white px-6 py-3 sm:py-3.5 rounded-xl font-medium transition ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 relative">
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

            {/* Sign in link */}
            <div className="mt-6 text-center text-sm sm:text-base">
              <p className="text-muted">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-accent transition">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
