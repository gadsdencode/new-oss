// app/contact/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
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
  TwitterIcon,
  GithubIcon,
  MessageSquareIcon,
  SparklesIcon,
  ArrowRight,
  HashIcon,
  UserIcon,
} from "lucide-react";
import { ContactForm } from "./contact-form";

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
    description: "Mon-Fri from 9am to 6pm EST | Extensions available",
    href: "tel:+18887163360",
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
  },
  {
    icon: MessageSquareIcon,
    title: "AI Chat",
    detail: "Available 24/7",
    description: "Get instant support",
    href: "#chat",
    color: "from-orange-500/20 to-red-500/20 dark:from-orange-500/10 dark:to-red-500/10",
  },
];

const phoneExtensions = [
  { ext: "1", department: "Sales", contact: "Brian Frerichs" },
  { ext: "2", department: "HR", contact: "Brian Frerichs" },
  { ext: "4", department: "Legal", contact: "Brian Frerichs" },
  { ext: "5", department: "Consulting Services", contact: "Brian Frerichs" },
  { ext: "8", department: "All Other Services", contact: "Jordan Martens" },
  { ext: "103", department: "AI Research", contact: "Samuel Conrad" },
  { ext: "300", department: "Technical Services", contact: "Jordan Martens" },
];

const socialLinks = [
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/overture-systems-solutions",
  },
  {
    icon: TwitterIcon,
    label: "Twitter",
    href: "https://twitter.com",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com",
  },
];

const offices = [
  {
    city: "San Francisco",
    address: "123 Innovation Drive, Suite 100",
    state: "California, 94105",
    isPrimary: true,
  },
  {
    city: "New York",
    address: "456 Tech Avenue, Floor 15",
    state: "New York, 10001",
    isPrimary: false,
  },
  {
    city: "Austin",
    address: "789 Startup Lane, Building C",
    state: "Texas, 78701",
    isPrimary: false,
  },
];

const faqs = [
  {
    question: "What's your typical response time?",
    answer: "We respond to all inquiries within 24 hours during business days.",
  },
  {
    question: "Do you offer free consultations?",
    answer: "Yes! We offer a free 30-minute initial consultation to discuss your needs.",
  },
  {
    question: "What industries do you serve?",
    answer: "We specialize in healthcare, non-profits, finance, and technology sectors.",
  },
];

// FAQPage Schema for Contact Page - Bing loves structured data for rich snippets!
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's your typical response time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We respond to all inquiries within 24 hours during business days."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer free consultations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We offer a free 30-minute initial consultation to discuss your needs."
      }
    },
    {
      "@type": "Question",
      "name": "What industries do you serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We specialize in healthcare, non-profits, finance, and technology sectors."
      }
    }
  ]
};

