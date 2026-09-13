// components/coe/pillar-next-steps.tsx
// Compact next-step strip for pillar pages — replaces the full StartHereBlock
// sales journey so each route stays focused on its pillar.
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PillarNextStepsProps {
  /** Short line tying this pillar to the next action. */
  prompt: string;
}

export function PillarNextSteps({ prompt }: PillarNextStepsProps) {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
      <div className="relative z-10 mx-auto max-w-3xl text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Next step
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{prompt}</p>
        <div className="mt-8 flex flex-col justify-center gap-4 p-0.5 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/ai-center-of-excellence#assessment">
              Take the Readiness Snapshot
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/contact?intent=readiness-workshop">Request a Readiness Workshop</Link>
          </Button>
        </div>
        <p className="mt-6">
          <Link
            href="/ai-center-of-excellence"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Back to the CoE operating model
          </Link>
        </p>
      </div>
    </section>
  );
}
