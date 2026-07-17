"use client";

// components/coe/getting-started-cta.tsx
// Footer CTA that follows the visitor's recommended tier so Pilot / Build & Scale
// results are not contradicted by a universal "Start with the Diagnostic" message.

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CtaTexture } from "@/components/coe/cta-texture";
import {
  ctaForRecommendedTier,
  type TierId,
} from "@/lib/coe/getting-started-data";
import { readSnapshotHandoff } from "@/lib/coe/snapshot-handoff";

export function GettingStartedCta() {
  const [tierId, setTierId] = React.useState<TierId | null>(null);

  React.useEffect(() => {
    const apply = () => {
      const handoff = readSnapshotHandoff();
      setTierId(handoff?.recommendedTierId ?? null);
    };
    apply();

    const onRecommend = (event: Event) => {
      const detail = (event as CustomEvent<{ tierId?: TierId }>).detail;
      if (detail?.tierId) setTierId(detail.tierId);
      else apply();
    };
    window.addEventListener("coe-tier-recommendation", onRecommend);
    return () => window.removeEventListener("coe-tier-recommendation", onRecommend);
  }, []);

  const cta = ctaForRecommendedTier(tierId);

  return (
    <section className="relative py-24 overflow-hidden bg-linear-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
      <CtaTexture />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{cta.title}</h2>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{cta.body}</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
            <Link href={cta.primaryHref}>
              {cta.primaryLabel}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
            <Link href={cta.secondaryHref}>{cta.secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
