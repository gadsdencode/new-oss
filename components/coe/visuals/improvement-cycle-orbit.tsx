"use client";

import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { RefreshCwIcon } from "lucide-react";

const steps = ["Monitor", "Analyze", "Iterate", "Implement", "Communicate", "Repeat"];

export function ImprovementCycleOrbit() {
  return (
    <div className="relative flex h-[440px] w-full items-center justify-center overflow-hidden">
      <div className="absolute z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#0B7CFF] to-[#00D6C9] text-white shadow-brand">
        <RefreshCwIcon className="h-7 w-7" />
        <span className="mt-1 text-xs font-semibold">Improve</span>
      </div>

      <OrbitingCircles radius={165} duration={30} iconSize={64}>
        {steps.map((s, i) => (
          <div
            key={s}
            className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-primary/30 bg-background text-center"
          >
            <span className="text-xs font-bold text-primary">{i + 1}</span>
            <span className="text-[9px] leading-tight text-muted-foreground">{s}</span>
          </div>
        ))}
      </OrbitingCircles>
    </div>
  );
}
