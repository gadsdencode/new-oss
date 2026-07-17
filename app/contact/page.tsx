// app/contact/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCopilotReadable } from "@copilotkit/react-core";
import { StructuredData } from "@/components/structured-data";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  LinkedinIcon,
  MessageSquareIcon,
  SparklesIcon,
  ArrowRight,
  HashIcon,
  UserIcon,
} from "lucide-react";
import { ContactForm } from "./contact-form";
import { getCoeIntentCopy, resolveCoeIntent } from "@/lib/contact/coe-intent";

const contactMethods = [
  {
    icon: MailIcon,
    title: "Email Us",
    detail: "jordan.martens@osscontact.com",
    description: "Send us an email anytime",
    href: "mailto:jordan.martens@osscontact.com",
    color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
  },
  {
    icon: PhoneIcon,
    title: "Call Us",
    detail: "+1 (888) 716-3360",
    description: "Mon–Fri, 9am–6pm EST · Extensions available",
    href: "tel:+18887163360",
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
  },
  {
    icon: MessageSquareIcon,
    title: "AI Assistant",
    detail: "On this website",
    description: "Ask questions about our services while you browse",
    href: "#contact-form",
    color: "from-orange-500/20 to-red-500/20 dark:from-orange-500/10 dark:to-red-500/10",
  },
];

const phoneExtensions = [
  { ext: "1", department: "Sales", contact: "Brian Conrad" },
  { ext: "2", department: "HR", contact: "Brian Conrad" },
  { ext: "4", department: "Legal", contact: "Brian Conrad" },
  { ext: "5", department: "Consulting Services", contact: "Brian Conrad" },
  { ext: "8", department: "All Other Services", contact: "Jordan Martens" },
  { ext: "103", department: "AI Research", contact: "Samuel Conrad" },
  { ext: "300", department: "Technical Services", contact: "Jordan Martens" },
];

/** Only verified company social destinations — no placeholder homepage links. */
const socialLinks = [
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/overture-systems-solutions",
  },
];

