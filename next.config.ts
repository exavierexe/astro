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
  // Allow ephemeris module to be bundled correctly
  // Ensure proper transpilation of ephemeris and our wrapper modules
  transpilePackages: ['ephemeris', './lib/ephemeris-wrapper', './lib/server-ephemeris'],
  // Properly handle CommonJS modules
  webpack: (config, { isServer }) => {
    // Add support for CommonJS modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    // Add our shim to the entry point
    if (!isServer) {
      const originalEntry = config.entry;
      
      config.entry = async () => {
        const entries = await originalEntry();
        
        // Add our shim to the entries
        if (entries['main.js'] && !entries['main.js'].includes('/app/shims.js')) {
          entries['main.js'] = [
            require.resolve('./app/shims.js'),
            ...entries['main.js']
          ];
        }
        
        return entries;
      };
    }
    
    return config;
  },
};

export default nextConfig;
