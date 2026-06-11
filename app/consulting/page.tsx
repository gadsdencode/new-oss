// app/consulting/page.tsx
// NO "use client;" directive - this is now a Server Component!
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { ConsultingPageTools } from "./ConsultingPageTools";
import { StructuredData } from "@/components/structured-data";
import {
  BrainCircuitIcon,
  RocketIcon,
  TrendingUpIcon,
  TargetIcon,
  LightbulbIcon,
  LineChartIcon,
  ShieldCheckIcon,
  CheckCircle2,
  ArrowRight,
  SparklesIcon,
  LayersIcon,
  Settings2Icon,
  GraduationCapIcon,
  ClockIcon,
  AwardIcon,
  HeartPulseIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  FactoryIcon,
  LaptopIcon,
  HeartIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Strategy and Implementation Consulting | Overture Systems Solutions",
  description:
    "End-to-end AI consulting from roadmap to production. Strategy, implementation, operations, training, and governance for enterprise teams.",
};

const consultingServices = [
  {
    icon: BrainCircuitIcon,
    title: "AI Strategy & Roadmap",
    description: "Develop comprehensive AI strategies aligned with your business objectives and create actionable implementation roadmaps.",
    features: ["Strategic planning", "ROI analysis", "Technology assessment", "Risk evaluation"],
  },
  {
    icon: LayersIcon,
    title: "AI Implementation",
    description: "End-to-end AI solution implementation from proof-of-concept to production deployment with ongoing support.",
    features: ["Custom AI solutions", "System integration", "Performance optimization", "Quality assurance"],
  },
  {
    icon: Settings2Icon,
    title: "AI Operations & Optimization",
    description: "Optimize existing AI systems for better performance, cost-efficiency, and scalability in production environments.",
    features: ["Model optimization", "Cost reduction", "Performance tuning", "Infrastructure design"],
  },
  {
    icon: GraduationCapIcon,
    title: "AI Training & Enablement",
    description: "Empower your teams with AI knowledge through customized training programs and workshops.",
    features: ["Team training", "Best practices", "Hands-on workshops", "Ongoing mentorship"],
  },
  {
    icon: ShieldCheckIcon,
    title: "AI Governance & Ethics",
    description: "Establish responsible AI practices with governance frameworks, compliance strategies, and ethical guidelines.",
    features: ["Policy development", "Compliance frameworks", "Ethics assessment", "Risk management"],
  },
  {
    icon: LineChartIcon,
    title: "AI Analytics & Insights",
    description: "Transform data into actionable insights using advanced AI analytics and predictive modeling techniques.",
    features: ["Predictive analytics", "Data strategy", "Business intelligence", "Performance metrics"],
  },
];

const industryExpertise = [
  {
    name: "Healthcare",
    description: "Secure, governed AI solutions for clinical operations, patient care, and research.",
    icon: HeartPulseIcon,
  },
  {
    name: "Financial Services",
    description: "Secure AI for fraud detection, risk assessment, and automated trading.",
    icon: DollarSignIcon,
  },
  {
    name: "Retail & E-commerce",
    description: "Personalization engines, demand forecasting, and inventory optimization.",
    icon: ShoppingCartIcon,
  },
  {
    name: "Manufacturing",
    description: "Predictive maintenance, quality control, and supply chain optimization.",
    icon: FactoryIcon,
  },
  {
    name: "Technology",
    description: "MLOps, AI product development, and scalable AI infrastructure.",
    icon: LaptopIcon,
  },
  {
    name: "Non-Profits",
    description: "Cost-effective AI for donor management, impact analysis, and operations.",
    icon: HeartIcon,
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & Assessment",
    description: "Deep dive into your business challenges, existing infrastructure, and AI readiness. We identify opportunities and define success metrics.",
    icon: TargetIcon,
    duration: "1-2 weeks",
  },
  {
    step: "02",
    title: "Strategy & Planning",
    description: "Develop tailored AI strategy with detailed roadmap, resource requirements, and ROI projections based on your unique needs.",
    icon: LightbulbIcon,
    duration: "2-3 weeks",
  },
  {
    step: "03",
    title: "Implementation & Integration",
    description: "Execute the AI strategy with agile development, rigorous testing, and seamless integration into your existing systems.",
    icon: RocketIcon,
    duration: "8-16 weeks",
  },
  {
    step: "04",
    title: "Optimization & Support",
    description: "Continuous monitoring, performance optimization, and ongoing support to ensure sustained value and improvement.",
    icon: TrendingUpIcon,
    duration: "Ongoing",
  },
];

