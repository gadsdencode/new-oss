"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Link from "next/link";

type PillarId = "vision" | "expertise" | "infrastructure" | "data" | "governance" | "adoption";

interface Pillar {
  id: PillarId;
  label: string; // short label for the radar axis
  title: string;
  icon: React.ElementType;
  question: string;
  options: { score: number; label: string }[];
}

const PILLARS: Pillar[] = [
  {
    id: "vision",
    label: "Vision",
    title: "Strategic Vision & Leadership",
    icon: TargetIcon,
    question: "How defined is your AI vision and leadership?",
    options: [
      { score: 1, label: "No formal AI vision or executive sponsor" },
      { score: 2, label: "Informal interest, but no roadmap or owner" },
      { score: 3, label: "Documented vision with an executive sponsor" },
      { score: 4, label: "Board-level AI strategy with measurable objectives" },
    ],
  },
  {
    id: "expertise",
    label: "Expertise",
    title: "Centralized AI Expertise",
    icon: UsersIcon,
    question: "How is your AI talent organized?",
    options: [
      { score: 1, label: "No dedicated AI/ML talent" },
      { score: 2, label: "A few individuals scattered across teams" },
      { score: 3, label: "A forming central team or shared resource" },
      { score: 4, label: "A multidisciplinary CoE deployable across the org" },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    title: "Scalable AI Infrastructure",
    icon: ServerIcon,
    question: "What does your AI infrastructure look like?",
    options: [
      { score: 1, label: "Ad-hoc, local experiments only" },
      { score: 2, label: "Some cloud usage with manual deployment" },
      { score: 3, label: "Cloud-native with repeatable deployments" },
      { score: 4, label: "Autoscaling, containerized, and fully observable" },
    ],
  },
  {
    id: "data",
    label: "Data",
    title: "Data Management & Governance",
    icon: DatabaseIcon,
    question: "How mature is your data foundation?",
    options: [
      { score: 1, label: "Siloed, ungoverned data" },
      { score: 2, label: "Basic storage with limited quality controls" },
      { score: 3, label: "Cataloged data with quality and access controls" },
      { score: 4, label: "A governed ecosystem with compliance monitoring" },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    title: "Governance, Risk & Responsible AI",
    icon: ShieldCheckIcon,
    question: "How do you govern AI risk?",
    options: [
      { score: 1, label: "No governance or risk process" },
      { score: 2, label: "Aware of risks, but nothing formalized" },
      { score: 3, label: "A governance board and risk reviews in place" },
      { score: 4, label: "Continuous model monitoring, auditing & incident response" },
    ],
  },
  {
    id: "adoption",
    label: "Adoption",
    title: "Culture of Adoption & Continuous Learning",
    icon: GraduationCapIcon,
    question: "How widely is AI adopted across your organization?",
    options: [
      { score: 1, label: "Little awareness or adoption" },
      { score: 2, label: "Pockets of experimentation" },
      { score: 3, label: "Cross-functional adoption with training" },
      { score: 4, label: "Org-wide adoption with continuous learning" },
    ],
  },
];

interface Tier {
  min: number; // minimum total score (out of 24) for this tier
  name: string;
  blurb: string;
  ctaLabel: string;
}

// Highest tier whose `min` the total meets, evaluated top-down.
const TIERS: Tier[] = [
  { min: 21, name: "Leading", blurb: "You're operating at a high level. We can help you optimize, govern at scale, and stay at the frontier of AI capability.", ctaLabel: "Schedule an Optimization Review" },
  { min: 17, name: "Operational", blurb: "You have a working foundation. The opportunity now is consistency and scale across the whole organization.", ctaLabel: "Schedule a Scaling Assessment" },
  { min: 12, name: "Developing", blurb: "You have momentum in places. Centralizing expertise and governance will turn pilots into a repeatable capability.", ctaLabel: "Schedule a Strategy Session" },
  { min: 0, name: "Foundational", blurb: "You're at the starting line. A structured assessment and roadmap will give you the fastest path to value.", ctaLabel: "Schedule a Discovery Call" },
];

function getTier(total: number): Tier {
  return TIERS.find((t) => total >= t.min) ?? TIERS[TIERS.length - 1];
}

// Brand palette
const C = {
  blue: "#0B7CFF",
  cyan: "#11B7FF",
  aqua: "#00D6C9",
  grid: "#334155",
  axis: "#64748B",
};

export function CoEReadinessAssessment() {
  const [answers, setAnswers] = React.useState<Record<PillarId, number>>({
    vision: 0,
    expertise: 0,
    infrastructure: 0,
    data: 0,
    governance: 0,
    adoption: 0,
  });

  const answeredCount = PILLARS.filter((p) => answers[p.id] > 0).length;
  const allAnswered = answeredCount === PILLARS.length;
  const total = PILLARS.reduce((sum, p) => sum + answers[p.id], 0);
  const maxTotal = PILLARS.length * 4;
  const readiness = Math.round((total / maxTotal) * 100);
  const tier = getTier(total);

  // Lowest-scoring answered pillar = biggest opportunity
  const opportunity = allAnswered
    ? [...PILLARS].sort((a, b) => answers[a.id] - answers[b.id])[0]
    : null;

  const radarData = PILLARS.map((p) => ({
    pillar: p.label,
    score: answers[p.id],
    fullMark: 4,
  }));

  const handleSelect = (id: PillarId, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleReset = () => {
    setAnswers({ vision: 0, expertise: 0, infrastructure: 0, data: 0, governance: 0, adoption: 0 });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Left Column - Questions */}
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
              Choose the statement that best matches your current state for each of the six CoE pillars.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {PILLARS.map((p, idx) => (
              <div key={p.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.question}</p>
                  </div>
                </div>
                <RadioGroup
                  value={answers[p.id] ? String(answers[p.id]) : ""}
                  onValueChange={(v) => handleSelect(p.id, v)}
                  className="gap-2 pl-1"
                >
                  {p.options.map((opt) => {
                    const optId = `${p.id}-${opt.score}`;
                    const selected = answers[p.id] === opt.score;
                    return (
                      <Label
                        key={optId}
                        htmlFor={optId}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                          selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem id={optId} value={String(opt.score)} className="mt-0.5" />
                        <span className="text-sm text-foreground leading-snug">{opt.label}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>
                {idx < PILLARS.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Sticky Result Summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-[#0B7CFF]/5 via-card to-[#00D6C9]/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0B7CFF] to-[#00D6C9]">
                  <GaugeIcon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Your AI Readiness</CardTitle>
              </div>
              <CardDescription>Live profile based on your answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score */}
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-2">Readiness Score</p>
                <div className="text-5xl font-bold bg-gradient-to-r from-[#0B7CFF] via-[#11B7FF] to-[#00D6C9] bg-clip-text text-transparent">
                  {answeredCount > 0 ? `${readiness}%` : "—"}
                </div>
                {allAnswered ? (
                  <Badge variant="outline" className="mt-3 border-primary/50 text-primary">
                    {tier.name} Maturity
                  </Badge>
                ) : (
                  <p className="text-xs text-muted-foreground mt-3">{answeredCount}/6 pillars answered</p>
                )}
              </div>

              <Progress value={readiness} className="h-2" />

              {/* Radar */}
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke={C.grid} strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 10, fill: C.axis }} />
                    <Radar dataKey="score" stroke={C.blue} fill={C.cyan} fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {allAnswered ? (
                <>
                  <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  {opportunity && (
                    <div className="text-sm">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Your biggest opportunity</p>
                      <p className="font-semibold text-foreground">{opportunity.title}</p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{tier.blurb}</p>
                  <div className="space-y-3">
                    <Button className="w-full shadow-brand" asChild>
                      <Link href="/contact">
                        {tier.ctaLabel}
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
                  Answer all six pillars to reveal your maturity tier and a tailored next step.
                </p>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center px-4">
            This is a self-assessment for orientation only. A full OSS assessment evaluates each pillar in depth.
          </p>
        </div>
      </div>
    </div>
  );
}
