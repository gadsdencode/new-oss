// app/ai-center-of-excellence/page.tsx
// NO "use client" directive - this is a Server Component (matches app/consulting/page.tsx)
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { CoEReadinessAssessment } from "@/components/coe/coe-readiness-assessment";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import Image from "next/image";
import { PageAiContext } from "@/components/page-ai-context";
import { CoEPageTools } from "./CoEPageTools";
import { CtaTexture } from "@/components/coe/cta-texture";
import { BrandLogo } from "@/components/brand-logo";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { StructuredData } from "@/components/structured-data";
import { GETTING_STARTED } from "@/lib/coe/getting-started-data";
import { coePageMetadata } from "@/lib/coe/page-seo";
import { absoluteUrl } from "@/lib/site";
import {
  TargetIcon,
  UsersIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  SearchCheckIcon,
  RocketIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowRight,
  UnplugIcon,
  NetworkIcon,
  LayersIcon,
  BrainCircuitIcon,
  AwardIcon,
  WorkflowIcon,
  FileStackIcon,
  MapIcon,
  ClipboardListIcon,
  ScaleIcon,
  BookOpenIcon,
  RulerIcon,
  WaypointsIcon,
} from "lucide-react";

export const metadata: Metadata = coePageMetadata({
  title: "AI Center of Excellence: From Expertise to Enterprise Capability | Overture Systems Solutions",
  description:
    "Turn your strongest expertise, decisions, controls, and operating practices into a governed AI capability. Start with the free AI CoE Readiness Snapshot.",
  path: "/ai-center-of-excellence",
  ogImage: "/images/coe/coe-hub-og.jpg",
});

// ---- The six CoE pillars (connected operating model) ----
const coePillars = [
  {
    icon: TargetIcon,
    title: "Strategic Vision & Leadership",
    description:
      "Set the direction: measurable objectives, executive sponsorship, and business-goal alignment so AI work serves the organization — not isolated experiments.",
    features: ["Forward-looking vision", "Measurable objectives", "Executive sponsorship", "Business-goal alignment"],
    bentoClassName: "col-span-1 md:col-span-2 lg:col-span-2",
    image: "/images/coe/coe-strategic-vision-hero.webp",
    href: "strategic-vision",
  },
  {
    icon: UsersIcon,
    title: "Centralized AI Expertise",
    description:
      "Concentrate multidisciplinary expertise — domain, delivery, and evaluation roles — so judgment and delivery standards travel with every initiative.",
    features: ["Domain experts", "Business analysts", "ML engineers", "Data scientists"],
    bentoClassName: "col-span-1 md:col-span-1 lg:col-span-1",
    image: "/images/coe/coe-centralized-expertise-hero.webp",
    href: "centralized-expertise",
  },
  {
    icon: ServerIcon,
    title: "Scalable AI Infrastructure",
    description:
      "Cloud and hybrid platforms, governed gateways, containerized deployment, evaluation, and cost controls so capability can run consistently across environments.",
    features: ["Cloud and hybrid platforms", "Deployment & orchestration", "Evaluation & observability", "Cost and usage governance"],
    bentoClassName: "col-span-1 md:col-span-1 lg:col-span-1",
    image: "/images/coe/coe-scalable-infrastructure-hero.webp",
    href: "scalable-infrastructure",
  },
  {
    icon: DatabaseIcon,
    title: "Data Management & Governance",
    description:
      "Catalog, quality, privacy, and access controls that make organizational knowledge usable by AI without sacrificing stewardship.",
    features: ["Data cataloging", "Quality assurance", "Privacy & security", "Compliance monitoring"],
    bentoClassName: "col-span-1 md:col-span-2 lg:col-span-2",
    image: "/images/coe/coe-data-governance-hero.webp",
    href: "data-governance",
  },
  {
    icon: ShieldCheckIcon,
    title: "Governance, Risk & Responsible AI",
    description:
      "Decision structures, risk review, monitoring, and human oversight that keep AI behavior accountable and aligned with organizational intent.",
    features: ["AI governance board", "Risk assessment", "Model monitoring & auditing", "Incident response"],
    bentoClassName: "col-span-1 md:col-span-1 lg:col-span-1",
    image: "/images/coe/coe-governance-risk-hero.webp",
    href: "governance-risk",
  },
  {
    icon: GraduationCapIcon,
    title: "Culture of Adoption & Continuous Learning",
    description:
      "Training, enablement, and feedback loops so the capability is used, improved, and owned by the people who run the business.",
    features: ["Cross-functional collaboration", "Comprehensive training", "Showcase use cases", "Continuous upskilling"],
    bentoClassName: "col-span-1 md:col-span-2 lg:col-span-2",
    image: "/images/coe/coe-adoption-culture-hero.webp",
    href: "adoption-culture",
  },
];

