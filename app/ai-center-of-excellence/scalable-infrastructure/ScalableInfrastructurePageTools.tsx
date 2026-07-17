// app/ai-center-of-excellence/scalable-infrastructure/ScalableInfrastructurePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Model & Agent Gateways", description: "Controlled entry points for model and agent traffic with consistent policy and oversight." },
  { title: "Enterprise Retrieval & Knowledge Grounding", description: "Ground responses in approved organizational knowledge — not unbounded web noise." },
  { title: "Agent Orchestration", description: "Coordinate multi-step agent workflows with clear boundaries and failure handling." },
  { title: "Evaluation Pipelines", description: "Test quality, intent alignment, and regressions before and after release." },
  { title: "Observability & Traceability", description: "See what ran, what was retrieved, and what changed when something goes wrong." },
  { title: "Guardrails & Policy Enforcement", description: "Apply organizational rules at runtime — not only in slide decks." },
  { title: "Human Approval Points", description: "Require human decision where risk, reputation, or regulation demands it." },
  { title: "Identity, Permissions & Security", description: "Control who and what can invoke capabilities, and what they may access." },
  { title: "Cost & Usage Controls", description: "Govern spend and consumption so scale does not become surprise." },
  { title: "Model & Cloud Portability", description: "Keep the operating model portable across models and environments." },
  { title: "Production Deployment & Continuous Improvement", description: "Ship, monitor, and improve — oriented to dependable business operation." },
];

export function ScalableInfrastructurePageTools() {
  useCopilotAction({
    name: "getScalableInfrastructureCapability",
    description:
      "Get details about a Scalable AI Infrastructure capability. Emphasize a model-agnostic capability layer for dependable business operation — not a legacy training stack. ONLY available on the Scalable AI Infrastructure pillar page.",
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
