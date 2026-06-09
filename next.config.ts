import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray pnpm-lock.yaml in a parent
  // directory otherwise makes Next infer the wrong root, which can pull in a
  // duplicate Next runtime and break static prerendering ("Expected
  // workUnitAsyncStorage to have a store").
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Next 16 clamps next/image quality to this list (default [75]). The CoE
    // hero backdrops request quality={90} to avoid recompressing the soft
    // atmospheric art.
    qualities: [75, 90],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
  },
};

export default nextConfig;
