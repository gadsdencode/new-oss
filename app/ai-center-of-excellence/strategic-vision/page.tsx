// app/ai-center-of-excellence/strategic-vision/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { StrategicVisionPageTools } from "./StrategicVisionPageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { StartHereBlock } from "@/components/coe/start-here-block";
import { VisionOrbit } from "@/components/coe/visuals/vision-orbit";
import {
  TelescopeIcon,
  TargetIcon,
  CrownIcon,
  UserCogIcon,
  GitMergeIcon,
  ShieldCheckIcon,
  SearchCheckIcon,
  RocketIcon,
  ArrowRight,
  SparklesIcon,
} from "lucide-react";

const capabilities = [
  { icon: TelescopeIcon, title: "Forward-Looking Vision", description: "Craft a vision that inspires the team, emphasizes innovation, and aligns with the organization's strategic goals." },
  { icon: TargetIcon, title: "Measurable Objectives", description: "Establish clear, quantifiable objectives that map to the vision and drive tangible business value." },
  { icon: CrownIcon, title: "Executive Sponsorship", description: "Secure strong executive sponsorship to unlock resources, drive adoption, and overcome organizational barriers." },
  { icon: UserCogIcon, title: "Dedicated AI Leadership", description: "Appoint a skilled AI leader - a Chief AI Officer or Head of CoE - to drive the mission and keep it focused and effective." },
  { icon: GitMergeIcon, title: "Business-Goal Alignment", description: "Tightly link AI projects and investments to overarching strategic priorities to maximize value and impact." },
  { icon: ShieldCheckIcon, title: "Governance & Oversight", description: "Establish oversight that keeps the CoE aligned with evolving business needs and ethical standards." },
];

const approach = [
  { step: "01", icon: SearchCheckIcon, title: "Engage an Experienced AI Advisor", description: "Bring in an expert to set the right strategic direction and operating framework from the start." },
  { step: "02", icon: TargetIcon, title: "Conduct a Comprehensive Assessment", description: "Run stakeholder workshops to review current capabilities, identify gaps, and gather baseline data." },
  { step: "03", icon: RocketIcon, title: "Develop a Strategic AI Roadmap", description: "Define high-impact projects, resource requirements, timelines, milestones, and early quick wins." },
];

const applications = [
  { title: "AI Roadmap for High-Impact Projects", description: "Identify and sequence initiatives such as predictive maintenance in manufacturing to cut downtime and operational costs." },
  { title: "Executive-Aligned Investment", description: "Tie AI spend directly to strategic priorities so leadership can see, fund, and champion measurable returns." },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Strategic Vision & Leadership Advisory",
  name: "Strategic Vision & Leadership for an AI Center of Excellence",
  description:
    "Advisory services that establish a forward-looking AI vision, measurable objectives, executive sponsorship, and dedicated leadership as the foundation of an AI Center of Excellence.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Strategic Vision & Leadership is the first pillar of an AI Center of Excellence. A clear, forward-looking vision aligned with business goals - backed by strong executive sponsorship and dedicated AI leadership - is the foundation every successful CoE is built on. Overture Systems Solutions helps organizations craft an inspiring vision, define measurable objectives that map to business value, secure executive sponsorship to unlock resources and overcome barriers, appoint dedicated AI leadership such as a Chief AI Officer or Head of CoE, align AI investment to strategic priorities, and establish governance and oversight. The advisor-led approach: engage an experienced AI advisor, conduct a comprehensive assessment through stakeholder workshops, and develop a strategic AI roadmap of high-impact projects with quick wins. Example applications include an AI roadmap that sequences high-impact projects like predictive maintenance in manufacturing to reduce downtime and operational costs.`;

export default function StrategicVisionPage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Strategic Vision & Leadership" />
      <StrategicVisionPageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 1 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Strategic Vision
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                &amp; Leadership
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              A clear, forward-looking AI vision aligned to business goals - backed by executive sponsorship - is the foundation every successful Center of Excellence is built on.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/ai-center-of-excellence">Back to the Framework</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Signature visual */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">Everything revolves around the vision</p>
            <VisionOrbit />
          </div>
        </section>

        {/* Why it matters */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">The Foundation of a Successful CoE</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A well-defined vision and aligned objectives guide the CoE&apos;s direction and ensure it delivers tangible value. Strong executive sponsorship secures resources, drives adoption across the organization, and clears the barriers that stall AI initiatives before they reach production.
            </p>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What We Build</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Core Capabilities</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, idx) => (
                <Card key={idx} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <c.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Our Approach</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">How We Establish It</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {approach.map((step, idx) => (
                <div key={idx} className="relative">
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary/20">{step.step}</span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {idx < approach.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">In Practice</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Real-World Applications</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {applications.map((a, idx) => (
                <Card key={idx} className="h-full border-2">
                  <CardHeader>
                    <div className="h-2 w-16 rounded-full bg-gradient-to-r from-primary to-accent mb-4" />
                    <CardTitle className="text-xl">{a.title}</CardTitle>
                    <CardDescription>{a.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sibling pillars */}
        <PillarNav current="strategic-vision" />

        {/* Start Here entry point */}
        <StartHereBlock />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to define your AI vision?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Let&apos;s align your AI strategy with your business goals and build the leadership foundation for a successful CoE.
            </p>
            <div className="mt-8">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
