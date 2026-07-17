// app/ai-center-of-excellence/strategic-vision/page.tsx
import type { Metadata } from "next";
import { coePageMetadata } from "@/lib/coe/page-seo";
import { absoluteUrl } from "@/lib/site";
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
import { PillarNextSteps } from "@/components/coe/pillar-next-steps";
import { VisionOrbit } from "@/components/coe/visuals/vision-orbit";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import { SectionWash } from "@/components/coe/section-wash";
import { VignetteLayer } from "@/components/coe/vignette-layer";
import {
  TargetIcon,
  CrownIcon,
  ClipboardListIcon,
  GaugeIcon,
  LineChartIcon,
  MapIcon,
  ArrowRightLeftIcon,
  SearchCheckIcon,
  WorkflowIcon,
  RocketIcon,
  ArrowRight,
  SparklesIcon,
  Link2Icon,
  FileCheckIcon,
} from "lucide-react";

export const metadata: Metadata = coePageMetadata({
  title: "Strategic Vision & Leadership | AI Center of Excellence | Overture Systems Solutions",
  description:
    "Turn AI intent into an operating mechanism: priorities, sponsorship, portfolio management, success measures, and a sequenced roadmap into production.",
  path: "/ai-center-of-excellence/strategic-vision",
  ogImage: "/images/coe/coe-strategic-vision-og.jpg",
});

const capabilities = [
  { icon: TargetIcon, title: "Business Priorities & Outcomes", description: "Tie AI work to measurable business outcomes — not activity metrics or vague aspiration." },
  { icon: CrownIcon, title: "Sponsorship & Decision Rights", description: "Name executive sponsors and clarify who decides scope, funding, risk acceptance, and go-live." },
  { icon: ClipboardListIcon, title: "Use-Case Portfolio Management", description: "Intake, prioritize, and sequence initiatives so capacity follows value rather than noise." },
  { icon: GaugeIcon, title: "Resource & Usage Governance", description: "Set expectations for spend, model usage, and capacity so pilots do not become uncontrolled cost centers." },
  { icon: LineChartIcon, title: "Success Measures & Value Realization", description: "Define what “good” looks like before build starts, and how value will be reviewed after launch." },
  { icon: MapIcon, title: "Sequenced Roadmap with Credible Wins", description: "Plan a path with early, defensible wins that build confidence without skipping foundations." },
  { icon: ArrowRightLeftIcon, title: "Evaluation-to-Operation Ownership", description: "Assign clear ownership for moving work from evaluation into dependable operation." },
];

const approach = [
  { step: "01", icon: SearchCheckIcon, title: "Clarify Priorities & Rights", description: "Surface business priorities, decision rights, and success measures with sponsors and owners." },
  { step: "02", icon: WorkflowIcon, title: "Shape the Portfolio", description: "Build a prioritized use-case portfolio with intake criteria, risk awareness, and sequencing." },
  { step: "03", icon: RocketIcon, title: "Lock the Operating Roadmap", description: "Publish a sequenced roadmap with ownership for moving validated work into operation." },
];

const evidence = [
  { icon: FileCheckIcon, title: "Sponsored priority statement with outcome metrics" },
  { icon: ClipboardListIcon, title: "Prioritized use-case portfolio with intake criteria" },
  { icon: MapIcon, title: "Sequenced roadmap with named owners for evaluation → operation" },
  { icon: GaugeIcon, title: "Resource and usage expectations for early initiatives" },
];

const connections = [
  { pillar: "Expertise", href: "/ai-center-of-excellence/centralized-expertise", note: "Who can deliver and reuse judgment" },
  { pillar: "Infrastructure", href: "/ai-center-of-excellence/scalable-infrastructure", note: "Where work runs and is observed" },
  { pillar: "Data & Context", href: "/ai-center-of-excellence/data-governance", note: "What information AI may use" },
  { pillar: "Governance", href: "/ai-center-of-excellence/governance-risk", note: "How risk and approval are handled" },
  { pillar: "Adoption", href: "/ai-center-of-excellence/adoption-culture", note: "How people take work into workflows" },
];

