import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'http://localhost:3000',
    // Removed network access for local-only testing
  ],
};

export default nextConfig;
