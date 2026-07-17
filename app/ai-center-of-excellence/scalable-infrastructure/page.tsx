// app/ai-center-of-excellence/scalable-infrastructure/page.tsx
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
import { ScalableInfrastructurePageTools } from "./ScalableInfrastructurePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { PillarNextSteps } from "@/components/coe/pillar-next-steps";
import { ScaleRipple } from "@/components/coe/visuals/scale-ripple";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import { SectionWash } from "@/components/coe/section-wash";
import { VignetteLayer } from "@/components/coe/vignette-layer";
import {
  ShareIcon,
  BookOpenIcon,
  BotIcon,
  RulerIcon,
  ActivityIcon,
  ShieldIcon,
  UserCheckIcon,
  KeyRoundIcon,
  GaugeIcon,
  LayersIcon,
  RocketIcon,
  CloudIcon,
  BoxesIcon,
  ArrowRight,
  SparklesIcon,
  Link2Icon,
  FileCheckIcon,
} from "lucide-react";

export const metadata: Metadata = coePageMetadata({
  title: "Scalable AI Infrastructure | AI Center of Excellence | Overture Systems Solutions",
  description:
    "A model-agnostic capability layer: gateways, retrieval, orchestration, evaluation, guardrails, approvals, security, cost controls, and portable production deployment.",
  path: "/ai-center-of-excellence/scalable-infrastructure",
  ogImage: "/images/coe/coe-scalable-infrastructure-og.jpg",
});

const capabilities = [
  { icon: ShareIcon, title: "Model & Agent Gateways", description: "Controlled entry points for model and agent traffic with consistent policy and oversight." },
  { icon: BookOpenIcon, title: "Enterprise Retrieval & Knowledge Grounding", description: "Ground responses in approved organizational knowledge — not unbounded web noise." },
  { icon: BotIcon, title: "Agent Orchestration", description: "Coordinate multi-step agent workflows with clear boundaries and failure handling." },
  { icon: RulerIcon, title: "Evaluation Pipelines", description: "Test quality, intent alignment, and regressions before and after release." },
  { icon: ActivityIcon, title: "Observability & Traceability", description: "See what ran, what was retrieved, and what changed when something goes wrong." },
  { icon: ShieldIcon, title: "Guardrails & Policy Enforcement", description: "Apply organizational rules at runtime — not only in slide decks." },
  { icon: UserCheckIcon, title: "Human Approval Points", description: "Require human decision where risk, reputation, or regulation demands it." },
  { icon: KeyRoundIcon, title: "Identity, Permissions & Security", description: "Control who and what can invoke capabilities, and what they may access." },
  { icon: GaugeIcon, title: "Cost & Usage Controls", description: "Govern spend and consumption so scale does not become surprise." },
  { icon: LayersIcon, title: "Model & Cloud Portability", description: "Keep the operating model portable across models and environments." },
  { icon: RocketIcon, title: "Production Deployment & Continuous Improvement", description: "Ship, monitor, and improve — oriented to dependable business operation." },
];

const approach = [
  { step: "01", icon: CloudIcon, title: "Design for Operation", description: "Define the capability layer around business workflows, risk, and portability — not a training lab stack." },
  { step: "02", icon: BoxesIcon, title: "Wire Gateways & Controls", description: "Stand up gateways, retrieval, orchestration, approvals, and security boundaries." },
  { step: "03", icon: ActivityIcon, title: "Evaluate, Observe, Improve", description: "Run evaluation pipelines and observability so production stays measurable and improvable." },
];

const evidence = [
  { icon: FileCheckIcon, title: "Reference architecture for the AI capability layer" },
  { icon: ShareIcon, title: "Gateway and policy patterns for model/agent access" },
  { icon: RulerIcon, title: "Evaluation and observability hooks in the release path" },
  { icon: GaugeIcon, title: "Cost/usage and approval controls for production paths" },
];

