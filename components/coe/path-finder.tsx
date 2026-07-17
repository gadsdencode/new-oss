"use client";

// components/coe/path-finder.tsx
// Guided tier finder for the getting-started funnel.
// Stage → foundations → recommended entry tier.
// Reads Snapshot handoff (session) + optional ?stage= deep link.
// Does not re-ask the stage when already supplied; visitor can still change it.

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import {
  GETTING_STARTED,
  JOURNEY_STAGES,
  explainTierRecommendation,
  isJourneyStageId,
  type JourneyStageId,
  type TierId,
} from "@/lib/coe/getting-started-data";
import {
  readSnapshotHandoff,
  writeSnapshotHandoff,
  type SnapshotHandoff,
} from "@/lib/coe/snapshot-handoff";
import {
  SearchCheckIcon,
  RocketIcon,
  TrendingUpIcon,
  CompassIcon,
  ClipboardCheckIcon,
  ClockIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  SparklesIcon,
} from "lucide-react";

const TIER_ICONS: Record<TierId, React.ElementType> = {
  diagnostic: SearchCheckIcon,
  pilot: RocketIcon,
  scale: TrendingUpIcon,
};

// Which engagement phases each tier primarily covers (highlighted chips).
// Diagnostic = phase 01 only. Pilot = 02–03. Build & Scale spans the broader path.
const TIER_PHASE_STEPS: Record<TierId, readonly string[]> = {
  diagnostic: ["01"],
  pilot: ["02", "03"],
  scale: ["01", "02", "03", "04"],
};

const JOURNEY_HEADING: Record<TierId, string> = {
  diagnostic: "How this starting point connects to the broader journey",
  pilot: "Where the broader CoE journey can lead",
  scale: "Where the broader CoE journey can lead",
};

type Step = "stage" | "prereqs" | "result";

const STEP_LABELS: { id: Step; label: string }[] = [
  { id: "stage", label: "Your stage" },
  { id: "prereqs", label: "Your foundations" },
  { id: "result", label: "Your path" },
];

