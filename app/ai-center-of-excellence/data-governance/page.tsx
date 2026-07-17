// app/ai-center-of-excellence/data-governance/page.tsx
import type { Metadata } from "next";
import { coePageMetadata } from "@/lib/coe/page-seo";
import { absoluteUrl } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { DataGovernancePageTools } from "./DataGovernancePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { PillarNextSteps } from "@/components/coe/pillar-next-steps";
import { DataCatalogTree } from "@/components/coe/visuals/data-catalog-tree";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import { SectionWash } from "@/components/coe/section-wash";
import { VignetteLayer } from "@/components/coe/vignette-layer";
import {
  LayersIcon,
  BookOpenIcon,
  KeyRoundIcon,
  RefreshCwIcon,
  SearchIcon,
  FolderTreeIcon,
  GitBranchIcon,
  CheckCircle2,
  LockIcon,
  ShieldIcon,
  FileSearchIcon,
  SearchCheckIcon,
  RocketIcon,
  ArrowRight,
  SparklesIcon,
  Link2Icon,
  FileCheckIcon,
} from "lucide-react";

export const metadata: Metadata = coePageMetadata({
  title: "Data Management & Governance | AI Center of Excellence | Overture Systems Solutions",
  description:
    "Trusted AI requires trusted context — structured and unstructured knowledge, permissions, freshness, retrieval quality, lineage, and evidence of what influenced an output.",
  path: "/ai-center-of-excellence/data-governance",
  ogImage: "/images/coe/coe-data-governance-og.jpg",
});

const capabilities = [
  { icon: LayersIcon, title: "Structured & Unstructured Information", description: "Treat tables, documents, tickets, and knowledge bases as first-class context — not an afterthought." },
  { icon: BookOpenIcon, title: "Knowledge Sources", description: "Identify which sources are authoritative for which questions and workflows." },
  { icon: KeyRoundIcon, title: "Data Permissions", description: "Ensure AI can only retrieve what the user and use case are allowed to see." },
  { icon: RefreshCwIcon, title: "Context Freshness", description: "Keep grounding material current so answers do not lag reality." },
  { icon: SearchIcon, title: "Retrieval Quality", description: "Measure whether the right context is retrieved for the task — not merely that something was retrieved." },
  { icon: FolderTreeIcon, title: "Cataloging & Lineage", description: "Know what exists, where it came from, and how it flows into AI systems." },
  { icon: CheckCircle2, title: "Data Quality", description: "Improve completeness, accuracy, and consistency for the contexts AI depends on." },
  { icon: LockIcon, title: "Privacy & Security", description: "Protect sensitive information across storage, retrieval, and generation paths." },
  { icon: ShieldIcon, title: "Approved Use Boundaries", description: "Define what information may be used for which AI purposes." },
  { icon: FileSearchIcon, title: "Influence Evidence", description: "Preserve evidence of which information influenced an AI output when accountability requires it." },
];

const approach = [
  { step: "01", icon: SearchCheckIcon, title: "Map Trusted Context", description: "Inventory structured and unstructured sources, permissions, and freshness risks for priority workflows." },
  { step: "02", icon: FolderTreeIcon, title: "Govern Access & Quality", description: "Stand up cataloging, lineage, retrieval quality, privacy controls, and approved-use boundaries." },
  { step: "03", icon: RocketIcon, title: "Enable Grounded Operation", description: "Connect trusted context to production paths with influence evidence where required." },
];

const evidence = [
  { icon: FileCheckIcon, title: "Context map for priority AI workflows" },
  { icon: KeyRoundIcon, title: "Permission and approved-use rules for retrieval" },
  { icon: GitBranchIcon, title: "Catalog/lineage coverage for grounding sources" },
  { icon: FileSearchIcon, title: "Pattern for recording what influenced an output" },
];

const connections = [
  { pillar: "Strategy", href: "/ai-center-of-excellence/strategic-vision", note: "Which contexts matter for outcomes" },
  { pillar: "Expertise", href: "/ai-center-of-excellence/centralized-expertise", note: "Who curates and stewards knowledge" },
  { pillar: "Infrastructure", href: "/ai-center-of-excellence/scalable-infrastructure", note: "Where retrieval and grounding run" },
  { pillar: "Governance", href: "/ai-center-of-excellence/governance-risk", note: "How misuse and drift are controlled" },
  { pillar: "Adoption", href: "/ai-center-of-excellence/adoption-culture", note: "How people trust and correct outputs" },
];

