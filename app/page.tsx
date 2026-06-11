// page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { HomeButton } from "@/components/ui/home-button";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCopilotReadable } from "@copilotkit/react-core";
import { 
  BrainCircuitIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  SearchCheckIcon, 
  CheckCircle2,
  ArrowRight,
  SparklesIcon,
  AwardIcon,
  RocketIcon,
  TargetIcon,
  ZapIcon,
  LayersIcon,
  GlobeIcon,
  LockIcon,
} from "lucide-react";

// Verifiable trust stats - claims a prospect can confirm before signing
const trustStats: {
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

export default function Home() {
  // Provide context to the AI agent about this page
  useCopilotReadable({
    description: "Homepage of Overture Systems Solutions",
    value: {
      companyName: "Overture Systems Solutions",
      tagline: "Transform Your Business With AI Solutions",
      description: "Strategic AI consulting, implementation, and platforms built for enterprises and innovative organizations. Founded in 2005 and home of the patent-pending ICDU evaluation pipeline.",
      mainServices: [
        {
          name: "AI Strategy & Implementation",
          description: "End-to-end AI consulting from strategy development to production deployment. We help identify opportunities, build roadmaps, and deliver measurable results.",
          link: "/consulting",
          features: ["Strategic Planning", "Custom Solutions", "ROI Optimization"]
        },
        {
          name: "AI Center of Excellence",
          description: "End-to-end advisory and build services for establishing a centralized AI Center of Excellence across an enterprise or portfolio.",
          link: "/ai-center-of-excellence",
          features: ["Strategy & Roadmap", "Team & Governance", "Scalable Infrastructure"]
        },
        {
          name: "B2B Research Platform",
          description: "AI-powered research solutions for healthcare and non-profit organizations with secure, governed data handling and impact measurement.",
          link: "/research",
          features: ["Secure, Governed Data Handling", "Advanced Analytics", "Impact Measurement"]
        },
        {
          name: "Uterpi",
          description: "Modern AI platform for businesses. Streamline workflows, automate processes, and unlock productivity with cutting-edge AI technology.",
          link: "https://uterpi.com",
          features: ["Advanced AI Models", "Team Collaboration", "Enterprise Security"]
        },
        {
          name: "AI-Powered Web Development",
          description: "Custom websites with built-in AI capabilities. Intelligent chatbots, semantic search, and predictive UX — bundled into every build.",
          link: "/web-development",
          features: ["AI Integration", "Custom Design", "Performance Optimization"]
        }
      ],
      keyFacts: {
        yearsInBusiness: "20+ years - founded in 2005, delivering systems long before the AI boom",
        icduPipeline: "Patent-pending ICDU evaluation pipeline - our proprietary method for evaluating AI quality and intent (https://icdu.ai)",
        engagementModel: "Fixed-scope entry engagements with defined deliverables and timelines",
        coverage: "End-to-end delivery - one team from roadmap to deployed, governed AI"
      },
      security: ["Enterprise-Grade Security", "Privacy-First Engineering"],
      contactInfo: {
        freeConsultation: true,
        contactPage: "/contact"
      }
    }
  });

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
      <HomeButton priority />
      {/* Premium Hero Section - Enterprise Value Proposition */}
      <header className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow opacity-50" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow opacity-50 animation-delay-1000" />
        
        <div className="relative z-10 mx-auto max-w-7xl text-center px-4 sm:px-6 lg:px-8 py-20">
          {/* Brand mark — transparent icon crowning the headline, glow ties it to the orb aesthetic */}
          <div className="relative mx-auto mb-7 w-fit sm:mb-8">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl sm:h-44 sm:w-44"
            />
            <BrandLogo
              size="xl"
              priority
              className="relative h-auto w-24 drop-shadow-[0_6px_24px_rgba(11,124,255,0.3)] sm:w-28 md:w-32"
            />
          </div>

          {/* Hero Headline - Clear Value Proposition */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Transform Your Business
            <span className="block mt-3 text-primary">
              With AI Solutions
            </span>
          </h1>
          
          {/* Clear Supporting Copy */}
          <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
            Strategic AI consulting, implementation, and platforms built for enterprises and innovative organizations. 
            <span className="block mt-2 font-medium">We deliver measurable results, not promises.</span>
          </p>
          
          {/* Clear CTAs - stack on mobile, 2-up on small screens, single row on large */}
          <div className="mt-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:px-0 lg:flex lg:flex-nowrap lg:items-center lg:justify-center">
            <Button size="default" className="h-11 w-full justify-center px-4 text-sm shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 lg:w-auto lg:shrink-0" asChild>
              <Link href="/ai">
                Start Your Custom AI Project
                <BrainCircuitIcon className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button size="default" className="h-11 w-full justify-center px-4 text-sm shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 lg:w-auto lg:shrink-0" asChild>
              <Link href="/ai-center-of-excellence">
                AI Center of Excellence
                <TargetIcon className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button size="default" className="h-11 w-full justify-center px-4 text-sm shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 lg:w-auto lg:shrink-0" asChild>
              <Link href="/web-development">
                Start Your Web Project
                <GlobeIcon className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button size="default" className="h-11 w-full justify-center px-4 text-sm shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 lg:w-auto lg:shrink-0" asChild>
              <Link href="/contact">
                Schedule an Executive Briefing
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Founded 2005</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Patent-Pending ICDU Evaluation</span>
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
              Built on Two Decades of Delivery
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              What you can verify before you ever sign
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {trustStats.map((stat, idx) => {
              const card = (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                      <stat.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.stat}</div>
                  <div className="mt-2 text-base font-semibold text-foreground">{stat.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.description}</div>
                </>
              );

              return stat.href ? (
                <a
                  key={idx}
                  href={stat.href}
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

      {/* Core Solutions - Focused BentoGrid (3 key offerings) */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Solutions</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              The Right Solutions for Your Business
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Six core offerings designed to transform your enterprise with AI
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
              description="AI research solutions for healthcare and non-profits with secure, governed data handling. Powerful and purpose-built." 
              href="/research" 
              cta="Learn More" 
            />
            <BentoCard 
              name="AI Center of Excellence" 
              className="col-span-1 md:col-span-2 lg:col-span-2" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/10" />
              } 
              Icon={TargetIcon} 
              description="Stand up a centralized AI capability - strategy, talent, governance, and infrastructure - that turns scattered experiments into a repeatable, scalable function." 
              href="/ai-center-of-excellence" 
              cta="Explore the CoE" 
            />
            <BentoCard 
              name="Uterpi" 
              className="col-span-1 md:col-span-1 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-secondary/10 to-secondary/5" />
              } 
              Icon={LayersIcon} 
              description="Modern AI platform for businesses. Advanced models, team collaboration, and enterprise security." 
              href="https://uterpi.com" 
              cta="Visit Uterpi" 
            />
            <BentoCard 
              name="AI-Powered Web Development" 
              className="col-span-1 md:col-span-1 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-primary/10 to-accent/5" />
              } 
              Icon={GlobeIcon} 
              description="Custom websites with built-in AI — chatbots, semantic search, and predictive UX in every build." 
              href="/web-development" 
              cta="Explore Web Dev" 
            />
            <BentoCard 
              name="Enterprise Compliance" 
              className="col-span-1 md:col-span-2 lg:col-span-2" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/5" />
              } 
              Icon={ShieldCheckIcon} 
              description="Enterprise-grade security, data protection, and AI governance built into every solution." 
              href="/compliance" 
              cta="View Security" 
            />
          </BentoGrid>
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
              <p className="text-muted-foreground">Enterprise-grade security and privacy-first engineering</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <ZapIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Longevity</h3>
              <p className="text-muted-foreground">Two decades in business and a methodology refined across hundreds of engagements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Strong, Clear Call-to-Action */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
            <SparklesIcon className="w-3 h-3 mr-2 inline" />
            Free Consultation Available
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Schedule a free consultation with our AI experts. Let's discuss how we can help you achieve measurable results and competitive advantage through AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8 shadow-brand-xl hover:shadow-brand-xl transition-all duration-300" asChild>
              <Link href="/contact">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8 border-2" asChild>
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
      <SiteFooter variant="full" />
    </div>
  );
}