export function PathFinder() {
  const searchParams = useSearchParams();
  const stageParam = searchParams.get("stage");
  const urlStage: JourneyStageId | null = isJourneyStageId(stageParam) ? stageParam : null;

  const [handoff, setHandoff] = React.useState<SnapshotHandoff | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = readSnapshotHandoff();
    setHandoff(stored);
    setHydrated(true);
  }, []);

  const [step, setStep] = React.useState<Step>("stage");
  const [stage, setStage] = React.useState<JourneyStageId | null>(null);
  const [checked, setChecked] = React.useState<boolean[]>(() =>
    GETTING_STARTED.prerequisites.map(() => false)
  );
  const [initializedFromHandoff, setInitializedFromHandoff] = React.useState(false);

  // After hydration, apply stage + foundation preselection once.
  React.useEffect(() => {
    if (!hydrated || initializedFromHandoff) return;
    const resolvedStage = urlStage ?? handoff?.stageId ?? null;
    if (resolvedStage) {
      setStage(resolvedStage);
      setStep("prereqs");
    }
    if (handoff?.foundationIndexes?.length) {
      setChecked(
        GETTING_STARTED.prerequisites.map((_, idx) =>
          handoff.foundationIndexes!.includes(idx)
        )
      );
    }
    setInitializedFromHandoff(true);
  }, [hydrated, handoff, urlStage, initializedFromHandoff]);

  const foundationsMet = checked.filter(Boolean).length;
  const recommendation = stage
    ? explainTierRecommendation(stage, foundationsMet)
    : null;
  const recommendedId = recommendation?.tierId ?? "diagnostic";
  const tier = GETTING_STARTED.tiers.find((t) => t.id === recommendedId) ?? GETTING_STARTED.tiers[0];
  const stageInfo = stage ? JOURNEY_STAGES.find((s) => s.id === stage) : null;
  const TierIcon = TIER_ICONS[tier.id];
  const stepIndex = STEP_LABELS.findIndex((s) => s.id === step);
  const fromSnapshot = Boolean(handoff);

  const handleStage = (id: JourneyStageId) => {
    setStage(id);
    setStep("prereqs");
  };

  const togglePrereq = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleSeeResult = () => {
    if (!stage || !recommendation) return;
    const indexes = checked
      .map((on, idx) => (on ? idx : -1))
      .filter((idx) => idx >= 0);
    const tierMeta = GETTING_STARTED.tiers.find((t) => t.id === recommendation.tierId);
    const existing = readSnapshotHandoff();
    writeSnapshotHandoff({
      version: 1,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      maturityBandId: existing?.maturityBandId ?? "foundational",
      maturityBandName: existing?.maturityBandName ?? "Foundational",
      largestGapId: existing?.largestGapId ?? "vision",
      largestGapLabel: existing?.largestGapLabel ?? "Strategic Vision & Leadership",
      strongestId: existing?.strongestId ?? "vision",
      strongestLabel: existing?.strongestLabel ?? "Strategic Vision & Leadership",
      percent: existing?.percent ?? 0,
      foundationIndexes: indexes,
      recommendedTierId: recommendation.tierId,
      recommendedTierName: tierMeta?.name ?? "Readiness Diagnostic",
      stageId: stage,
    });
    setHandoff(readSnapshotHandoff());
    window.dispatchEvent(
      new CustomEvent("coe-tier-recommendation", { detail: { tierId: recommendation.tierId } })
    );
    setStep("result");
  };

  const handleReset = () => {
    setStep("stage");
    setStage(null);
    setChecked(GETTING_STARTED.prerequisites.map(() => false));
  };

  const scrollToCompare = () => {
    document.getElementById("compare-tiers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 mx-auto max-w-3xl">
      {step === "result" && (
        <BorderBeam size={140} duration={8} colorFrom="#0B7CFF" colorTo="#00D6C9" />
      )}
      <CardContent className="p-6 sm:p-10">
        <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-3" aria-label="Path finder progress">
          {STEP_LABELS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2 sm:gap-3">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                  i < stepIndex && "border-primary bg-primary text-primary-foreground",
                  i === stepIndex && "border-primary text-primary",
                  i > stepIndex && "border-border text-muted-foreground"
                )}
                aria-current={i === stepIndex ? "step" : undefined}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium sm:text-sm",
                  i === stepIndex ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <span aria-hidden="true" className="h-px w-4 bg-border sm:w-8" />
              )}
            </li>
          ))}
        </ol>

        {step === "stage" && (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <CompassIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Where are you today?</h3>
              <p className="mt-2 text-muted-foreground">
                One click — we&apos;ll point you to the right starting tier.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {JOURNEY_STAGES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStage(s.id)}
                  className="group rounded-xl border-2 border-border p-4 text-left transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex items-center justify-between font-semibold text-foreground">
                    {s.label}
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "prereqs" && (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                What do you already have in place?
              </h3>
              <p className="mt-2 text-muted-foreground">
                Check everything that exists today. Gaps are normal — they shape the recommendation.
              </p>
              {stageInfo && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Your stage:{" "}
                  <span className="font-semibold text-foreground">{stageInfo.label}</span>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setStep("stage")}
                    className="font-medium text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    change
                  </button>
                </p>
              )}
              {fromSnapshot && handoff && (
                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-left text-sm">
                  <p className="text-xs font-medium text-muted-foreground mb-1">From your AI CoE Readiness Snapshot</p>
                  <p className="text-foreground">
                    <span className="font-semibold">{handoff.maturityBandName}</span>
                    {" band · largest opportunity: "}
                    <span className="font-semibold">{handoff.largestGapLabel}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Confirm foundations below — we won&apos;t ask you to re-rate the pillars.
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {GETTING_STARTED.prerequisites.map((req, idx) => {
                const isOn = checked[idx];
                const prereqId = `path-finder-prereq-${idx}`;
                return (
                  <Label
                    key={req.title}
                    htmlFor={prereqId}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                      isOn ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      id={prereqId}
                      checked={isOn}
                      onCheckedChange={() => togglePrereq(idx)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block font-semibold text-foreground">{req.title}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{req.detail}</span>
                    </span>
                  </Label>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button variant="ghost" onClick={() => setStep("stage")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSeeResult} className="shadow-brand">
                See my starting point
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "result" && recommendation && (
          <div>
            <div className="mb-6 text-center">
              <Badge className="mb-4">Your recommended starting point</Badge>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TierIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">{tier.name}</h3>
              <p className="mt-1 text-base font-medium text-foreground/80">{tier.tagline}</p>
              <Badge variant="outline" className="mt-3">
                <ClockIcon className="mr-1 h-3 w-3" />
                {tier.duration}
              </Badge>
            </div>

            <p className="text-center text-muted-foreground">{tier.whatItIs}</p>

            <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="flex items-start gap-2 text-sm text-foreground">
                <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{recommendation.reason}</span>
              </p>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/70">
                You walk away with
              </p>
              <ul className="space-y-2">
                {tier.walkAwayWith.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {JOURNEY_HEADING[tier.id]}
              </p>
              {tier.id === "diagnostic" && (
                <p className="mb-3 text-xs text-muted-foreground">
                  The Readiness Diagnostic itself is limited to Discovery &amp; Readiness (estimated 2–3 weeks). Later
                  phases belong to subsequent tiers.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {GETTING_STARTED.phases.map((phase) => {
                  const included = TIER_PHASE_STEPS[tier.id].includes(phase.step);
                  return (
                    <span
                      key={phase.step}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                        included
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground/60"
                      )}
                    >
                      <span className={cn("font-bold", included ? "text-primary" : "")}>{phase.step}</span>
                      {phase.title}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="shadow-brand whitespace-normal" asChild>
                <Link href={`/contact?intent=${tier.id}`}>
                  Request the {tier.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToCompare}>
                Compare all three tiers
              </Button>
            </div>
            {(tier.id === "pilot" || tier.id === "scale") && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Prefer a lower-commitment start?{" "}
                <Link href="/contact?intent=diagnostic" className="font-medium text-primary underline underline-offset-2">
                  Request a Readiness Diagnostic
                </Link>
              </p>
            )}
            <div className="mt-3 text-center">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Start over
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
