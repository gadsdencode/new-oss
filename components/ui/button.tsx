import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "button-focus-ring inline-flex items-center justify-center gap-2 rounded-[6px] text-center text-sm font-medium leading-5 transition-[color,background-color,border-color] duration-150 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-primary)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-hover)] active:bg-[var(--button-primary-active)]",
        destructive:
          "bg-[var(--button-destructive)] text-[var(--button-destructive-fg)] hover:bg-[var(--button-destructive-hover)] active:bg-[var(--button-destructive-active)]",
        outline:
          "border border-[var(--button-outline-border)] bg-transparent text-[var(--button-outline-fg)] hover:border-[var(--button-outline-hover-border)] hover:bg-[var(--button-outline-hover-bg)]",
        secondary:
          "bg-[var(--button-secondary)] text-[var(--button-secondary-fg)] hover:bg-[var(--button-secondary-hover)]",
        ghost:
          "bg-transparent text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-white/10",
        link:
          "bg-transparent text-[var(--button-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-5 py-2",
        sm: "min-h-9 px-3",
        lg: "min-h-12 px-6 py-2.5 text-base leading-6",
        icon: "size-11 p-0",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        class: "h-auto min-h-0 w-auto px-0 py-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
