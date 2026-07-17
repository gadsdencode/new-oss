"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BrainCircuitIcon, CheckCircle2, Loader2 } from "lucide-react";
import { GETTING_STARTED } from "@/lib/coe/getting-started-data";

// Pillars (mirror of page data, no icon field - serialized for the AI)
const coePillars = [
  { title: "Strategic Vision & Leadership", description: "Forward-looking AI vision, measurable objectives, executive sponsorship, and alignment to business goals.", features: ["Forward-looking vision", "Measurable objectives", "Executive sponsorship", "Business-goal alignment"] },
  { title: "Centralized AI Expertise", description: "A multidisciplinary concentration of domain experts, analysts, ML engineers, and data scientists — so judgment and delivery standards travel with every initiative. Not merely a team of data scientists.", features: ["Domain experts", "Business analysts", "ML engineers", "Data scientists"] },
  { title: "Scalable AI Infrastructure", description: "Cloud and hybrid AI platforms with model and agent gateways, retrieval services, containerized deployment, evaluation and observability, policy enforcement, human approval workflows, model portability, and cost and usage governance.", features: ["Cloud and hybrid platforms", "Model and agent gateways", "Retrieval and knowledge services", "Containerized deployment and orchestration", "Evaluation and observability", "Policy enforcement and guardrails", "Human approval workflows", "Model portability", "Cost and usage governance"] },
  { title: "Data Management & Governance", description: "A robust data ecosystem with cataloging, quality assurance, and secure storage.", features: ["Data cataloging", "Quality assurance", "Privacy & security", "Compliance monitoring"] },
  { title: "Governance, Risk & Responsible AI", description: "Governance board, risk assessment, model monitoring and auditing, incident response, and qualitative control areas for values and policy alignment, transparency, bias evaluation, privacy and security, and accountability with human oversight.", features: ["AI governance board", "Risk assessment", "Model monitoring & auditing", "Incident response", "Values and policy alignment", "Transparency and explainability", "Bias evaluation", "Privacy and security", "Accountability and human oversight"] },
  { title: "Culture of Adoption & Continuous Learning", description: "Cross-functional collaboration, training, success stories, and continuous upskilling.", features: ["Cross-functional collaboration", "Comprehensive training", "Showcase use cases", "Continuous upskilling"] },
];

const capabilityModel = [
  { step: "01", title: "Assess Current AI Maturity", description: "Evaluate existing capabilities to identify strengths, weaknesses, and areas for improvement." },
  { step: "02", title: "Define AI Maturity Levels", description: "Establish maturity levels from basic to advanced, aligned with strategic goals." },
  { step: "03", title: "Identify Capability Gaps", description: "Analyze current state against target levels and pinpoint where to improve." },
  { step: "04", title: "Develop a Roadmap for Growth", description: "Plan with specific goals, milestones, and timelines to advance maturity." },
  { step: "05", title: "Implement Continuous Improvement", description: "Review and update the model to stay aligned with evolving needs and best practices." },
];

const entryTiers = GETTING_STARTED.tiers.map((tier) => ({
  id: tier.id,
  name: tier.name,
  duration: tier.duration,
  scope: tier.whatItIs,
  walkAwayWith: tier.walkAwayWith,
  bestFor: tier.bestFor,
}));

export function CoEPageTools() {
  useCopilotAction({
    name: "getCoEPillarDetails",
    description:
      "Get detailed information about a specific AI Center of Excellence pillar. Use when the user asks about a CoE pillar, what it includes, or its capabilities. ONLY available on the AI Center of Excellence page.",
    parameters: [
      { name: "pillarName", type: "string", description: "The CoE pillar to get details for", required: true, enum: coePillars.map((p) => p.title) },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <CardTitle className="text-lg">Retrieving Pillar Details</CardTitle>
              </div>
              <CardDescription>Pillar: &quot;{args?.pillarName || "..."}&quot;</CardDescription>
            </CardHeader>
          </Card>
        );
      }
      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BrainCircuitIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{result.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.description && <p className="text-sm text-foreground">{result.description}</p>}
              {result.features && Array.isArray(result.features) && result.features.length > 0 && (
                <div>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Components</p>
                  <ul className="space-y-2">
                    {result.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }
      return <></>;
    },
    handler: async ({ pillarName }) => {
      const pillar = coePillars.find((p) => p.title === pillarName);
      if (!pillar) throw new Error(`CoE pillar "${pillarName}" not found`);
      return { success: true, ...pillar };
    },
  });

  useCopilotAction({
    name: "getCoECapabilitySteps",
    description:
      "Get the five-step AI capability model (maturity assessment through continuous improvement). Use when the user asks how OSS assesses AI maturity or builds the capability roadmap. ONLY available on the AI Center of Excellence page.",
    parameters: [],
    available: "enabled",
    handler: async () => ({ success: true, steps: capabilityModel }),
  });

  useCopilotAction({
    name: "getCoEEngagementProcess",
    description:
      "Get the three CoE entry tiers (Readiness Diagnostic, Foundation Pilot, CoE Build & Scale), their estimated durations, and scope. Emphasize that durations are estimates and that the Diagnostic does not include Foundation, Pilot & Prove, or Scale & Enable work. Clarify Snapshot vs Diagnostic naming. Use when the user asks how an engagement works, how long it takes, or how to get started. ONLY available on the AI Center of Excellence page.",
    parameters: [],
    available: "enabled",
    handler: async () => ({
      success: true,
      durationDisclaimer: GETTING_STARTED.durationDisclaimer,
      naming: {
        freeTool: "AI CoE Readiness Snapshot",
        formalEngagement: "Readiness Diagnostic",
        note: "Do not call both an assessment or both a diagnostic. The Snapshot is orientation only — not a validated maturity score.",
      },
      entryTiers,
      phases: GETTING_STARTED.phases,
      tierFinderLogic: {
        exploring: "Readiness Diagnostic",
        planning: "Readiness Diagnostic",
        building: "Foundation Pilot (if ≥2 foundations; else Diagnostic)",
        scaling: "CoE Build & Scale (if ≥2 foundations; else Diagnostic)",
        foundationGate: "Fewer than 2 foundations always recommends Readiness Diagnostic",
      },
    }),
  });

  useCopilotAction({
    name: "explainCoESnapshotVsDiagnostic",
    description:
      "Explain the difference between the free AI CoE Readiness Snapshot and the formal Readiness Diagnostic, including scoring (levels 0–3, 0–100%), maturity bands, what each tier includes, estimated timelines, and that later phases are not included in the Diagnostic. ONLY available on the AI Center of Excellence page.",
    parameters: [],
    available: "enabled",
    handler: async () => ({
      success: true,
      snapshot: {
        name: "AI CoE Readiness Snapshot",
        cost: "Free",
        purpose: "Orientation — maturity band, six-pillar profile, suggested entry tier",
        scoring: "Six pillars × levels 0–3; normalize to 0–100% (all-lowest 0%, all-highest 100%). Emphasize band/profile over percentage.",
        caveat: "Not an objective or validated organizational maturity score. Not the Readiness Diagnostic.",
      },
      diagnostic: {
        name: "Readiness Diagnostic",
        duration: "Estimated 2–3 weeks",
        scope: "Discovery across six pillars, prioritized gaps, success measures, recommended roadmap",
        notIncluded: ["Foundation", "Pilot & Prove", "Scale & Enable"],
      },
      otherTiers: entryTiers.filter((t) => t.id !== "diagnostic"),
      durationDisclaimer: GETTING_STARTED.durationDisclaimer,
    }),
  });

  return null;
}
