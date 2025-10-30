// page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { BotIcon, BrainCircuitIcon, ChartBarIcon, ZapIcon, ShieldCheckIcon, Users2Icon, SearchCheckIcon, HeartPulseIcon } from "lucide-react";

const TechCard = ({
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
        <div className="z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-16">
          <Badge variant="outline" className="mb-3 border-primary text-primary">Beta Launch</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl whitespace-nowrap">
            Overture Systems Solutions
          </h1>
          <p className="mt-4 text-lg sm:text-xl leading-7 text-muted-foreground">
            AI-powered solutions for your business.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Bento Grid Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
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
              name="Real-time Analytics" 
              className="col-span-1 md:col-span-2 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10" />
              } 
              Icon={ChartBarIcon} 
              description="Gain deep insights from your data in real-time." 
              href="/features/analytics" 
              cta="Explore" 
            />
            <BentoCard 
              name="Lightning Fast" 
              className="col-span-1 md:col-span-1 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-500/10" />
              } 
              Icon={ZapIcon} 
              description="Optimized performance for enterprise-scale applications." 
              href="/features/performance" 
              cta="See Speed" 
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
              name="Enterprise Security" 
              className="col-span-1 md:col-span-1 lg:col-span-1" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10" />
              } 
              Icon={ShieldCheckIcon} 
              description="Bank-level security with SOC 2 compliance." 
              href="/features/security" 
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

      {/* Tech Stack Section */}
      <section className="py-24 bg-muted/50 dark:bg-muted/20">
        <div className="w-full">
          <div className="px-6">
            <h2 className="text-center text-4xl font-semibold tracking-tight text-foreground">
              Built with Modern Technologies
            </h2>
            <Separator className="my-12" />
          </div>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:30s]">
              <TechCard name="Next.js" description="React Framework for Production" category="Framework" />
              <TechCard name="React" description="UI Component Library" category="Library" />
              <TechCard name="TypeScript" description="Type-Safe JavaScript" category="Language" />
              <TechCard name="Tailwind CSS" description="Utility-First CSS Framework" category="Styling" />
              <TechCard name="shadcn/ui" description="Re-usable Components" category="Components" />
              <TechCard name="Radix UI" description="Accessible Primitives" category="Primitives" />
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:30s] mt-4">
              <TechCard name="Lucide Icons" description="Beautiful Icon Set" category="Icons" />
              <TechCard name="Framer Motion" description="Animation Library" category="Animation" />
              <TechCard name="Zod" description="Schema Validation" category="Validation" />
              <TechCard name="React Hook Form" description="Form Management" category="Forms" />
              <TechCard name="Recharts" description="Chart Components" category="Charts" />
              <TechCard name="date-fns" description="Date Utilities" category="Utilities" />
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
            Join thousands of innovators using our AI platform.
          </p>
          <Button size="lg" className="mt-8">Sign Up Free</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2025 AI Startup. All rights reserved.
      </footer>
    </div>
  );
}