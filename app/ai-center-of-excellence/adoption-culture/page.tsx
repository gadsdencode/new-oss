// app/ai-center-of-excellence/adoption-culture/page.tsx
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
import { AdoptionCulturePageTools } from "./AdoptionCulturePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { PillarNextSteps } from "@/components/coe/pillar-next-steps";
import { ImprovementCycleOrbit } from "@/components/coe/visuals/improvement-cycle-orbit";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import {
  GraduationCapIcon,
  WorkflowIcon,
  UsersIcon,
  Repeat2Icon,
  BrainIcon,
  HandshakeIcon,
  LineChartIcon,
  MessageSquareIcon,
  RulerIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  RefreshCwIcon,
  ArrowRight,
  SparklesIcon,
  Link2Icon,
  FileCheckIcon,
} from "lucide-react";

export const metadata: Metadata = coePageMetadata({
  title: "Culture of Adoption & Continuous Learning | AI Center of Excellence | Overture Systems Solutions",
  description:
    "Role-based enablement, workflow redesign, champions, reusable practices, and feedback loops that make high-quality expertise available while retaining human accountability.",
  path: "/ai-center-of-excellence/adoption-culture",
  ogImage: "/images/coe/coe-adoption-culture-og.jpg",
});

const capabilities = [
  { icon: GraduationCapIcon, title: "Role-Based Enablement", description: "Train people for the work they do — not generic fundamentals for everyone at once." },
  { icon: WorkflowIcon, title: "Workflow Redesign", description: "Change how work actually runs so AI is embedded, not bolted on as optional novelty." },
  { icon: UsersIcon, title: "AI Champions", description: "Cultivate local leaders who coach peers and surface issues early." },
  { icon: Repeat2Icon, title: "Reusable Operating Practices", description: "Capture patterns that travel — playbooks, prompts, checklists, and exception handling." },
  { icon: BrainIcon, title: "Capturing Strong-Performer Judgment", description: "Make the judgment of high performers available more consistently across the organization." },
  { icon: HandshakeIcon, title: "Human-AI Collaboration", description: "Design clear handoffs so people remain accountable for decisions that matter." },
  { icon: LineChartIcon, title: "Adoption Measures", description: "Track whether capability is used, trusted, and improving outcomes — not vanity usage alone." },
  { icon: MessageSquareIcon, title: "Feedback Loops", description: "Route frontline signal back into product, evaluation, and enablement." },
  { icon: RulerIcon, title: "Continuous Evaluation & Improvement", description: "Keep quality and fit under review as workflows and models change." },
  { icon: ShieldCheckIcon, title: "Responsible Internal Ownership", description: "Ensure business owners — not only the CoE — own outcomes and safe use." },
];

const approach = [
  { step: "01", icon: BookOpenIcon, title: "Enable by Role", description: "Define role-based enablement and champion networks tied to priority workflows." },
  { step: "02", icon: WorkflowIcon, title: "Redesign the Work", description: "Embed AI into operating practices with clear human accountability." },
  { step: "03", icon: RefreshCwIcon, title: "Measure & Improve", description: "Instrument adoption, feedback, and continuous evaluation so learning compounds." },
];

const evidence = [
  { icon: FileCheckIcon, title: "Role-based enablement plan for priority workflows" },
  { icon: UsersIcon, title: "Champion network with feedback channels" },
  { icon: Repeat2Icon, title: "Reusable practice library (playbooks / patterns)" },
  { icon: LineChartIcon, title: "Adoption measures and improvement cadence" },
];

const connections = [
  { pillar: "Strategy", href: "/ai-center-of-excellence/strategic-vision", note: "Which outcomes adoption must serve" },
  { pillar: "Expertise", href: "/ai-center-of-excellence/centralized-expertise", note: "Whose judgment is being scaled" },
  { pillar: "Infrastructure", href: "/ai-center-of-excellence/scalable-infrastructure", note: "What people actually use in production" },
  { pillar: "Data & Context", href: "/ai-center-of-excellence/data-governance", note: "What context they can trust" },
  { pillar: "Governance", href: "/ai-center-of-excellence/governance-risk", note: "How safe use is evidenced" },
];

const examples = [
  {
    title: "Example: Role-based coach path",
    description:
      "Operations leads receive workflow-specific enablement and exception playbooks, while builders receive evaluation and release practices — not the same generic course.",
  },
  {
    title: "Example: Judgment capture into practice",
    description:
      "A high-performing reviewer documents decision criteria that become a reusable checklist and evaluation cases — available to peers, with the reviewer still owning escalations.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Adoption & Continuous Learning",
  name: "Culture of Adoption & Continuous Learning for an AI Center of Excellence",
  url: absoluteUrl("/ai-center-of-excellence/adoption-culture"),
  description:
    "Role-based enablement, workflow redesign, AI champions, reusable operating practices, capturing strong-performer judgment, human-AI collaboration, adoption measures, feedback loops, continuous evaluation, and responsible internal ownership.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Culture of Adoption & Continuous Learning is pillar 6 of Overture's AI Center of Excellence. It replaces generic company-wide AI fundamentals training with: role-based enablement; workflow redesign; AI champions; reusable operating practices; capturing the judgment of strong performers; human-AI collaboration; adoption measures; feedback loops; continuous evaluation and improvement; responsible internal ownership. Message: the CoE makes high-quality expertise more consistently available across the organization while retaining human accountability. Do not invent results. Examples are illustrative.`;

export default function AdoptionCulturePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Culture of Adoption & Continuous Learning" />
      <AdoptionCulturePageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/10 via-accent/5 to-primary/10 dark:from-secondary/5 dark:via-accent/5 dark:to-primary/5">
          <HeroBackdrop src="/images/coe/coe-adoption-culture-hero.webp" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 6 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Culture of Adoption
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                &amp; Continuous Learning
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              Make high-quality expertise consistently available across the organization — while people remain accountable for the work.
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
            <p className="text-sm font-medium text-muted-foreground mb-6">Feedback, evaluation, and improvement as a continuous cycle</p>
            <ImprovementCycleOrbit />
          </div>
        </section>

        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Adoption Is Operating Change</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Generic fundamentals training rarely changes how work gets done. This pillar redesigns roles, workflows, and feedback so capability is used — and so human accountability stays intact.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What Overture Helps Establish</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Adoption & Learning Capabilities</h2>
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

        <SectionBand src="/images/coe/coe-adoption-culture-hero.webp">
          Scale judgment through practice — not by removing accountability from the people who own the work.
        </SectionBand>

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How We Establish It</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Enable, Redesign, Improve</h2>
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

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Examples</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Operating Examples</h2>
              <p className="mt-3 text-sm text-muted-foreground">Illustrative scenarios — not client case studies or measured results.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {examples.map((a) => (
                <Card key={a.title} className="h-full border-2">
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

        <PillarNav current="adoption-culture" />
        <PillarNextSteps prompt="See how adoption and enablement show up in your organization — or design a role-based path in a Readiness Workshop." />
        <SiteFooter />
      </div>
    </>
  );
}
