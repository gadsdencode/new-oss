// app/ai-center-of-excellence/governance-risk/page.tsx
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
import { GovernanceRiskPageTools } from "./GovernanceRiskPageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { PillarNextSteps } from "@/components/coe/pillar-next-steps";
import { ResponsibleAIGauges } from "@/components/coe/visuals/responsible-ai-gauges";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import { SectionWash } from "@/components/coe/section-wash";
import { VignetteLayer } from "@/components/coe/vignette-layer";
import {
  InboxIcon,
  UsersIcon,
  RulerIcon,
  GitBranchIcon,
  UserCheckIcon,
  FileSearchIcon,
  ActivityIcon,
  SirenIcon,
  RefreshCwIcon,
  ScaleIcon,
  BrainCircuitIcon,
  SearchCheckIcon,
  RocketIcon,
  ArrowRight,
  SparklesIcon,
  Link2Icon,
  FileCheckIcon,
} from "lucide-react";

export const metadata: Metadata = coePageMetadata({
  title: "Governance, Risk & Responsible AI | AI Center of Excellence | Overture Systems Solutions",
  description:
    "Operational governance and evidence for enterprise AI — intake, risk tiering, evaluation, provenance, approvals, monitoring, and ICDU as a differentiated evaluation capability.",
  path: "/ai-center-of-excellence/governance-risk",
  ogImage: "/images/coe/coe-governance-risk-og.jpg",
});

const capabilities = [
  { icon: InboxIcon, title: "Use-Case Intake & Risk Tiering", description: "Classify initiatives by risk and required controls before build accelerates." },
  { icon: UsersIcon, title: "Ownership & Decision Rights", description: "Name who owns outcomes, risk acceptance, and go-live decisions." },
  { icon: RulerIcon, title: "Pre-Deployment Evaluation", description: "Evaluate quality, intent alignment, and failure modes before release." },
  { icon: GitBranchIcon, title: "Provenance", description: "Track model, prompt, policy, and version lineage so change is auditable." },
  { icon: UserCheckIcon, title: "Human Approval Requirements", description: "Define when a human must approve before an action or output is final." },
  { icon: FileSearchIcon, title: "Audit Evidence", description: "Retain the evidence trail needed for review — not paperwork theater." },
  { icon: ActivityIcon, title: "Production Monitoring", description: "Watch behavior, quality signals, and drift after go-live." },
  { icon: SirenIcon, title: "Incident Escalation", description: "Clear paths to contain, communicate, and recover when AI misbehaves." },
  { icon: RefreshCwIcon, title: "Periodic Reassessment", description: "Revisit risk, controls, and fitness as use and models change." },
  { icon: ScaleIcon, title: "Organizational & Regulatory Alignment", description: "Align controls to applicable organizational policies and regulatory requirements." },
];

const approach = [
  { step: "01", icon: SearchCheckIcon, title: "Define Intake & Rights", description: "Stand up use-case intake, risk tiers, ownership, and approval thresholds." },
  { step: "02", icon: BrainCircuitIcon, title: "Wire Evaluation & Evidence", description: "Connect pre-deployment evaluation — including ICDU where appropriate — with provenance and audit evidence." },
  { step: "03", icon: RocketIcon, title: "Operate Continuously", description: "Monitor production, escalate incidents, and reassess on a defined cadence." },
];

const evidence = [
  { icon: FileCheckIcon, title: "Intake and risk-tiering criteria for AI use cases" },
  { icon: RulerIcon, title: "Pre-deployment evaluation checklist with evidence artifacts" },
  { icon: GitBranchIcon, title: "Provenance pattern for models, prompts, policies, and versions" },
  { icon: SirenIcon, title: "Incident escalation path and reassessment cadence" },
];

const connections = [
  { pillar: "Strategy", href: "/ai-center-of-excellence/strategic-vision", note: "Which work enters the portfolio" },
  { pillar: "Expertise", href: "/ai-center-of-excellence/centralized-expertise", note: "Who evaluates and owns quality" },
  { pillar: "Infrastructure", href: "/ai-center-of-excellence/scalable-infrastructure", note: "Where controls and monitoring run" },
  { pillar: "Data & Context", href: "/ai-center-of-excellence/data-governance", note: "What evidence and context attach" },
  { pillar: "Adoption", href: "/ai-center-of-excellence/adoption-culture", note: "How humans stay accountable in use" },
];