export default function ContactPage() {
  // Provide context to the AI agent about contact information
  useCopilotReadable({
    description: "Contact page with multiple ways to reach Overture Systems Solutions",
    value: {
      pageTitle: "Contact Us",
      overview: "Multiple ways to get in touch with Overture Systems Solutions. We're here to help transform your business with AI.",
      contactMethods: [
        {
          type: "Email",
          value: "jordan.martens@osscontact.com",
          description: "Send us an email anytime",
          availability: "Responds within 24 hours during business days"
        },
        {
          type: "Phone",
          value: "+1 (888) 716-3360",
          description: "Call us during business hours. Extensions available for direct department routing.",
          availability: "Mon-Fri, 9am-6pm EST",
          extensions: phoneExtensions.map(e => ({
            extension: e.ext,
            department: e.department,
            contact: e.contact,
          })),
          routingInstructions: "When a user asks to speak to a specific department, provide the main number +1 (888) 716-3360 and the relevant extension number."
        },
        {
          type: "Live Chat",
          description: "Available 24/7 for instant support",
          availability: "24/7"
        }
      ],
      offices: [
        {
          city: "San Francisco",
          address: "123 Innovation Drive, Suite 100",
          state: "California",
          zip: "94105",
          isPrimary: true,
          label: "Headquarters"
        },
        {
          city: "New York",
          address: "456 Tech Avenue, Floor 15",
          state: "New York",
          zip: "10001",
          isPrimary: false
        },
        {
          city: "Austin",
          address: "789 Startup Lane, Building C",
          state: "Texas",
          zip: "78701",
          isPrimary: false
        }
      ],
      businessHours: {
        mondayToFriday: "9:00 AM - 6:00 PM EST",
        saturday: "10:00 AM - 4:00 PM EST",
        sunday: "Closed",
        currentlyOpen: true
      },
      responseTime: "We respond to all inquiries within 24 hours during business days",
      freeConsultation: {
        available: true,
        duration: "30 minutes",
        description: "Free initial consultation to discuss your needs"
      },
      socialMedia: {
        linkedin: "https://www.linkedin.com/company/overture-systems-solutions",
        twitter: "https://twitter.com",
        github: "https://github.com"
      },
      faqs: [
        {
          question: "What's your typical response time?",
          answer: "We respond to all inquiries within 24 hours during business days."
        },
        {
          question: "Do you offer free consultations?",
          answer: "Yes! We offer a free 30-minute initial consultation to discuss your needs."
        },
        {
          question: "What industries do you serve?",
          answer: "We specialize in healthcare, non-profits, finance, and technology sectors."
        }
      ]
    }
  });

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
      {/* FAQPage Schema for SEO - Bing and Google rich snippets */}
      <StructuredData data={faqPageSchema} />
      
      {/* Home Button */}
      <HomeButton />

      {/* Hero Section */}
      <header className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 dark:from-primary/10 dark:via-accent/5 dark:to-primary/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8 py-16">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1.5">
            <SparklesIcon className="w-3 h-3 mr-2 inline" />
            Get In Touch
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Let&apos;s Start a
            <span className="block mt-2 text-primary">
              Conversation
            </span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            Have a question or ready to transform your business with AI? We&apos;re here to help. Reach out and let&apos;s discuss how we can work together.
          </p>
        </div>
      </header>

      {/* Main Contact Form + Info Section - Moved to top for visibility */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge variant="secondary" className="mb-4">Send a Message</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Get in Touch
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <ContactForm />
            </div>

            {/* Additional Info Sidebar */}
            <div className="space-y-8">
              {/* Office Hours */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Office Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-muted-foreground">Availability</span>
                    <span className="text-sm font-medium">24/7</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-muted-foreground">Support Type</span>
                    <span className="text-sm font-medium">Global, all time zones</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm text-muted-foreground">Live response with AI</span>
                    <span className="text-sm font-medium">Available round-the-clock</span>
                  </div>
                  <div className="pt-3 border-t">
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                    >
                      • Always Open
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>Stay connected on social media</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {socialLinks.map((social, idx) => (
                      <Link
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 transition-all hover:scale-110"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Other Ways to Reach Us</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Additional Contact Options
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map((method, idx) => (
              <Link key={idx} href={method.href}>
                <Card className={cn(
                  "h-full border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group",
                  "md:hover:scale-105 duration-200"
                )}>
                  <div className={cn("h-2 bg-gradient-to-r", method.color)} />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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

      {/* Phone Extension Directory */}
      <section className="pb-16 pt-4 sm:-mt-4 sm:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-2 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Phone Extension Directory</CardTitle>
                  <CardDescription>
                    Call <span className="font-medium text-foreground">+1 (888) 716-3360</span> and dial the extension
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
                      <HashIcon className="h-3 w-3 mr-0.5" />{item.ext}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{item.department}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <UserIcon className="h-3 w-3 text-muted-foreground shrink-0" />
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

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-2">
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

      {/* CTA Section */}
      <section className="py-20 border-t">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Prefer to Schedule a Call?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Book a free 30-minute consultation with our team to discuss your needs.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/consulting">
              Schedule Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2025 Overture Systems Solutions. All rights reserved.
      </footer>
    </div>
  );
}

