"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/motionutils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";

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
    <div className="min-h-screen bg-bg">
      <Header />
      <motion.div
      initial="hidden"
      animate="show"
      variants={fadeInUp}
      className="min-h-[calc(100vh-73px)] bg-bg flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary inline-block mb-2">
            StudyMate
          </Link>
          <h1 className="text-3xl font-bold text-text mb-2 font-clarity">Welcome back!</h1>
          <p className="text-muted font-clarity">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-bg-light p-8 rounded-2xl shadow-lg border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-text focus:outline-none focus:border-primary transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-primary border-border rounded bg-bg" />
                <span className="ml-2 text-sm text-muted">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-accent transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary hover:bg-accent text-white px-6 py-3 rounded-xl font-medium transition ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:text-accent transition">
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