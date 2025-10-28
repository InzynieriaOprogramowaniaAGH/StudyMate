import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, 
  },
  env: {
    NEXTAUTH_URL: "http://localhost:3000",
  },
};

export default nextConfig;
