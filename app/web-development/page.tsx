// app/web-development/page.tsx
// NO "use client;" directive - this is a Server Component
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { WebDevPageTools } from "./WebDevPageTools";
import { StructuredData } from "@/components/structured-data";
import { WebDevCostEstimator } from "@/components/ai/web-dev-cost-estimator";
import {
  MonitorIcon,
  BrainCircuitIcon,
  FileTextIcon,
  CloudIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  SearchIcon,
  PenToolIcon,
  CodeIcon,
  RocketIcon,
  MessageSquareIcon,
  SparklesIcon,
  BarChart3Icon,
  CheckCircle2,
  ArrowRight,
  ClockIcon,
  GlobeIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI-Powered Web Development | Overture Systems Solutions",
  description:
    "Custom websites with built-in AI capabilities. From intelligent chatbots to predictive UX — every site we build is smarter from day one. Get your free consultation.",
  keywords: [
    "web development",
    "AI website",
    "custom website",
    "AI chatbot integration",
    "Next.js development",
    "enterprise web development",
  ],
  openGraph: {
    title: "AI-Powered Web Development | Overture Systems Solutions",
    description:
      "Custom websites with built-in AI capabilities. Every site we build is smarter from day one.",
    url: "https://new-oss.vercel.app/web-development",
    type: "website",
  },
};

const webDevServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI-Powered Web Development",
  name: "AI-Powered Web Development Services",
  description:
    "Custom website development with integrated AI capabilities including intelligent chatbots, predictive analytics, and smart content management. Built on modern frameworks with enterprise-grade security.",
  provider: {
    "@type": "Organization",
    name: "Overture Systems Solutions",
    url: "https://new-oss.vercel.app",
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  serviceOutput: [
    "Custom AI-powered websites",
    "AI chatbot integration",
    "Intelligent search systems",
    "Predictive UX optimization",
    "Enterprise web applications",
    "E-commerce platforms",
    "Content management systems",
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Small businesses, Mid-market companies, Enterprise organizations",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web Development Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter",
        description: "Professional website with AI chatbot",
        price: "8000",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Business",
        description: "Advanced website with full AI integration suite",
        price: "25000",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Enterprise",
        description: "Custom enterprise platform with dedicated AI systems",
        price: "75000",
        priceCurrency: "USD",
      },
    ],
  },
};

const pageContent = `
Overture Systems Solutions offers AI-Powered Web Development services.
We build custom websites with integrated AI capabilities — every site includes intelligent features from day one.

SERVICE PACKAGES:
- Starter ($8,000+): Up to 5 pages, AI chatbot, responsive design, basic SEO, CMS integration, 30 days support
- Business ($25,000+): Up to 15 pages, full AI suite (chatbot + intelligent search + content recommendations), custom design system, advanced SEO, analytics dashboard, CMS, 90 days support, performance optimization
- Enterprise ($75,000+): Unlimited pages, custom AI systems, dedicated design team, headless CMS architecture, API integrations, SSO/RBAC, 12 months support, SLA guarantees, compliance (SOC 2, HIPAA ready)

AI CAPABILITIES INCLUDED:
- AI Chatbot: Conversational assistant trained on your business content
- Intelligent Search: Semantic search across all site content
- Content Recommendations: Personalized content based on visitor behavior
- Predictive Analytics: AI-driven insights on user behavior and conversion
- Smart Forms: AI-powered form optimization and lead scoring

TECH STACK:
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- AI/ML: CopilotKit, LangChain, Custom LLM Integration
- CMS: Headless (Sanity, Contentful, Zoho, or custom)
- Hosting: Vercel, AWS, or Azure
- Database: PostgreSQL (Neon), MongoDB, or Redis
- Auth: NextAuth, Clerk, or custom SSO

PROCESS:
1. Discovery & Strategy (1-2 weeks): Requirements gathering, competitive analysis, AI opportunity mapping, technical architecture
2. Design & Prototyping (2-3 weeks): Wireframes, UI/UX design, design system creation, client review cycles
3. Development & AI Integration (4-8 weeks): Frontend build, AI feature development, CMS setup, testing, QA
4. Launch & Optimization (1-2 weeks): Deployment, performance tuning, SEO audit, training, handoff

RESULTS:
- 95% project on-time delivery rate
- 40% average increase in user engagement with AI features
- 3x faster content discovery with intelligent search
- 60% reduction in support tickets with AI chatbot
`;

