// app/ai-center-of-excellence/getting-started/page.tsx
// NO "use client" directive - this is a Server Component (matches the pillar pages).
// Interactive islands (PathFinder, EngagementPhases) are client components.
import type { Metadata } from "next";
import { coePageMetadata } from "@/lib/coe/page-seo";
import { absoluteUrl } from "@/lib/site";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { SectionWash } from "@/components/coe/section-wash";
import { VignetteLayer } from "@/components/coe/vignette-layer";
import { PathFinder } from "@/components/coe/path-finder";
import { EngagementPhases } from "@/components/coe/engagement-phases";
import { GettingStartedCta } from "@/components/coe/getting-started-cta";
import { GETTING_STARTED } from "@/lib/coe/getting-started-data";
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

export const metadata: Metadata = coePageMetadata({
  title: "Getting Started with Your AI CoE | Overture Systems Solutions",
  description:
    "Three entry tiers from Readiness Diagnostic to full CoE build. See prerequisites, estimated timelines, and what you walk away with at each tier.",
  path: "/ai-center-of-excellence/getting-started",
  ogImage: "/images/coe/coe-getting-started-og.jpg",
});

// GETTING_STARTED copy lives in lib/coe/getting-started-data.ts (shared with
// the PathFinder wizard, the phase stepper, and the readiness assessment).

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
  url: absoluteUrl("/ai-center-of-excellence/getting-started"),
  description:
    "A phased path to launching an AI Center of Excellence: begin with a readiness diagnostic, prove value with a foundation pilot, then build and scale across all six pillars.",
  step: GETTING_STARTED.phases.map((p) => ({
    "@type": "HowToStep",
    position: Number(p.step),
    name: p.title,
    text: p.ossDoes,
  })),
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

// ---- Plain-text context for the AI assistant ----
const pageContent = `This page explains HOW to get started with an Overture Systems Solutions AI Center of Excellence (CoE). NAMING: the free tool is the "AI CoE Readiness Snapshot"; the formal paid engagement is the "Readiness Diagnostic". Do not call both an assessment or both a diagnostic. The Snapshot is orientation only — not an objective or validated organizational maturity score. The Diagnostic is estimated 2–3 weeks and is diagnostic scope only — it does not include Foundation, Pilot & Prove, or Scale & Enable work. ${GETTING_STARTED.durationDisclaimer} Three entry tiers: (1) Readiness Diagnostic — estimated 2–3 weeks — discovery across six CoE pillars, prioritized gaps, success measures, recommended roadmap. (2) Foundation Pilot — estimated 8–12 weeks — minimum governance/data/technical foundation plus one production-ready pilot. (3) CoE Build & Scale — phased, generally 6 months or more — full CoE operating model. Prerequisites: executive sponsor; defined high-value business problem; access to data/systems/stakeholders; cross-functional point of contact. TIER-FINDER LOGIC: journey stage maps Exploring/Planning → Diagnostic, Building → Pilot, Scaling → Build & Scale; if fewer than 2 foundations are in place, always recommend the Readiness Diagnostic. Recommendations explain why the tier was selected. Later phases are not included in the Diagnostic. Do not invent statistics. FLOW: Snapshot (hub) → tier finder (this page; stage/handoff carried in session, not sensitive URL data) → request via /contact with intent.`;

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
          <SectionWash src="/images/coe/coe-tier-scale.webp" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Step 2 · Tier Finder</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Find Your Starting Point</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Two quick questions match you to one of the three entry tiers below - no form, no commitment.
                Arriving from the AI CoE Readiness Snapshot? Your stage is already pre-selected.
              </p>
            </div>

            {/* PathFinder is a client island reading ?stage= deep links; Suspense
                keeps the page statically prerenderable with useSearchParams. */}
            <Suspense fallback={null}>
              <PathFinder />
            </Suspense>

            {/* Comparison view: full tier detail for browsers and crawlers,
                anchored for the wizard's "Compare all three tiers" action. */}
            <div id="compare-tiers" className="scroll-mt-24 text-center mt-24 mb-16">
              <h3 className="text-3xl font-bold tracking-tight text-foreground">Three Ways to Begin</h3>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                These are the three entry tiers the tier finder above chooses between. Start where the path fits —
                Diagnostic, Pilot, or Build & Scale — and scale as value is proven. The free AI CoE Readiness Snapshot
                on the overview page is orientation only; the Readiness Diagnostic is the formal fixed-scope engagement.
              </p>
            </div>
            <p className="mb-10 text-center text-sm text-muted-foreground max-w-3xl mx-auto">
              {GETTING_STARTED.durationDisclaimer}
            </p>
            <div className="grid gap-8 md:grid-cols-3 items-stretch">
              {GETTING_STARTED.tiers.map((tier, idx) => {
                const Icon = tierIcons[idx];
                return (
                  <Link
                    key={tier.id}
                    href={`/contact?intent=${tier.id}`}
                    aria-label={`Request the ${tier.name} — contact form`}
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
                    <VignetteLayer src={tier.image} position={tierImageStyles[idx].position} edge="top" />
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
                A clear, phased path — with both sides of the work spelled out at every step. The Readiness Diagnostic covers Discovery & Readiness only; Foundation and Pilot & Prove belong to the Foundation Pilot; Scale & Enable is CoE Build & Scale.
              </p>
            </div>
            <EngagementPhases />
            <p className="mt-8 text-center text-sm text-muted-foreground max-w-3xl mx-auto">
              {GETTING_STARTED.durationDisclaimer}
            </p>
          </div>
        </section>

        {/* 5. Why it works */}
        <section className="py-20 border-y bg-linear-to-b from-background to-primary/5 dark:to-primary/5">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-2xl font-medium leading-relaxed text-foreground">
              Every structured engagement begins with clarity. That discipline —{" "}
              <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent font-bold">
                defined scope, a measured baseline, and clear success metrics
              </span>{" "}
              — helps teams move from isolated experiments to an operating model they can sustain.
            </p>
          </div>
        </section>

        {/* 6. Primary CTA — tier-aware (client island) */}
        <GettingStartedCta />

        {/* 7. Cross-navigation */}
        <PillarNav current="getting-started" />

        <SiteFooter />
      </div>
    </>
  );
}
