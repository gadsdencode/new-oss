"use client";

import {
  CompassIcon,
  EyeIcon,
  ScaleIcon,
  LockIcon,
  ClipboardCheckIcon,
} from "lucide-react";

const controlAreas = [
  {
    label: "Values & Policy Alignment",
    state: "Maturity focus",
    detail: "AI decisions stay aligned with organizational values and approved policies.",
    icon: CompassIcon,
  },
  {
    label: "Transparency & Explainability",
    state: "Control area",
    detail: "Models and decisions can be understood, reviewed, and explained when needed.",
    icon: EyeIcon,
  },
  {
    label: "Bias Evaluation",
    state: "Control area",
    detail: "Structured evaluation to detect and reduce unfair or unintended outcomes.",
    icon: ScaleIcon,
  },
  {
    label: "Privacy & Security",
    state: "Control area",
    detail: "Protect sensitive data and control access throughout the AI lifecycle.",
    icon: LockIcon,
  },
  {
    label: "Accountability & Human Oversight",
    state: "Maturity focus",
    detail: "Clear ownership, human approval points, and oversight for AI behavior.",
    icon: ClipboardCheckIcon,
  },
];

export function ResponsibleAIGauges() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {controlAreas.map((area) => (
          <div
            key={area.label}
            className="flex flex-col rounded-xl border-2 border-border bg-background/60 p-4 text-left"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <area.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
              {area.state}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{area.label}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{area.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Qualitative control areas for a responsible-AI program — not measured scores.
      </p>
    </div>
  );
}
