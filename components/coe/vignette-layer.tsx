// components/coe/vignette-layer.tsx
// Greyscale in-card image bleed for CoE tier and application cards.
// Static Server Component - decorative only.
//
// The image bleeds from one card edge and dissolves via a mask (no hard
// boundary), renders greyscale so the colored SectionWash behind the card
// supplies chromatic figure-ground contrast, and re-saturates on card hover.
//
// Theme calibration lives here (single source): dark-field art needs MORE
// alpha plus a contrast boost in light mode to match its dark-mode salience.
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VignetteLayerProps {
  src: string;
  /** Tailwind object-position utility, e.g. "object-top" / "object-right". */
  position?: string;
  /** "top" = header bleed (tier cards), "right" = peripheral bleed (use-case cards). */
  edge: "top" | "right";
}

export function VignetteLayer({ src, position = "object-center", edge }: VignetteLayerProps) {
  const isTop = edge === "top";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute",
        isTop
          ? "inset-x-0 top-0 h-48 mask-[linear-gradient(to_bottom,black_20%,transparent_100%)]"
          : "inset-y-0 right-0 w-3/5 mask-[linear-gradient(to_left,black_25%,transparent_95%)]"
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={isTop ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 66vw, 30vw"}
        className={cn(
          "object-cover grayscale transition-all group-hover:grayscale-0",
          position,
          isTop
            ? "duration-700 opacity-55 contrast-125 brightness-105 dark:opacity-60 dark:contrast-100 dark:brightness-100 group-hover:scale-105"
            : "duration-500 opacity-45 contrast-125 dark:opacity-45 dark:contrast-100"
        )}
      />
    </div>
  );
}
