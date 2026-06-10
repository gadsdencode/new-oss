// components/coe/start-here-block.tsx
// Server Component - static content + next/link only (no client interactivity).
// On-ramp into the PathFinder wizard: each stage chip deep-links to the
// getting-started page with that stage preselected (?stage=).
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import { CtaTexture } from "@/components/coe/cta-texture";
import { JOURNEY_STAGES, GETTING_STARTED_PATH } from "@/lib/coe/getting-started-data";

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
              Where are you on the AI journey?
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Pick your stage and we&apos;ll recommend the right starting tier. Most teams begin with a short readiness diagnostic.
            </p>

            {/* Stage chips: deep-link into the PathFinder with the stage preselected */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
