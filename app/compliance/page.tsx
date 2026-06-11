// app/compliance/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCopilotReadable } from "@copilotkit/react-core";
import { CompliancePageTools } from "./CompliancePageTools";
import { StructuredData } from "@/components/structured-data";
import {
  ShieldCheckIcon,
  LockIcon,
  FileCheckIcon,
  ShieldAlertIcon,
  KeyIcon,
  ServerIcon,
  EyeIcon,
  ClipboardCheckIcon,
  UserCheckIcon,
  AwardIcon,
  CheckCircle2,
  ArrowRight,
  SparklesIcon,
  AlertTriangleIcon,
  DatabaseIcon,
  FileTextIcon,
  GlobeIcon,
  NetworkIcon,
  LayersIcon,
  TrophyIcon,
  HeartPulseIcon,
  CreditCardIcon,
} from "lucide-react";

const complianceStandards = [
  {
    icon: ShieldCheckIcon,
    title: "Security & Availability Controls",
    description: "Security, availability, and confidentiality controls built around recognized security frameworks.",
    features: ["Framework-aligned controls", "Continuous monitoring", "Documented policies", "Documentation on request"],
  },
  {
    icon: FileCheckIcon,
    title: "Healthcare Data Protection",
    description: "Secure, governed data handling designed for sensitive healthcare and research information.",
    features: ["Data-handling agreements", "Encryption of sensitive data", "Access controls", "Audit logging"],
  },
  {
    icon: GlobeIcon,
    title: "GDPR-Aligned Privacy",
    description: "Privacy-by-design principles that support General Data Protection Regulation requirements for EU citizen data.",
    features: ["Data portability", "Right to deletion", "Consent management", "Privacy controls"],
  },
  {
    icon: DatabaseIcon,
    title: "ISO 27001-Informed Practices",
    description: "Information security management practices designed around the international standard for systematic risk management.",
    features: ["Risk assessment", "Security policies", "Incident response", "Business continuity"],
  },
  {
    icon: FileTextIcon,
    title: "CCPA-Aligned Transparency",
    description: "Practices designed to support California Consumer Privacy Act requirements for consumer privacy rights and data transparency.",
    features: ["Data disclosure", "Opt-out rights", "Non-discrimination", "Consumer requests"],
  },
  {
    icon: NetworkIcon,
    title: "Government-Grade Design",
    description: "Architecture designed with federal cloud security expectations, such as FedRAMP, in mind.",
    features: ["Security controls", "Continuous monitoring", "Government standards", "Hardened architecture"],
  },
];

const securityFeatures = [
  {
    icon: LockIcon,
    title: "End-to-End Encryption",
    description: "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
    color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
  },
  {
    icon: KeyIcon,
    title: "Multi-Factor Authentication",
    description: "Mandatory MFA with support for TOTP, SMS, and hardware security keys",
    color: "from-primary-500/20 to-accent-500/20 dark:from-primary-500/10 dark:to-accent-500/10",
  },
  {
    icon: EyeIcon,
    title: "Real-Time Monitoring",
    description: "24/7 security monitoring with automated threat detection and response",
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
  },
  {
    icon: ServerIcon,
    title: "Infrastructure Security",
    description: "Enterprise-grade infrastructure with redundancy and DDoS protection",
    color: "from-orange-500/20 to-red-500/20 dark:from-orange-500/10 dark:to-red-500/10",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Compliance Audits",
    description: "Regular third-party security audits and penetration testing",
    color: "from-secondary-500/20 to-primary-500/20 dark:from-secondary-500/10 dark:to-primary-500/10",
  },
  {
    icon: UserCheckIcon,
    title: "Access Controls",
    description: "Role-based access control with principle of least privilege",
    color: "from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-500/10",
  },
];

const complianceProcess = [
  {
    step: "01",
    title: "Security Assessment",
    description: "Comprehensive evaluation of your security requirements, compliance needs, and existing infrastructure to identify gaps.",
    icon: ShieldAlertIcon,
    duration: "1 week",
  },
  {
    step: "02",
    title: "Implementation Planning",
    description: "Develop detailed compliance roadmap with timelines, resource allocation, and milestone definitions.",
    icon: ClipboardCheckIcon,
    duration: "1-2 weeks",
  },
  {
    step: "03",
    title: "Controls Deployment",
    description: "Implement security controls, policies, and procedures aligned with compliance requirements.",
    icon: LayersIcon,
    duration: "4-8 weeks",
  },
  {
    step: "04",
    title: "Continuous Compliance",
    description: "Ongoing monitoring, documentation, and updates to maintain your compliance posture.",
    icon: EyeIcon,
    duration: "Ongoing",
  },
];

