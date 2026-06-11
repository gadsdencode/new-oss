import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  variant?: "simple" | "full";
  className?: string;
};

export function SiteFooter({ variant = "simple", className }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t py-8 text-center text-sm text-muted-foreground",
        variant === "full" && "bg-muted/20",
        className
      )}
    >
      <BrandLogo
        size="md"
        decorative
        className="mx-auto mb-3 h-8 w-8 opacity-70"
      />
      <p>&copy; {year} Overture Systems Solutions. All rights reserved.</p>
      {variant === "full" && (
        <p className="mt-2 text-xs">
          Enterprise-Grade Security &bull; Privacy-First Engineering
        </p>
      )}
    </footer>
  );
}
