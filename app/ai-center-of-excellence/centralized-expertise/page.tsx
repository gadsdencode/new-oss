// app/ai-center-of-excellence/centralized-expertise/page.tsx
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { CentralizedExpertisePageTools } from "./CentralizedExpertisePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { StartHereBlock } from "@/components/coe/start-here-block";
import { ExpertiseBeam } from "@/components/coe/visuals/expertise-beam";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import {
  UsersIcon,
  FlaskConicalIcon,
  CpuIcon,
  BriefcaseIcon,
  BarChart3Icon,
  NetworkIcon,
  LightbulbIcon,
  Repeat2Icon,
  GaugeIcon,
  RocketIcon,
  ArrowRight,
  SparklesIcon,
} from "lucide-react";

// Social cards only; title/description inherit from the root layout.
// No metadataBase is set in app/layout.tsx, so URLs are absolute.
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "https://new-oss.vercel.app/images/coe/coe-centralized-expertise-og.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://new-oss.vercel.app/images/coe/coe-centralized-expertise-og.jpg"],
  },
};

const capabilities = [
  { icon: FlaskConicalIcon, title: "Data Scientists", description: "Design, train, and validate models grounded in the organization's real problems and data." },
  { icon: CpuIcon, title: "ML Engineers", description: "Productionize and scale models so they run reliably and efficiently in production." },
  { icon: BriefcaseIcon, title: "Domain Experts", description: "Translate business context - in supply chain, healthcare, finance, and more - into effective AI solutions." },
  { icon: BarChart3Icon, title: "Business Analysts", description: "Connect AI initiatives to measurable business outcomes and keep work tied to value." },
  { icon: NetworkIcon, title: "Shared-Services Model", description: "A central team deployable across business units so expertise reaches every initiative that needs it." },
  { icon: UsersIcon, title: "Cross-Functional Collaboration", description: "Bring data scientists, analysts, and domain experts together on shared initiatives." },
];

const approach = [
  { step: "01", icon: UsersIcon, title: "Assemble the Team", description: "Bring together data scientists, ML engineers, domain experts, and business analysts." },
  { step: "02", icon: NetworkIcon, title: "Define the Operating Model", description: "Set up a shared-services structure that can be deployed across the organization." },
  { step: "03", icon: RocketIcon, title: "Deploy on High-Value Work", description: "Direct the team to initiatives with the clearest, fastest business payoff." },
];

const applications = [
  { title: "Customer Sentiment Analysis", description: "A shared team builds an NLP tool to analyze customer feedback across retail operations." },
  { title: "Supply-Chain Optimization", description: "A cross-functional team applies AI-driven demand forecasting to optimize logistics." },
];

const benefits = [
  { icon: LightbulbIcon, title: "Improved Innovation", description: "Concentrated expertise sparks better ideas and faster experimentation." },
  { icon: Repeat2Icon, title: "Consistent Implementation", description: "Shared standards mean AI is built the same reliable way every time." },
  { icon: GaugeIcon, title: "Efficient Resource Allocation", description: "Deploy scarce talent where it creates the most value." },
  { icon: RocketIcon, title: "Accelerated Adoption", description: "A central team helps the whole organization adopt AI faster." },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Centralized AI Expertise & Team Building",
  name: "Centralized AI Expertise for an AI Center of Excellence",
  description:
    "Building a multidisciplinary AI team - data scientists, ML engineers, domain experts, and business analysts - deployable across the organization for consistent, high-quality AI delivery.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Centralized AI Expertise is the second pillar of an AI Center of Excellence. A multidisciplinary team - data scientists, ML engineers, domain experts, and business analysts - deployable across the organization turns scattered effort into consistent, high-quality AI delivery. Overture Systems Solutions assembles the team, defines a shared-services operating model, and deploys it on high-value work. The payoff: improved innovation from concentrated expertise, consistent implementation through shared standards, efficient resource allocation by directing scarce talent where it creates the most value, and accelerated adoption organization-wide. Real-world applications include NLP customer sentiment analysis across retail operations and AI-driven demand forecasting for supply-chain optimization.`;

export default function CentralizedExpertisePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Centralized AI Expertise" />
      <CentralizedExpertisePageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-accent/10 via-accent/5 to-background dark:from-accent/5 dark:via-accent/5 dark:to-background">
          <HeroBackdrop src="/images/coe/coe-centralized-expertise-hero.webp" intensity="strong" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 2 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Centralized
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                AI Expertise
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              A multidisciplinary team - deployable across the organization - that turns scattered effort into consistent, high-quality AI delivery.
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
            <p className="text-sm font-medium text-muted-foreground mb-6">Four disciplines, one deployable center of expertise</p>
            <ExpertiseBeam />
          </div>
        </section>

        {/* Why it matters */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">One Team, Every Initiative</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Siloed expertise slows AI delivery and produces inconsistent results. A centralized, multidisciplinary team eliminates that friction - bringing the right skills to every initiative while maintaining the consistent standards that make AI trustworthy at scale.
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

        {/* The Payoff */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">The Payoff</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">What Centralization Delivers</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b, idx) => (
                <Card key={idx} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <b.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{b.title}</CardTitle>
                    <CardDescription>{b.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sibling pillars */}
        <PillarNav current="centralized-expertise" />

        {/* Start Here entry point */}
        <StartHereBlock />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to build your AI team?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Let&apos;s assemble a multidisciplinary team that delivers consistent, high-quality AI across every initiative.
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
