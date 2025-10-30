// app/research/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { HomeButton } from "@/components/ui/home-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
  {
    icon: BrainCircuitIcon,
    title: "AI-Powered Insights",
    description: "Leverage advanced machine learning to uncover hidden patterns and trends in healthcare and non-profit data.",
  },
  {
    icon: SearchCheckIcon,
    title: "Intelligent Research",
    description: "Automated data collection and analysis across multiple sources with AI-driven accuracy.",
  },
  {
    icon: DatabaseIcon,
    title: "Data Integration",
    description: "Seamlessly integrate disparate data sources for comprehensive B2B intelligence.",
  },
  {
    icon: BarChart3Icon,
    title: "Predictive Analytics",
    description: "Forecast market trends and identify opportunities before your competitors.",
  },
  {
    icon: ShieldCheckIcon,
    title: "HIPAA Compliant",
    description: "Enterprise-grade security with full HIPAA and data privacy compliance.",
  },
  {
    icon: ZapIcon,
    title: "Real-Time Updates",
    description: "Get instant alerts on market changes, competitor moves, and industry developments.",
  },
];

const useCases = [
  {
    industry: "Healthcare",
    icon: HeartPulseIcon,
    color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
    cases: [
      "Hospital systems market analysis and competitive intelligence",
      "Medical device and pharmaceutical partnership opportunities",
      "Healthcare provider network expansion research",
      "Clinical trial site identification and evaluation",
      "Payer and reimbursement landscape analysis",
    ],
  },
  {
    industry: "Non-Profits",
    icon: HandHeartIcon,
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
    cases: [
      "Grant funding opportunity identification and tracking",
      "Donor prospect research and wealth screening",
      "Foundation and corporate partnership discovery",
      "Impact measurement and program evaluation",
      "Non-profit landscape and competitive analysis",
    ],
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

const testimonials = [
  {
    quote: "The AI-powered research platform transformed how we identify hospital partnerships. We've cut research time by 75% and increased our pipeline quality significantly.",
    author: "Dr. Sarah Chen",
    role: "VP of Business Development",
    organization: "HealthTech Solutions",
  },
  {
    quote: "Finding the right foundation partners used to take our team months. Now we identify qualified prospects in days, allowing us to focus on relationship building.",
    author: "Michael Rodriguez",
    role: "Director of Development",
    organization: "Education First Foundation",
  },
];

export default function B2BResearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Home Button */}
      <HomeButton />
      
      {/* Hero Section */}
      <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 dark:from-primary/10 dark:via-accent/5 dark:to-primary/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-20">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1">
            <SparklesIcon className="w-3 h-3 mr-2 inline" />
            AI-Enabled Research Platform
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            B2B Research for
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Healthcare & Non-Profits
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            Transform your research process with AI-powered intelligence. Identify partners, track opportunities, and drive growth faster than ever.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/demo">Request Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/contact">Talk to an Expert</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 inline mr-2 text-green-500" />
            No credit card required • 14-day free trial
          </p>
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
                        <p className="font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
                      <span className="text-6xl font-bold text-primary/20">{item.step}</span>
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
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/demo">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            <ShieldCheckIcon className="w-4 h-4 inline mr-2 text-green-500" />
            HIPAA Compliant • Enterprise Compliance • Dedicated Support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2025 Overture Systems Solutions. All rights reserved.
      </footer>
    </div>
  );
}

