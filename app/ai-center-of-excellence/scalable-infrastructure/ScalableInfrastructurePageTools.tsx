// app/ai-center-of-excellence/scalable-infrastructure/ScalableInfrastructurePageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const capabilities = [
  { title: "Cloud-Native Architecture", description: "Dynamically scale resources on demand and leverage managed services for seamless deployment." },
  { title: "Containerization & Orchestration", description: "Use Docker and Kubernetes for consistent, reproducible deployments across environments." },
  { title: "Distributed Training & Inference", description: "Handle large workloads and run multiple models in parallel with distributed setups." },
  { title: "Autoscaling & Load Balancing", description: "Scale up or down with demand for high availability and efficient resource utilization." },
  { title: "Monitoring & Observability", description: "Track health, performance, and utilization to enable proactive troubleshooting and optimization." },
];

export function ScalableInfrastructurePageTools() {
  useCopilotAction({
    name: "getScalableInfrastructureCapability",
    description:
      "Get details about a Scalable AI Infrastructure capability for an AI Center of Excellence. ONLY available on the Scalable AI Infrastructure pillar page.",
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
