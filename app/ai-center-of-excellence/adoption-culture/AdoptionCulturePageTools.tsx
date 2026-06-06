// app/ai-center-of-excellence/adoption-culture/AdoptionCulturePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Cross-Functional Collaboration", description: "Bring IT, data science, and business units together to break down silos and build shared understanding." },
  { title: "Comprehensive Training", description: "Programs covering AI, machine learning, and data-science fundamentals to equip every employee." },
  { title: "Showcase Use Cases", description: "Highlight real wins - efficiency, cost savings, better CX - to inspire and motivate wider adoption." },
  { title: "Continuous Learning Program", description: "Ongoing training and certification, workshops and seminars, and regular knowledge-sharing sessions." },
  { title: "AI Innovation Labs", description: "A space to experiment with new tools and techniques and promote a culture of innovation." },
  { title: "Continuous Feedback Loop", description: "Capture insights from AI projects and use them to refine strategy and implementation." },
];

export function AdoptionCulturePageTools() {
  useCopilotAction({
    name: "getAdoptionCultureCapability",
    description:
      "Get details about a Culture of Adoption & Continuous Learning capability for an AI Center of Excellence. ONLY available on the Adoption Culture pillar page.",
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
