// page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Hero Section */}
      <header className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10">
        <div className="absolute inset-0 ai-gradient opacity-50" />
        <div className="z-10 mx-auto max-w-4xl px-6 text-center">
          <Badge variant="outline" className="mb-4 border-primary text-primary">Beta Launch</Badge>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
            Overture Systems Solutions
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            Our platform delivers intelligent solutions to transform your business. From automation to insights, we&apos;ve got you covered.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </header>

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