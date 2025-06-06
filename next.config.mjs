/* eslint-disable prettier/prettier */

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
  },
  // Add configuration for handling static files
  async headers() {
    return [
      {
        source: '/locales/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // Cache for 1 hour
          },
        ],
      },
    ];
  },
};

export default nextConfig;
