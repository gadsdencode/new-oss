"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  TargetIcon,
  UsersIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  GaugeIcon,
  RotateCcw,
  ArrowRight,
  TrendingUpIcon,
  AlertCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "@/components/ui/border-beam";
import { GETTING_STARTED_PATH } from "@/lib/coe/getting-started-data";
import {
  computeSnapshotResult,
  type SnapshotLevel,
  type SnapshotPillarId,
} from "@/lib/coe/readiness-snapshot";
import { createSnapshotHandoff, writeSnapshotHandoff } from "@/lib/coe/snapshot-handoff";

interface Pillar {
  id: SnapshotPillarId;
  label: string;
  title: string;
  icon: React.ElementType;
  question: string;
  options: { level: SnapshotLevel; label: string }[];
}

const PILLARS: Pillar[] = [
  {
    id: "vision",
    label: "Vision",
    title: "Strategic Vision & Leadership",
    icon: TargetIcon,
    question: "How defined is your AI vision and leadership?",
    options: [
      { level: 0, label: "No formal AI vision or executive sponsor" },
      { level: 1, label: "Informal interest, but no roadmap or owner" },
      { level: 2, label: "Documented vision with an executive sponsor" },
      { level: 3, label: "Board-level AI strategy with measurable objectives" },
    ],
  },
  {
    id: "expertise",
    label: "Expertise",
    title: "Centralized AI Expertise",
    icon: UsersIcon,
    question: "How is AI expertise organized and reused?",
    options: [
      { level: 0, label: "No dedicated AI capability or shared practices" },
      { level: 1, label: "A few individuals scattered across teams" },
      { level: 2, label: "A forming shared capability or multidisciplinary group" },
      { level: 3, label: "Reusable multidisciplinary expertise across the org" },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    title: "Scalable AI Infrastructure",
    icon: ServerIcon,
    question: "What does your AI operating layer look like?",
    options: [
      { level: 0, label: "Ad-hoc experiments only" },
      { level: 1, label: "Some cloud or API usage with manual paths" },
      { level: 2, label: "Repeatable deployment with basic controls" },
      { level: 3, label: "Governed, observable, portable production paths" },
    ],
  },
  {
    id: "data",
    label: "Data",
    title: "Data Management & Governance",
    icon: DatabaseIcon,
    question: "How trusted is the context AI systems can use?",
    options: [
      { level: 0, label: "Siloed, ungoverned information" },
      { level: 1, label: "Basic storage with limited quality controls" },
      { level: 2, label: "Cataloged sources with quality and access controls" },
      { level: 3, label: "Trusted context with freshness, permissions, and influence evidence" },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    title: "Governance, Risk & Responsible AI",
    icon: ShieldCheckIcon,
    question: "How do you govern AI risk in operation?",
    options: [
      { level: 0, label: "No governance or risk process" },
      { level: 1, label: "Aware of risks, but nothing formalized" },
      { level: 2, label: "Intake, ownership, and risk reviews in place" },
      { level: 3, label: "Evaluation, approvals, monitoring, and incident paths in production" },
    ],
  },
  {
    id: "adoption",
    label: "Adoption",
    title: "Culture of Adoption & Continuous Learning",
    icon: GraduationCapIcon,
    question: "How is AI adopted and improved in the work?",
    options: [
      { level: 0, label: "Little awareness or adoption" },
      { level: 1, label: "Pockets of experimentation" },
      { level: 2, label: "Role-based enablement and workflow change underway" },
      { level: 3, label: "Org-wide practices with feedback and continuous improvement" },
    ],
  },
];

const C = {
  blue: "#0B7CFF",
  cyan: "#11B7FF",
  aqua: "#00D6C9",
  grid: "#334155",
  axis: "#64748B",
};

type Answers = Record<SnapshotPillarId, SnapshotLevel | null>;

const EMPTY_ANSWERS: Answers = {
  vision: null,
  expertise: null,
  infrastructure: null,
  data: null,
  governance: null,
  adoption: null,
};

export function CoEReadinessAssessment() {
  const [answers, setAnswers] = React.useState<Answers>(EMPTY_ANSWERS);

  const answeredCount = PILLARS.filter((p) => answers[p.id] !== null).length;
  const allAnswered = answeredCount === PILLARS.length;

  const result = React.useMemo(() => {
    if (!allAnswered) return null;
    return computeSnapshotResult(
      PILLARS.map((p) => ({
        id: p.id,
        level: answers[p.id] as SnapshotLevel,
        title: p.title,
        label: p.label,
      }))
    );
  }, [allAnswered, answers]);

  // Persist handoff whenever a complete result is available.
  React.useEffect(() => {
    if (!result) return;
    writeSnapshotHandoff(
      createSnapshotHandoff({
        maturityBandId: result.band.id,
        maturityBandName: result.band.name,
        recommendedTierId: result.band.entryTierId,
        recommendedTierName: result.band.entryTierName,
        stageId: result.band.stageId,
        largestGapId: result.opportunity.id,
        largestGapLabel: result.opportunity.title,
        strongestId: result.strongest.id,
        strongestLabel: result.strongest.title,
        percent: result.percent,
      })
    );
  }, [result]);

  const radarData = PILLARS.map((p) => ({
    pillar: p.label,
    score: answers[p.id] ?? 0,
    fullMark: 3,
  }));

  const progressValue = allAnswered && result ? result.percent : Math.round((answeredCount / PILLARS.length) * 100);

  const handleSelect = (id: SnapshotPillarId, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: Number(value) as SnapshotLevel }));
  };

  const handleReset = () => {
    setAnswers(EMPTY_ANSWERS);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0B7CFF]/20 to-[#00D6C9]/20">
                <GaugeIcon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Rate Your Organization</CardTitle>
            </div>
            <CardDescription>
              AI CoE Readiness Snapshot — choose the statement that best matches your current state for each pillar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {PILLARS.map((p, idx) => (
              <fieldset key={p.id} className="min-w-0">
                <legend className="mb-3 w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <p.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-foreground">{p.title}</span>
                      <span className="block text-xs text-muted-foreground font-normal">{p.question}</span>
                    </div>
                  </div>
                </legend>
                <RadioGroup
                  value={answers[p.id] !== null ? String(answers[p.id]) : ""}
                  onValueChange={(v) => handleSelect(p.id, v)}
                  className="gap-2 pl-1"
                  aria-label={p.question}
                >
                  {p.options.map((opt) => {
                    const optId = `${p.id}-${opt.level}`;
                    const selected = answers[p.id] === opt.level;
                    return (
                      <Label
                        key={optId}
                        htmlFor={optId}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-primary ${
                          selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem id={optId} value={String(opt.level)} className="mt-0.5" />
                        <span className="text-sm text-foreground leading-snug">{opt.label}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>
                {idx < PILLARS.length - 1 && <Separator className="mt-8" />}
              </fieldset>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-6">
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-[#0B7CFF]/5 via-card to-[#00D6C9]/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0B7CFF] to-[#00D6C9]">
                  <GaugeIcon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Your Snapshot Profile</CardTitle>
              </div>
              <CardDescription>Orientation from your six-pillar answers — not a validated maturity score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className="text-center py-2"
                aria-live="polite"
                aria-atomic="true"
                role="status"
              >
                {allAnswered && result ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Maturity band</p>
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{result.band.name}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Indicative profile index{" "}
                      <span className="font-medium text-foreground/80">{result.percent}%</span>
                      <span className="block mt-0.5">(self-reported · for orientation)</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Progress</p>
                    <div className="text-5xl font-bold bg-gradient-to-r from-[#0B7CFF] via-[#11B7FF] to-[#00D6C9] bg-clip-text text-transparent">
                      {answeredCount}/6
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">pillars answered</p>
                  </>
                )}
              </div>

              <Progress
                value={progressValue}
                className="h-2"
                aria-label={
                  allAnswered
                    ? `Indicative profile index ${result?.percent ?? 0} percent`
                    : `Snapshot progress ${answeredCount} of 6 pillars answered`
                }
              />

              <div
                className="h-[240px] w-full"
                role="img"
                aria-label="Six-pillar readiness radar chart reflecting your current answers"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke={C.grid} strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 10, fill: C.axis }} />
                    <Radar dataKey="score" stroke={C.blue} fill={C.cyan} fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {allAnswered && result ? (
                <>
                  <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-lg border border-border/80 p-3 text-sm">
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                        <TrendingUpIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        Strongest current capability
                      </p>
                      <p className="font-semibold text-foreground">{result.strongest.title}</p>
                    </div>
                    <div className="rounded-lg border border-border/80 p-3 text-sm">
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                        <AlertCircleIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        Largest opportunity
                      </p>
                      <p className="font-semibold text-foreground">{result.opportunity.title}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Recommended entry tier</p>
                      <p className="font-semibold text-foreground">{result.band.entryTierName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{result.band.whyTier}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{result.band.blurb}</p>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground text-center">Next step</p>
                    <Button className="w-full whitespace-normal shadow-brand" asChild>
                      <Link href={`${GETTING_STARTED_PATH}?stage=${result.band.stageId}`}>
                        Continue to Confirm Your Tier
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full whitespace-normal" asChild>
                      <Link href={`/contact?intent=${result.band.entryTierId}`}>
                        {result.band.ctaLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={handleReset}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Start Over
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Answer all six pillars to see your maturity band, pillar profile, and a suggested starting tier.
                </p>
              )}
            </CardContent>

            {allAnswered && <BorderBeam duration={8} size={120} colorFrom="#0B7CFF" colorTo="#00D6C9" />}
          </Card>

          <p className="text-xs text-muted-foreground text-center px-4">
            This AI CoE Readiness Snapshot is for orientation only. It is not an objective or validated organizational
            maturity score, and it is not the Readiness Diagnostic — that is a formal estimated 2–3 week engagement
            that produces a substantiated maturity baseline, prioritized gaps, success measures, and a recommended
            roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
