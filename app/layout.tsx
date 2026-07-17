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
import { absoluteUrl, SITE_ORIGIN } from "@/lib/site";

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
  metadataBase: new URL(SITE_ORIGIN),
  title: "Overture Systems Solutions | Enterprise AI Consulting and Implementation",
  description:
    "AI strategy, implementation, and governance for enterprises. Founded in 2005. Home of the patent-pending ICDU evaluation pipeline and the AI Center of Excellence practice.",
  icons: {
    icon: "/images/Overture_icon_transparent_32.png",
    apple: "/images/Overture_icon_transparent_128.png",
  },
};

// Organization Schema for all pages
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Overture Systems Solutions",
  "url": absoluteUrl("/"),
  "logo": absoluteUrl("/images/Overture_icon_transparent_512.png"),
  "description": "Enterprise AI consulting, implementation, and governance. Founded in 2005, Overture Systems Solutions helps organizations build AI Centers of Excellence and deploy custom AI solutions, and is the home of the patent-pending ICDU evaluation pipeline.",
  "foundingDate": "2005",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "jordan.martens@osscontact.com",
    "areaServed": "US",
    "availableLanguage": ["English"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "7305 Hancock Village Drive, Suite 223",
    "addressLocality": "Chesterfield",
    "addressRegion": "VA",
    "postalCode": "23832",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.linkedin.com/company/overture-systems-solutions"
  ],
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