const servicePackages = [
  {
    name: "Starter",
    price: "$8,000",
    priceNote: "starting at",
    description:
      "Perfect for small businesses and startups looking for a professional web presence with AI-powered engagement.",
    highlighted: false,
    features: [
      "Up to 5 pages",
      "AI chatbot integration",
      "Responsive design (mobile-first)",
      "Basic SEO optimization",
      "CMS integration",
      "Contact forms with lead capture",
      "Analytics setup",
      "30 days post-launch support",
    ],
    cta: "Get Started",
  },
  {
    name: "Business",
    price: "$25,000",
    priceNote: "starting at",
    description:
      "For growing companies that need a powerful digital platform with the full AI integration suite.",
    highlighted: true,
    features: [
      "Up to 15 pages",
      "Full AI suite (chatbot + search + recommendations)",
      "Custom design system",
      "Advanced SEO & structured data",
      "Analytics & conversion dashboard",
      "Headless CMS",
      "Performance optimization",
      "API integrations",
      "90 days post-launch support",
    ],
    cta: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$75,000",
    priceNote: "starting at",
    description:
      "Fully custom enterprise platform with dedicated AI systems, compliance, and ongoing partnership.",
    highlighted: false,
    features: [
      "Unlimited pages & features",
      "Custom AI systems & training",
      "Dedicated design team",
      "Headless architecture",
      "SSO / RBAC authentication",
      "API-first development",
      "SOC 2 & HIPAA ready",
      "SLA guarantees",
      "12 months dedicated support",
    ],
    cta: "Contact Sales",
  },
];

const techStack = [
  {
    category: "Frontend",
    icon: MonitorIcon,
    technologies: ["Next.js 15+", "React 19", "TypeScript", "Tailwind CSS"],
    description:
      "Modern, performant frontends built on the latest frameworks with server-side rendering and edge deployment.",
  },
  {
    category: "AI & Intelligence",
    icon: BrainCircuitIcon,
    technologies: ["CopilotKit", "LangChain", "Custom LLMs", "Vector Search"],
    description:
      "Native AI capabilities woven into every site — from conversational agents to intelligent content discovery.",
  },
  {
    category: "Content Management",
    icon: FileTextIcon,
    technologies: ["Sanity", "Contentful", "Zoho", "Strapi", "Custom CMS"],
    description:
      "Headless CMS architecture that gives your team full control over content without touching code.",
  },
  {
    category: "Infrastructure",
    icon: CloudIcon,
    technologies: ["Vercel", "AWS", "Azure", "Cloudflare"],
    description:
      "Enterprise-grade hosting with global CDN, automatic scaling, and 99.9% uptime guarantees.",
  },
  {
    category: "Data & Backend",
    icon: DatabaseIcon,
    technologies: ["PostgreSQL", "MongoDB", "Redis", "NeonDB"],
    description:
      "Robust data layer engineered for speed, reliability, and seamless integration with AI systems.",
  },
  {
    category: "Security & Auth",
    icon: ShieldCheckIcon,
    technologies: ["NextAuth", "Clerk", "SSO/SAML", "RBAC"],
    description:
      "Enterprise authentication and authorization with compliance-ready security configurations.",
  },
];

const processSteps = [
  {
    step: "01",
    icon: SearchIcon,
    title: "Discovery & Strategy",
    duration: "1-2 weeks",
    description:
      "We map your business goals, analyze competitors, identify AI opportunities, and architect the technical foundation.",
    deliverables: [
      "Requirements document",
      "Competitive analysis",
      "AI opportunity map",
      "Technical architecture",
    ],
  },
  {
    step: "02",
    icon: PenToolIcon,
    title: "Design & Prototyping",
    duration: "2-3 weeks",
    description:
      "High-fidelity wireframes and UI/UX design with your feedback baked into every iteration.",
    deliverables: [
      "Wireframes",
      "Design system",
      "Interactive prototype",
      "Brand guidelines",
    ],
  },
  {
    step: "03",
    icon: CodeIcon,
    title: "Development & AI Integration",
    duration: "4-8 weeks",
    description:
      "Full-stack development with AI features built natively — not bolted on. Continuous testing and QA throughout.",
    deliverables: [
      "Production website",
      "AI integrations",
      "CMS setup",
      "Test coverage",
    ],
  },
  {
    step: "04",
    icon: RocketIcon,
    title: "Launch & Optimization",
    duration: "1-2 weeks",
    description:
      "Deployment, performance tuning, SEO audit, team training, and a smooth handoff with ongoing support.",
    deliverables: [
      "Live deployment",
      "Performance report",
      "SEO audit",
      "Training sessions",
    ],
  },
];