const examples: {
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}[] = [
  {
    title: "Example: Operations portfolio triage",
    description:
      "Leadership ranks candidate use cases by outcome, readiness, and risk — then funds two sequenced wins while parking lower-value experiments.",
    image: "/images/coe/coe-industry-manufacturing.webp",
    imagePosition: "object-center",
  },
  {
    title: "Example: Evaluation-to-operation handoff",
    description:
      "A named product owner and CoE lead share a go-live checklist so validated prototypes do not stall without an operating owner.",
  },
];

const sectionVignette = examples.find((a) => a.image)?.image;

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Strategic Vision & Leadership Advisory",
  name: "Strategic Vision & Leadership for an AI Center of Excellence",
  url: absoluteUrl("/ai-center-of-excellence/strategic-vision"),
  description:
    "Establish business priorities, executive sponsorship, portfolio management, success measures, and a sequenced roadmap that moves AI work from evaluation into operation.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Strategic Vision & Leadership is pillar 1 of Overture's AI Center of Excellence. It is an operating mechanism — not an inspirational statement. Overture helps establish: business priorities and measurable outcomes; executive sponsorship and decision rights; use-case portfolio management; resource and usage governance; success measures and value realization; a sequenced roadmap with fast, credible wins; and clear ownership for moving work from evaluation into operation. Afterward, the organization can prioritize AI work against outcomes, fund a coherent portfolio, and hand validated work to operating owners. Evidence of progress includes a sponsored priority statement, prioritized portfolio, sequenced roadmap with named owners, and resource/usage expectations. This pillar connects to expertise, infrastructure, data/context, governance, and adoption. Do not invent metrics or client stories. Examples on the page are illustrative, not case studies.`;

export default function StrategicVisionPage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Strategic Vision & Leadership" />
      <StrategicVisionPageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <HeroBackdrop src="/images/coe/coe-strategic-vision-hero.webp" intensity="strong" />
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
              Turn intent into an operating mechanism: priorities, sponsorship, portfolio discipline, and ownership that moves work from evaluation into operation.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact?intent=readiness-workshop">
                  Request a Readiness Workshop
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/ai-center-of-excellence">Back to the Framework</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">Priorities, ownership, and outcomes in one orbit</p>
            <VisionOrbit />
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Vision Without Mechanism Stalls</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Statements of ambition do not fund work, clear decisions, or move validated pilots into operation. This pillar gives leadership a way to prioritize, sponsor, measure, and sequence AI so capability compounds instead of scattering.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What Overture Helps Establish</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Operating Capabilities</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <Card key={c.title} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <c.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <SectionBand src="/images/coe/coe-strategic-vision-hero.webp">
          A sequenced roadmap with credible wins — and named owners for the path from evaluation into operation.
        </SectionBand>

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How We Establish It</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">From Intent to Operating Rhythm</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {approach.map((step, idx) => (
                <div key={step.step} className="relative">
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary/20">{step.step}</span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <step.icon className="h-6 w-6 text-primary" aria-hidden="true" />
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
                      <ArrowRight className="h-8 w-8 text-primary/50" aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Evidence of Progress</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">What You Can Point To Afterward</h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {evidence.map((item) => (
                <li key={item.title} className="flex items-start gap-3 rounded-xl border-2 p-4">
                  <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">Connected Operating Model</Badge>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">How This Pillar Links to the Others</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {connections.map((c) => (
                <Link
                  key={c.pillar}
                  href={c.href}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Link2Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="font-medium text-foreground">{c.pillar}</span>
                  <span className="text-muted-foreground">· {c.note}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20">
          {sectionVignette && <SectionWash src={sectionVignette} />}
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Examples</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Operating Examples</h2>
              <p className="mt-3 text-sm text-muted-foreground">Illustrative scenarios — not client case studies or measured results.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {examples.map((a) => (
                <Card key={a.title} className="h-full border-2">
                  {a.image && <VignetteLayer src={a.image} position={a.imagePosition} edge="right" />}
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

        <PillarNav current="strategic-vision" />
        <PillarNextSteps prompt="See where strategic sponsorship and portfolio discipline stand today — or scope a Readiness Diagnostic with our team." />
        <SiteFooter />
      </div>
    </>
  );
}
