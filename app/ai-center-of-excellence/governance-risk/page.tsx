// app/ai-center-of-excellence/governance-risk/page.tsx
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
import { StartHereBlock } from "@/components/coe/start-here-block";
import { ResponsibleAIGauges } from "@/components/coe/visuals/responsible-ai-gauges";
import {
  UsersIcon,
  AlertTriangleIcon,
  ActivityIcon,
  SirenIcon,
  ScaleIcon,
  CompassIcon,
  EyeIcon,
  LockIcon,
  ClipboardCheckIcon,
  SearchCheckIcon,
  RocketIcon,
  ArrowRight,
  SparklesIcon,
} from "lucide-react";

const capabilities = [
  { icon: UsersIcon, title: "AI Governance Board", description: "A cross-functional board that oversees development and deployment and ensures alignment with objectives, policies, and ethics." },
  { icon: AlertTriangleIcon, title: "Risk Assessment Process", description: "A structured process to identify, analyze, and mitigate technical, operational, and reputational risks." },
  { icon: ActivityIcon, title: "Model Monitoring & Auditing", description: "Continuously monitor production models and run periodic audits to catch bias or unintended behavior." },
  { icon: SirenIcon, title: "Incident Response Plan", description: "Defined roles, responsibilities, and steps to mitigate issues and restore normal operations." },
  { icon: ScaleIcon, title: "Regulatory Compliance", description: "Ensure development and deployment comply with relevant regulations, guidelines, and organizational policies." },
];

const approach = [
  { step: "01", icon: UsersIcon, title: "Establish the Board", description: "Stand up a cross-functional governance board with a clear charter." },
  { step: "02", icon: SearchCheckIcon, title: "Define Risk & Controls", description: "Implement the risk-assessment process, monitoring, and auditing controls." },
  { step: "03", icon: RocketIcon, title: "Operationalize", description: "Wire in incident response and compliance so governance runs continuously." },
];

const applications = [
  { title: "Real-Time Fraud Detection", description: "Deploy AI-powered fraud detection in banking to identify and prevent fraudulent activity in real time." },
  { title: "Audited Model Operations", description: "Keep production models monitored and audited so they behave as expected and stay compliant." },
];

const principles = [
  { icon: CompassIcon, title: "Alignment with Organizational Values", description: "AI decisions reflect the organization's values and intent." },
  { icon: EyeIcon, title: "Transparency & Explainability", description: "Models and decisions can be understood and explained." },
  { icon: ScaleIcon, title: "Mitigating Bias & Discrimination", description: "Actively detect and reduce unfair or biased outcomes." },
  { icon: LockIcon, title: "Data Privacy & Security", description: "Protect sensitive data throughout the AI lifecycle." },
  { icon: ClipboardCheckIcon, title: "Accountability & Oversight", description: "Clear ownership and oversight for AI behavior and outcomes." },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Governance, Risk & Responsible AI",
  name: "Governance, Risk & Responsible AI for an AI Center of Excellence",
  description:
    "A governance framework that makes AI trustworthy - board oversight, risk management, model monitoring and auditing, incident response, and responsible-AI practices.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Governance, Risk & Responsible AI is the fifth pillar of an AI Center of Excellence. A cross-functional AI governance board oversees development and deployment, ensuring alignment with objectives, policies, and ethics. A structured risk assessment process identifies, analyzes, and mitigates technical, operational, and reputational risks. Continuous model monitoring and periodic auditing catch bias or unintended behavior in production. A defined incident response plan provides roles, responsibilities, and steps to restore normal operations. Regulatory compliance ensures adherence to relevant regulations and organizational policies. Responsible AI principles include alignment with organizational values, transparency and explainability, mitigating bias and discrimination, data privacy and security, and accountability and oversight. Real-world applications include AI-powered real-time fraud detection in banking and audited model operations.`;

export default function GovernanceRiskPage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Governance, Risk & Responsible AI" />
      <GovernanceRiskPageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 dark:from-accent/5 dark:via-primary/5 dark:to-secondary/5">
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
              A governance framework that makes AI trustworthy - board oversight, risk management, monitoring, and responsible-AI practices.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/ai-center-of-excellence">Back to the Framework</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Why it matters */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Trustworthy AI Requires Active Governance</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ungoverned AI carries real risk - biased outputs, regulatory exposure, and reputational harm. A structured governance framework turns AI from a liability into a controlled, trusted capability. It is the difference between organizations that deploy AI confidently and those that pull it back after an incident.
            </p>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What We Build</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Core Capabilities</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, idx) => (
                <Card key={idx} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <c.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Our Approach</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">How We Establish It</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {approach.map((step, idx) => (
                <div key={idx} className="relative">
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary/20">{step.step}</span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <step.icon className="h-6 w-6 text-primary" />
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
                      <ArrowRight className="h-8 w-8 text-primary/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">In Practice</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Real-World Applications</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {applications.map((a, idx) => (
                <Card key={idx} className="h-full border-2">
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

        {/* Responsible AI Principles */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Responsible AI Principles</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Built on a Foundation of Trust</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Every AI system we help build is grounded in five core principles that make it defensible, trustworthy, and aligned with organizational values.
              </p>
            </div>
            <div className="mb-16">
              <ResponsibleAIGauges />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {principles.map((p, idx) => (
                <Card key={idx} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <p.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{p.title}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sibling pillars */}
        <PillarNav current="governance-risk" />

        {/* Start Here entry point */}
        <StartHereBlock />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to govern AI responsibly?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Let&apos;s build the board, risk controls, and responsible-AI framework that make your AI trustworthy at scale.
            </p>
            <div className="mt-8">
              <Button size="lg" className="w-full sm:w-auto whitespace-normal text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
