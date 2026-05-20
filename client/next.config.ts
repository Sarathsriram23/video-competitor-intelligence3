import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure Turbopack uses the client folder as the workspace root
  experimental: {
    turbopack: {
      root: "."
    }
  }
};

export default nextConfig;
