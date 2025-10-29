// layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

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
  title: "AI Startup - Revolutionizing Intelligence",
  description: "Empowering businesses with cutting-edge AI solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        <div className="fixed top-4 right-4 z-50">
          <AnimatedThemeToggler />
        </div>
        {children}
      </body>
    </html>
  );
}