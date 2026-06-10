// app/ai-center-of-excellence/getting-started/page.tsx
// NO "use client" directive - this is a Server Component (matches the pillar pages).
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import Image from "next/image";
import { CtaTexture } from "@/components/coe/cta-texture";
import { PageAiContext } from "@/components/page-ai-context";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { BorderBeam } from "@/components/ui/border-beam";
import { BrandLogo } from "@/components/brand-logo";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import {
  SearchCheckIcon,
  RocketIcon,
  TrendingUpIcon,
  CrownIcon,
  TargetIcon,
  DatabaseIcon,
  UsersIcon,
  ClockIcon,
  CheckCircle2,
  ArrowRight,
  SparklesIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How to Start an AI Center of Excellence | Overture Systems",
  description:
    "A clear, low-risk path to launching your AI Center of Excellence - start with a short readiness diagnostic, prove value with a foundation pilot, then build and scale. See the tiers, what you'll need, and how an engagement runs.",
  // Absolute URLs: no metadataBase is set in app/layout.tsx (origin matches the JSON-LD schemas).
  openGraph: {
    images: [
      {
        url: "https://new-oss.vercel.app/images/coe/coe-getting-started-og.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://new-oss.vercel.app/images/coe/coe-getting-started-og.jpg"],
  },
};

// ---------------------------------------------------------------------------
// GETTING_STARTED — single source of truth for ALL copy on this page.
// Editorial defaults: timelines SHOWN (as ranges), pricing NOT shown.
// To show pricing later: add a `price` field per tier here and render one line
// in the tier card. No other file changes required.
// ---------------------------------------------------------------------------
const GETTING_STARTED = {
  hero: {
    eyebrow: "Center of Excellence",
    title: "How to get started",
    subtitle:
      "You don't have to commit to a full build to begin. Most teams start with a short, fixed-scope diagnostic, then scale as the value is proven.",
  },

  // Three entry tiers (crawl / walk / run). Maps to journey stages:
  // Diagnostic = Exploring/Planning, Pilot = Building, Build & Scale = Scaling.
  tiers: [
    {
      id: "diagnostic",
      name: "Readiness Diagnostic",
      tagline: "Find out where you stand",
      image: "/images/coe/coe-tier-diagnostic.webp",
      duration: "2 to 3 weeks",
      whatItIs:
        "A structured assessment across all six CoE pillars, benchmarked against a maturity model.",
      walkAwayWith: [
        "A maturity score across the six pillars",
        "A prioritized gap analysis",
        "A recommended roadmap and starting point",
      ],
      bestFor:
        "Teams exploring or planning a CoE who want an objective baseline before committing.",
      featured: true, // primary, lowest-barrier entry point
    },
    {
      id: "pilot",
      name: "Foundation Pilot",
      tagline: "Prove value on one real use case",
      image: "/images/coe/coe-tier-pilot.webp",
      duration: "8 to 12 weeks",
      whatItIs:
        "We stand up the governance and infrastructure baseline and deliver one high-value use case end to end.",
      walkAwayWith: [
        "A production-ready pilot",
        "A governance and data baseline",
        "A measured outcome to build the internal case",
      ],
      bestFor:
        "Teams ready to build who want to de-risk the full investment by proving the model first.",
      featured: false,
    },
    {
      id: "scale",
      name: "CoE Build & Scale",
      tagline: "Operationalize the full Center of Excellence",
      image: "/images/coe/coe-tier-scale.webp",
      duration: "Phased, typically 6 months and up",
      whatItIs:
        "Full operationalization across all six pillars, with the operating model, enablement, and governance to scale AI organization-wide.",
      walkAwayWith: [
        "A running Center of Excellence",
        "An operating model and governance framework",
        "An enabled internal team and adoption plan",
      ],
      bestFor:
        "Teams scaling AI who are committed to a durable, organization-wide capability.",
      featured: false,
    },
  ],

  // "What you'll need" — qualifies leads and builds trust.
  prerequisites: [
    {
      title: "An executive sponsor",
      detail:
        "A senior leader accountable for outcomes and empowered to clear roadblocks.",
    },
    {
      title: "A defined business problem",
      detail:
        "At least one concrete, high-value problem to anchor the work. We help you sharpen it if needed.",
    },
    {
      title: "Access to data and systems",
      detail:
        "Reasonable access to the relevant data, tools, and stakeholders during the engagement.",
    },
    {
      title: "A cross-functional point of contact",
      detail:
        "One person or small team to coordinate on your side and keep momentum.",
    },
  ],
  prerequisitesNote:
    "Don't have all of these in place yet? That is exactly what the Readiness Diagnostic is for.",

  // Engagement phases — shows BOTH sides of the work (this is what converts).
  phases: [
    {
      step: "01",
      title: "Discovery & Readiness",
      duration: "2 to 3 weeks",
      ossDoes:
        "Assess maturity across the six pillars, identify gaps, and define success metrics.",
      youDo: "Connect us with stakeholders and provide access to context.",
      deliverable: "Maturity baseline and prioritized roadmap.",
    },
    {
      step: "02",
      title: "Foundation",
      duration: "4 to 6 weeks",
      ossDoes: "Stand up governance, data, and infrastructure baselines.",
      youDo: "Review and approve the operating model and guardrails.",
      deliverable: "Governance framework and technical foundation.",
    },
    {
      step: "03",
      title: "Pilot & Prove",
      duration: "4 to 8 weeks",
      ossDoes: "Build and deploy one high-value use case end to end.",
      youDo: "Provide subject-matter input and validate outcomes.",
      deliverable: "Production-ready pilot with measured results.",
    },
    {
      step: "04",
      title: "Scale & Enable",
      duration: "Ongoing",
      ossDoes:
        "Expand across the pillars, enable your team, and operationalize the CoE.",
      youDo: "Grow internal ownership and adoption.",
      deliverable: "A self-sustaining Center of Excellence.",
    },
  ],

  cta: {
    title: "Start with a readiness diagnostic",
    body: "The lowest-risk first step. We give you an objective baseline and a clear recommendation, no commitment to a full build.",
    primaryLabel: "Book a readiness workshop",
    primaryHref: "/contact",
    secondaryLabel: "Take the 5-minute readiness assessment",
    // Anchor verified against app/ai-center-of-excellence/page.tsx (section id="assessment").
    secondaryHref: "/ai-center-of-excellence#assessment",
  },
} as const;

// Decorative icons paired to tiers / prerequisites (kept out of the copy constant).
const tierIcons = [SearchCheckIcon, RocketIcon, TrendingUpIcon] as const;
// Per-tier crop, indexed like tierIcons: diagnostic's subject is upper-center,
// pilot's launch beam and scale's network plane both read best centered.
const tierImageStyles = [
  { position: "object-top" },
  { position: "object-center" },
  { position: "object-center" },
] as const;
const prerequisiteIcons = [CrownIcon, TargetIcon, DatabaseIcon, UsersIcon] as const;

// ---- JSON-LD HowTo schema (SEO) ----
const gettingStartedSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to start an AI Center of Excellence",
  description:
    "A phased path to launching an AI Center of Excellence: begin with a readiness diagnostic, prove value with a foundation pilot, then build and scale across all six pillars.",
  step: GETTING_STARTED.phases.map((p) => ({
    "@type": "HowToStep",
    position: Number(p.step),
    name: p.title,
    text: p.ossDoes,
  })),
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

// ---- Plain-text context for the AI assistant ----
const pageContent = `This page explains HOW to get started with an Overture Systems Solutions AI Center of Excellence (CoE). Teams do not have to commit to a full build; most start with a short, fixed-scope diagnostic and scale as value is proven. There are three entry tiers: (1) Readiness Diagnostic - 2 to 3 weeks, a structured assessment across all six CoE pillars benchmarked against a maturity model; you walk away with a maturity score, a prioritized gap analysis, and a recommended roadmap and starting point; best for teams exploring or planning a CoE who want an objective baseline. This is the recommended, lowest-risk first step. (2) Foundation Pilot - 8 to 12 weeks, stand up the governance and infrastructure baseline and deliver one high-value use case end to end; you walk away with a production-ready pilot, a governance and data baseline, and a measured outcome; best for teams ready to build who want to de-risk the full investment. (3) CoE Build & Scale - phased, typically 6 months and up, full operationalization across all six pillars with the operating model, enablement, and governance to scale AI organization-wide; you walk away with a running Center of Excellence, an operating model and governance framework, and an enabled internal team and adoption plan; best for teams committed to a durable, organization-wide capability. What you'll need to begin: an executive sponsor accountable for outcomes; a defined, high-value business problem to anchor the work; reasonable access to relevant data, tools, and stakeholders; and a cross-functional point of contact to coordinate. Teams that don't yet have all of these should start with the Readiness Diagnostic. How an engagement runs, in four phases: 01 Discovery & Readiness (2 to 3 weeks) - OSS assesses maturity, identifies gaps, and defines success metrics while you connect stakeholders and provide context; deliverable is a maturity baseline and prioritized roadmap. 02 Foundation (4 to 6 weeks) - OSS stands up governance, data, and infrastructure baselines while you review and approve the operating model; deliverable is a governance framework and technical foundation. 03 Pilot & Prove (4 to 8 weeks) - OSS builds and deploys one high-value use case while you provide subject-matter input and validate outcomes; deliverable is a production-ready pilot with measured results. 04 Scale & Enable (ongoing) - OSS expands across the pillars and enables your team while you grow internal ownership and adoption; deliverable is a self-sustaining Center of Excellence. Every engagement opens with a rigorous readiness diagnostic, which is a big part of why Overture maintains a 95% project success rate. Pricing is scoped during the diagnostic; to begin, book a readiness workshop via the contact page or take the 5-minute readiness assessment on the AI Center of Excellence overview page.`;

export default function GettingStartedPage() {
  return (
    <>
      <StructuredData data={gettingStartedSchema} />
      <PageAiContext content={pageContent} pageTitle="How to Get Started with an AI Center of Excellence" />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* 1. Hero */}
        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <HeroBackdrop src="/images/coe/coe-getting-started-hero.webp" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            {/* Brand mark crowning the headline (matches the homepage hero treatment) */}
            <div className="relative mx-auto mb-7 w-fit sm:mb-8">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl sm:h-40 sm:w-40"
              />
              <BrandLogo
                size="xl"
                priority
                className="relative h-auto w-20 drop-shadow-[0_6px_24px_rgba(11,124,255,0.3)] sm:w-24 md:w-28"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {GETTING_STARTED.hero.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              {GETTING_STARTED.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href={GETTING_STARTED.cta.primaryHref}>
                  {GETTING_STARTED.cta.primaryLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href={GETTING_STARTED.cta.secondaryHref}>{GETTING_STARTED.cta.secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* 2. Tiered entry path */}
        <section className="relative overflow-hidden py-20 border-b">
          {/* Colored section field: the Build & Scale artwork (the destination of
              the three-tier journey) washes the section in color, fading at both
              edges. The tier cards above carry greyscale versions of their own
              art, so color reads as ambient ground and the cards as figure. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
          >
            <Image
              src="/images/coe/coe-tier-scale.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center opacity-15 dark:opacity-25"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Three Ways to Begin</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Start small and scale as the value is proven. Most teams begin with the readiness diagnostic.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 items-stretch">
              {GETTING_STARTED.tiers.map((tier, idx) => {
                const Icon = tierIcons[idx];
                return (
                  <Link
                    key={tier.id}
                    href="/contact"
                    aria-label={`Get started with the ${tier.name} - contact us`}
                    className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                  <Card
                    className={`relative h-full overflow-hidden transition-colors ${
                      tier.featured
                        ? "border-2 border-primary ring-2 ring-primary/40 shadow-lg hover:shadow-xl"
                        : "border-2 hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    {tier.featured && (
                      <BorderBeam size={120} duration={8} colorFrom="#0B7CFF" colorTo="#00D6C9" />
                    )}
                    {/* Ambient tier visual: bleeds from the card's top edge and
                        dissolves into the surface via a mask, so there is no hard
                        image boundary for the eye to snag on. Copy stays the
                        figure; the artwork reads as atmosphere behind it. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-48 mask-[linear-gradient(to_bottom,black_20%,transparent_100%)]"
                    >
                      <Image
                        src={tier.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={`object-cover ${tierImageStyles[idx].position} grayscale opacity-40 dark:opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0`}
                      />
                    </div>
                    <CardHeader className="pt-28">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {tier.featured && <Badge>Recommended start</Badge>}
                      </div>
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <CardDescription className="text-base font-medium text-foreground/80">
                        {tier.tagline}
                      </CardDescription>
                      <Badge variant="outline" className="w-fit mt-3">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {tier.duration}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <p className="text-muted-foreground">{tier.whatItIs}</p>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">
                          You walk away with
                        </p>
                        <ul className="space-y-2">
                          {tier.walkAwayWith.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Best for
                        </p>
                        <p className="text-sm text-foreground">{tier.bestFor}</p>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 pt-1 text-sm font-semibold text-primary">
                        Get started
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. What you'll need */}
        <section className="py-20 bg-linear-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Setting You Up to Succeed</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A few things make every engagement go faster. We help you put any missing pieces in place.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {GETTING_STARTED.prerequisites.map((req, idx) => {
                const Icon = prerequisiteIcons[idx];
                return (
                  <Card key={idx} className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{req.title}</CardTitle>
                          <CardDescription className="mt-2">{req.detail}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
            <div className="mt-8 flex items-start justify-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-6 py-4 max-w-3xl mx-auto">
              <SparklesIcon className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <p className="text-foreground">{GETTING_STARTED.prerequisitesNote}</p>
            </div>
          </div>
        </section>

        {/* 4. How an engagement runs */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">How an Engagement Runs</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A clear, phased path - with both sides of the work spelled out at every step.
              </p>
            </div>
            <ol className="relative space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-px before:bg-border md:before:left-[31px]">
              {GETTING_STARTED.phases.map((phase) => (
                <li key={phase.step} className="relative pl-20 md:pl-24">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-background text-lg font-bold text-primary md:h-16 md:w-16"
                  >
                    {phase.step}
                  </span>
                  <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className="text-xl">{phase.title}</CardTitle>
                        <Badge variant="outline" className="w-fit">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {phase.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border bg-muted/30 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-1">We do</p>
                          <p className="text-sm text-foreground">{phase.ossDoes}</p>
                        </div>
                        <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">You do</p>
                          <p className="text-sm text-foreground">{phase.youDo}</p>
                        </div>
                        <div className="rounded-lg border bg-muted/30 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">You get</p>
                          <p className="text-sm text-foreground">{phase.deliverable}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. Why it works */}
        <section className="py-20 border-y bg-linear-to-b from-background to-primary/5 dark:to-primary/5">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-2xl font-medium leading-relaxed text-foreground">
              Every engagement opens with a rigorous readiness diagnostic. That discipline is a big part of
              why we maintain a{" "}
              <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent font-bold">
                95% project success rate
              </span>{" "}
              where the industry average struggles.
            </p>
          </div>
        </section>

        {/* 6. Primary CTA */}
        <section className="relative py-24 overflow-hidden bg-linear-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <CtaTexture />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {GETTING_STARTED.cta.title}
            </h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              {GETTING_STARTED.cta.body}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href={GETTING_STARTED.cta.primaryHref}>
                  {GETTING_STARTED.cta.primaryLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href={GETTING_STARTED.cta.secondaryHref}>{GETTING_STARTED.cta.secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 7. Cross-navigation */}
        <PillarNav current="getting-started" />

        <SiteFooter />
      </div>
    </>
  );
}
