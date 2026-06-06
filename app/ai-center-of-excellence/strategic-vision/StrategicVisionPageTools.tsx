// app/ai-center-of-excellence/strategic-vision/StrategicVisionPageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Forward-Looking Vision", description: "Craft a vision that inspires, emphasizes innovation, and aligns with strategic goals." },
  { title: "Measurable Objectives", description: "Clear, quantifiable objectives that map to the vision and drive business value." },
  { title: "Executive Sponsorship", description: "Secure sponsorship to unlock resources, drive adoption, and overcome barriers." },
  { title: "Dedicated AI Leadership", description: "Appoint a Chief AI Officer or Head of CoE to drive the mission." },
  { title: "Business-Goal Alignment", description: "Link AI projects and investments to strategic priorities." },
  { title: "Governance & Oversight", description: "Oversight that keeps the CoE aligned with evolving needs and ethics." },
];

export function StrategicVisionPageTools() {
  useCopilotAction({
    name: "getStrategicVisionCapability",
    description:
      "Get details about a Strategic Vision & Leadership capability for an AI Center of Excellence. ONLY available on the Strategic Vision pillar page.",
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