const examples: {
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}[] = [
  {
    title: "Example: Tiered intake for a new agent",
    description:
      "A proposed agent is risk-tiered at intake; higher tiers require stronger evaluation, approval, and monitoring before production access.",
  },
  {
    title: "Example: Provenance on a prompt change",
    description:
      "A policy-sensitive prompt update records version, evaluator, approval, and evaluation evidence before it can ship — then is monitored after release.",
    image: "/images/coe/coe-industry-financial.webp",
    imagePosition: "object-center",
  },
];

const sectionVignette = examples.find((a) => a.image)?.image;

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Governance, Risk & Responsible AI",
  name: "Governance, Risk & Responsible AI for an AI Center of Excellence",
  url: absoluteUrl("/ai-center-of-excellence/governance-risk"),
  description:
    "Operational governance and evidence for enterprise AI — intake, risk tiering, pre-deployment evaluation, provenance, human approvals, audit evidence, monitoring, incident escalation, reassessment, and alignment to applicable requirements. Includes the patent-pending ICDU evaluation pipeline as a quality and evaluation capability.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Governance, Risk & Responsible AI is pillar 5 of Overture's AI Center of Excellence. It is an operational governance and evidence layer — not fear messaging and not paperwork alone. Capabilities include: AI use-case intake and risk tiering; defined ownership and decision rights; pre-deployment evaluation; model, prompt, policy, and version provenance; human approval requirements; audit evidence; production monitoring; incident escalation; periodic reassessment; alignment to applicable organizational and regulatory requirements. ICDU (https://icdu.ai) is Overture's patent-pending evaluation pipeline — a differentiated quality and evaluation capability that helps make AI behavior more effective, measurable, repeatable, and aligned with organizational intent. ICDU's value extends across strategy, infrastructure, data, and continuous improvement; do not reduce it to compliance documentation or a governance wrapper, and do not say it fails to improve AI effectiveness. Control areas are qualitative (values/policy, transparency, bias evaluation, privacy/security, accountability) — not arbitrary numerical scores. Do not invent results. Examples are illustrative. Avoid introducing the word finance.`;

export default function GovernanceRiskPage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Governance, Risk & Responsible AI" />
      <GovernanceRiskPageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 dark:from-primary/5 dark:via-accent/5 dark:to-secondary/5">
          <HeroBackdrop src="/images/coe/coe-governance-risk-hero.webp" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 5 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Governance, Risk
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                &amp; Responsible AI
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              An operational evidence layer — intake, evaluation, provenance, approvals, and monitoring — so AI can be improved and trusted in production.
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
            <p className="text-sm font-medium text-muted-foreground mb-6">Qualitative control areas — not arbitrary scores</p>
            <ResponsibleAIGauges />
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Governance That Operates</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Policies on a shelf do not evaluate systems, approve releases, or escalate incidents. This pillar makes governance a working path — with evidence — from intake through production reassessment.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What Overture Helps Establish</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Operational Governance Capabilities</h2>
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

        {/* ICDU differentiation */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary/40">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <BrainCircuitIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <Badge variant="secondary" className="w-fit mb-2">Differentiated Capability</Badge>
                <CardTitle className="text-2xl">ICDU Evaluation Pipeline</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Overture&apos;s patent-pending ICDU evaluation pipeline is a quality and evaluation capability that helps make AI behavior more effective, measurable, repeatable, and aligned with organizational intent. It is not a documentation wrapper. Its value spans strategy (what “good” means), infrastructure (evaluation in the release path), data/context (what grounded an output), and continuous improvement after go-live.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="https://icdu.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Learn about ICDU
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <SectionBand src="/images/coe/coe-governance-risk-hero.webp">
          Evidence from intake through production — so accountability is operational, not theatrical.
        </SectionBand>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How We Establish It</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">From Intake to Continuous Reassessment</h2>
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

        <PillarNav current="governance-risk" />
        <PillarNextSteps prompt="See how operational your AI controls are today — or discuss evaluation and governance design in a Readiness Workshop." />
        <SiteFooter />
      </div>
    </>
  );
}