const aiFeatures = [
  {
    icon: MessageSquareIcon,
    title: "AI Chatbot",
    description:
      "Conversational assistant trained on your business content. Handles customer questions 24/7 and routes qualified leads to your team.",
    stat: "60% fewer support tickets",
    color: "purple",
  },
  {
    icon: SearchIcon,
    title: "Intelligent Search",
    description:
      "Semantic search that understands intent, not just keywords. Visitors find what they need 3x faster.",
    stat: "3x faster content discovery",
    color: "cyan",
  },
  {
    icon: SparklesIcon,
    title: "Content Recommendations",
    description:
      "Personalized content suggestions based on visitor behavior and journey stage. Increases engagement and time on site.",
    stat: "40% more engagement",
    color: "orange",
  },
  {
    icon: BarChart3Icon,
    title: "Predictive Analytics",
    description:
      "AI-driven insights that predict user behavior, optimize conversion paths, and surface opportunities automatically.",
    stat: "Data-driven decisions",
    color: "green",
  },
];

const AI_COLOR_MAP: Record<string, string> = {
  purple: "bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
};

export default function WebDevelopmentPage() {
  return (
    <>
      <StructuredData data={webDevServiceSchema} />
      <PageAiContext content={pageContent} pageTitle="AI-Powered Web Development" />
      <WebDevPageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow opacity-50" />
          <div className="absolute bottom-20 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow opacity-50 animation-delay-1000" />

          <div className="relative z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-24">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline animate-pulse" />
              AI-Powered Web Development • Every Site Ships Smarter
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              Websites That Think,
              <span className="block mt-3 text-primary">
                Not Just Look Pretty
              </span>
            </h1>
            <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
              We build custom websites with AI baked in from day one — intelligent chatbots,
              semantic search, and predictive UX that drive real business results.
              <span className="block mt-3 font-medium text-foreground">
                Your site shouldn&apos;t just exist. It should work for you.
              </span>
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8 shadow-brand-lg hover:shadow-brand-xl transition-all duration-300" asChild>
                <Link href="/contact">
                  Get Your Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8 border-2" asChild>
                <Link href="#calculator">Estimate Your Cost</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Free consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">AI included in every package</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">95% on-time delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Modern tech stack</span>
              </div>
            </div>
          </div>
        </header>

        {/* Service Packages */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Packages</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                Web Development Packages
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Every package includes AI-powered features. Choose the tier that fits your ambition.
              </p>
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
              {servicePackages.map((pkg, idx) => (
                <Card
                  key={idx}
                  className={`border-2 hover:shadow-lg transition-all relative ${
                    pkg.highlighted
                      ? "border-primary shadow-brand-lg"
                      : "hover:border-primary/50"
                  }`}
                >
                  {pkg.highlighted && (
                    <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {pkg.priceNote}
                      </span>
                      <div className="text-4xl font-bold text-foreground mt-1">{pkg.price}</div>
                    </div>
                    <CardDescription className="text-base mt-3">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={pkg.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/contact">{pkg.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Estimator */}
        <section id="calculator" className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Cost Calculator</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                Estimate Your Project Cost
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Configure your project requirements and get an instant ballpark estimate.
              </p>
            </div>
            <WebDevCostEstimator />
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Tech Stack</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                Built on Modern, Battle-Tested Technology
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We use the best tools in the industry so your site is fast, secure, and future-proof.
              </p>
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {techStack.map((tech, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                        <tech.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{tech.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tech.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.technologies.map((t, tIdx) => (
                        <Badge key={tIdx} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Our Process</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                From Idea to Launch, Methodically
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A proven 4-step process that keeps your project on time and on budget.
              </p>
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Deliverables</p>
                        <ul className="space-y-1">
                          {step.deliverables.map((d, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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

        {/* AI Integration Showcase */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">AI-Powered</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                What Makes Our Websites Different
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Every site we build ships with intelligent features that work for your business around the clock.
              </p>
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {aiFeatures.map((feature, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={`mt-2 ${AI_COLOR_MAP[feature.color] ?? ""}`}
                        >
                          {feature.stat}
                        </Badge>
                      </div>
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

        {/* Final CTA */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              Free Consultation • No Obligation
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Ready to Build Something Intelligent?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Let&apos;s talk about your project. We&apos;ll map out the AI opportunities, scope
              the work, and give you a clear proposal — no strings attached.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8 shadow-brand-xl hover:shadow-brand-xl transition-all duration-300" asChild>
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8 border-2" asChild>
                <Link href="/contact">Schedule Consultation</Link>
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
                <span className="font-medium">AI bundled free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Flexible engagement</span>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter variant="full" />
      </div>
    </>
  );
}
