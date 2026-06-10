// app/ai-center-of-excellence/data-governance/page.tsx
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import Image from "next/image";
import { PageAiContext } from "@/components/page-ai-context";
import { DataGovernancePageTools } from "./DataGovernancePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { StartHereBlock } from "@/components/coe/start-here-block";
import { DataCatalogTree } from "@/components/coe/visuals/data-catalog-tree";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import { CtaTexture } from "@/components/coe/cta-texture";
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

// Social cards only; title/description inherit from the root layout.
// No metadataBase is set in app/layout.tsx, so URLs are absolute.
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "https://new-oss.vercel.app/images/coe/coe-data-governance-og.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://new-oss.vercel.app/images/coe/coe-data-governance-og.jpg"],
  },
};

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

// Industry vignettes: keyword-matched per the Stage 2 mapping; items with no
// industry keyword stay imageless on purpose. Healthcare's stethoscope sits
// right of center, hence object-right so it survives the right-edge bleed.
const applications: {
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}[] = [
  { title: "Healthcare Diagnostics", description: "Ensure accurate, secure patient data for AI-driven diagnostic tools and clinical decision support.", image: "/images/coe/coe-industry-healthcare.webp", imagePosition: "object-right" },
  { title: "Governed Analytics", description: "Provide a trustworthy, compliant data foundation for analytics and model training across the business." },
];

// Colored version of the section's matched vignette, washed behind the whole
// Applications section; the card copies render greyscale for chromatic contrast.
const sectionVignette = applications.find((a) => a.image)?.image;

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

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <HeroBackdrop src="/images/coe/coe-data-governance-hero.webp" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8 py-20">
            <Badge variant="outline" className="mb-6 max-w-full whitespace-normal text-center border-primary/50 text-primary px-4 py-1.5 shadow-brand">
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

        {/* Signature visual */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-6">A cataloged, governed data estate</p>
            <DataCatalogTree />
          </div>
        </section>

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

        {/* Mid-page breather band - echoes the hero artwork */}
        <SectionBand src="/images/coe/coe-data-governance-hero.webp">
          A well-cataloged, quality-managed, and compliant data foundation is not a nice-to-have - it is the prerequisite for every AI initiative that needs to be trusted in production.
        </SectionBand>

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
        <section className="relative overflow-hidden py-20">
          {/* Colored section field: full-color vignette washes the section and
              fades at both edges; the greyscale card copy above it supplies the
              chromatic figure-ground contrast. */}
          {sectionVignette && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
            >
              <Image
                src={sectionVignette}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center opacity-15 dark:opacity-25"
              />
            </div>
          )}
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">In Practice</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Real-World Applications</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {applications.map((a, idx) => (
                <Card key={idx} className="h-full border-2">
                  {/* Industry vignette as an edge-bleed backdrop: anchored to the
                      right periphery and masked toward the text, so reading
                      anchors top-left while the image registers as atmosphere. */}
                  {a.image && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 right-0 w-3/5 mask-[linear-gradient(to_left,black_25%,transparent_95%)]"
                    >
                      <Image
                        src={a.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 66vw, 30vw"
                        className={`object-cover ${a.imagePosition ?? "object-center"} grayscale opacity-30 dark:opacity-45 transition-all duration-500 group-hover:grayscale-0`}
                      />
                    </div>
                  )}
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

        {/* Start Here entry point */}
        <StartHereBlock />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <CtaTexture />
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to govern your data?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Let&apos;s build the cataloging, quality management, and compliance foundation your AI initiatives depend on.
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
