// components/coe/start-here-block.tsx
// Server Component - static content + next/link only (no client interactivity).
// The single "map" of the CoE funnel, rendered on pillar pages (hub uses its own narrative):
//   Step 1 - free AI CoE Readiness Snapshot (hub, #assessment)
//   Step 2 - tier finder / PathFinder wizard (getting-started)
//   Step 3 - readiness workshop with our team (/contact)
// The stage chips are a shortcut that skips Step 1 and deep-links into the
// PathFinder with that stage preselected (?stage=).
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import { CtaTexture } from "@/components/coe/cta-texture";
import { JOURNEY_STAGES, GETTING_STARTED_PATH } from "@/lib/coe/getting-started-data";

const JOURNEY_STEPS = [
  {
    step: "1",
    title: "Take the Readiness Snapshot",
    detail: "A free ~5-minute AI CoE Readiness Snapshot across the six pillars — orientation and a recommended starting point.",
    href: "/ai-center-of-excellence#assessment",
    linkLabel: "Start the Snapshot",
  },
  {
    step: "2",
    title: "Find your entry tier",
    detail: "Two quick questions match you to a Readiness Diagnostic, Foundation Pilot, or full CoE Build & Scale.",
    href: GETTING_STARTED_PATH,
    linkLabel: "Open the tier finder",
  },
  {
    step: "3",
    title: "Request a Readiness Workshop",
    detail: "Talk with our team to scope the formal engagement. Most teams start with the fixed-scope Readiness Diagnostic.",
    href: "/contact?intent=readiness-workshop",
    linkLabel: "Request the workshop",
  },
] as const;

interface StartHereBlockProps {
  className?: string;
}

export function StartHereBlock({ className }: StartHereBlockProps) {
  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 text-center sm:p-12">
          <CtaTexture />
          {/* relative wrapper keeps content painted above the absolute texture */}
          <div className="relative">
            <BrandLogo size="lg" className="mx-auto mb-5 h-auto w-12 drop-shadow-[0_4px_16px_rgba(11,124,255,0.25)]" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Your Path to a Center of Excellence
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three steps, in order. Each one is free of commitment until you&apos;re ready for the next.
            </p>

            {/* The journey map: one card per step, each linking to where that step happens */}
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              {JOURNEY_STEPS.map((s) => (
                <Link
                  key={s.step}
                  href={s.href}
                  className="group flex flex-col rounded-xl border border-primary/30 bg-background p-5 shadow-sm transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {s.step}
                  </span>
                  <span className="mt-3 font-semibold text-foreground">{s.title}</span>
                  <span className="mt-1.5 flex-1 text-sm text-muted-foreground">{s.detail}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {s.linkLabel}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>

            {/* Shortcut: skip the Snapshot and jump into the tier finder with a stage preselected */}
            <p className="mt-8 text-sm font-medium text-muted-foreground">
              Already know where you stand? Pick your stage and skip straight to the tier finder:
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              {JOURNEY_STAGES.map((stage) => (
                <Link
                  key={stage.id}
                  href={`${GETTING_STARTED_PATH}?stage=${stage.id}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {stage.label}
                  <ArrowRight
                    className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href={GETTING_STARTED_PATH}>
                  See how to get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
