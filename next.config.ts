import type { NextConfig } from "next";
import path from "node:path";
import { SITE_ORIGIN, SITE_WWW_HOST } from "./lib/site";

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
  // Preferred host is the apex (see lib/site.ts and app/layout.tsx metadataBase).
  // Permanently consolidate www → apex so search engines and sharers see one origin.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: SITE_WWW_HOST }],
        destination: `${SITE_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
