// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon,
  CheckCircle2,
  LinkedinIcon,
  TwitterIcon,
  GithubIcon,
  MessageSquareIcon,
  SparklesIcon,
  ArrowRight,
  Loader2Icon,
} from "lucide-react";

const contactMethods = [
  {
    icon: MailIcon,
    title: "Email Us",
    detail: "hello@overturesystems.com",
    description: "Send us an email anytime",
    href: "mailto:hello@overturesystems.com",
    color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
  },
  {
    icon: PhoneIcon,
    title: "Call Us",
    detail: "+1 (555) 123-4567",
    description: "Mon-Fri from 9am to 6pm EST",
    href: "tel:+15551234567",
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
  },
  {
    icon: MapPinIcon,
    title: "Visit Us",
    detail: "123 Innovation Drive, Suite 100",
    description: "San Francisco, CA 94105",
    href: "https://maps.google.com",
    color: "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10",
  },
  {
    icon: MessageSquareIcon,
    title: "Live Chat",
    detail: "Available 24/7",
    description: "Get instant support",
    href: "#chat",
    color: "from-orange-500/20 to-red-500/20 dark:from-orange-500/10 dark:to-red-500/10",
  },
];

const socialLinks = [
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://linkedin.com",
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
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
            Let's Start a
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Conversation
            </span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            Have a question or ready to transform your business with AI? We're here to help. Reach out and let's discuss how we can work together.
          </p>
        </div>
      </header>

      {/* Contact Methods Grid */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method, idx) => (
              <Link key={idx} href={method.href}>
                <Card className={cn(
                  "h-full border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group",
                  "hover:scale-105 duration-200"
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
                    <CardDescription className="font-medium text-foreground mt-1">
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

      {/* Main Contact Form + Info Section */}
      <section className="py-20">
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
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card className="border-2">
                <CardContent className="pt-6">
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Thank you for contacting us. We'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            name="company"
                            placeholder="Your Company"
                            value={formData.company}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">
                          Subject <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">
                          Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your needs..."
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          className="resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <SendIcon className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monday - Friday</span>
                    <span className="text-sm font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Saturday</span>
                    <span className="text-sm font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sunday</span>
                    <span className="text-sm font-medium">Closed</span>
                  </div>
                  <div className="pt-3 border-t">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                      • Currently Open
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Our Offices */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Our Offices</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offices.map((office, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{office.city}</h4>
                        {office.isPrimary && (
                          <Badge variant="secondary" className="text-xs">HQ</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{office.address}</p>
                      <p className="text-sm text-muted-foreground">{office.state}</p>
                      {idx < offices.length - 1 && <div className="pt-4 border-b" />}
                    </div>
                  ))}
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

