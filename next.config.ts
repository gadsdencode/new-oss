import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
  },
  // Ensure environment variables are available at runtime
  // Include both standard and NEWOSS-prefixed variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL || '',
    POSTGRES_URL: process.env.POSTGRES_URL || '',
    NEWOSS_DATABASE_URL: process.env.NEWOSS_DATABASE_URL || '',
    NEWOSS_POSTGRES_URL: process.env.NEWOSS_POSTGRES_URL || '',
    NEWOSS_POSTGRES_PRISMA_URL: process.env.NEWOSS_POSTGRES_PRISMA_URL || '',
  },
};

export default nextConfig;
