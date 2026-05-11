import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack has issues resolving @/ path aliases on Vercel — using webpack instead
};

export default nextConfig;
