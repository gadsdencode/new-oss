// app/ai-center-of-excellence/adoption-culture/AdoptionCulturePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Role-Based Enablement", description: "Train people for the work they do — not generic fundamentals for everyone at once." },
  { title: "Workflow Redesign", description: "Change how work actually runs so AI is embedded, not bolted on as optional novelty." },
  { title: "AI Champions", description: "Cultivate local leaders who coach peers and surface issues early." },
  { title: "Reusable Operating Practices", description: "Capture patterns that travel — playbooks, prompts, checklists, and exception handling." },
  { title: "Capturing Strong-Performer Judgment", description: "Make the judgment of high performers available more consistently across the organization." },
  { title: "Human-AI Collaboration", description: "Design clear handoffs so people remain accountable for decisions that matter." },
  { title: "Adoption Measures", description: "Track whether capability is used, trusted, and improving outcomes — not vanity usage alone." },
  { title: "Feedback Loops", description: "Route frontline signal back into product, evaluation, and enablement." },
  { title: "Continuous Evaluation & Improvement", description: "Keep quality and fit under review as workflows and models change." },
  { title: "Responsible Internal Ownership", description: "Ensure business owners — not only the CoE — own outcomes and safe use." },
];

export function AdoptionCulturePageTools() {
  useCopilotAction({
    name: "getAdoptionCultureCapability",
    description:
      "Get details about an Adoption & Continuous Learning capability. Emphasize role-based enablement, workflow redesign, judgment capture, and human accountability — not generic company-wide fundamentals training. ONLY available on the Adoption Culture pillar page.",
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
