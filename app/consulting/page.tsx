// app/consulting/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { HomeButton } from "@/components/ui/home-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  BrainCircuitIcon,
  RocketIcon,
  TrendingUpIcon,
  UsersIcon,
  TargetIcon,
  LightbulbIcon,
  LineChartIcon,
  ShieldCheckIcon,
  ZapIcon,
  CheckCircle2,
  ArrowRight,
  SparklesIcon,
  LayersIcon,
  Settings2Icon,
  GraduationCapIcon,
  BookOpenIcon,
  ClockIcon,
  AwardIcon,
  BarChart3Icon,
} from "lucide-react";

const consultingServices = [
  {
    icon: BrainCircuitIcon,
    title: "AI Strategy & Roadmap",
    description: "Develop comprehensive AI strategies aligned with your business objectives and create actionable implementation roadmaps.",
    features: ["Strategic planning", "ROI analysis", "Technology assessment", "Risk evaluation"],
  },
  {
    icon: LayersIcon,
    title: "AI Implementation",
    description: "End-to-end AI solution implementation from proof-of-concept to production deployment with ongoing support.",
    features: ["Custom AI solutions", "System integration", "Performance optimization", "Quality assurance"],
  },
  {
    icon: Settings2Icon,
    title: "AI Operations & Optimization",
    description: "Optimize existing AI systems for better performance, cost-efficiency, and scalability in production environments.",
    features: ["Model optimization", "Cost reduction", "Performance tuning", "Infrastructure design"],
  },
  {
    icon: GraduationCapIcon,
    title: "AI Training & Enablement",
    description: "Empower your teams with AI knowledge through customized training programs and workshops.",
    features: ["Team training", "Best practices", "Hands-on workshops", "Ongoing mentorship"],
  },
  {
    icon: ShieldCheckIcon,
    title: "AI Governance & Ethics",
    description: "Establish responsible AI practices with governance frameworks, compliance strategies, and ethical guidelines.",
    features: ["Policy development", "Compliance frameworks", "Ethics assessment", "Risk management"],
  },
  {
    icon: LineChartIcon,
    title: "AI Analytics & Insights",
    description: "Transform data into actionable insights using advanced AI analytics and predictive modeling techniques.",
    features: ["Predictive analytics", "Data strategy", "Business intelligence", "Performance metrics"],
  },
];

const industryExpertise = [
  {
    name: "Healthcare",
    description: "HIPAA-compliant AI solutions for clinical operations, patient care, and research.",
    icon: "🏥",
  },
  {
    name: "Financial Services",
    description: "Secure AI for fraud detection, risk assessment, and automated trading.",
    icon: "💰",
  },
  {
    name: "Retail & E-commerce",
    description: "Personalization engines, demand forecasting, and inventory optimization.",
    icon: "🛒",
  },
  {
    name: "Manufacturing",
    description: "Predictive maintenance, quality control, and supply chain optimization.",
    icon: "🏭",
  },
  {
    name: "Technology",
    description: "MLOps, AI product development, and scalable AI infrastructure.",
    icon: "💻",
  },
  {
    name: "Non-Profits",
    description: "Cost-effective AI for donor management, impact analysis, and operations.",
    icon: "❤️",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & Assessment",
    description: "Deep dive into your business challenges, existing infrastructure, and AI readiness. We identify opportunities and define success metrics.",
    icon: TargetIcon,
    duration: "1-2 weeks",
  },
  {
    step: "02",
    title: "Strategy & Planning",
    description: "Develop tailored AI strategy with detailed roadmap, resource requirements, and ROI projections based on your unique needs.",
    icon: LightbulbIcon,
    duration: "2-3 weeks",
  },
  {
    step: "03",
    title: "Implementation & Integration",
    description: "Execute the AI strategy with agile development, rigorous testing, and seamless integration into your existing systems.",
    icon: RocketIcon,
    duration: "8-16 weeks",
  },
  {
    step: "04",
    title: "Optimization & Support",
    description: "Continuous monitoring, performance optimization, and ongoing support to ensure sustained value and improvement.",
    icon: TrendingUpIcon,
    duration: "Ongoing",
  },
];

const benefits = [
  {
    icon: TrendingUpIcon,
    stat: "3.5x",
    label: "Average ROI",
    description: "Clients see 3.5x return on AI investments within 18 months",
  },
  {
    icon: ClockIcon,
    stat: "60%",
    label: "Time Savings",
    description: "Reduce operational costs through intelligent automation",
  },
  {
    icon: AwardIcon,
    stat: "95%",
    label: "Success Rate",
    description: "Project success rate with measurable business impact",
  },
  {
    icon: UsersIcon,
    stat: "200+",
    label: "Clients Served",
    description: "Organizations transformed through AI consulting",
  },
];

const testimonials = [
  {
    quote: "The AI strategy they developed transformed our operations. We've seen a 40% increase in efficiency and significant cost savings within the first year.",
    author: "Jennifer Martinez",
    role: "CTO",
    company: "HealthCore Systems",
    impact: "40% efficiency gain",
  },
  {
    quote: "Their expertise in AI implementation was invaluable. They guided us through every step and delivered a solution that exceeded our expectations.",
    author: "David Chen",
    role: "VP of Innovation",
    company: "FinTech Solutions",
    impact: "Deployed in 3 months",
  },
  {
    quote: "The training program they provided empowered our entire data science team. We're now building and deploying AI models independently.",
    author: "Sarah Johnson",
    role: "Head of Analytics",
    company: "RetailMax Inc",
    impact: "Team fully enabled",
  },
];

export default function AIConsultingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Home Button */}
      <HomeButton />
      
      {/* Hero Section */}
      <header className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 dark:from-blue-500/10 dark:via-purple-500/5 dark:to-pink-500/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-20">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1.5">
            <SparklesIcon className="w-3 h-3 mr-2 inline" />
            Expert AI Consulting Services
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Transform Your Business
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              With AI Consulting
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            Strategic AI guidance from experts who understand both technology and business. We help you navigate the AI landscape and achieve measurable results.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="#services">View Services</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Free initial consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Tailored strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Proven track record</span>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Stats */}
      <section className="py-16 border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-foreground">{benefit.stat}</div>
                <div className="mt-2 text-sm font-medium text-foreground">{benefit.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting Services */}
      <section id="services" className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Services</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Comprehensive AI Consulting Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              End-to-end AI consulting services designed to accelerate your AI journey and maximize business value.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {consultingServices.map((service, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <service.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Process</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Structured Approach to Success
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our proven methodology ensures successful AI implementation from concept to production.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
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
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Industry Expertise</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Deep Industry Knowledge
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized AI consulting across multiple industries with proven results.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industryExpertise.map((industry, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{industry.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{industry.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Client Success</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                      {testimonial.impact}
                    </Badge>
                  </div>
                  <blockquote className="text-base text-muted-foreground italic mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 dark:from-blue-500/10 dark:via-purple-500/5 dark:to-pink-500/10">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Ready to Start Your AI Journey?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Schedule a free consultation with our AI experts and discover how we can help transform your business.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/contact">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Custom proposals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Flexible engagement models</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2025 Overture Systems Solutions. All rights reserved.
      </footer>
    </div>
  );
}