const benefits: {
  icon: React.ElementType;
  stat: string;
  label: string;
  description: string;
  href?: string;
}[] = [
  {
    icon: AwardIcon,
    stat: "20+",
    label: "Years in Business",
    description: "Founded in 2005, delivering systems long before the AI boom",
  },
  {
    icon: BrainCircuitIcon,
    stat: "Patent-Pending",
    label: "ICDU Evaluation Pipeline",
    description: "Our proprietary method for evaluating AI quality and intent",
    href: "https://icdu.ai",
  },
  {
    icon: TargetIcon,
    stat: "Fixed-Scope",
    label: "Entry Engagements",
    description: "Defined deliverables and timelines from the first engagement",
  },
  {
    icon: LayersIcon,
    stat: "End-to-End",
    label: "Strategy Through Production",
    description: "One team from roadmap to deployed, governed AI",
  },
];

// Illustrative engagement scenarios - composites, not named clients
const engagementScenarios = [
  {
    title: "Healthcare Operations",
    icon: HeartPulseIcon,
    body: "A regional healthcare organization needed to move from scattered AI pilots to a governed program. We assessed readiness across the six CoE pillars, prioritized two high-impact workflows, and stood up governance so the team could expand with confidence.",
  },
  {
    title: "Financial Services",
    icon: DollarSignIcon,
    body: "A financial services firm wanted AI in production without compliance surprises. We paired implementation with a governance framework from day one: model documentation, risk review, and monitoring built into the delivery itself.",
  },
  {
    title: "Enterprise Enablement",
    icon: GraduationCapIcon,
    body: "An enterprise analytics team needed to own its AI capability rather than rent it. We delivered hands-on training alongside the build, so the internal team could maintain and extend the system independently after handoff.",
  },
];

// Define page content for AI context
const pageContent = `
AI Strategy & Consulting - Enterprise AI consulting services from strategy development to production deployment. Partner with AI experts who combine deep technical expertise with business acumen.

Services:
1. AI Strategy & Roadmap - Develop comprehensive AI strategies aligned with your business objectives and create actionable implementation roadmaps. Features: Strategic planning, ROI analysis, Technology assessment, Risk evaluation.

2. AI Implementation - End-to-end AI solution implementation from proof-of-concept to production deployment with ongoing support. Features: Custom AI solutions, System integration, Performance optimization, Quality assurance.

3. AI Operations & Optimization - Optimize existing AI systems for better performance, cost-efficiency, and scalability in production environments. Features: Model optimization, Cost reduction, Performance tuning, Infrastructure design.

4. AI Training & Enablement - Empower your teams with AI knowledge through customized training programs and workshops. Features: Team training, Best practices, Hands-on workshops, Ongoing mentorship.

5. AI Governance & Ethics - Establish responsible AI practices with governance frameworks, compliance strategies, and ethical guidelines. Features: Policy development, Compliance frameworks, Ethics assessment, Risk management.

6. AI Analytics & Insights - Transform data into actionable insights using advanced AI analytics and predictive modeling techniques. Features: Predictive analytics, Data strategy, Business intelligence, Performance metrics.

Industries: Healthcare (secure, governed AI), Financial Services (fraud detection, risk assessment), Retail & E-commerce (personalization, demand forecasting), Manufacturing (predictive maintenance, quality control), Technology (MLOps, AI product development), Non-Profits (donor management, impact analysis).

Process: Discovery & Assessment (1-2 weeks), Strategy & Planning (2-3 weeks), Implementation & Integration (8-16 weeks), Optimization & Support (Ongoing).

What you can verify before signing: 20+ years in business (founded 2005), the patent-pending ICDU evaluation pipeline (https://icdu.ai), fixed-scope entry engagements with defined deliverables and timelines, and end-to-end delivery from strategy through production.

Contact: Free consultation available at /contact page.
`;

