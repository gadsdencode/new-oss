"use client";

import { Ripple } from "@/components/ui/ripple";
import { Badge } from "@/components/ui/badge";
import { ServerIcon } from "lucide-react";

const stack = ["Docker", "Kubernetes", "AWS SageMaker", "Google AI Platform", "TensorFlow Serving", "Prometheus", "Grafana", "Elasticsearch"];

export function ScaleRipple() {
  return (
    <div className="space-y-10">
      <div className="relative flex h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border bg-background/40">
        <div className="z-10 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B7CFF] to-[#00D6C9] text-white shadow-brand">
            <ServerIcon className="h-8 w-8" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Scales out to meet demand &mdash; and back in to control cost.
          </p>
        </div>
        <Ripple mainCircleSize={180} numCircles={6} />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {stack.map((s) => (
          <Badge key={s} variant="secondary" className="px-3 py-1 text-sm">{s}</Badge>
        ))}
      </div>
    </div>
  );
}
