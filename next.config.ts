import type { NextConfig } from "next";

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

export default nextConfig;
