// app/ai-center-of-excellence/strategic-vision/StrategicVisionPageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Business Priorities & Outcomes", description: "Tie AI work to measurable business outcomes — not activity metrics or vague aspiration." },
  { title: "Sponsorship & Decision Rights", description: "Name executive sponsors and clarify who decides scope, funding, risk acceptance, and go-live." },
  { title: "Use-Case Portfolio Management", description: "Intake, prioritize, and sequence initiatives so capacity follows value rather than noise." },
  { title: "Resource & Usage Governance", description: "Set expectations for spend, model usage, and capacity so pilots do not become uncontrolled cost centers." },
  { title: "Success Measures & Value Realization", description: "Define what good looks like before build starts, and how value will be reviewed after launch." },
  { title: "Sequenced Roadmap with Credible Wins", description: "Plan a path with early, defensible wins that build confidence without skipping foundations." },
  { title: "Evaluation-to-Operation Ownership", description: "Assign clear ownership for moving work from evaluation into dependable operation." },
];

export function StrategicVisionPageTools() {
  useCopilotAction({
    name: "getStrategicVisionCapability",
    description:
      "Get details about a Strategic Vision & Leadership capability for an AI Center of Excellence. Emphasize operating mechanisms (portfolio, sponsorship, ownership), not inspirational vision alone. ONLY available on the Strategic Vision pillar page.",
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