// ---- Execution gap: activity vs capability ----
const executionGapPoints = [
  {
    icon: UnplugIcon,
    from: "Isolated tools",
    to: "Reusable capability",
    description:
      "Point solutions and departmental bots rarely become shared organizational assets.",
  },
  {
    icon: UsersIcon,
    from: "Individual experimentation",
    to: "Organization-wide execution",
    description:
      "Pockets of talent succeed locally while the enterprise still lacks a common operating rhythm.",
  },
  {
    icon: RocketIcon,
    from: "Successful demonstrations",
    to: "Dependable operations",
    description:
      "Proofs of concept impress in a review — then stall when ownership, data, and controls are incomplete.",
  },
  {
    icon: NetworkIcon,
    from: "AI activity",
    to: "Measured business outcomes",
    description:
      "Usage and pilots accumulate without a clear line from work performed to results the business can trust.",
  },
];

// ---- Why Overture (repo-supported claims only) ----
const whyOverture = [
  {
    icon: AwardIcon,
    title: "20+ years of delivery",
    description: "Founded in 2005 — systems delivery long before the current AI cycle.",
  },
  {
    icon: BrainCircuitIcon,
    title: "Patent-pending ICDU evaluation",
    description:
      "A quality and evaluation capability that helps make AI behavior more effective, measurable, repeatable, and aligned with organizational intent.",
    href: "https://icdu.ai",
  },
  {
    icon: SearchCheckIcon,
    title: "Fixed-scope entry engagements",
    description: "Defined deliverables and timelines from the first engagement — start contained, then scale.",
  },
  {
    icon: WorkflowIcon,
    title: "Strategy through governed production",
    description: "One practice from roadmap to deployed, governed AI — not a handoff between strategy and build.",
  },
  {
    icon: LayersIcon,
    title: "Model- and cloud-portable design",
    description:
      "Built to operate across models and cloud environments so the operating model is not locked to a single stack.",
  },
];

// ---- Broader CoE journey artifacts (not claimed as Diagnostic-only outputs) ----
const journeyArtifacts = [
  { icon: ClipboardListIcon, title: "Prioritized use-case portfolio" },
  { icon: WaypointsIcon, title: "CoE operating model" },
  { icon: ScaleIcon, title: "Governance and decision structure" },
  { icon: BookOpenIcon, title: "Data and knowledge requirements" },
  { icon: ServerIcon, title: "Technical architecture" },
  { icon: RulerIcon, title: "Evaluation and measurement plan" },
  { icon: GraduationCapIcon, title: "Adoption and enablement plan" },
  { icon: MapIcon, title: "Sequenced implementation roadmap" },
];

const tierIcons = [SearchCheckIcon, RocketIcon, TrendingUpIcon] as const;

// ---- JSON-LD Service schema (SEO) ----
const coeServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Center of Excellence Advisory & Build",
  name: "AI Center of Excellence (CoE) Establishment",
  description:
    "Overture Systems Solutions helps organizations turn their strongest expertise, decisions, controls, data, and operating practices into a governed AI capability that can be applied consistently across the enterprise.",
  url: absoluteUrl("/ai-center-of-excellence"),
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "United States" },
  serviceOutput: [
    "Prioritized use-case portfolio",
    "CoE operating model",
    "Governance and decision structure",
    "Data and knowledge requirements",
    "Technical architecture",
    "Evaluation and measurement plan",
    "Adoption and enablement plan",
    "Sequenced implementation roadmap",
  ],
  audience: { "@type": "Audience", audienceType: "Enterprise organizations, Private equity firms, Portfolio companies" },
};

