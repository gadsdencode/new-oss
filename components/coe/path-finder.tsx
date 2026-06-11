"use client";

// components/coe/path-finder.tsx
// Guided "find your path" wizard for the getting-started funnel.
// 2-3 clicks: journey stage -> prerequisites in place -> recommended entry tier.
// Reuses GETTING_STARTED copy verbatim; only the questions, stage labels, and
// "why this fits" blurbs are new microcopy.
//
// Deep links: reads ?stage=<JourneyStageId> (from StartHereBlock chips and the
// readiness assessment) to preselect step 1 and jump straight to step 2.
// Render inside <Suspense> - useSearchParams requires it under static prerender.

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
  recommendTier,
  isJourneyStageId,
  type JourneyStageId,
  type TierId,
} from "@/lib/coe/getting-started-data";
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

// Which engagement phases each tier covers (rendered as a mini tailored timeline).
const TIER_PHASE_STEPS: Record<TierId, readonly string[]> = {
  diagnostic: ["01"],
  pilot: ["01", "02", "03"],
  scale: ["01", "02", "03", "04"],
};

// "Why this fits" microcopy, keyed by recommended tier.
const TIER_FIT_BLURBS: Record<TierId, string> = {
  diagnostic:
    "The diagnostic gives you an objective baseline and a clear roadmap before you commit budget or headcount - the lowest-risk way to turn intent into a plan.",
  pilot:
    "You're already building. The pilot proves value on one real use case while standing up the governance and data baseline everything else will run on.",
  scale:
    "AI already works in pockets of your organization. Build & Scale turns those pockets into one durable, organization-wide capability.",
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
  const initialStage: JourneyStageId | null = isJourneyStageId(stageParam) ? stageParam : null;

  const [step, setStep] = React.useState<Step>(initialStage ? "prereqs" : "stage");
  const [stage, setStage] = React.useState<JourneyStageId | null>(initialStage);
  const [checked, setChecked] = React.useState<boolean[]>(
    () => GETTING_STARTED.prerequisites.map(() => false)
  );

  const prerequisitesMet = checked.filter(Boolean).length;
  const recommendedId = stage ? recommendTier(stage, prerequisitesMet) : "diagnostic";
  const tier = GETTING_STARTED.tiers.find((t) => t.id === recommendedId) ?? GETTING_STARTED.tiers[0];
  const stageInfo = stage ? JOURNEY_STAGES.find((s) => s.id === stage) : null;
  // The rule downgraded the stage's natural tier because foundations are missing.
  const downgraded = stageInfo ? stageInfo.tierId !== recommendedId : false;
  const TierIcon = TIER_ICONS[tier.id];
  const stepIndex = STEP_LABELS.findIndex((s) => s.id === step);

  const handleStage = (id: JourneyStageId) => {
    setStage(id);
    setStep("prereqs");
  };

  const togglePrereq = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
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
        {/* Step indicator */}
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

        {/* Step 1: journey stage */}
        {step === "stage" && (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <CompassIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Where are you today?</h3>
              <p className="mt-2 text-muted-foreground">
                One click - we&apos;ll point you to the right starting tier.
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

        {/* Step 2: prerequisites in place */}
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
                Check everything that exists today. Gaps are normal - they shape the recommendation.
              </p>
              {/* Echo the stage so deep-linked visitors (readiness check, stage
                  chips) can see - and correct - what was pre-selected for them. */}
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
              <Button onClick={() => setStep("result")} className="shadow-brand">
                See my starting point
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Result: recommended tier */}
        {step === "result" && (
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
                <span>
                  {downgraded
                    ? GETTING_STARTED.prerequisitesNote
                    : TIER_FIT_BLURBS[tier.id]}
                </span>
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

            {/* Tailored mini-timeline: which engagement phases this tier covers */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your engagement covers
              </p>
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
                  Start with the {tier.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToCompare}>
                Compare all three tiers
              </Button>
            </div>
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
