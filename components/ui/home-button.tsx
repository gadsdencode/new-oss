// components/ui/home-button.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

interface HomeButtonProps {
  className?: string;
  priority?: boolean;
}

export function HomeButton({ className, priority = false }: HomeButtonProps) {
  return (
    <Link href="/" className={cn("fixed top-4 left-4 z-50", className)}>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full shadow-lg backdrop-blur-sm",
          "bg-background/80 hover:bg-background/95",
          "border-border/50 hover:border-primary/50",
          "transition-all duration-200 hover:scale-105",
          "group"
        )}
        aria-label="Return to homepage"
      >
        <BrandLogo
          size="md"
          priority={priority}
          className="h-5 w-5 transition-opacity group-hover:opacity-80"
        />
      </Button>
    </Link>
  );
}