// ---- Plain-text context for the AI assistant ----
const pageContent = `Overture Systems Solutions' AI Center of Excellence practice helps an organization turn its best expertise, decisions, controls, data, and operating practices into a governed AI capability that can be applied consistently across the enterprise. Experimentation is not the objective — a repeatable organizational capability is. The CoE connects strategy, business expertise, technology, evaluation, governance, and adoption into one operating model. Overture can begin with a contained readiness engagement rather than requiring an immediate full-scale commitment. DIFFERENTIATION (supported facts only): founded 2005 / 20+ years of delivery; patent-pending ICDU evaluation pipeline (https://icdu.ai) — a quality and evaluation capability that helps make AI behavior more effective, measurable, repeatable, and aligned with organizational intent (do not describe ICDU as merely a governance wrapper, and do not say it fails to improve AI effectiveness); fixed-scope entry engagements; strategy through governed production; ability to operate across models and cloud environments. Do not invent client names, case studies, or statistics. Do not promise literal employee cloning or guaranteed zero degradation. Do not present "AI Factory" as a launched commercial product name. SIX PILLARS (a connected operating model, not six independent services): Strategic Vision & Leadership; Centralized AI Expertise (multidisciplinary — domain experts, analysts, ML engineers, data scientists — not merely a team of data scientists); Scalable AI Infrastructure; Data Management & Governance; Governance, Risk & Responsible AI; Culture of Adoption & Continuous Learning. Value comes from how the pillars interact. EXECUTION GAP: isolated tools vs reusable capability; individual experimentation vs organization-wide execution; successful demonstrations vs dependable operations; AI activity vs measured business outcomes. NAMING: free tool = "AI CoE Readiness Snapshot"; formal paid engagement = "Readiness Diagnostic". Do not call both an assessment or both a diagnostic. SNAPSHOT SCORING: each pillar uses levels 0–3; completed score normalizes to 0–100 (all-lowest = 0%, all-highest = 100%). Emphasize maturity band and six-pillar profile over the percentage. The Snapshot is orientation only — not an objective or validated organizational maturity score. ENTRY TIERS (durations are estimates): Readiness Diagnostic (estimated 2–3 weeks; diagnostic scope only — later phases are NOT included); Foundation Pilot (estimated 8–12 weeks); CoE Build & Scale (phased, generally 6 months or more). ${GETTING_STARTED.durationDisclaimer} TIER-FINDER: Exploring/Planning → Diagnostic; Building → Pilot; Scaling → Build & Scale; fewer than 2 foundations in place always → Diagnostic. Recommendations explain why. FLOW: Snapshot on this page → tier finder on getting-started (session handoff carries band, tier, stage, largest gap, foundations — not sensitive URL data) → /contact. Broader CoE journey artifacts include: prioritized use-case portfolio, CoE operating model, governance and decision structure, data and knowledge requirements, technical architecture, evaluation and measurement plan, adoption and enablement plan, sequenced implementation roadmap.`;

