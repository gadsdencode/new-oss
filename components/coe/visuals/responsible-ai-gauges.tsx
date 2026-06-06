"use client";

import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";

const gauges = [
  { label: "Values Alignment", value: 90 },
  { label: "Transparency", value: 80 },
  { label: "Bias Mitigation", value: 95 },
  { label: "Privacy & Security", value: 85 },
  { label: "Accountability", value: 88 },
];

export function ResponsibleAIGauges() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {gauges.map((g) => (
          <div key={g.label} className="flex flex-col items-center text-center">
            <AnimatedCircularProgressBar
              value={g.value}
              max={100}
              min={0}
              gaugePrimaryColor="#0B7CFF"
              gaugeSecondaryColor="rgba(11,124,255,0.15)"
              className="size-24 text-lg"
            />
            <span className="mt-3 text-sm font-medium text-foreground">{g.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Illustrative coverage targets for a mature responsible-AI program.
      </p>
    </div>
  );
}
