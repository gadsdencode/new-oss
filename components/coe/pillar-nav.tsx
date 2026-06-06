// components/coe/pillar-nav.tsx
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPinIcon } from "lucide-react";

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
    <nav aria-label="Center of Excellence pillars" className="py-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Explore the Six Pillars</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump to any pillar of the framework &mdash; each link opens its dedicated page.
            </p>
          </div>
          <Link
            href="/ai-center-of-excellence"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the CoE overview
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COE_PILLARS.map((p, idx) => {
            const active = p.slug === current;
            const number = String(idx + 1).padStart(2, "0");
            return (
              <li key={p.slug}>
                <Link
                  href={`/ai-center-of-excellence/${p.slug}`}
                  aria-current={active ? "page" : undefined}
                  aria-disabled={active ? true : undefined}
                  className={`group flex h-full items-center justify-between gap-3 rounded-lg border p-4 transition-colors ${
                    active
                      ? "border-primary bg-primary/5 pointer-events-none"
                      : "border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                      Pillar {number}
                    </span>
                    <span className="font-medium text-foreground">{p.title}</span>
                  </span>
                  {active ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <MapPinIcon className="h-3 w-3" />
                      You are here
                    </span>
                  ) : (
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
