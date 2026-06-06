// app/ai-center-of-excellence/page.tsx
// NO "use client" directive - this is a Server Component (matches app/consulting/page.tsx)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { CoEReadinessAssessment } from "@/components/coe/coe-readiness-assessment";
import { HomeButton } from "@/components/ui/home-button";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { CoEPageTools } from "./CoEPageTools";
import { StructuredData } from "@/components/structured-data";
import {
  TargetIcon,
  UsersIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  Settings2Icon,
  HeartIcon,
  LineChartIcon,
  LightbulbIcon,
  LayersIcon,
  SearchCheckIcon,
  RocketIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowRight,
  SparklesIcon,
  BrainCircuitIcon,
} from "lucide-react";

// ---- The six CoE pillars (services grid) ----
const coePillars = [
  {
    icon: TargetIcon,
    title: "Strategic Vision & Leadership",
    description:
      "Define a forward-looking AI vision with measurable objectives, executive sponsorship, and tight alignment to business goals - the foundation every successful CoE is built on.",
    features: ["Forward-looking vision", "Measurable objectives", "Executive sponsorship", "Business-goal alignment"],
    bentoClassName: "col-span-1 md:col-span-2 lg:col-span-2",
    gradient: "from-primary/15 via-accent/10 to-primary/5",
  },
  {
    icon: UsersIcon,
    title: "Centralized AI Expertise",
    description:
      "Assemble a multidisciplinary team - data scientists, ML engineers, domain experts, and business analysts - deployable across the organization for consistent delivery.",
    features: ["Data scientists", "ML engineers", "Domain experts", "Business analysts"],
    bentoClassName: "col-span-1 md:col-span-1 lg:col-span-1",
    gradient: "from-accent/15 via-accent/10 to-accent/5",
  },
  {
    icon: ServerIcon,
    title: "Scalable AI Infrastructure",
    description:
      "Stand up cloud-native, containerized infrastructure with distributed training, autoscaling, and full observability so AI models deploy and scale reliably as demand grows.",
    features: ["Cloud-native architecture", "Containerization & orchestration", "Autoscaling & load balancing", "Monitoring & observability"],
    bentoClassName: "col-span-1 md:col-span-1 lg:col-span-1",
    gradient: "from-secondary/15 via-secondary/10 to-secondary/5",
  },
  {
    icon: DatabaseIcon,
    title: "Data Management & Governance",
    description:
      "Build a robust data ecosystem with cataloging, quality assurance, and secure storage - the high-quality, well-governed foundation effective AI depends on.",
    features: ["Data cataloging", "Quality assurance", "Privacy & security", "Compliance monitoring"],
    bentoClassName: "col-span-1 md:col-span-2 lg:col-span-2",
    gradient: "from-primary/15 via-secondary/10 to-accent/5",
  },
  {
    icon: ShieldCheckIcon,
    title: "Governance, Risk & Responsible AI",
    description:
      "Establish a cross-functional governance board, structured risk assessment, model monitoring and auditing, incident response, and regulatory compliance for trustworthy AI.",
    features: ["AI governance board", "Risk assessment", "Model monitoring & auditing", "Incident response"],
    bentoClassName: "col-span-1 md:col-span-1 lg:col-span-1",
    gradient: "from-accent/15 via-primary/10 to-secondary/5",
  },
  {
    icon: GraduationCapIcon,
    title: "Culture of Adoption & Continuous Learning",
    description:
      "Drive cross-functional collaboration, comprehensive training, and visible success stories so adoption spreads - paired with continuous learning to stay at the frontier.",
    features: ["Cross-functional collaboration", "Comprehensive training", "Showcase use cases", "Continuous upskilling"],
    bentoClassName: "col-span-1 md:col-span-2 lg:col-span-2",
    gradient: "from-secondary/15 via-accent/10 to-primary/5",
  },
];

// ---- AI Capability Model (5-step process band) ----
const capabilityModel = [
  { step: "01", title: "Assess Current AI Maturity", description: "Evaluate existing AI capabilities - skills, processes, and infrastructure - to identify strengths, weaknesses, and areas for improvement." },
  { step: "02", title: "Define AI Maturity Levels", description: "Establish a clear set of maturity levels, from basic to advanced, aligned with strategic goals and objectives." },
  { step: "03", title: "Identify Capability Gaps", description: "Analyze the current state against target maturity levels and pinpoint where the organization needs to improve." },
  { step: "04", title: "Develop a Roadmap for Growth", description: "Create a detailed plan with specific goals, milestones, and timelines to progress through the maturity levels." },
  { step: "05", title: "Implement Continuous Improvement", description: "Regularly review and update the capability model so it stays aligned with evolving needs and industry best practices." },
];

