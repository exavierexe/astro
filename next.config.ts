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
  experimental: {
    // Keep essential Swiss Ephemeris files in public/ephemeris
    // and exclude the large directories
    outputFileTracingExcludes: {
      '*': [
        // Exclude full Swiss Ephemeris data directories
        'swisseph-master/ephe/**',
        'swisseph-master/doc/**',
        'swisseph-master/contrib/**',
        'swisseph-master/windows/**',
        'swisseph-master/setest/**',
        // We only need specific files now copied to public/ephemeris
        
        // Exclude test files and other large non-essential files
        '**/node_modules/**/*.md',
        '**/node_modules/**/*.txt',
        '**/node_modules/**/test/**',
        '**/node_modules/**/tests/**',
        '**/node_modules/**/docs/**',
        '**/node_modules/**/.git/**',
      ],
    },
    // Optimize tracing
    turbotrace: {
      contextDirectory: __dirname,
      processCwd: __dirname,
    },
  },
};

export default nextConfig;