"use client";

import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { TargetIcon, CrownIcon, UserCogIcon, GitMergeIcon, ShieldCheckIcon, CompassIcon } from "lucide-react";

export function VisionOrbit() {
  return (
    <div className="relative flex h-[440px] w-full items-center justify-center overflow-hidden">
      {/* Center core */}
      <div className="absolute z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#0B7CFF] to-[#00D6C9] text-white shadow-brand">
        <CompassIcon className="h-7 w-7" />
        <span className="mt-1 text-xs font-semibold">Vision</span>
      </div>

      {/* Inner orbit */}
      <OrbitingCircles radius={115} duration={26} iconSize={48}>
        <TargetIcon className="h-6 w-6 text-primary" />
        <CrownIcon className="h-6 w-6 text-primary" />
        <UserCogIcon className="h-6 w-6 text-primary" />
      </OrbitingCircles>

      {/* Outer orbit (reverse) */}
      <OrbitingCircles radius={185} duration={34} reverse iconSize={48}>
        <GitMergeIcon className="h-6 w-6 text-primary" />
        <ShieldCheckIcon className="h-6 w-6 text-primary" />
      </OrbitingCircles>
    </div>
  );
}
