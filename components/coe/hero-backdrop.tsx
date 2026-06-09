// components/coe/hero-backdrop.tsx
// Decorative hero background for CoE pages. Static Server Component.
import Image from "next/image";

interface HeroBackdropProps {
  src: string; // e.g. "/images/coe/coe-hub-hero.webp"
  /** Overlay strength for the middle of the gradient. Use "strong" on pages
   *  whose artwork is bright at center (Strategic Vision, Centralized Expertise). */
  intensity?: "default" | "strong";
}

export function HeroBackdrop({ src, intensity = "default" }: HeroBackdropProps) {
  const mid = intensity === "strong" ? "via-[#030F26]/90" : "via-[#030F26]/80";
  return (
    // Dark-theme only: in light theme the CoE hero bands are a light surface
    // with dark foreground text, so the navy artwork would break contrast.
    <div aria-hidden="true" className="absolute inset-0 -z-10 hidden overflow-hidden dark:block">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
        className="object-cover object-center"
      />
      <div
        className={`absolute inset-0 bg-linear-to-b from-[#030F26]/70 ${mid} to-background`}
      />
    </div>
  );
}
