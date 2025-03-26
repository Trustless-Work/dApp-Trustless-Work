/* eslint-disable prettier/prettier */

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
  },
};

export default nextConfig;