const faqs = [
  {
    question: "What's your typical response time?",
    answer:
      "We follow up on inquiries during business hours (Monday–Friday, 9am–6pm EST). Timing depends on volume and the complexity of your request.",
  },
  {
    question: "Do you offer free consultations?",
    answer:
      "Yes. We offer an initial conversation to discuss your needs. Use the form on this page to request one — submitting the form does not schedule a meeting by itself.",
  },
  {
    question: "What industries do you serve?",
    answer: "We work with healthcare, non-profits, technology, and other organizations exploring AI capability.",
  },
];

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function ContactPageInner() {
  const searchParams = useSearchParams();
  const intentParam = searchParams.get("intent");
  const intentId = resolveCoeIntent(intentParam);
  const intentCopy = getCoeIntentCopy(intentParam);
  const fromCoe = intentId !== "general";

  useCopilotReadable({
    description: "Contact page with multiple ways to reach Overture Systems Solutions",
    value: {
      pageTitle: "Contact Us",
      overview:
        "Contact form and phone/email options. Submitting the form requests a follow-up; it does not schedule a meeting. No third-party calendar scheduler is embedded on this page.",
      coeIntent: fromCoe
        ? {
            intent: intentId,
            subject: intentCopy.subject,
            heading: intentCopy.heading,
            note: "Visitor arrived from the AI Center of Excellence journey.",
          }
        : null,
      contactMethods: [
        {
          type: "Email",
          value: "jordan.martens@osscontact.com",
          description: "Send us an email anytime",
          availability: "Follow-up during business hours (Mon–Fri, 9am–6pm EST)",
        },
        {
          type: "Phone",
          value: "+1 (888) 716-3360",
          description: "Call us during business hours. Extensions available for direct department routing.",
          availability: "Mon-Fri, 9am-6pm EST",
          extensions: phoneExtensions.map((e) => ({
            extension: e.ext,
            department: e.department,
            contact: e.contact,
          })),
          routingInstructions:
            "When a user asks to speak to a specific department, provide the main number +1 (888) 716-3360 and the relevant extension number.",
        },
        {
          type: "AI Assistant",
          description: "Site assistant available while browsing this website",
          availability: "On-site assistant; not a guaranteed 24/7 human support SLA",
        },
      ],
      offices: [
        {
          city: "Chesterfield",
          address: "7305 Hancock Village Drive, Suite 223",
          state: "Virginia",
          zip: "23832",
          isPrimary: true,
          label: "Headquarters",
        },
      ],
      businessHours: {
        mondayToFriday: "9:00 AM - 6:00 PM EST",
        saturday: "Closed for phone support",
        sunday: "Closed",
      },
      responseTime:
        "We follow up during business hours; response timing depends on volume and request complexity.",
      freeConsultation: {
        available: true,
        description:
          "Initial conversation available on request via the contact form — form submit does not schedule a meeting.",
      },
      socialMedia: {
        linkedin: "https://www.linkedin.com/company/overture-systems-solutions",
      },
      faqs,
    },
  });

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
      <StructuredData data={faqPageSchema} />
      <HomeButton />

      <header className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 dark:from-primary/10 dark:via-accent/5 dark:to-primary/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8 py-16">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1.5">
            <SparklesIcon className="w-3 h-3 mr-2 inline" aria-hidden="true" />
            {fromCoe ? "AI Center of Excellence" : "Get In Touch"}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {fromCoe ? (
              <span className="text-primary">{intentCopy.heading}</span>
            ) : (
              <>
                Let&apos;s Start a
                <span className="block mt-2 text-primary">Conversation</span>
              </>
            )}
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            {fromCoe
              ? intentCopy.intro
              : "Have a question or ready to explore how AI can support your organization? Reach out and we&apos;ll follow up."}
          </p>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-8">
                <Badge variant="secondary" className="mb-4">
                  {fromCoe ? "AI CoE inquiry" : "Send a Message"}
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {fromCoe ? intentCopy.heading : "Get in Touch"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {fromCoe
                    ? intentCopy.intro
                    : "Fill out the form below and we&apos;ll follow up during business hours."}
                </p>
              </div>

              <ContactForm key={intentId} intentId={intentId} />
            </div>

            <div className="space-y-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ClockIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle>Business Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-muted-foreground">Phone support</span>
                    <span className="text-sm font-medium">Mon–Fri, 9am–6pm EST</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-muted-foreground">Email &amp; form follow-up</span>
                    <span className="text-sm font-medium">During business hours</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-muted-foreground">Site AI assistant</span>
                    <span className="text-sm font-medium">Available while you browse</span>
                  </div>
                  <div className="pt-3 border-t">
                    <Badge variant="secondary">Headquarters · Chesterfield, VA</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>Official company presence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <Link
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 transition-all hover:scale-110"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <CardTitle className="text-lg">Headquarters</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    7305 Hancock Village Drive, Suite 223
                    <br />
                    Chesterfield, Virginia 23832
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Other Ways to Reach Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Additional Contact Options</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map((method) => (
              <Link key={method.title} href={method.href}>
                <Card
                  className={cn(
                    "h-full border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group",
                    "md:hover:scale-105 duration-200"
                  )}
                >
                  <div className={cn("h-2 bg-gradient-to-r", method.color)} />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <method.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <ArrowRight
                        className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                        aria-hidden="true"
                      />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription className="font-medium text-foreground mt-1 break-words">
                      {method.detail}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 pt-4 sm:-mt-4 sm:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-2 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-lg">Phone Extension Directory</CardTitle>
                  <CardDescription>
                    Call <span className="font-medium text-foreground">+1 (888) 716-3360</span> and dial the
                    extension
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {phoneExtensions.map((item) => (
                  <div
                    key={item.ext}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      <HashIcon className="h-3 w-3 mr-0.5" aria-hidden="true" />
                      {item.ext}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{item.department}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <UserIcon className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                        <p className="text-xs text-muted-foreground truncate">{item.contact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Prefer to talk it through?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Request a conversation with our team using the form on this page. There is no separate calendar
            scheduler embedded here — we&apos;ll follow up to arrange a time.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="#contact-form">
              Request a Conversation
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading contact form…</p>
        </div>
      }
    >
      <ContactPageInner />
    </Suspense>
  );
}
