// app/ai-center-of-excellence/centralized-expertise/page.tsx
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
import { CentralizedExpertisePageTools } from "./CentralizedExpertisePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { PillarNextSteps } from "@/components/coe/pillar-next-steps";
import { ExpertiseBeam } from "@/components/coe/visuals/expertise-beam";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import { SectionWash } from "@/components/coe/section-wash";
import { VignetteLayer } from "@/components/coe/vignette-layer";
import {
  BriefcaseIcon,
  PackageIcon,
  BotIcon,
  DatabaseIcon,
  RulerIcon,
  ShieldIcon,
  GraduationCapIcon,
  UsersIcon,
  NetworkIcon,
  WorkflowIcon,
  ArrowRight,
  SparklesIcon,
  Link2Icon,
  FileCheckIcon,
  Repeat2Icon,
} from "lucide-react";

export const metadata: Metadata = coePageMetadata({
  title: "Centralized AI Expertise | AI Center of Excellence | Overture Systems Solutions",
  description:
    "Capture, strengthen, and reuse multidisciplinary expertise across the enterprise — without stripping capability from business units.",
  path: "/ai-center-of-excellence/centralized-expertise",
  ogImage: "/images/coe/coe-centralized-expertise-og.jpg",
});

const capabilities = [
  { icon: BriefcaseIcon, title: "Domain Leaders & Strong Practitioners", description: "Surface the people whose judgment already works — and make that judgment reusable." },
  { icon: PackageIcon, title: "AI Product & Process Owners", description: "Owners who keep initiatives tied to outcomes, workflows, and operating accountability." },
  { icon: BotIcon, title: "Agent & Application Engineers", description: "Builders who assemble agents, applications, and integrations for dependable use." },
  { icon: DatabaseIcon, title: "Data & Knowledge Engineers", description: "Engineers who ground AI in trusted structured and unstructured organizational context." },
  { icon: RulerIcon, title: "Evaluation & Quality Specialists", description: "Specialists who make quality measurable, repeatable, and improvable before and after release." },
  { icon: ShieldIcon, title: "Platform, Security & Governance Specialists", description: "Roles that keep platforms safe, portable, and policy-aligned as usage grows." },
  { icon: GraduationCapIcon, title: "Adoption & Enablement Leaders", description: "Leaders who redesign work, coach champions, and keep humans accountable in the loop." },
];

const approach = [
  { step: "01", icon: UsersIcon, title: "Map Capability Flexibly", description: "Identify which roles you already have, which can be shared, and which need partner support — without assuming a large permanent hire wave." },
  { step: "02", icon: NetworkIcon, title: "Design Capture & Reuse", description: "Define how expertise is captured, reviewed, and reused across units while remaining with the business." },
  { step: "03", icon: WorkflowIcon, title: "Deploy on Priority Work", description: "Apply the multidisciplinary mix to prioritized use cases with clear ownership and quality standards." },
];

const evidence = [
  { icon: FileCheckIcon, title: "Role map of multidisciplinary CoE capabilities (as-needed model)" },
  { icon: Repeat2Icon, title: "Practices for capturing and reusing strong-performer judgment" },
  { icon: NetworkIcon, title: "Shared standards for quality, delivery, and handoffs" },
  { icon: PackageIcon, title: "Named product/process owners on priority initiatives" },
];

const connections = [
  { pillar: "Strategy", href: "/ai-center-of-excellence/strategic-vision", note: "What work deserves scarce expertise" },
  { pillar: "Infrastructure", href: "/ai-center-of-excellence/scalable-infrastructure", note: "Where builders and agents operate" },
  { pillar: "Data & Context", href: "/ai-center-of-excellence/data-governance", note: "What knowledge they can trust" },
  { pillar: "Governance", href: "/ai-center-of-excellence/governance-risk", note: "How quality and risk are evidenced" },
  { pillar: "Adoption", href: "/ai-center-of-excellence/adoption-culture", note: "How expertise lands in daily work" },
];

const examples: {
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}[] = [
  {
    title: "Example: Shared agent delivery cell",
    description:
      "A domain lead, agent engineer, knowledge engineer, and evaluation specialist form a short-lived cell for one priority workflow — then document patterns for reuse.",
    image: "/images/coe/coe-usecase-sentiment.webp",
    imagePosition: "object-left",
  },
  {
    title: "Example: Practitioner judgment capture",
    description:
      "High-performing operators contribute decision criteria and exception handling that become reusable prompts, policies, and evaluation cases — without leaving their unit.",
    image: "/images/coe/coe-industry-supplychain.webp",
    imagePosition: "object-center",
  },
];

const sectionVignette = "/images/coe/coe-industry-supplychain.webp";

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Centralized AI Expertise & Capability Building",
  name: "Centralized AI Expertise for an AI Center of Excellence",
  url: absoluteUrl("/ai-center-of-excellence/centralized-expertise"),
  description:
    "A flexible multidisciplinary capability that captures, strengthens, and reuses organizational expertise across domain, product, engineering, evaluation, platform, and enablement roles — without stripping expertise from business units.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Centralized AI Expertise is pillar 2 of Overture's AI Center of Excellence. It is a flexible multidisciplinary capability — not a mandate to hire a large permanent central team of data scientists. Roles include: domain leaders and high-performing practitioners; AI product and process owners; agent and application engineers; data and knowledge engineers; evaluation and quality specialists; platform, security, and governance specialists; adoption and enablement leaders. The CoE does not remove expertise from business units. It gives the organization a way to capture, strengthen, reuse, and scale that expertise consistently. Do not invent staffing numbers or client results. Examples are illustrative.`;

export default function CentralizedExpertisePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Centralized AI Expertise" />
      <CentralizedExpertisePageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-accent/10 via-accent/5 to-background dark:from-accent/5 dark:via-accent/5 dark:to-background">
          <HeroBackdrop src="/images/coe/coe-centralized-expertise-hero.webp" intensity="strong" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 2 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Centralized
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                AI Expertise
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              Capture, strengthen, and reuse multidisciplinary expertise across the enterprise — without stripping capability from the units that hold it.
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
            <p className="text-sm font-medium text-muted-foreground mb-6">
              Multidisciplinary capability flowing into one reusable center — not a single job title
            </p>
            <ExpertiseBeam />
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Expertise Stays Local — Capability Can Still Scale</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The CoE is not a takeover of business-unit talent. It is the operating way to make strong judgment, product ownership, engineering, evaluation, and enablement available wherever work needs them — consistently, and without assuming an oversized permanent headcount.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What Overture Helps Establish</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">A Flexible Multidisciplinary Mix</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <Card key={c.title} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <c.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <SectionBand src="/images/coe/coe-centralized-expertise-hero.webp">
          Reuse strong judgment across the organization — while accountability stays with the people who run the work.
        </SectionBand>

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How We Establish It</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Right-Sized for Your Reality</h2>
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
          <SectionWash src={sectionVignette} />
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

        <PillarNav current="centralized-expertise" />
        <PillarNextSteps prompt="Assess how your expertise is currently concentrated — or talk with us about a right-sized CoE capability model." />
        <SiteFooter />
      </div>
    </>
  );
}
