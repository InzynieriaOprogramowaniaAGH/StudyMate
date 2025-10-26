import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // ✅ modern syntax
  },
  env: {
    NEXTAUTH_URL: "http://localhost:3000", // ✅ same as .env
  },
};

export default nextConfig;
