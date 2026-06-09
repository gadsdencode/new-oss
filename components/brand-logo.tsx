import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { src: "/images/Overture_icon_transparent_32.png", width: 32, height: 32 },
  md: { src: "/images/Overture_icon_transparent_64.png", width: 64, height: 64 },
  lg: { src: "/images/Overture_icon_transparent_128.png", width: 128, height: 128 },
  xl: { src: "/images/Overture_icon_transparent_256.png", width: 256, height: 256 },
  square: {
    src: "/images/Overture_logo_square_dark_1254.png",
    width: 1254,
    height: 1254,
  },
} as const;

type BrandLogoProps = {
  size?: keyof typeof SIZES;
  className?: string;
  priority?: boolean;
  alt?: string;
  decorative?: boolean;
};

export function BrandLogo({
  size = "md",
  className,
  priority = false,
  alt = "Overture Systems Solutions",
  decorative = false,
}: BrandLogoProps) {
  const { src, width, height } = SIZES[size];

  return (
    <Image
      src={src}
      alt={decorative ? "" : alt}
      width={width}
      height={height}
      priority={priority}
      aria-hidden={decorative || undefined}
      className={cn(className)}
    />
  );
}
