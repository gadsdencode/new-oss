// page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { BotIcon, BrainCircuitIcon, ChartBarIcon, ZapIcon, ShieldCheckIcon, Users2Icon, SearchCheckIcon, HeartPulseIcon, MailIcon } from "lucide-react";

const ServiceCard = ({
  name,
  description,
  category,
}: {
  name: string
  description: string
  category: string
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "transition-colors"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        <blockquote className="text-xs text-muted-foreground">{description}</blockquote>
      </div>
    </figure>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Hero Section */}
      <header className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10">
        <div className="absolute inset-0 ai-gradient opacity-50" />
        <div className="z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <Badge variant="outline" className="mb-3 border-primary text-primary">Beta Launch</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl whitespace-nowrap">
            Overture Systems Solutions
          </h1>
          <p className="mt-4 text-lg sm:text-xl leading-7 text-muted-foreground">
            AI-powered solutions for your business.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Bento Grid Section */}
      <section className="pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <BentoGrid>
            <BentoCard 
              name="Uterpi" 
              className="col-span-1 md:col-span-2 lg:col-span-2" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10" />
              } 
              Icon={BrainCircuitIcon} 
              description="Advanced AI platform for modern businesses and workflows." 
              href="https://uterpi.com" 
              cta="Visit Uterpi" 
              title="Uterpi - AI-powered platform for modern businesses and workflows."
            />
            <BentoCard 
              name="AI Consulting" 
              className="col-span-1 md:col-span-2 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10" />
              } 
              Icon={ChartBarIcon} 
              description="Expert AI strategy and implementation consulting for your business." 
              href="/consulting" 
              cta="Get Consultation" 
            />
            <BentoCard 
              name="Contact Us" 
              className="col-span-1 md:col-span-1 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-500/10" />
              } 
              Icon={MailIcon} 
              description="Get in touch with our team for personalized support and solutions." 
              href="/contact" 
              cta="Get In Touch" 
            />
            <BentoCard 
              name="Advanced AI Models" 
              className="col-span-1 md:col-span-1 lg:col-span-2" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10" />
              } 
              Icon={BrainCircuitIcon} 
              description="Custom AI models tailored to your specific business needs." 
              href="/features/ai-models" 
              cta="Discover AI" 
            />
            <BentoCard 
              name="Enterprise Compliance" 
              className="col-span-1 md:col-span-1 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10" />
              } 
              Icon={ShieldCheckIcon} 
              description="Enterprise-level compliance with SOC 2." 
              href="/compliance" 
              cta="View Security" 
            />
            <BentoCard 
              name="Team Collaboration" 
              className="col-span-1 md:col-span-2 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 dark:from-indigo-500/10 dark:to-blue-500/10" />
              } 
              Icon={Users2Icon} 
              description="Work seamlessly with your team in real-time." 
              href="/features/collaboration" 
              cta="Get Started" 
            />
            <BentoCard 
              name="B2B Research" 
              className="col-span-1 md:col-span-2 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 dark:from-rose-500/10 dark:to-pink-500/10" />
              } 
              Icon={SearchCheckIcon} 
              description="AI-powered research platform for healthcare and non-profit organizations." 
              href="/research" 
              cta="Explore Research" 
            />
          </BentoGrid>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-muted/50 dark:bg-muted/20">
        <div className="w-full">
          <div className="px-6">
            <h2 className="text-center text-4xl font-semibold tracking-tight text-foreground">
              Our Comprehensive Services
            </h2>
            <p className="mt-4 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI consulting to research platforms, we provide end-to-end solutions to transform your business.
            </p>
            <Separator className="my-12" />
          </div>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:30s]">
              <ServiceCard name="AI Consulting" description="Expert AI strategy, implementation, and optimization consulting for your business." category="Consulting" />
              <ServiceCard name="B2B Research" description="AI-powered research platform for healthcare and non-profit organizations." category="Research" />
              <ServiceCard name="AI Strategy & Roadmap" description="Comprehensive AI strategies aligned with your business objectives." category="Strategy" />
              <ServiceCard name="AI Implementation" description="End-to-end AI solution implementation from proof-of-concept to production." category="Implementation" />
              <ServiceCard name="Advanced AI Models" description="Custom AI models tailored to your specific business needs." category="AI Models" />
              <ServiceCard name="AI Operations & Optimization" description="Optimize AI systems for better performance and cost-efficiency." category="Operations" />
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:30s] mt-4">
              <ServiceCard name="AI Training & Enablement" description="Empower your teams with AI knowledge through customized training." category="Training" />
              <ServiceCard name="AI Governance & Ethics" description="Establish responsible AI practices with governance frameworks." category="Governance" />
              <ServiceCard name="AI Analytics & Insights" description="Transform data into actionable insights using advanced AI analytics." category="Analytics" />
              <ServiceCard name="Enterprise Compliance" description="Enterprise-level compliance with SOC 2 and security standards." category="Compliance" />
              <ServiceCard name="Team Collaboration" description="Work seamlessly with your team in real-time collaboration." category="Collaboration" />
              <ServiceCard name="Uterpi Platform" description="Advanced AI platform for modern businesses and workflows." category="Platform" />
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-muted/50 dark:from-muted/20"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-muted/50 dark:from-muted/20"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-4xl font-semibold tracking-tight text-foreground">
            Ready to Revolutionize Your Business?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of innovators using our AI-powered solutions.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/contact">Get Started Now</Link>
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