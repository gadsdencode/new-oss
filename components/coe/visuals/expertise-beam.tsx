"use client";

import React, { useRef, useSyncExternalStore } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import {
  BriefcaseIcon,
  BotIcon,
  DatabaseIcon,
  RulerIcon,
  NetworkIcon,
} from "lucide-react";

const subscribeNoop = () => () => {};
function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

const Node = React.forwardRef<HTMLDivElement, { className?: string; children: React.ReactNode; label?: string }>(
  ({ className, children, label }, ref) => (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={ref}
        className={cn(
          "z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-background shadow-[0_0_24px_-12px_rgba(0,0,0,0.6)]",
          className
        )}
      >
        {children}
      </div>
      {label ? (
        <span className="max-w-[5.5rem] text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
          {label}
        </span>
      ) : null}
    </div>
  )
);
Node.displayName = "Node";

export function ExpertiseBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const r4 = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);

  const mounted = useIsClient();

  const beam = { containerRef, toRef: hub, gradientStartColor: "#0B7CFF", gradientStopColor: "#00D6C9" };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex h-[400px] w-full max-w-3xl items-center justify-between overflow-hidden px-4 sm:px-12"
    >
      <div className="flex flex-col justify-center gap-5">
        <Node ref={r1} label="Domain & practitioners">
          <BriefcaseIcon className="h-6 w-6 text-primary" />
        </Node>
        <Node ref={r2} label="Agents & apps">
          <BotIcon className="h-6 w-6 text-primary" />
        </Node>
        <Node ref={r3} label="Data & knowledge">
          <DatabaseIcon className="h-6 w-6 text-primary" />
        </Node>
        <Node ref={r4} label="Evaluation">
          <RulerIcon className="h-6 w-6 text-primary" />
        </Node>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Node ref={hub} className="h-20 w-20 border-0 bg-gradient-to-br from-[#0B7CFF] to-[#00D6C9]">
          <NetworkIcon className="h-8 w-8 text-white" />
        </Node>
        <span className="text-xs font-medium text-muted-foreground">Reusable CoE capability</span>
      </div>

      {mounted && (
        <>
          <AnimatedBeam {...beam} fromRef={r1} curvature={-50} />
          <AnimatedBeam {...beam} fromRef={r2} curvature={-18} />
          <AnimatedBeam {...beam} fromRef={r3} curvature={18} />
          <AnimatedBeam {...beam} fromRef={r4} curvature={50} />
        </>
      )}
    </div>
  );
}
