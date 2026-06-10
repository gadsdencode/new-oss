// components/coe/section-wash.tsx
// Full-color section backdrop for CoE sections that carry an assigned vignette.
// Static Server Component - decorative only.
//
// Theme calibration lives here (single source):
// - Light: dark-field art washes out when alpha-blended toward white, so it gets
//   a contrast/saturation boost plus a cool "ground" tint beneath it.
// - Dark: the art's own highlights carry the form, so no filters are needed.
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionWashProps {
  /** Colored image washed behind the section, e.g. "/images/coe/coe-industry-healthcare.webp" */
  src: string;
  className?: string;
}

export function SectionWash({ src, className }: SectionWashProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // Vertical mask dissolves the wash at both section edges so it never
        // forms a hard band against neighboring sections.
        "pointer-events-none absolute inset-0 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]",
        className
      )}
    >
      {/* Light-only local ground: gives the art a faint cool surface to sit on
          instead of stark white, raising its local contrast anchor. */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent dark:hidden" />
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-25 contrast-125 saturate-150 brightness-105 dark:opacity-25 dark:contrast-100 dark:saturate-100 dark:brightness-100"
      />
    </div>
  );
}