// Frameworks our security program is designed around (no held certifications asserted)
const frameworkAlignment = [
  {
    name: "Security & Availability",
    framework: "Recognized audit frameworks",
    status: "Aligned",
    icon: TrophyIcon,
  },
  {
    name: "Healthcare Data Protection",
    framework: "Secure, governed data handling",
    status: "Built-in",
    icon: HeartPulseIcon,
  },
  {
    name: "Information Security",
    framework: "ISO 27001-informed practices",
    status: "Aligned",
    icon: GlobeIcon,
  },
  {
    name: "Payment Security",
    framework: "PCI-aligned processing via Stripe",
    status: "Delegated",
    icon: CreditCardIcon,
  },
];

const stats = [
  {
    icon: ShieldCheckIcon,
    stat: "99.99%",
    label: "Uptime SLA",
    description: "Enterprise-grade reliability with multi-region redundancy",
  },
  {
    icon: LockIcon,
    stat: "256-bit",
    label: "AES Encryption",
    description: "Military-grade encryption for all sensitive data",
  },
  {
    icon: ClipboardCheckIcon,
    stat: "24/7",
    label: "Security Monitoring",
    description: "Round-the-clock threat detection and incident response",
  },
  {
    icon: AwardIcon,
    stat: "4+",
    label: "Security Frameworks",
    description: "Recognized frameworks guiding our controls and engineering",
  },
];

// Anonymized testimonials - role and sector only, no names or company names
const testimonials = [
  {
    quote: "Their security infrastructure gave us the confidence to migrate our entire healthcare platform. The security review process was seamless.",
    role: "Chief Information Security Officer",
    company: "Healthcare platform provider",
    impact: "Smooth security review",
  },
  {
    quote: "The data-protection features are best-in-class. Their security team is incredibly responsive whenever we have questions.",
    role: "VP of Clinical Operations",
    company: "Regional health system",
    impact: "Responsive security team",
  },
  {
    quote: "As a financial services company, we need rigorous security. Their multi-layered approach exceeds our requirements.",
    role: "Head of Compliance",
    company: "Financial services firm",
    impact: "Requirements exceeded",
  },
];

// Service Schema for Compliance Page - Bing loves structured data!
const complianceServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Enterprise Security & Data Protection Services",
  "name": "Enterprise Security & Data Protection Solutions",
  "description": "Enterprise-grade security and data protection built around recognized security frameworks. Encryption, access controls, monitoring, and governance designed into every engagement.",
  "provider": {
    "@type": "Organization",
    "name": "Overture Systems Solutions",
    "url": "https://overture-systems.com"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "serviceOutput": [
    "Framework-aligned security controls",
    "Secure, governed data handling",
    "Privacy-by-design architecture",
    "Risk assessment and security policies",
    "Encryption, access controls, and monitoring",
    "Security documentation and governance frameworks"
  ],
  "audience": {
    "@type": "Audience",
    "audienceType": "Enterprise organizations, Healthcare providers, Financial services, Government agencies"
  }
};