// ---- Business outcomes a CoE delivers ----
const coeOutcomes = [
  { icon: Settings2Icon, title: "Operational Efficiency", description: "AI-driven automation and process optimization reduce manual effort, minimize errors, and accelerate workflows." },
  { icon: HeartIcon, title: "Enhanced Customer Experience", description: "AI-powered service tools like chatbots and recommendation systems improve response times and satisfaction." },
  { icon: LineChartIcon, title: "Data-Driven Decisions", description: "Predictive analytics, risk management, and market analysis deliver actionable insights and faster, more accurate decisions." },
  { icon: LightbulbIcon, title: "Product & Service Innovation", description: "New AI-driven offerings create competitive differentiation and open new revenue streams." },
  { icon: LayersIcon, title: "Resource Utilization", description: "Demand forecasting, inventory management, and supply-chain optimization reduce waste and lower costs." },
  { icon: ShieldCheckIcon, title: "Compliance & Risk Management", description: "AI for regulatory compliance, fraud detection, and cybersecurity strengthens security and reduces penalty risk." },
];

// ---- Industry-backed impact stats (KEEP SOURCE ATTRIBUTIONS) ----
const impactStats = [
  { stat: "10-20%", label: "Manufacturing Cost Reduction", description: "Through AI automation and process optimization (McKinsey)." },
  { stat: "~1/3", label: "Lower Support Costs", description: "Generative AI can cut customer-support costs while increasing conversions." },
  { stat: "41%", label: "Supply Chain Savings", description: "Cost reduction achieved in some AI supply-chain implementations (McKinsey)." },
  { stat: "54%", label: "Executives Expect Savings", description: "Of executives expect AI cost savings; half anticipate over 10% (BCG)." },
];

// ---- OSS engagement process (advisor-led). Durations are placeholders - adjust to your standard SOW. ----
const engagementProcess = [
  { step: "01", icon: SearchCheckIcon, title: "Comprehensive Assessment", description: "Review current AI capabilities, identify gaps, and understand organizational needs through stakeholder workshops and baseline data gathering.", duration: "2-3 weeks" },
  { step: "02", icon: TargetIcon, title: "Strategic AI Roadmap", description: "Create a detailed plan outlining high-impact AI projects, resource requirements, timelines, and key milestones - including quick-win initiatives.", duration: "2-4 weeks" },
  { step: "03", icon: RocketIcon, title: "Stand Up the CoE", description: "Establish the team, infrastructure, governance framework, and operating model that turn the roadmap into a functioning capability.", duration: "8-12 weeks" },
  { step: "04", icon: TrendingUpIcon, title: "Operate & Continuously Improve", description: "Monitor performance, run innovation labs and knowledge-sharing, and refine strategy through a continuous feedback loop.", duration: "Ongoing" },
];

// ---- JSON-LD Service schema (SEO) ----
const coeServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Center of Excellence Advisory & Build",
  name: "AI Center of Excellence (CoE) Establishment",
  description:
    "End-to-end advisory and build services for establishing an AI Center of Excellence - uniting strategy, talent, scalable infrastructure, data governance, responsible-AI practices, and an adoption culture into a repeatable enterprise capability.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  areaServed: { "@type": "Country", name: "United States" },
  serviceOutput: [
    "AI vision and strategic roadmap",
    "Multidisciplinary CoE team and operating model",
    "Scalable AI infrastructure",
    "Data management and governance framework",
    "AI governance, risk, and responsible-AI policies",
    "Adoption and continuous-learning programs",
  ],
  audience: { "@type": "Audience", audienceType: "Enterprise organizations, Private equity firms, Portfolio companies" },
};

