// components/structured-data.tsx
// Reusable component for adding JSON-LD structured data to pages
"use client";

interface StructuredDataProps {
  data: object | object[];
}

/**
 * StructuredData Component
 * 
 * Adds JSON-LD structured data to the page head for SEO and search engine recognition.
 * Used by Google, Bing, and other search engines to understand page content.
 * 
 * This component renders script tags with type="application/ld+json" which search engines
 * automatically parse. Next.js will move these to the document head.
 * 
 * @param data - Single object or array of objects containing Schema.org structured data
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item, null, 0) }}
        />
      ))}
    </>
  );
}

