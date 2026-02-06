import type { NextConfig } from "next";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Hataları görmezden gel
  },
  eslint: {
    ignoreDuringBuilds: true, // Uyarıları görmezden gel
  },
};
export default nextConfig;
