import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
  },
  // Ensure environment variables are available at runtime
  env: {
    DATABASE_URL: process.env.DATABASE_URL || '',
    POSTGRES_URL: process.env.POSTGRES_URL || '',
  },
};

export default nextConfig;
