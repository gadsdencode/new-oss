// app/research/layout.tsx
// Carries route metadata for the client-component research page.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B Research Platform for Healthcare and Non-Profits | Overture Systems Solutions",
  description:
    "AI-powered research for healthcare and non-profit organizations with secure, governed data handling and impact measurement.",
};

export default function ResearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
