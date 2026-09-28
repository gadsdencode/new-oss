import type { NextConfig } from "next";
import path from "node:path";
import { SITE_ORIGIN, SITE_WWW_HOST } from "./lib/site";

function stableWindowsPath(value: string): string {
  if (process.platform === "win32" && value.length >= 2 && value.charCodeAt(1) === 58) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray pnpm-lock.yaml in a parent
  // directory otherwise makes Next infer the wrong root. Windows also loads
  // the same Next file twice when the drive letter casing differs; dev, build,
  // and start go through scripts/run-next.cjs so static prerender sees one store.
  outputFileTracingRoot: stableWindowsPath(path.join(__dirname)),
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
  webpack: (config) => {
    config.context = stableWindowsPath(config.context ?? process.cwd());
    config.plugins ??= [];
    config.plugins.push({
      apply(compiler: {
        hooks: {
          normalModuleFactory: {
            tap: (
              name: string,
              callback: (factory: {
                hooks: {
                  beforeResolve: {
                    tap: (
                      name: string,
                      callback: (data?: { context?: string; request?: string }) => void
                    ) => void;
                  };
                };
              }) => void
            ) => void;
          };
        };
      }) {
        compiler.hooks.normalModuleFactory.tap("StableWindowsDrive", (factory) => {
          factory.hooks.beforeResolve.tap("StableWindowsDrive", (data) => {
            if (!data || process.platform !== "win32") {
              return;
            }
            if (typeof data.context === "string") {
              data.context = stableWindowsPath(data.context);
            }
            if (typeof data.request === "string" && /^[a-zA-Z]:[\\/]/.test(data.request)) {
              data.request = stableWindowsPath(data.request);
            }
          });
        });
      },
    });
    return config;
  },
};

export default nextConfig;
