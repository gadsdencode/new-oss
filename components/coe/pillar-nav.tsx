// components/coe/pillar-nav.tsx
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPinIcon, RocketIcon } from "lucide-react";

export const COE_PILLARS = [
  { slug: "strategic-vision", title: "Strategic Vision & Leadership" },
  { slug: "centralized-expertise", title: "Centralized AI Expertise" },
  { slug: "scalable-infrastructure", title: "Scalable AI Infrastructure" },
  { slug: "data-governance", title: "Data Management & Governance" },
  { slug: "governance-risk", title: "Governance, Risk & Responsible AI" },
  { slug: "adoption-culture", title: "Culture of Adoption & Continuous Learning" },
];

// Distinct entry point - intentionally NOT a seventh pillar. Rendered as a
// lead "Start here" banner above the six pillars, data-driven via this flag.
const COE_ENTRY_POINT = {
  slug: "getting-started",
  title: "Getting Started",
  description: "New to the framework? Begin with the recommended path - how to start, what you'll need, and how an engagement runs.",
  isEntryPoint: true as const,
};

export function PillarNav({ current }: { current: string }) {
  const entryActive = current === COE_ENTRY_POINT.slug;
  return (
    <nav aria-label="Center of Excellence pillars" className="py-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Entry point - the first step, distinct from the six pillars */}
        <Link
          href={`/ai-center-of-excellence/${COE_ENTRY_POINT.slug}`}
          aria-current={entryActive ? "page" : undefined}
          aria-disabled={entryActive ? true : undefined}
          className={`group mb-8 flex items-center justify-between gap-4 rounded-xl border-2 p-5 transition-colors ${
            entryActive
              ? "border-primary bg-primary/5 pointer-events-none"
              : "border-primary/40 bg-primary/5 hover:border-primary hover:shadow-sm"
          }`}
        >
          <span className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <RocketIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Start here
              </span>
              <span className="text-lg font-bold text-foreground">{COE_ENTRY_POINT.title}</span>
              <span className="mt-0.5 text-sm text-muted-foreground">{COE_ENTRY_POINT.description}</span>
            </span>
          </span>
          {entryActive ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <MapPinIcon className="h-3 w-3" />
              You are here
            </span>
          ) : (
            <ArrowRight
              className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          )}
        </Link>

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
