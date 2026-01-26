import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Performance optimizations
  compress: true,

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Performance budgets
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.performance = {
        maxAssetSize: 244000, // 244kb
        maxEntrypointSize: 244000,
        hints: 'warning',
      };
    }

    // Tree shaking optimization
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    return config;
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tanstack/react-query', 'axios', 'zod'],
  },
};

export default nextConfig;
