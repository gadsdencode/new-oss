// app/ai-center-of-excellence/data-governance/DataGovernancePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Data Cataloging", description: "Make data discoverable, documented, and usable across teams and AI initiatives." },
  { title: "Data Quality Management", description: "Ensure the accuracy and reliability that effective model training depends on." },
  { title: "Privacy & Security", description: "Securely store and process data and protect sensitive information end to end." },
  { title: "Compliance Monitoring", description: "Keep data use aligned with regulations across regulated domains like healthcare and finance." },
  { title: "Robust Data Ecosystem", description: "Combine governance, quality assurance, and secure processing into a scalable foundation." },
];

export function DataGovernancePageTools() {
  useCopilotAction({
    name: "getDataGovernanceCapability",
    description:
      "Get details about a Data Management & Governance capability for an AI Center of Excellence. ONLY available on the Data Management & Governance pillar page.",
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
