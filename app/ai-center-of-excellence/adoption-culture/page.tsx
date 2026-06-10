// app/ai-center-of-excellence/adoption-culture/page.tsx
import type { Metadata } from "next";
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
import { StartHereBlock } from "@/components/coe/start-here-block";
import { ImprovementCycleOrbit } from "@/components/coe/visuals/improvement-cycle-orbit";
import { HeroBackdrop } from "@/components/coe/hero-backdrop";
import { SectionBand } from "@/components/coe/section-band";
import { CtaTexture } from "@/components/coe/cta-texture";
import {
  UsersIcon,
  BookOpenIcon,
  TrophyIcon,
  RefreshCwIcon,
  FlaskConicalIcon,
  MessageSquareIcon,
  ArrowRight,
  SparklesIcon,
} from "lucide-react";

// Social cards only; title/description inherit from the root layout.
// No metadataBase is set in app/layout.tsx, so URLs are absolute.
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "https://new-oss.vercel.app/images/coe/coe-adoption-culture-og.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://new-oss.vercel.app/images/coe/coe-adoption-culture-og.jpg"],
  },
};

const capabilities = [
  { icon: UsersIcon, title: "Cross-Functional Collaboration", description: "Bring IT, data science, and business units together to break down silos and build shared understanding." },
  { icon: BookOpenIcon, title: "Comprehensive Training", description: "Programs covering AI, machine learning, and data-science fundamentals to equip every employee." },
  { icon: TrophyIcon, title: "Showcase Use Cases", description: "Highlight real wins - efficiency, cost savings, better CX - to inspire and motivate wider adoption." },
  { icon: RefreshCwIcon, title: "Continuous Learning Program", description: "Ongoing training and certification, workshops and seminars, and regular knowledge-sharing sessions." },
  { icon: FlaskConicalIcon, title: "AI Innovation Labs", description: "A space to experiment with new tools and techniques and promote a culture of innovation." },
  { icon: MessageSquareIcon, title: "Continuous Feedback Loop", description: "Capture insights from AI projects and use them to refine strategy and implementation." },
];

const approach = [
  { step: "01", icon: UsersIcon, title: "Break Down Silos", description: "Form cross-functional teams and shared rituals so AI work is everyone's work." },
  { step: "02", icon: BookOpenIcon, title: "Train & Showcase", description: "Run training programs and spotlight early wins to build momentum." },
  { step: "03", icon: RefreshCwIcon, title: "Institutionalize Learning", description: "Stand up innovation labs and feedback loops so the organization keeps improving." },
];

const applications = [
  { title: "Knowledge-Sharing & Innovation Labs", description: "Regular sessions where teams present projects and experiment with new AI techniques." },
  { title: "Agile Prototyping", description: "Use Scrum or Kanban to rapidly prototype and refine solutions like recommendation systems." },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Adoption & Continuous Learning",
  name: "Culture of Adoption & Continuous Learning for an AI Center of Excellence",
  description:
    "Driving org-wide AI adoption and keeping teams at the frontier through cross-functional collaboration, comprehensive training, showcased wins, innovation labs, and a continuous-improvement feedback loop.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Culture of Adoption & Continuous Learning is the sixth pillar of an AI Center of Excellence. Cross-functional collaboration breaks down silos between IT, data science, and business units. Comprehensive training covers AI, machine learning, and data-science fundamentals for every employee. Showcasing use cases highlights real wins in efficiency, cost savings, and customer experience to inspire wider adoption. Continuous learning programs include ongoing training and certification, workshops, and knowledge-sharing sessions. AI innovation labs provide space to experiment with new tools and promote innovation culture. A continuous feedback loop captures insights from projects to refine strategy. The six-step continuous-improvement cycle: monitor and gather feedback, analyze data for improvement opportunities, iterate on processes and technologies, implement and test changes, communicate updates and lessons learned, and repeat the cycle. Real-world applications include knowledge-sharing sessions and innovation labs, and agile prototyping with Scrum or Kanban for recommendation systems.`;

export default function AdoptionCulturePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Culture of Adoption & Continuous Learning" />
      <AdoptionCulturePageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* Hero */}
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
              Drive org-wide adoption and keep your team at the frontier through collaboration, training, and continuous improvement.
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Technology Without Adoption Is Just Cost</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The most capable AI platform delivers zero value if the organization doesn&apos;t embrace it. Culture is what turns a technical capability into a business multiplier - and continuous learning is what keeps that multiplier growing as AI evolves.
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
        <SectionBand src="/images/coe/coe-adoption-culture-hero.webp">
          The most capable AI platform delivers zero value if the organization doesn&apos;t embrace it.
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

        {/* Continuous Improvement Cycle */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">The Continuous Improvement Cycle</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Always Getting Better</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A structured six-step cycle turns every AI deployment into a learning opportunity that sharpens the next one.
              </p>
            </div>
            <ImprovementCycleOrbit />
          </div>
        </section>

        {/* Sibling pillars */}
        <PillarNav current="adoption-culture" />

        {/* Start Here entry point */}
        <StartHereBlock />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <CtaTexture />
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to build an AI-first culture?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Let&apos;s design the training, collaboration, and continuous-learning program that turns AI into everyone&apos;s competitive advantage.
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
