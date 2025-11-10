import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          // Light mode: Rich saturated brand color with crystal-clear readable text (WCAG AAA)
          "bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 text-black tracking-wide " +
          "text-shadow-button-light shadow-2xl shadow-primary-600/40 border-2 border-primary-800/30 " +
          "hover:from-primary-800 hover:via-primary-700 hover:to-primary-800 hover:shadow-[0_20px_40px_rgba(67,56,202,0.5)] hover:scale-[1.02] hover:border-primary-900/40 " +
          "active:scale-[0.98] transition-all duration-300 " +
          // Subtle shimmer that doesn't interfere with text readability
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 before:pointer-events-none " +
          // Dark mode: Bright, luminous button that clearly stands out (high visibility)
          "dark:from-primary-400 dark:to-primary-500 dark:text-white dark:font-bold dark:text-shadow-button-dark " +
          "dark:shadow-2xl dark:shadow-primary-500/50 dark:border-primary-300/30 " +
          "dark:hover:from-primary-300 dark:hover:to-primary-400 dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] dark:hover:border-primary-200/40 dark:hover:scale-[1.02] " +
          // Dark mode shimmer with enhanced glow
          "dark:before:bg-gradient-to-r dark:before:from-transparent dark:before:via-white/20 dark:before:to-transparent",
        destructive:
          // Light mode: Red gradient
          "bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white shadow-lg shadow-red-500/40 hover:shadow-xl hover:shadow-red-500/50 hover:scale-[1.02] hover:from-red-700 hover:via-red-600 hover:to-rose-600 active:scale-[0.98] " +
          // Dark mode: Brighter red
          "dark:from-red-500 dark:via-red-400 dark:to-rose-400 dark:text-white dark:shadow-red-400/50 dark:hover:from-red-400 dark:hover:via-red-300 dark:hover:to-rose-300 dark:hover:shadow-red-400/60",
        outline:
          // Light mode: Clear border and text with high contrast
          "border-2 border-primary-500 bg-background text-primary-700 shadow-sm hover:bg-primary-50 hover:border-primary-600 hover:text-primary-800 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm " +
          // Dark mode: Lighter border and text for visibility
          "dark:border-primary-400 dark:text-primary-200 dark:hover:bg-primary-950/80 dark:hover:border-primary-300 dark:hover:text-primary-100 dark:hover:shadow-primary-400/20",
        secondary:
          // Light mode: Secondary to accent gradient
          "bg-gradient-to-r from-secondary-600 via-secondary-500 to-accent-500 text-white shadow-lg shadow-secondary-500/40 hover:shadow-xl hover:shadow-secondary-500/50 hover:scale-[1.02] hover:from-secondary-700 hover:via-secondary-600 hover:to-accent-600 active:scale-[0.98] " +
          // Dark mode: Lighter secondary to accent for visibility
          "dark:from-secondary-500 dark:via-secondary-400 dark:to-accent-400 dark:text-white dark:shadow-secondary-400/50 dark:hover:from-secondary-400 dark:hover:via-secondary-300 dark:hover:to-accent-300 dark:hover:shadow-secondary-400/60",
        ghost: 
          // Light mode: Default text with hover background
          "text-foreground hover:bg-primary-100 hover:text-primary-700 active:bg-primary-200 active:text-primary-800 " +
          // Dark mode: Light text with subtle hover for visibility
          "dark:text-foreground dark:hover:bg-primary-950/70 dark:hover:text-primary-200 dark:active:bg-primary-900/90 dark:active:text-primary-100 transition-colors",
        link: 
          // Light mode: Primary color text for visibility
          "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 " +
          // Dark mode: Lighter primary for visibility
          "dark:text-primary-400 dark:hover:text-primary-300 transition-colors",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
