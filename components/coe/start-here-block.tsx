// components/coe/start-here-block.tsx
// Server Component - static content + next/link only (no client interactivity).
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";

// Compact teaser for the full Getting Started page. Tier names mirror
// GETTING_STARTED.tiers in app/ai-center-of-excellence/getting-started/page.tsx.
const TIER_STEPS = ["Readiness Diagnostic", "Foundation Pilot", "CoE Build & Scale"] as const;

interface StartHereBlockProps {
  className?: string;
}

export function StartHereBlock({ className }: StartHereBlockProps) {
  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 text-center sm:p-12">
          <BrandLogo size="lg" className="mx-auto mb-5 h-auto w-12 drop-shadow-[0_4px_16px_rgba(11,124,255,0.25)]" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Not sure where to begin?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Most teams start with a short readiness diagnostic, then scale as value is proven.
          </p>

          {/* Tier progression */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {TIER_STEPS.map((step, idx) => (
              <div key={step} className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                  {step}
                </span>
                {idx < TIER_STEPS.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
              <Link href="/ai-center-of-excellence/getting-started">
                See how to get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
