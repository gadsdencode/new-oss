// components/coe/section-band.tsx
// Mid-page "breather band" for CoE pillar pages. Static Server Component.
// Reuses the page's own hero artwork under a heavy navy overlay so it reads
// as a textural echo of the hero, not a repeat. Fixed navy + white text keeps
// contrast identical in light and dark themes.
import Image from "next/image";

interface SectionBandProps {
  /** That pillar's hero image, e.g. "/images/coe/coe-strategic-vision-hero.webp" */
  src: string;
  /** One short statement - already-existing page copy only. */
  children: React.ReactNode;
}

export function SectionBand({ src, children }: SectionBandProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 my-4">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-[#030F26]/85" />
      </div>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
          {children}
        </p>
      </div>
    </section>
  );
}
