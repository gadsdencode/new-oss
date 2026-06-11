// app/contact/layout.tsx
// Carries route metadata for the client-component contact page.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule an Executive Briefing | Overture Systems Solutions",
  description:
    "Talk with our team about AI strategy, implementation, or a Center of Excellence readiness diagnostic.",
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
