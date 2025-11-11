import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  env: {
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "6WW9a01MKhx/Nov18c2E/HBldcPXvLZh+vPWI1CvESY=",
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