// ---- Plain-text context for the AI assistant ----
const pageContent = `Overture Systems Solutions helps organizations build an AI Center of Excellence (CoE) from the ground up - a centralized capability that turns scattered AI experiments into a repeatable, scalable function. The six CoE pillars are: Strategic Vision & Leadership, Centralized AI Expertise (a multidisciplinary team of data scientists, ML engineers, domain experts, and business analysts), Scalable AI Infrastructure (cloud-native, containerized, autoscaling, observable), Data Management & Governance, Governance/Risk/Responsible AI (governance board, risk assessment, model monitoring and auditing, incident response, compliance), and a Culture of Adoption & Continuous Learning. We develop the AI capability model in five steps: assess current maturity, define maturity levels, identify capability gaps, develop a growth roadmap, and implement continuous improvement. A CoE drives operational efficiency, better customer experience, data-driven decisions, product innovation, resource utilization, and compliance/risk management. OSS engages advisor-led: comprehensive assessment, strategic AI roadmap, standing up the CoE, then operate and continuously improve. Industry research cited on the page: AI can reduce manufacturing costs 10-20% (McKinsey); generative AI can cut customer-support costs by about one-third; some supply-chain AI implementations achieved 41% cost reduction (McKinsey); 54% of executives expect AI cost savings, half anticipating over 10% (BCG).`;

export default function AICenterOfExcellencePage() {
  return (
    <>
      <StructuredData data={coeServiceSchema} />
      <PageAiContext content={pageContent} pageTitle="AI Center of Excellence" />
      <CoEPageTools />

      <div className="flex min-h-screen flex-col bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow opacity-50" />
          <div className="absolute bottom-20 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow opacity-50 animation-delay-1000" />

          <div className="relative z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-24">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline animate-pulse" />
              AI Center of Excellence &bull; Enterprise Capability Building
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              Build Your AI Center of Excellence
              <span className="block mt-3 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                From Strategy to Scale
              </span>
            </h1>
            <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
              We help organizations stand up a centralized AI CoE that unites strategy, talent, governance, and infrastructure - turning AI from scattered experiments into a repeatable, scalable capability.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a CoE Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="#assessment">Assess Your Readiness</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Impact stats */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Why a CoE</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">The Business Case for AI at Scale</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A well-run Center of Excellence concentrates expertise and turns AI investment into measurable returns.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((s, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{s.stat}</p>
                  <p className="mt-2 font-semibold text-foreground">{s.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Six pillars - Bento */}
        <section id="framework" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">The Framework</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Six Pillars of a Successful AI CoE</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We build each pillar to fit your organization, then connect them into one operating model.
              </p>
            </div>
            <BentoGrid className="auto-rows-[24rem]">
              {coePillars.map((p, idx) => (
                <BentoCard
                  key={idx}
                  name={p.title}
                  className={p.bentoClassName}
                  background={<div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />}
                  Icon={p.icon}
                  description={p.description}
                  href="/contact"
                  cta="Learn More"
                />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* AI Readiness Assessment - signature interactive */}
        <section id="assessment" className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                <SparklesIcon className="w-3 h-3 mr-2 inline" />
                AI Readiness Assessment
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">How Ready Is Your Organization?</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Rate yourself across the six pillars to see your AI maturity profile and where a Center of Excellence would move the needle first.
              </p>
            </div>
            <CoEReadinessAssessment />
          </div>
        </section>

        {/* Capability model process band */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">AI Capability Model</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">From Maturity Assessment to Continuous Growth</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
              {capabilityModel.map((step, idx) => (
                <div key={idx} className="relative">
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <span className="text-5xl font-bold text-primary/20">{step.step}</span>
                      <CardTitle className="text-lg mt-2">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">What a CoE Delivers</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Measurable Outcomes Across the Business</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {coeOutcomes.map((o, idx) => (
                <Card key={idx} className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <o.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{o.title}</CardTitle>
                    <CardDescription>{o.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement process */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How We Engage</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Advisor-Led, Built to Last</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                An experienced AI advisor sets the strategic direction and operating framework from day one.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {engagementProcess.map((step, idx) => (
                <div key={idx} className="relative">
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-6xl font-bold text-primary/20">{step.step}</span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <Badge variant="outline" className="w-fit mt-2">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {step.duration}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {idx < engagementProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5 shadow-brand">
              <SparklesIcon className="w-3 h-3 mr-2 inline" />
              Free Consultation Available
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Ready to Build Your AI Center of Excellence?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Let&apos;s assess your AI maturity, map a roadmap, and stand up a CoE that delivers measurable results across your organization.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/contact">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="/consulting">See Our Consulting Services</Link>
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
