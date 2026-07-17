// app/ai-center-of-excellence/governance-risk/GovernanceRiskPageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Use-Case Intake & Risk Tiering", description: "Classify initiatives by risk and required controls before build accelerates." },
  { title: "Ownership & Decision Rights", description: "Name who owns outcomes, risk acceptance, and go-live decisions." },
  { title: "Pre-Deployment Evaluation", description: "Evaluate quality, intent alignment, and failure modes before release — including ICDU where appropriate." },
  { title: "Provenance", description: "Track model, prompt, policy, and version lineage so change is auditable." },
  { title: "Human Approval Requirements", description: "Define when a human must approve before an action or output is final." },
  { title: "Audit Evidence", description: "Retain the evidence trail needed for review — not paperwork theater." },
  { title: "Production Monitoring", description: "Watch behavior, quality signals, and drift after go-live." },
  { title: "Incident Escalation", description: "Clear paths to contain, communicate, and recover when AI misbehaves." },
  { title: "Periodic Reassessment", description: "Revisit risk, controls, and fitness as use and models change." },
  { title: "Organizational & Regulatory Alignment", description: "Align controls to applicable organizational policies and regulatory requirements." },
];

export function GovernanceRiskPageTools() {
  useCopilotAction({
    name: "getGovernanceRiskCapability",
    description:
      "Get details about a Governance, Risk & Responsible AI capability. Emphasize operational evidence (intake, evaluation, provenance, monitoring). ICDU is a quality/evaluation capability that improves effectiveness and alignment — not mere compliance documentation. ONLY available on the Governance Risk pillar page.",
    parameters: [
      { name: "capabilityName", type: "string", description: "The capability", required: true, enum: capabilities.map((c) => c.title) },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <CardTitle className="text-lg">Retrieving &quot;{args?.capabilityName || "..."}&quot;</CardTitle>
              </div>
            </CardHeader>
          </Card>
        );
      }
      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">{result.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{result.description}</p>
            </CardContent>
          </Card>
        );
      }
      return <></>;
    },
    handler: async ({ capabilityName }) => {
      const c = capabilities.find((x) => x.title === capabilityName);
      if (!c) throw new Error(`Capability "${capabilityName}" not found`);
      return { success: true, ...c };
    },
  });

  return null;
}
