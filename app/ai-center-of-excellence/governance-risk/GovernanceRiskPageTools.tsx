// app/ai-center-of-excellence/governance-risk/GovernanceRiskPageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "AI Governance Board", description: "A cross-functional board that oversees development and deployment and ensures alignment with objectives, policies, and ethics." },
  { title: "Risk Assessment Process", description: "A structured process to identify, analyze, and mitigate technical, operational, and reputational risks." },
  { title: "Model Monitoring & Auditing", description: "Continuously monitor production models and run periodic audits to catch bias or unintended behavior." },
  { title: "Incident Response Plan", description: "Defined roles, responsibilities, and steps to mitigate issues and restore normal operations." },
  { title: "Regulatory Compliance", description: "Ensure development and deployment comply with relevant regulations, guidelines, and organizational policies." },
];

export function GovernanceRiskPageTools() {
  useCopilotAction({
    name: "getGovernanceRiskCapability",
    description:
      "Get details about a Governance, Risk & Responsible AI capability for an AI Center of Excellence. ONLY available on the Governance, Risk & Responsible AI pillar page.",
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
