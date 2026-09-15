"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileTextIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { approvedResearchAssistantPayload } from "@/lib/research/approved-services";
import { ASSISTANT_CONTACT_PATH } from "@/lib/assistant/constants";

/**
 * Research page assistant tools.
 * Mock database search and fabricated market analysis are not registered.
 */
export function ResearchPageTools() {
  useCopilotAction({
    name: "describeResearchServices",
    description:
      "Describes Overture's approved B2B research services for healthcare and non-profits. Does not search databases or produce findings, sources, organizations, or market figures. Use when the visitor asks what research Overture offers. If they need live data, explain that an engagement is required and point to /research and /contact.",
    parameters: [],
    available: "enabled",
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <CardTitle className="text-lg">Loading research services</CardTitle>
              </div>
            </CardHeader>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileTextIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Overture research services</CardTitle>
              </div>
              <CardDescription>{result.overview}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {Array.isArray(result.features)
                  ? result.features.map((feature: { title: string; description: string }) => (
                      <li key={feature.title} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="font-medium">{feature.title}.</span> {feature.description}
                        </span>
                      </li>
                    ))
                  : null}
              </ul>
              <p className="text-sm text-muted-foreground">{result.unavailable}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/research" className="underline underline-offset-2">
                  Research services
                </Link>
                <Link href={ASSISTANT_CONTACT_PATH} className="underline underline-offset-2">
                  Contact
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async () => approvedResearchAssistantPayload(),
  });

  return null;
}
