"use client";

// components/coe/engagement-phases.tsx
// Interactive stepper for the "How an Engagement Runs" section: one phase in
// focus at a time instead of four stacked cards, with prev/next to create a
// sense of progression. Same GETTING_STARTED.phases data as the JSON-LD HowTo
// schema, so SEO output is unchanged.

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GETTING_STARTED } from "@/lib/coe/getting-started-data";
import { ClockIcon, ArrowLeft, ArrowRight } from "lucide-react";

export function EngagementPhases() {
  const phases = GETTING_STARTED.phases;
  const [active, setActive] = React.useState(0);
  const phase = phases[active];

  return (
    <div>
      {/* Stepper rail — nav/step semantics (not tabs): one shared panel below */}
      <nav aria-label="Engagement phases" className="mb-8 flex items-start justify-center">
        {phases.map((p, idx) => {
          const isActive = idx === active;
          const isPast = idx < active;
          return (
            <React.Fragment key={p.step}>
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className={cn("mt-6 h-0.5 w-6 shrink-0 sm:w-12 md:w-16", isPast || isActive ? "bg-primary/60" : "bg-border")}
                />
              )}
              <button
                type="button"
                id={`phase-tab-${p.step}`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => setActive(idx)}
                className="group flex w-16 flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-24"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-bold transition-all group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-brand scale-110"
                      : isPast
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                  )}
                >
                  {p.step}
                </span>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium leading-tight sm:block",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {p.title}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Active phase panel */}
      <section
        aria-labelledby={`phase-tab-${phase.step}`}
        className="mx-auto max-w-4xl"
      >
      <Card className="border-2">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-xl">
              <span className="mr-2 text-primary/40">{phase.step}</span>
              {phase.title}
            </CardTitle>
            <Badge variant="outline" className="w-fit">
              <ClockIcon className="mr-1 h-3 w-3" />
              {phase.duration}
            </Badge>
          </div>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            Entry tier: <span className="text-foreground">{phase.tierLabel}</span>
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary/70">We do</p>
              <p className="text-sm text-foreground">{phase.ossDoes}</p>
            </div>
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">You do</p>
              <p className="text-sm text-foreground">{phase.youDo}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">You get</p>
              <p className="text-sm text-foreground">{phase.deliverable}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              disabled={active === 0}
              onClick={() => setActive((i) => Math.max(0, i - 1))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <p className="text-xs text-muted-foreground">
              Phase {active + 1} of {phases.length}
            </p>
            <Button
              variant="ghost"
              size="sm"
              disabled={active === phases.length - 1}
              onClick={() => setActive((i) => Math.min(phases.length - 1, i + 1))}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      </section>
    </div>
  );
}
