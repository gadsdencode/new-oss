// app/ai-center-of-excellence/scalable-infrastructure/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeButton } from "@/components/ui/home-button";
import Link from "next/link";
import { PageAiContext } from "@/components/page-ai-context";
import { ScalableInfrastructurePageTools } from "./ScalableInfrastructurePageTools";
import { StructuredData } from "@/components/structured-data";
import { PillarNav } from "@/components/coe/pillar-nav";
import { ScaleRipple } from "@/components/coe/visuals/scale-ripple";
import {
  CloudIcon,
  BoxesIcon,
  ShareIcon,
  GaugeIcon,
  ActivityIcon,
  ArrowRight,
  SparklesIcon,
} from "lucide-react";

const capabilities = [
  { icon: CloudIcon, title: "Cloud-Native Architecture", description: "Dynamically scale resources on demand and leverage managed services for seamless deployment." },
  { icon: BoxesIcon, title: "Containerization & Orchestration", description: "Use Docker and Kubernetes for consistent, reproducible deployments across environments." },
  { icon: ShareIcon, title: "Distributed Training & Inference", description: "Handle large workloads and run multiple models in parallel with distributed setups." },
  { icon: GaugeIcon, title: "Autoscaling & Load Balancing", description: "Scale up or down with demand for high availability and efficient resource utilization." },
  { icon: ActivityIcon, title: "Monitoring & Observability", description: "Track health, performance, and utilization to enable proactive troubleshooting and optimization." },
];

const approach = [
  { step: "01", icon: CloudIcon, title: "Design the Platform", description: "Choose a cloud-native foundation and managed services that fit the organization's needs." },
  { step: "02", icon: BoxesIcon, title: "Containerize & Automate", description: "Package models for reproducible deployment and automate the delivery pipeline." },
  { step: "03", icon: ActivityIcon, title: "Scale & Observe", description: "Add autoscaling, load balancing, and full observability for reliable production operation." },
];

const applications = [
  { title: "Fraud Detection at Scale", description: "Deploy and scale fraud-detection models that handle high transaction volumes in financial services." },
  { title: "Multi-Model Deployment", description: "Run diverse AI applications in parallel on a single elastic platform." },
];

const stack = ["Docker", "Kubernetes", "AWS SageMaker", "Google AI Platform", "TensorFlow Serving", "Prometheus", "Grafana", "Elasticsearch"];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Scalable AI Infrastructure",
  name: "Scalable AI Infrastructure for an AI Center of Excellence",
  description:
    "Cloud-native, containerized infrastructure with distributed training, autoscaling, and full observability so AI models deploy and scale reliably as demand grows.",
  provider: { "@type": "Organization", name: "Overture Systems Solutions", url: "https://new-oss.vercel.app" },
  areaServed: { "@type": "Country", name: "United States" },
  isPartOf: { "@type": "Service", name: "AI Center of Excellence (CoE) Establishment" },
};

const pageContent = `Scalable AI Infrastructure is the third pillar of an AI Center of Excellence. Cloud-native architecture enables dynamic resource scaling and managed services for seamless deployment. Containerization and orchestration via Docker and Kubernetes ensure consistent, reproducible deployments. Distributed training and inference with TensorFlow Serving and AWS SageMaker handle large workloads and parallel model execution. Autoscaling and load balancing maintain high availability, while monitoring and observability via Prometheus, Grafana, and Elasticsearch enable proactive troubleshooting. Real-world applications include fraud detection at scale for financial services and multi-model deployment on a single elastic platform.`;

export default function ScalableInfrastructurePage() {
  return (
    <>
      <StructuredData data={schema} />
      <PageAiContext content={pageContent} pageTitle="Scalable AI Infrastructure" />
      <ScalableInfrastructurePageTools />

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background font-sans">
        <HomeButton />

        {/* Hero */}
        <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/10 via-secondary/5 to-background dark:from-secondary/5 dark:via-secondary/5 dark:to-background">
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
              Cloud-native, containerized infrastructure that deploys and scales AI reliably as demand grows.
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
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <ScaleRipple />
          </div>
        </section>

        {/* Why it matters */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">Why It Matters</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Infrastructure That Grows With You</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Brittle, hand-configured infrastructure is the hidden bottleneck in most AI programs. Cloud-native, containerized platforms eliminate that ceiling - so models that work in the lab also work reliably at production scale, without heroic effort every time demand spikes.
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

        {/* Technology Stack */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Technology Stack</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Battle-Tested Tools</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We build on proven, open-standard platforms so your infrastructure is portable and future-proof.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Sibling pillars */}
        <PillarNav current="scalable-infrastructure" />

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 dark:from-primary/10 dark:via-secondary/5 dark:to-accent/10">
          <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to scale your AI platform?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground">
              Let&apos;s design and deploy a cloud-native AI infrastructure that grows reliably with your ambitions.
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

        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          &copy; 2025 Overture Systems Solutions. All rights reserved.
        </footer>
      </div>
    </>
  );
}
