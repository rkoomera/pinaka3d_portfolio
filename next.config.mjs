/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import bundle analyzer
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const nextConfig = {
  // Optimize images
  images: {
    // Allow remote image sources
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '**' },
      { protocol: 'https', hostname: 'gyuznawtihohzzdmhvtw.supabase.co', pathname: '**' },
    ],
    // Generate optimized image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Use modern image formats where supported
    formats: ['image/webp', 'image/avif'],
  },
  
  // Increase performance with webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization.moduleIds = 'deterministic';
    
    // Only load needed polyfills
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Minimize impact of third-party scripts on performance
  poweredByHeader: false,
  compress: true,
  
  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Default to denying framing; override below for studio path
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Allow embedding Studio in Sanity Dashboard (different origin)
        source: '/admin/studio(.*)',
        headers: [
          // Do not send X-Frame-Options on this path; use CSP below instead
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.sanity.io https://*.sanity.app",
          },
        ],
      },
      {
        // Cache static assets longer
        source: '/(.*).(jpg|jpeg|png|svg|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // For production builds, optimize CSS
  experimental: {
    optimizeCss: process.env.ANALYZE === 'true',
  },
};

export default withBundleAnalyzer(nextConfig); 