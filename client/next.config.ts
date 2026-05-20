import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  // Ensure Turbopack uses the client folder as the workspace root
  experimental: {
    turbopack: {
      root: "."
    }
  }
} as any;

export default nextConfig;
