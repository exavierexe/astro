import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Use standalone output for better optimization
  output: 'standalone',
  
  // Optimize file size by excluding unnecessary files
  // Use the correct property for the experimental configuration
  experimental: {
    // Optimize tracing
    turbotrace: {
      contextDirectory: __dirname,
      processCwd: __dirname,
    },
  },
};

export default nextConfig;