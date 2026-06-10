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
          before it reaches the text. Light theme stays much fainter so the dark
          texture never fights the dark foreground text. */}
      <Image
        src="/images/coe/coe-cta-texture.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom opacity-20 dark:opacity-70 mask-[linear-gradient(to_top,black_30%,transparent_85%)]"
      />
    </div>
  );
}
