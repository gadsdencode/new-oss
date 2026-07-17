// app/ai-center-of-excellence/data-governance/DataGovernancePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Structured & Unstructured Information", description: "Treat tables, documents, tickets, and knowledge bases as first-class context — not an afterthought." },
  { title: "Knowledge Sources", description: "Identify which sources are authoritative for which questions and workflows." },
  { title: "Data Permissions", description: "Ensure AI can only retrieve what the user and use case are allowed to see." },
  { title: "Context Freshness", description: "Keep grounding material current so answers do not lag reality." },
  { title: "Retrieval Quality", description: "Measure whether the right context is retrieved for the task — not merely that something was retrieved." },
  { title: "Cataloging & Lineage", description: "Know what exists, where it came from, and how it flows into AI systems." },
  { title: "Data Quality", description: "Improve completeness, accuracy, and consistency for the contexts AI depends on." },
  { title: "Privacy & Security", description: "Protect sensitive information across storage, retrieval, and generation paths." },
  { title: "Approved Use Boundaries", description: "Define what information may be used for which AI purposes." },
  { title: "Influence Evidence", description: "Preserve evidence of which information influenced an AI output when accountability requires it." },
];

export function DataGovernancePageTools() {
  useCopilotAction({
    name: "getDataGovernanceCapability",
    description:
      "Get details about a Data Management & Governance capability. Emphasize trusted organizational context for AI (permissions, freshness, retrieval quality, influence evidence) — not storage for training alone. ONLY available on the Data Governance pillar page.",
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
