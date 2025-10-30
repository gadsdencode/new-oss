// components/ui/home-button.tsx
"use client";

import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HomeButtonProps {
  className?: string;
}

export function HomeButton({ className }: HomeButtonProps) {
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
        <HomeIcon className="h-4 w-4 transition-colors group-hover:text-primary" />
      </Button>
    </Link>
  );
}

