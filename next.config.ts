import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray pnpm-lock.yaml in a parent
  // directory otherwise makes Next infer the wrong root, which can pull in a
  // duplicate Next runtime and break static prerendering ("Expected
  // workUnitAsyncStorage to have a store").
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
  },
};

export default nextConfig;
