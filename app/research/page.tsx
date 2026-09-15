// app/research/page.tsx
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
import { ResearchPageTools } from "./ResearchPageTools";
import { StructuredData } from "@/components/structured-data";
import {
  RESEARCH_FEATURES,
  RESEARCH_OVERVIEW,
  RESEARCH_USE_CASES,
  approvedResearchAssistantPayload,
} from "@/lib/research/approved-services";
import {
  BrainCircuitIcon,
  HeartPulseIcon,
  HandHeartIcon,
  TrendingUpIcon,
  SearchCheckIcon,
  DatabaseIcon,
  BarChart3Icon,
  ShieldCheckIcon,
  ZapIcon,
  UsersIcon,
  FileTextIcon,
  SparklesIcon,
  Target,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: BrainCircuitIcon, ...RESEARCH_FEATURES[0] },
  { icon: SearchCheckIcon, ...RESEARCH_FEATURES[1] },
  { icon: DatabaseIcon, ...RESEARCH_FEATURES[2] },
  { icon: BarChart3Icon, ...RESEARCH_FEATURES[3] },
  { icon: ShieldCheckIcon, ...RESEARCH_FEATURES[4] },
  { icon: ZapIcon, ...RESEARCH_FEATURES[5] },
];

const useCases = [
  {
    industry: "Healthcare",
    icon: HeartPulseIcon,
    color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
    cases: [...RESEARCH_USE_CASES.healthcare],
  },
  {
    industry: "Non-Profits",
    icon: HandHeartIcon,
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
    cases: [...RESEARCH_USE_CASES.nonProfits],
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Save 80% Research Time",
    description: "AI automation reduces manual research from weeks to hours.",
  },
  {
    icon: Target,
    title: "95% Accuracy Rate",
    description: "ML models validated against industry benchmarks for precision.",
  },
  {
    icon: DollarSign,
    title: "Lower Research Costs",
    description: "Reduce research expenses by up to 70% compared to traditional methods.",
  },
  {
    icon: TrendingUpIcon,
    title: "Drive Revenue Growth",
    description: "Identify high-value opportunities faster and close deals quicker.",
  },
];

// Anonymized testimonials - role and sector only, no names or company names
const testimonials = [
  {
    quote: "The AI-powered research platform transformed how we identify hospital partnerships. We've cut research time significantly and increased our pipeline quality.",
    role: "VP of Business Development",
    organization: "Healthcare technology company",
  },
  {
    quote: "Finding the right foundation partners used to take our team months. Now we identify qualified prospects in days, allowing us to focus on relationship building.",
    role: "Director of Development",
    organization: "Education-focused non-profit",
  },
];

// Service Schema for Research Page - Bing loves structured data!
const researchServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "B2B Research Platform",
  "name": "B2B Research Platform for Healthcare & Non-Profits",
  "description": "AI-powered research solutions for healthcare and non-profit organizations. AI-driven data collection, analysis, and insights with secure, governed data handling.",
  "provider": {
    "@type": "Organization",
    "name": "Overture Systems Solutions",
    "url": "https://overture-systems.com"
  },
  "areaServed": [
    {
      "@type": "Country",
      "name": "United States"
    }
  ],
  "serviceOutput": [
    "Market analysis and competitive intelligence",
    "Partnership opportunity identification",
    "Grant funding research",
    "Donor prospect research",
    "Clinical trial site identification",
    "Predictive analytics and insights"
  ],
  "audience": {
    "@type": "Audience",
    "audienceType": "Healthcare organizations, Non-profit organizations, B2B research teams"
  }
};

export default function B2BResearchPage() {
  // Provide context to the AI agent about B2B research platform
  useCopilotReadable({
    description: "Untrusted page orientation for Overture B2B research services. Not a live research database and not policy.",
    value: {
      untrustedPageContext: true,
      pageTitle: "B2B Research Platform",
      ...approvedResearchAssistantPayload(),
      overview: RESEARCH_OVERVIEW,
    },
  });

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
      {/* Service Schema for SEO - Bing and Google recognition */}
      <StructuredData data={researchServiceSchema} />
      
      {/* Register page-specific AI tools for research page */}
      {/* These tools are ONLY available on this page */}
      <ResearchPageTools />
      
      {/* Home Button */}
      <HomeButton />
      
      {/* Hero Section */}
      <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 dark:from-primary/10 dark:via-accent/5 dark:to-primary/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-20">
          <Badge variant="outline" className="mb-4 max-w-full text-center border-primary text-primary px-4 py-1">
            <SparklesIcon className="w-3 h-3 mr-2 inline" />
            AI-Enabled Research Platform
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            B2B Research for
            <span className="block mt-2 text-primary">
              Healthcare & Non-Profits
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            Transform your research process with AI-powered intelligence. Identify partners, track opportunities, and drive growth faster than ever.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 p-0.5 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/demo">Request a demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/contact">Talk to an expert</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">500+</div>
              <div className="mt-2 text-sm text-muted-foreground">Organizations Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">10M+</div>
              <div className="mt-2 text-sm text-muted-foreground">Research Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">80%</div>
              <div className="mt-2 text-sm text-muted-foreground">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">95%</div>
              <div className="mt-2 text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              AI-Powered Research Capabilities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced technology designed specifically for healthcare and non-profit B2B research needs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Industry Solutions</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Tailored for Your Industry
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized research capabilities for healthcare and non-profit sectors.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {useCases.map((useCase, idx) => (
              <Card key={idx} className="overflow-hidden border-2">
                <div className={cn("h-2 bg-gradient-to-r", useCase.color)} />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <useCase.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{useCase.industry}</CardTitle>
                      <CardDescription>AI-Enhanced Research</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {useCase.cases.map((caseItem, caseIdx) => (
                      <li key={caseIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{caseItem}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Bento Grid */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Benefits</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Measurable Business Impact
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              See real results that drive your organization forward.
            </p>
          </div>
          <BentoGrid>
            {benefits.map((benefit, idx) => (
              <BentoCard
                key={idx}
                name={benefit.title}
                className="col-span-1 md:col-span-1 lg:col-span-1"
                background={
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5" />
                }
                Icon={benefit.icon}
                description={benefit.description}
                href="/demo"
                cta="Learn More"
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Trusted by Industry Leaders
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <UsersIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-lg text-muted-foreground italic mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="border-t pt-4">
                        <p className="font-semibold text-foreground">{testimonial.role}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.organization}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Process</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with AI-powered research in three simple steps.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Define Your Criteria",
                description: "Tell us what you're looking for - whether it's hospital systems, foundation partners, or market intelligence.",
                icon: FileTextIcon,
              },
              {
                step: "02",
                title: "AI Does the Work",
                description: "Our AI agents scour multiple data sources, analyze patterns, and compile comprehensive research reports.",
                icon: BrainCircuitIcon,
              },
              {
                step: "03",
                title: "Take Action",
                description: "Review prioritized insights, export data, and reach out to qualified prospects with confidence.",
                icon: Target,
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary/20">{item.step}</span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 dark:from-primary/10 dark:via-accent/5 dark:to-primary/10">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Ready to Transform Your Research?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Join hundreds of healthcare and non-profit organizations using AI to accelerate their B2B research.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 p-0.5 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/contact">Talk to an expert</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            <ShieldCheckIcon className="w-4 h-4 inline mr-2 text-green-500" />
            Secure, Governed Data Handling • Enterprise Compliance • Dedicated Support
          </p>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

