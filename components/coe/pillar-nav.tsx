// components/coe/pillar-nav.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const COE_PILLARS = [
  { slug: "strategic-vision", title: "Strategic Vision & Leadership" },
  { slug: "centralized-expertise", title: "Centralized AI Expertise" },
  { slug: "scalable-infrastructure", title: "Scalable AI Infrastructure" },
  { slug: "data-governance", title: "Data Management & Governance" },
  { slug: "governance-risk", title: "Governance, Risk & Responsible AI" },
  { slug: "adoption-culture", title: "Culture of Adoption & Continuous Learning" },
];

export function PillarNav({ current }: { current: string }) {
  return (
    <section className="py-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-foreground">Explore the Six Pillars</h2>
          <Link
            href="/ai-center-of-excellence"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Back to the CoE overview <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COE_PILLARS.map((p) => {
            const active = p.slug === current;
            return (
              <Link
                key={p.slug}
                href={`/ai-center-of-excellence/${p.slug}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg border p-4 transition-colors ${
                  active
                    ? "border-primary bg-primary/5 pointer-events-none"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <span className="font-medium text-foreground">{p.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