const connections = [
  { pillar: "Strategy", href: "/ai-center-of-excellence/strategic-vision", note: "Which workloads deserve platform investment" },
  { pillar: "Expertise", href: "/ai-center-of-excellence/centralized-expertise", note: "Who builds and operates on the platform" },
  { pillar: "Data & Context", href: "/ai-center-of-excellence/data-governance", note: "What retrieval may ground on" },
  { pillar: "Governance", href: "/ai-center-of-excellence/governance-risk", note: "How evaluation and evidence attach" },
  { pillar: "Adoption", href: "/ai-center-of-excellence/adoption-culture", note: "How people use production paths safely" },
];

const examples: {
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}[] = [
  {
    title: "Example: Governed agent gateway",
    description:
      "Business applications call a shared gateway that enforces identity, retrieval scope, approval rules, and cost limits before an agent acts.",
  },
  {
    title: "Example: Portable evaluation path",
    description:
      "The same evaluation and observability hooks run whether a workload uses one model family or another — so the operating model is not locked to a single vendor.",
    image: "/images/coe/coe-industry-financial.webp",
    imagePosition: "object-center",
  },
];

const sectionVignette = examples.find((a) => a.image)?.image;

const capabilityCategories = [
  "Model and agent gateways",
  "Enterprise retrieval and knowledge grounding",
  "Agent orchestration",
  "Evaluation pipelines",
  "Observability and traceability",
  "Guardrails and policy enforcement",
  "Human approval points",
  "Identity, permissions, and security",
  "Cost and usage controls",
  "Model and cloud portability",
  "Production deployment and continuous improvement",
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Scalable AI Infrastructure",
  name: "Scalable AI Infrastructure for an AI Center of Excellence",
  url: absoluteUrl("/ai-center-of-excellence/scalable-infrastructure"),
  description:
    "A model-agnostic AI capability layer spanning gateways, retrieval, agent orchestration, evaluation, observability, guardrails, human approvals, identity and security, cost controls, portability, and production continuous improvement.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Scalable AI Infrastructure is pillar 3 of Overture's AI Center of Excellence. It is a modern, model-agnostic capability layer for dependable business operation — not a legacy training stack and not infrastructure for its own sake. Capabilities include: model and agent gateways; enterprise retrieval and knowledge grounding; agent orchestration; evaluation pipelines; observability and traceability; guardrails and policy enforcement; human approval points; identity, permissions, and security; cost and usage controls; model and cloud portability; production deployment and continuous improvement. Vendor products are secondary implementation choices. Do not invent results. Examples are illustrative.`;

export default function ScalableInfrastructurePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Scalable AI Infrastructure" />
      <ScalableInfrastructurePageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/10 via-secondary/5 to-background dark:from-secondary/5 dark:via-secondary/5 dark:to-background">
          <HeroBackdrop src="/images/coe/coe-scalable-infrastructure-hero.webp" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 3 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Scalable
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                AI Infrastructure
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              A model-agnostic capability layer built for dependable business operation — gateways, retrieval, evaluation, controls, and portable production paths.
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
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <ScaleRipple />
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Infrastructure Serves Operation</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Labs can run without a capability layer. Enterprises cannot. Gateways, retrieval, evaluation, approvals, and cost controls exist so AI work can be trusted in production — across models and environments.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What Overture Helps Establish</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Capability Layer</h2>
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

        <SectionBand src="/images/coe/coe-scalable-infrastructure-hero.webp">
          Portable by design — the operating model is not locked to one model family or cloud.
        </SectionBand>

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How We Establish It</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">From Design to Continuous Improvement</h2>
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

        <section className="py-16 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">Capability Categories</Badge>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Defined by Capabilities, Not a Legacy Stack</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {capabilityCategories.map((category) => (
                <Badge key={category} variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <PillarNav current="scalable-infrastructure" />
        <PillarNextSteps prompt="See whether your current stack supports governed, portable operation — or scope the capability layer with our team." />
        <SiteFooter />
      </div>
    </>
  );
}
