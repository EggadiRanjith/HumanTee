// Force rebuild with NEXT_PUBLIC_API_URL
import type { NextConfig } from "next";

// Bundle analyzer for performance monitoring
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Production compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Enable React Strict Mode for better error detection
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for production
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'inline',
  },
  // Optimize for video delivery
  experimental: {
    // optimizeCss: true, // Disabled - requires critters module
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
  // Headers for security and performance
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const isDev = process.env.NODE_ENV === 'development';

    return [
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            // CSP: Report-only in development, enforcing in production
            key: isDev ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sentry.io https://checkout.razorpay.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https:;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' ${apiUrl} https://sentry.io https://api.razorpay.com;
              frame-src 'self' https://api.razorpay.com;
              report-uri /api/csp-report;
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
      // Video streaming headers
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
      // Font caching
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Image caching
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

