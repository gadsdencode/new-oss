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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
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
            <CopilotSidebarWrapper />
          </CopilotKit>
        </ThemeProvider>
      </body>
    </html>
  );
}