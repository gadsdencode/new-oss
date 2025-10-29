// page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import Image from "next/image";
import Link from "next/link";
import { BotIcon, BrainCircuitIcon, ChartBarIcon, ZapIcon, ShieldCheckIcon, Users2Icon } from "lucide-react";

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
              name="Intelligent Automation" 
              className="col-span-1 md:col-span-2 lg:col-span-2" 
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10" />
              } 
              Icon={BotIcon} 
              description="Streamline workflows with AI-driven tools and smart automation." 
              href="/features/automation" 
              cta="Learn More" 
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
          </BentoGrid>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 dark:bg-muted/20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-semibold tracking-tight text-foreground">
            Powerful Features for Your AI Needs
          </h2>
          <Separator className="my-12" />
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="shadow-ai-glow">
              <CardHeader>
                <CardTitle>Intelligent Automation</CardTitle>
                <CardDescription>Streamline workflows with AI-driven tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/automation.svg"  // Placeholder; replace with actual asset
                  alt="Automation"
                  width={300}
                  height={200}
                  className="mx-auto"
                />
              </CardContent>
              <CardFooter>
                <Button variant="link">Learn More</Button>
              </CardFooter>
            </Card>
            <Card className="shadow-ai-glow">
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Gain deep insights from your data.</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/analytics.svg"  // Placeholder
                  alt="Analytics"
                  width={300}
                  height={200}
                  className="mx-auto"
                />
              </CardContent>
              <CardFooter>
                <Button variant="link">Learn More</Button>
              </CardFooter>
            </Card>
            <Card className="shadow-ai-glow">
              <CardHeader>
                <CardTitle>Custom AI Models</CardTitle>
                <CardDescription>Build and deploy tailored AI solutions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/models.svg"  // Placeholder
                  alt="AI Models"
                  width={300}
                  height={200}
                  className="mx-auto"
                />
              </CardContent>
              <CardFooter>
                <Button variant="link">Learn More</Button>
              </CardFooter>
            </Card>
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