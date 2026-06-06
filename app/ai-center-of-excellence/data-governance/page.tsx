// app/ai-center-of-excellence/data-governance/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { DataGovernancePageTools } from "./DataGovernancePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import {
  FolderTreeIcon,
  CheckCircle2,
  LockIcon,
  FileCheckIcon,
  LayersIcon,
  SearchCheckIcon,
  RocketIcon,
  ArrowRight,
  SparklesIcon,
} from "lucide-react";

const capabilities = [
  { icon: FolderTreeIcon, title: "Data Cataloging", description: "Make data discoverable, documented, and usable across teams and AI initiatives." },
  { icon: CheckCircle2, title: "Data Quality Management", description: "Ensure the accuracy and reliability that effective model training depends on." },
  { icon: LockIcon, title: "Privacy & Security", description: "Securely store and process data and protect sensitive information end to end." },
  { icon: FileCheckIcon, title: "Compliance Monitoring", description: "Keep data use aligned with regulations across regulated domains like healthcare and finance." },
  { icon: LayersIcon, title: "Robust Data Ecosystem", description: "Combine governance, quality assurance, and secure processing into a scalable foundation." },
];

const approach = [
  { step: "01", icon: SearchCheckIcon, title: "Assess the Data Estate", description: "Map sources, quality, and gaps across the organization's data." },
  { step: "02", icon: FolderTreeIcon, title: "Stand Up Governance", description: "Implement cataloging, quality management, and compliance monitoring." },
  { step: "03", icon: RocketIcon, title: "Enable AI Workloads", description: "Deliver a reliable, secure data foundation that AI initiatives can build on." },
];

const applications = [
  { title: "Healthcare Diagnostics", description: "Ensure accurate, secure patient data for AI-driven diagnostic tools and clinical decision support." },
  { title: "Governed Analytics", description: "Provide a trustworthy, compliant data foundation for analytics and model training across the business." },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Data Management & Governance",
  name: "Data Management & Governance for an AI Center of Excellence",
  description:
    "Building a robust data ecosystem with cataloging, quality assurance, and secure storage - the high-quality, well-governed foundation effective AI depends on.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Data Management & Governance is the fourth pillar of an AI Center of Excellence. High-quality, well-governed data is the foundation that effective AI depends on. Overture Systems Solutions implements data cataloging to make data discoverable and documented, data quality management to ensure accuracy and reliability for model training, privacy and security controls to protect sensitive information end to end, and compliance monitoring to keep data use aligned with regulations in healthcare, finance, and other regulated domains. The approach: assess the data estate, stand up governance, and enable AI workloads. Real-world applications include ensuring accurate and secure patient data for healthcare diagnostics and clinical decision support, and providing a trustworthy compliant data foundation for analytics and model training.`;

export default function DataGovernancePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Data Management & Governance" />
      <DataGovernancePageTools />

      <div className="flex min-h-screen flex-col bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              AI Center of Excellence &bull; Pillar 4 of 6
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Data Management
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                &amp; Governance
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              A robust, well-governed data ecosystem - the high-quality foundation effective AI depends on.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="/ai-center-of-excellence">Back to the Framework</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Why it matters */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">No Model Is Better Than Its Data</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Even the most sophisticated AI model produces unreliable outputs when trained on poor-quality or ungoverned data. A well-cataloged, quality-managed, and compliant data foundation is not a nice-to-have - it is the prerequisite for every AI initiative that needs to be trusted in production.
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
                        <span className="text-5xl font-bold text-primary/20">{step.step}</span>
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

        {/* Sibling pillars */}
        <PillarNav current="data-governance" />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to govern your data?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Let&apos;s build the cataloging, quality management, and compliance foundation your AI initiatives depend on.
            </p>
            <div className="mt-8">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          &copy; 2025 Overture Systems Solutions. All rights reserved.
        </footer>
      </div>
    </>
  );
}