// Service Schema for Consulting Page - Bing loves structured data!
const consultingServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "AI Strategy & Implementation Consulting",
  "name": "AI Strategy & Implementation Consulting",
  "description": "End-to-end AI consulting services from strategy development to production deployment. We help enterprises identify opportunities, build roadmaps, and deliver AI systems with governance built in.",
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
    "Strategic AI roadmaps",
    "Custom AI solutions",
    "ROI analysis and projections",
    "AI implementation and integration",
    "Model optimization and tuning",
    "Team training and enablement",
    "AI governance frameworks"
  ],
  "audience": {
    "@type": "Audience",
    "audienceType": "Enterprise organizations, Technology companies"
  },
  "offers": {
    "@type": "Offer",
    "description": "Free 30-minute consultation available",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function AIConsultingPage() {
  return (
    <>
      {/* Service Schema for SEO - Bing and Google recognition */}
      <StructuredData data={consultingServiceSchema} />
      
      {/* AI Context - Provides page-specific information to the AI */}
      {/* Note: Global AI tools (consultation form, services, status) are available from the layout */}
      <PageAiContext 
        content={pageContent}
        pageTitle="AI Strategy & Consulting"
      />
      
      {/* Register page-specific AI tools for consulting page */}
      {/* These tools are ONLY available on this page */}
      <ConsultingPageTools />
      
      {/* Main page content - Server-rendered for optimal performance! */}
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        {/* Home Button */}
        <HomeButton />
      
      {/* Premium Hero Section - Aspirational & Enterprise-Focused */}
      <header className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow opacity-50" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow opacity-50 animation-delay-1000" />
        
        <div className="relative z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-24">
          <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
            <SparklesIcon className="w-3 h-3 mr-2 inline animate-pulse" />
            Enterprise AI Consulting • Founded 2005
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Accelerate Enterprise Growth
            <span className="block mt-3 text-primary">
              With Strategic AI Consulting
            </span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
            Partner with AI experts who combine deep technical expertise with business acumen. We transform complexity into competitive advantage.
            <span className="block mt-3 font-medium text-foreground">From strategy to production. From vision to measurable ROI.</span>
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8 shadow-brand-lg hover:shadow-brand-xl transition-all duration-300" asChild>
              <Link href="/contact">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8 border-2" asChild>
              <Link href="#services">View Services</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Custom strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Fixed-scope entry points</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Defined timelines</span>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Stats */}
      <section className="py-16 border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Built on Two Decades of Delivery
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              What you can verify before you ever sign
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {benefits.map((benefit, idx) => {
              const card = (
                <>
                  <div className="flex justify-center mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground sm:text-3xl">{benefit.stat}</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{benefit.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{benefit.description}</div>
                </>
              );

              return benefit.href ? (
                <a
                  key={idx}
                  href={benefit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {card}
                </a>
              ) : (
                <div key={idx} className="text-center">
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Consulting Services */}
      <section id="services" className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Services</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Comprehensive AI Consulting Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              End-to-end AI consulting services designed to accelerate your AI journey and maximize business value.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {consultingServices.map((service, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <service.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIdx) => (
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

      {/* Our Process */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Process</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Structured Approach to Success
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our proven methodology ensures successful AI implementation from concept to production.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
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
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Industry Expertise</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Deep Industry Knowledge
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized AI consulting across multiple industries with proven results.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industryExpertise.map((industry, idx) => {
              const IconComponent = industry.icon;
              return (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{industry.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{industry.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Representative engagement scenarios (illustrative composites, not testimonials) */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Representative Scenarios</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              How Engagements Typically Unfold
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-2xl mx-auto">
              The scenarios below are illustrative composites that reflect common engagement patterns.
              They do not describe specific named clients.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {engagementScenarios.map((scenario, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <scenario.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{scenario.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground">{scenario.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
            <SparklesIcon className="w-3 h-3 mr-2 inline" />
            Free Consultation • No Obligation
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Ready to Start Your AI Journey?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Schedule a free consultation with our AI experts. Let&apos;s discuss your challenges, explore opportunities, and create a roadmap to measurable business impact.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8 shadow-brand-xl hover:shadow-brand-xl transition-all duration-300" asChild>
              <Link href="/contact">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8 border-2" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">No obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Custom proposals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Flexible engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </section>

        {/* Footer */}
        <SiteFooter variant="full" />
      </div>
    </>
  );
}

