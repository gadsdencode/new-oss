// app/compliance/layout.tsx
// Carries route metadata for the client-component compliance page.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security and Data Protection | Overture Systems Solutions",
  description:
    "How Overture Systems Solutions secures client data and builds governance into every engagement.",
};

export default function ComplianceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
