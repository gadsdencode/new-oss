// app/ai-center-of-excellence/centralized-expertise/CentralizedExpertisePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Data Scientists", description: "Design, train, and validate models grounded in the organization's real problems and data." },
  { title: "ML Engineers", description: "Productionize and scale models so they run reliably and efficiently in production." },
  { title: "Domain Experts", description: "Translate business context - in supply chain, healthcare, finance, and more - into effective AI solutions." },
  { title: "Business Analysts", description: "Connect AI initiatives to measurable business outcomes and keep work tied to value." },
  { title: "Shared-Services Model", description: "A central team deployable across business units so expertise reaches every initiative that needs it." },
  { title: "Cross-Functional Collaboration", description: "Bring data scientists, analysts, and domain experts together on shared initiatives." },
];

export function CentralizedExpertisePageTools() {
  useCopilotAction({
    name: "getCentralizedExpertiseCapability",
    description:
      "Get details about a Centralized AI Expertise capability for an AI Center of Excellence. ONLY available on the Centralized AI Expertise pillar page.",
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