const examples: {
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}[] = [
  {
    title: "Example: Permission-aware retrieval",
    description:
      "A support assistant retrieves only policy and case context the requesting role is allowed to see — and logs which sources grounded the answer.",
    image: "/images/coe/coe-industry-healthcare.webp",
    imagePosition: "object-right",
  },
  {
    title: "Example: Freshness for operating decisions",
    description:
      "A workflow that depends on current procedures refuses stale documents and routes owners to update the knowledge source before generation proceeds.",
  },
];

const sectionVignette = examples.find((a) => a.image)?.image;

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Data Management & Governance",
  name: "Data Management & Governance for an AI Center of Excellence",
  url: absoluteUrl("/ai-center-of-excellence/data-governance"),
  description:
    "Trusted organizational context for AI — structured and unstructured information, knowledge sources, permissions, freshness, retrieval quality, cataloging and lineage, quality, privacy, approved use, and influence evidence.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Data Management & Governance is pillar 4 of Overture's AI Center of Excellence. Headline concept: Trusted AI requires trusted context. This is not primarily "data storage for model training." It covers structured and unstructured information; knowledge sources; data permissions; context freshness; retrieval quality; cataloging and lineage; data quality; privacy and security; approved use boundaries; and evidence of which information influenced an AI output. Do not invent results or unsupported industry statistics. Examples are illustrative.`;

export default function DataGovernancePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Data Management & Governance" />
      <DataGovernancePageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <HeroBackdrop src="/images/coe/coe-data-governance-hero.webp" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 4 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Trusted AI Requires
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Trusted Context
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              Data management for enterprise AI is about permissions, freshness, retrieval quality, and evidence — not storage for training alone.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact?intent=readiness-workshop">
                  Request a Readiness Workshop
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/ai-center-of-excellence">Back to the Framework</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-6">Cataloged, permissioned, retrieval-ready context</p>
            <DataCatalogTree />
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Context Is the Product Input</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Generative and agentic systems inherit the quality, permissions, and freshness of what they can retrieve. Without trusted context, outputs are clever guesses — not organizational capability.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What Overture Helps Establish</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Trusted Context Capabilities</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <Card key={c.title} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <c.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <SectionBand src="/images/coe/coe-data-governance-hero.webp">
          Know what influenced an output — when accountability requires it.
        </SectionBand>

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How We Establish It</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">From Estate Map to Grounded Operation</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {approach.map((step, idx) => (
                <div key={step.step} className="relative">
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary/20">{step.step}</span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <step.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {idx < approach.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary/50" aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Evidence of Progress</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">What You Can Point To Afterward</h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {evidence.map((item) => (
                <li key={item.title} className="flex items-start gap-3 rounded-xl border-2 p-4">
                  <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">Connected Operating Model</Badge>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">How This Pillar Links to the Others</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {connections.map((c) => (
                <Link
                  key={c.pillar}
                  href={c.href}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Link2Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="font-medium text-foreground">{c.pillar}</span>
                  <span className="text-muted-foreground">· {c.note}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20">
          {sectionVignette && <SectionWash src={sectionVignette} />}
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Examples</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Operating Examples</h2>
              <p className="mt-3 text-sm text-muted-foreground">Illustrative scenarios — not client case studies or measured results.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {examples.map((a) => (
                <Card key={a.title} className="h-full border-2">
                  {a.image && <VignetteLayer src={a.image} position={a.imagePosition} edge="right" />}
                  <CardHeader>
                    <div className="h-2 w-16 rounded-full bg-gradient-to-r from-primary to-accent mb-4" />
                    <CardTitle className="text-xl">{a.title}</CardTitle>
                    <CardDescription>{a.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <PillarNav current="data-governance" />
        <PillarNextSteps prompt="See how ready your context layer is for governed AI — or scope trusted-context work in a Readiness Workshop." />
        <SiteFooter />
      </div>
    </>
  );
}
