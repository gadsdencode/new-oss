// app/contact/layout.tsx
// Carries route metadata for the client-component contact page.
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

const title = "Contact Us | Overture Systems Solutions";
const description =
  "Request a conversation about AI strategy, implementation, or a Center of Excellence Readiness Diagnostic. Submitting the form requests a follow-up — it does not schedule a meeting by itself.";
const url = absoluteUrl("/contact");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: "Overture Systems Solutions",
    type: "website",
    images: [
      {
        url: absoluteUrl("/images/Overture_icon_transparent_512.png"),
        width: 512,
        height: 512,
        alt: "Overture Systems Solutions",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
