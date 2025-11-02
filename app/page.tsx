// page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  BrainCircuitIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  Users2Icon, 
  SearchCheckIcon, 
  MailIcon,
  CheckCircle2,
  ArrowRight,
  SparklesIcon,
  TrendingUpIcon,
  ClockIcon,
  AwardIcon,
  RocketIcon,
  TargetIcon,
  ZapIcon,
  LayersIcon,
  GlobeIcon,
  LockIcon,
} from "lucide-react";

// Trust Stats for Social Proof
const trustStats = [
  {
    icon: TrendingUpIcon,
    stat: "3.5x",
    label: "Average ROI",
    description: "Return on AI investments within 18 months",
  },
  {
    icon: ClockIcon,
    stat: "60%",
    label: "Time Savings",
    description: "Operational efficiency improvement",
  },
  {
    icon: AwardIcon,
    stat: "95%",
    label: "Success Rate",
    description: "Projects with measurable impact",
  },
  {
    icon: Users2Icon,
    stat: "200+",
    label: "Clients Served",
    description: "Organizations transformed",
  },
];

// Core Services (Curated - replaces cheap marquee)
const coreServices = [
  {
    icon: BrainCircuitIcon,
    title: "AI Strategy & Implementation",
    description: "End-to-end AI consulting from strategy development to production deployment. We help you identify opportunities, build roadmaps, and deliver measurable results.",
    href: "/consulting",
    features: ["Strategic Planning", "Custom Solutions", "ROI Optimization"],
  },
  {
    icon: SearchCheckIcon,
    title: "B2B Research Platform",
    description: "AI-powered research solutions for healthcare and non-profit organizations. HIPAA-compliant, secure, and designed for impact.",
    href: "/research",
    features: ["HIPAA Compliant", "Advanced Analytics", "Impact Measurement"],
  },
  {
    icon: LayersIcon,
    title: "Enterprise AI Platform - Uterpi",
    description: "Modern AI platform for businesses. Streamline workflows, automate processes, and unlock productivity with cutting-edge AI technology.",
    href: "https://uterpi.com",
    features: ["Advanced AI Models", "Team Collaboration", "SOC 2 Compliant"],
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Premium Hero Section - Enterprise Value Proposition */}
      <header className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow opacity-50" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow opacity-50 animation-delay-1000" />
        
        <div className="relative z-10 mx-auto max-w-7xl text-center px-4 sm:px-6 lg:px-8 py-20">
          <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5 shadow-brand">
            <SparklesIcon className="w-3 h-3 mr-2 inline animate-pulse" />
            Next-Generation AI Solutions for Enterprise
          </Badge>
          
          {/* Hero Headline - Clear Value Proposition */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Transform Your Business
            <span className="block mt-3 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              With Enterprise AI
            </span>
          </h1>
          
          {/* Clear Supporting Copy */}
          <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
            Strategic AI consulting, implementation, and platforms built for Fortune 500 companies and innovative enterprises. 
            <span className="block mt-2 font-medium">We deliver measurable results, not promises.</span>
          </p>
          
          {/* Clear CTAs - Primary & Secondary */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8 shadow-brand-lg hover:shadow-brand-xl transition-all duration-300" asChild>
              <Link href="/contact">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-2" asChild>
              <Link href="/consulting">Explore Services</Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>200+ Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Free Consultation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Stats Section - Social Proof First */}
      <section className="py-16 border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Proven Results That Drive Growth
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Our track record speaks for itself
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {trustStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.stat}</div>
                <div className="mt-2 text-base font-semibold text-foreground">{stat.label}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Solutions - Focused BentoGrid (3 key offerings) */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Solutions</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              The Right Solution for Your Business
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three core offerings designed to transform your enterprise with AI
            </p>
          </div>
          <BentoGrid className="auto-rows-[28rem]">
            <BentoCard 
              name="AI Strategy & Implementation" 
              className="col-span-1 md:col-span-2 lg:col-span-2" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/5" />
              } 
              Icon={ChartBarIcon} 
              description="Expert AI consulting from strategy development to production deployment. We deliver measurable ROI and transform your operations." 
              href="/consulting" 
              cta="Explore Consulting" 
            />
            <BentoCard 
              name="B2B Research Platform" 
              className="col-span-1 md:col-span-2 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5" />
              } 
              Icon={SearchCheckIcon} 
              description="HIPAA-compliant AI research solutions for healthcare and non-profits. Secure, powerful, and purpose-built." 
              href="/research" 
              cta="Learn More" 
            />
            <BentoCard 
              name="Enterprise AI Platform" 
              className="col-span-1 md:col-span-1 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-secondary/10 to-secondary/5" />
              } 
              Icon={LayersIcon} 
              description="Uterpi - Modern AI platform for businesses. Advanced models, team collaboration, and SOC 2 compliance." 
              href="https://uterpi.com" 
              cta="Visit Uterpi" 
            />
            <BentoCard 
              name="Enterprise Compliance" 
              className="col-span-1 md:col-span-2 lg:col-span-2" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-500/10 to-green-500/5" />
              } 
              Icon={ShieldCheckIcon} 
              description="SOC 2 Type II certified. Enterprise-grade security, compliance, and data protection built into every solution." 
              href="/compliance" 
              cta="View Security" 
            />
          </BentoGrid>
        </div>
      </section>

      {/* Featured Services - Static, Curated (Replaces Cheap Marquee) */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">What We Offer</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Comprehensive AI Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From strategy to deployment, we provide end-to-end AI solutions tailored to your enterprise needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coreServices.map((service, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-brand-lg group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary/20 group-hover:ring-primary/30 group-hover:shadow-glow transition-all duration-300">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full shadow-brand hover:shadow-brand-lg transition-all">
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Why Leading Enterprises Choose Us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine deep technical expertise with business acumen to deliver AI solutions that drive real results
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <RocketIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapid Deployment</h3>
              <p className="text-muted-foreground">From strategy to production in weeks, not years</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <TargetIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Business-Focused</h3>
              <p className="text-muted-foreground">Technology aligned with your strategic goals</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <LockIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">SOC 2 certified with enterprise-grade compliance</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <ZapIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-muted-foreground">95% success rate with measurable ROI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Strong, Clear Call-to-Action */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5 shadow-brand">
            <SparklesIcon className="w-3 h-3 mr-2 inline" />
            Free Consultation Available
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Ready to Transform Your Enterprise?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Schedule a free consultation with our AI experts. Let's discuss how we can help you achieve measurable results and competitive advantage through AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8 shadow-brand-xl hover:shadow-brand-xl transition-all duration-300" asChild>
              <Link href="/contact">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-2" asChild>
              <Link href="/consulting">View All Services</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>No obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Custom proposals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Flexible engagement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground bg-muted/20">
        <p>© 2025 Overture Systems Solutions. All rights reserved.</p>
        <p className="mt-2 text-xs">
          SOC 2 Type II Certified • HIPAA Compliant • Enterprise-Grade Security
        </p>
      </footer>
    </div>
  );
}