export default function CompliancePage() {
  // Provide context to the AI agent about security and data protection
  useCopilotReadable({
    description: "Security and data protection page describing framework-aligned security practices",
    value: {
      pageTitle: "Security & Data Protection",
      overview: "Enterprise-grade security and data protection built around recognized security frameworks. Overture Systems Solutions does not currently assert any held third-party certifications; controls are designed around recognized frameworks.",
      frameworkAlignment: [
        {
          name: "Security & Availability Controls",
          description: "Security, availability, and confidentiality controls built around recognized security frameworks.",
          features: ["Framework-aligned controls", "Continuous monitoring", "Documented policies", "Documentation on request"]
        },
        {
          name: "Healthcare Data Protection",
          description: "Secure, governed data handling designed for sensitive healthcare and research information.",
          features: ["Data-handling agreements", "Encryption of sensitive data", "Access controls", "Audit logging"]
        },
        {
          name: "GDPR-Aligned Privacy",
          description: "Privacy-by-design principles that support General Data Protection Regulation requirements for EU citizen data.",
          features: ["Data portability", "Right to deletion", "Consent management", "Privacy controls"]
        },
        {
          name: "ISO 27001-Informed Practices",
          description: "Information security management practices designed around the international standard for systematic risk management.",
          features: ["Risk assessment", "Security policies", "Incident response", "Business continuity"]
        },
        {
          name: "CCPA-Aligned Transparency",
          description: "Practices designed to support California Consumer Privacy Act requirements for consumer privacy rights and data transparency.",
          features: ["Data disclosure", "Opt-out rights", "Non-discrimination", "Consumer requests"]
        },
        {
          name: "Government-Grade Design",
          description: "Architecture designed with federal cloud security expectations, such as FedRAMP, in mind.",
          features: ["Security controls", "Continuous monitoring", "Government standards", "Hardened architecture"]
        },
        {
          name: "Payment Security",
          description: "Payment processing is delegated to Stripe, a PCI-aligned payment provider."
        }
      ],
      securityFeatures: [
        "End-to-End Encryption - AES-256 encryption for data at rest and TLS 1.3 for data in transit",
        "Multi-Factor Authentication - Mandatory MFA with support for TOTP, SMS, and hardware security keys",
        "Real-Time Monitoring - 24/7 security monitoring with automated threat detection and response",
        "Infrastructure Security - Enterprise-grade infrastructure with redundancy and DDoS protection",
        "Compliance Audits - Regular third-party security audits and penetration testing",
        "Access Controls - Role-based access control with principle of least privilege"
      ],
      statistics: {
        uptimeSLA: "99.99% uptime with multi-region redundancy",
        encryption: "256-bit AES encryption (military-grade)",
        monitoring: "24/7 security monitoring and incident response",
        frameworksCount: "4+ recognized security frameworks guiding our controls and engineering"
      },
      complianceProcess: [
        "Security Assessment (1 week) - Comprehensive evaluation of security requirements and compliance needs",
        "Implementation Planning (1-2 weeks) - Develop detailed compliance roadmap with timelines and milestones",
        "Controls Deployment (4-8 weeks) - Implement security controls, policies, and procedures",
        "Continuous Compliance (Ongoing) - Ongoing monitoring, documentation, and updates"
      ],
      documentation: {
        available: true,
        includes: ["Security documentation", "Data-handling agreements", "Security whitepapers", "Dedicated security support"]
      },
      contactInfo: {
        securityTeam: true,
        contactPage: "/contact"
      }
    }
  });

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
      {/* Service Schema for SEO - Bing and Google recognition */}
      <StructuredData data={complianceServiceSchema} />
      
      {/* Register page-specific AI tools for compliance page */}
      {/* These tools are ONLY available on this page */}
      <CompliancePageTools />
      
      {/* Home Button */}
      <HomeButton />
      
      {/* Hero Section */}
      <header className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20 dark:from-green-500/10 dark:via-emerald-500/5 dark:to-teal-500/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-20">
          <Badge variant="outline" className="mb-4 max-w-full whitespace-normal text-center border-primary text-primary px-4 py-1.5">
            <ShieldCheckIcon className="w-3 h-3 mr-2 inline" />
            Enterprise-Grade Security & Compliance
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Security & Data Protection
            <span className="block mt-2 text-primary">
              You Can Trust
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            Security built around recognized frameworks and privacy-first engineering. Your data is protected by enterprise-grade infrastructure and governance built into every engagement.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
              <Link href="/contact">Request Security Documentation</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
              <Link href="#certifications">View Certifications</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Enterprise-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Secure, Governed Data Handling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Privacy-First Engineering</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-foreground">{stat.stat}</div>
                <div className="mt-2 text-sm font-medium text-foreground">{stat.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section id="certifications" className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Security Standards</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Frameworks We Build Around
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our security and data-protection practices are designed around recognized frameworks to protect your data.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {complianceStandards.map((standard, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <standard.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{standard.title}</CardTitle>
                  <CardDescription className="text-base">{standard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {standard.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Bento Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Security Features</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Multi-Layered Security Architecture
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive security measures protecting your data at every layer of our infrastructure.
            </p>
          </div>
          <BentoGrid>
            {securityFeatures.map((feature, idx) => (
              <BentoCard
                key={idx}
                name={feature.title}
                className="col-span-1 md:col-span-1 lg:col-span-1"
                background={
                  <div className={cn("absolute inset-0 bg-gradient-to-br", feature.color)} />
                }
                Icon={feature.icon}
                description={feature.description}
                href="/contact"
                cta="Learn More"
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Compliance Process */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Compliance Process</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Path to Compliance
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our structured approach ensures your organization meets all regulatory requirements efficiently.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {complianceProcess.map((step, idx) => (
              <div key={idx} className="relative">
                <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary/20">{step.step}</span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <Badge variant="outline" className="w-fit mt-2">
                      <ClipboardCheckIcon className="w-3 h-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {idx < complianceProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Alignment */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Framework Alignment</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              How We Approach Security
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We design our controls around recognized security frameworks and review them continuously.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {frameworkAlignment.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                        {item.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.framework}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Trusted by Leaders</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              What Security Teams Say
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                      {testimonial.impact}
                    </Badge>
                  </div>
                  <blockquote className="text-base text-muted-foreground italic mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20 dark:from-green-500/10 dark:via-emerald-500/5 dark:to-teal-500/10">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Ready to Meet Your Compliance Requirements?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Get detailed security documentation and discuss your specific compliance needs with our security team.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
              <Link href="/contact">
                Contact Security Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
              <Link href="/security-whitepaper">Download Security Whitepaper</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Security documentation available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Data-handling agreements provided</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Dedicated security support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