export default function AICenterOfExcellencePage() {
  return (
    <>
      <StructuredData data={coeServiceSchema} />
      <PageAiContext content={pageContent} pageTitle="AI Center of Excellence" />
      <CoEPageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* 1. Hero */}
        <header className="relative isolate flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <HeroBackdrop src="/images/coe/coe-hub-hero.webp" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow opacity-50" />
          <div className="absolute bottom-20 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow opacity-50 animation-delay-1000" />

          <div className="relative z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-24">
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
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              Make Your Best Expertise
              <span className="block mt-3 pb-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                an Enterprise Capability
              </span>
            </h1>
            <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
              AI experimentation is not the objective. Overture helps you turn expertise, decisions, controls, data, and operating practices into a governed AI capability — applied consistently across the enterprise — connecting strategy, business judgment, technology, evaluation, governance, and adoption.
            </p>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              Begin with a contained readiness engagement. A full-scale build is not required to start.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8 shadow-brand" asChild>
                <Link href="#assessment">
                  Start the 5-Minute Readiness Snapshot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact?intent=readiness-workshop">Request a Readiness Workshop</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* 2. Execution gap */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">The Execution Gap</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Most organizations do not lack AI activity. They lack the operating model that turns activity into capability.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {executionGapPoints.map((point) => (
                <div key={point.from} className="text-left rounded-xl border border-border/80 bg-card/40 p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <point.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                    {point.from}
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{point.to}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 text-center text-lg text-foreground max-w-3xl mx-auto">
              A Center of Excellence closes that gap by connecting the parts into one operating model — the six pillars below.
            </p>
          </div>
        </section>

        {/* 3. Why Overture */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Why Overture</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                Built to Operationalize Judgment — Not Just Deploy Tools
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                We bring long-running delivery discipline, a proprietary evaluation pipeline, and fixed-scope entry paths so you can stand up a CoE without an open-ended commitment.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {whyOverture.map((item) => (
                <Card key={item.title} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                      <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        Learn about ICDU
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-muted-foreground max-w-3xl mx-auto">
              Within the CoE, ICDU supports evaluation of quality and intent so AI systems can be improved, measured, and kept aligned with how the organization intends to operate.
            </p>
          </div>
        </section>

        {/* 4. Six pillars — connected operating model */}
        <section id="framework" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Operating Model</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Six Pillars, One Connected System</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                These are not six standalone services. Value comes from how strategy, expertise, infrastructure, data, governance, and adoption reinforce each other — so capability compounds instead of fragmenting.
              </p>
            </div>
            <BentoGrid className="auto-rows-[24rem]">
              {coePillars.map((p, idx) => (
                <BentoCard
                  key={idx}
                  name={p.title}
                  className={`dark ${p.bentoClassName}`}
                  background={
                    <div className="absolute inset-0">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-[#030F26]/95 via-[#030F26]/70 to-[#030F26]/40" />
                    </div>
                  }
                  Icon={p.icon}
                  description={p.description}
                  href={`/ai-center-of-excellence/${p.href}`}
                  cta="Explore This Pillar"
                />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* 5. AI CoE Readiness Snapshot */}
        <section id="assessment" className="scroll-mt-24 py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Free · About 5 Minutes</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">AI CoE Readiness Snapshot</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Rate yourself across the six pillars for a live maturity profile, your biggest gap, and a recommended starting point.
                This is orientation only. The formal Readiness Diagnostic produces the substantiated maturity baseline and roadmap.
              </p>
            </div>
            <CoEReadinessAssessment />
          </div>
        </section>

        {/* 6. Engagement path */}
        <section id="engagement-path" className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Engagement Path</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Three Ways to Begin</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Start with a diagnostic, prove value in a pilot, then scale the operating model — without requiring a full commitment up front.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {GETTING_STARTED.tiers.map((tier, idx) => {
                const Icon = tierIcons[idx];
                return (
                  <div key={tier.id} className="relative">
                    <Card
                      className={`h-full border-2 transition-colors ${
                        tier.featured ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-4xl sm:text-5xl font-bold text-primary/20">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                          </div>
                        </div>
                        <CardTitle className="text-xl">{tier.name}</CardTitle>
                        <Badge variant="outline" className="w-fit mt-2">
                          <ClockIcon className="w-3 h-3 mr-1" aria-hidden="true" />
                          {tier.duration}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{tier.whatItIs}</p>
                      </CardContent>
                    </Card>
                    {idx < GETTING_STARTED.tiers.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-8 w-8 text-primary/50" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-10 text-center text-sm text-muted-foreground max-w-3xl mx-auto">
              {GETTING_STARTED.durationDisclaimer}
            </p>
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/ai-center-of-excellence/getting-started">
                  Compare tiers and find your path
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 7. What you leave with */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Proof of Delivery</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">What You Leave With</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Tangible artifacts from the broader CoE journey — not unsupported outcome claims. A Readiness Diagnostic delivers the maturity baseline, gap analysis, and recommended roadmap; later tiers expand into the full set below.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {journeyArtifacts.map((artifact) => (
                <div
                  key={artifact.title}
                  className="flex items-start gap-3 rounded-xl border-2 border-border p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <artifact.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <p className="pt-2 text-sm font-semibold text-foreground leading-snug">{artifact.title}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-2">
              <FileStackIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Outputs scale with engagement tier. Exact scope is confirmed in the Readiness Workshop.
            </p>
          </div>
        </section>

        {/* 8. Final CTA */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <CtaTexture />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Choose Your Next Step
            </h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Orient yourself in five minutes — or talk with us to scope a formal Readiness Diagnostic.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8 shadow-brand" asChild>
                <Link href="#assessment">
                  Take the Readiness Snapshot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact?intent=readiness-workshop">Request a Readiness Workshop</Link>
              </Button>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
