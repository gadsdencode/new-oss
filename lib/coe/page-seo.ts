// lib/coe/page-seo.ts
// Shared metadata builder so every CoE route gets absolute canonical + OG/Twitter
// URLs on the preferred production host.
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export interface CoePageSeoInput {
  /** Full document title (includes brand when appropriate). */
  title: string;
  description: string;
  /** Path beginning with /ai-center-of-excellence… (no query string). */
  path: string;
  /** Absolute or site-relative OG image path. */
  ogImage: string;
}

export function coePageMetadata({ title, description, path, ogImage }: CoePageSeoInput): Metadata {
  // Canonical is always the clean path — query variants (?stage=, ?intent= elsewhere)
  // must not create distinct indexable URLs.
  const url = absoluteUrl(path.split("?")[0] || path);
  const imageUrl = absoluteUrl(ogImage);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Overture Systems Solutions",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function coeServiceJsonLd(params: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: params.serviceType ?? "AI Center of Excellence",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    provider: {
      "@type": "Organization",
      name: "Overture Systems Solutions",
      url: absoluteUrl("/"),
    },
    areaServed: { "@type": "Country", name: "United States" },
    isPartOf: {
      "@type": "Service",
      name: "AI Center of Excellence (CoE) Establishment",
      url: absoluteUrl("/ai-center-of-excellence"),
    },
  };
}
