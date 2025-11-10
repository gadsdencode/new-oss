import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="relative z-10 flex h-full flex-col justify-between p-6">
      {/* Content */}
      <div className="flex flex-col gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30 group-hover:shadow-glow">
          <Icon className="h-7 w-7 text-primary transition-all duration-300" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          {name}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* CTA - ALWAYS VISIBLE (Enterprise UX Best Practice) */}
      <div className="mt-6 flex w-full items-center">
        <Button
          variant="default"
          asChild
          size="default"
          className="pointer-events-auto shadow-brand hover:shadow-brand-lg transition-all duration-300"
        >
          <a href={href} className="flex items-center">
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </div>

    {/* Hover effect overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/[.03] group-hover:dark:bg-primary/[.05]" />
  </div>
)

export { BentoCard, BentoGrid }
