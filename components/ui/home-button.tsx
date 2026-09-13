// components/ui/home-button.tsx
"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

interface HomeButtonProps {
  className?: string;
  priority?: boolean;
}

export function HomeButton({ className, priority = false }: HomeButtonProps) {
  return (
    <Link
      href="/"
      aria-label="Return to homepage"
      className={cn(
        "button-focus-ring fixed top-4 left-4 z-50 inline-flex size-11 items-center justify-center rounded-[6px] border border-[var(--button-outline-border)] bg-background/80 text-foreground backdrop-blur-sm transition-[color,background-color,border-color] duration-150 hover:bg-[var(--button-outline-hover-bg)] motion-reduce:transition-none",
        className
      )}
    >
      <BrandLogo
        size="md"
        priority={priority}
        className="h-5 w-5"
        decorative
      />
    </Link>
  );
}
