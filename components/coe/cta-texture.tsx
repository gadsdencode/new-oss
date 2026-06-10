// components/coe/cta-texture.tsx
// Shared background texture for CoE Start Here blocks and final CTA bands.
// Static Server Component - decorative only, rendered beneath section content.
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CtaTextureProps {
  className?: string;
}

export function CtaTexture({ className }: CtaTextureProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Near-black asset with a faint wave in the lower half. The bottom-rising
          mask makes the wave read as a ground plane under the headline instead of
          a full-bleed picture: strongest at the section's base, fully dissolved
          before it reaches the text.
          Per-theme compositing: light = multiply ("graphite ink" that preserves
          the band's tint); dark = screen (only the wave's glow adds light, so
          there is no black smudge over the dark band). */}
      <Image
        src="/images/coe/coe-cta-texture.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom mix-blend-multiply opacity-35 dark:mix-blend-screen dark:opacity-80 mask-[linear-gradient(to_top,black_30%,transparent_85%)]"
      />
    </div>
  );
}
