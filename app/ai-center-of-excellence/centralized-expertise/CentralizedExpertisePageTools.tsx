// app/ai-center-of-excellence/centralized-expertise/CentralizedExpertisePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Domain Leaders & Strong Practitioners", description: "Surface the people whose judgment already works — and make that judgment reusable." },
  { title: "AI Product & Process Owners", description: "Owners who keep initiatives tied to outcomes, workflows, and operating accountability." },
  { title: "Agent & Application Engineers", description: "Builders who assemble agents, applications, and integrations for dependable use." },
  { title: "Data & Knowledge Engineers", description: "Engineers who ground AI in trusted structured and unstructured organizational context." },
  { title: "Evaluation & Quality Specialists", description: "Specialists who make quality measurable, repeatable, and improvable before and after release." },
  { title: "Platform, Security & Governance Specialists", description: "Roles that keep platforms safe, portable, and policy-aligned as usage grows." },
  { title: "Adoption & Enablement Leaders", description: "Leaders who redesign work, coach champions, and keep humans accountable in the loop." },
];

export function CentralizedExpertisePageTools() {
  useCopilotAction({
    name: "getCentralizedExpertiseCapability",
    description:
      "Get details about a Centralized AI Expertise capability. Emphasize multidisciplinary roles and that the CoE captures/reuses expertise without removing it from business units or requiring a large permanent hire wave. ONLY available on the Centralized Expertise pillar page.",
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
