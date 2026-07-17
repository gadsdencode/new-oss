// lib/site.ts
// Preferred production origin for absolute URLs (canonical, OG, JSON-LD, sitemap).
// Convention: apex host — matches app/layout.tsx metadataBase and existing
// overture-systems.com absolute URLs throughout the repo. www redirects here.

export const SITE_ORIGIN = "https://overture-systems.com" as const;
export const SITE_WWW_HOST = "www.overture-systems.com" as const;

/** Build an absolute URL on the preferred host. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}
