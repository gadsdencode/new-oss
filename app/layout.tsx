// layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

import { CopilotKit } from "@copilotkit/react-core";
import { ThemeProvider } from "next-themes";
import { CopilotSidebarWrapper } from "./components/copilot-sidebar-wrapper";
import { ThemeToggleWrapper } from "./components/theme-toggle-wrapper";
import { GlobalAITools } from "@/components/global-ai-tools";
import { StructuredData } from "@/components/structured-data";
import { Analytics } from '@vercel/analytics/next';

// Fallback: Inter ≈ Geist Sans, JetBrains Mono ≈ Geist Mono
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Overture Systems Solutions - Revolutionizing Intelligence",
  description: "Empowering businesses with cutting-edge AI-powered solutions.",
  icons: {
    icon: "/images/Overture_icon_transparent_32.png",
    apple: "/images/Overture_icon_transparent_128.png",
  },
};

// Organization Schema for all pages - Bing and Google love this!
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Overture Systems Solutions",
  "url": "https://new-oss.vercel.app",
  "logo": "https://new-oss.vercel.app/images/Overture_logo_square_dark_1254.png",
  "description": "Enterprise AI solutions for business intelligence, strategy, implementation, and compliance. We deliver 3.5x average ROI within 18 months, 60% operational time savings, and 95% project success rates.",
  "foundingDate": "2020",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-888-716-3360",
    "contactType": "Customer Service",
    "email": "jordan.martens@osscontact.com",
    "areaServed": "US",
    "availableLanguage": ["English"]
  },
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "123 Innovation Drive, Suite 100",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105",
      "addressCountry": "US"
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "456 Tech Avenue, Floor 15",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "789 Startup Lane, Building C",
      "addressLocality": "Austin",
      "addressRegion": "TX",
      "postalCode": "78701",
      "addressCountry": "US"
    }
  ],
  "sameAs": [
    "https://linkedin.com",
    "https://twitter.com",
    "https://github.com"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "200",
    "bestRating": "5",
    "worstRating": "1"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        {/* Organization Schema - Appears on all pages for Bing/Google recognition */}
        <StructuredData data={organizationSchema} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CopilotKit runtimeUrl="/api/copilotkit">
            {/* Global AI Tools - Available on ALL pages */}
            <GlobalAITools />
            <ThemeToggleWrapper />
            {children}
            <Analytics />
            <CopilotSidebarWrapper />
          </CopilotKit>
        </ThemeProvider>
      </body>
    </html>
  );
}