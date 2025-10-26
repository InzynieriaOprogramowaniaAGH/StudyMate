"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  const base =
    "inline-block px-6 py-3 rounded-xl font-medium transition text-center";

  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    outline: "border border-gray-700 hover:border-blue-500 text-gray-300",
  };

  const classes = cn(base, variants[variant], className);

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return <button className={classes}>{children}</button>;
}
