// app/ai/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HomeButton } from "@/components/ui/home-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  BrainCircuitIcon,
  SparklesIcon,
  ZapIcon,
  CodeIcon,
  GlobeIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  DollarSignIcon,
  CheckCircle2,
  ArrowRight,
  LayersIcon,
  CpuIcon,
  DatabaseIcon,
  BarChart3Icon,
} from "lucide-react";

interface AIModel {
  name: string;
  developer: string;
  releaseDate: string;
  parameters?: string;
  contextWindow: string;
  inputPrice?: string;
  outputPrice?: string;
  accessType: string;
  strengths: string[];
  useCases: string[];
  icon: React.ElementType;
  color: string;
  rating?: {
    reasoning?: number;
    coding?: number;
    multimodal?: boolean;
  };
}

const aiModels: AIModel[] = [
  {
    name: "Claude 4 Opus",
    developer: "Anthropic",
    releaseDate: "May 2025",
    parameters: "200B+ (est.)",
    contextWindow: "200K tokens",
    inputPrice: "$15.00",
    outputPrice: "$75.00",
    accessType: "API",
    strengths: [
      "World's best coding performance (72.5% SWE-bench)",
      "Advanced multi-step reasoning",
      "Agent-based workflows",
      "Robust safety and alignment",
      "Hybrid thinking modes",
    ],
    useCases: [
      "Enterprise coding assistance",
      "Complex software engineering",
      "AI agent development",
      "Technical documentation",
      "Code review and optimization",
    ],
    icon: CodeIcon,
    color: "from-orange-500/20 to-amber-500/20 dark:from-orange-500/10 dark:to-amber-500/10",
    rating: {
      reasoning: 75,
      coding: 72.5,
      multimodal: false,
    },
  },
  {
    name: "Gemini 2.5 Pro",
    developer: "Google DeepMind",
    releaseDate: "June 2025",
    parameters: "1.56T (est.)",
    contextWindow: "1M tokens",
    inputPrice: "$2.50",
    outputPrice: "$15.00",
    accessType: "API",
    strengths: [
      "Leading reasoning performance (86.4 GPQA)",
      "Massive 1M token context window",
      "Advanced multimodal capabilities",
      "Google ecosystem integration",
      "Self-fact-checking",
    ],
    useCases: [
      "Large document analysis",
      "Multimodal applications",
      "Research and analysis",
      "Enterprise search",
      "Content generation",
    ],
    icon: BrainCircuitIcon,
    color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
    rating: {
      reasoning: 86.4,
      multimodal: true,
    },
  },
  {
    name: "GPT-4.5 / GPT-5",
    developer: "OpenAI",
    releaseDate: "Feb 2025 / 2025",
    parameters: "Not Disclosed",
    contextWindow: "128K-200K tokens",
    inputPrice: "$75.00",
    outputPrice: "$150.00",
    accessType: "API",
    strengths: [
      "Advanced unsupervised learning",
      "Multimodal (text, image, audio)",
      "Creative content generation",
      "80% reduction in hallucinations",
      "Multiple personality modes",
    ],
    useCases: [
      "Creative writing",
      "Multimedia conversations",
      "Content generation",
      "Interactive AI assistants",
      "General-purpose applications",
    ],
    icon: SparklesIcon,
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10",
    rating: {
      multimodal: true,
    },
  },
  {
    name: "OpenAI o3",
    developer: "OpenAI",
    releaseDate: "April 2025",
    parameters: "Not Disclosed",
    contextWindow: "200K tokens",
    inputPrice: "$10.00",
    outputPrice: "$40.00",
    accessType: "API",
    strengths: [
      "State-of-the-art reasoning (83.3 GPQA)",
      "Exceptional math/science (91.6 AIME)",
      "Reasoning-first architecture",
      "Extended thinking capabilities",
      "Production-ready performance",
    ],
    useCases: [
      "Scientific research",
      "Mathematical problem solving",
      "Complex reasoning tasks",
      "Technical analysis",
      "Academic applications",
    ],
    icon: CpuIcon,
    color: "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10",
    rating: {
      reasoning: 83.3,
    },
  },
  {
    name: "Llama 4 Scout",
    developer: "Meta AI",
    releaseDate: "April 2025",
    parameters: "109B (17B active)",
    contextWindow: "10M tokens",
    inputPrice: "Open Source",
    outputPrice: "Open Source",
    accessType: "Open Source",
    strengths: [
      "Unprecedented 10M token context",
      "Multimodal capabilities",
      "Open-source and customizable",
      "Cost-effective self-hosting",
      "Research and enterprise ready",
    ],
    useCases: [
      "Large codebase analysis",
      "Extensive document processing",
      "Research applications",
      "Custom enterprise solutions",
      "Academic research",
    ],
    icon: DatabaseIcon,
    color: "from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10",
  },
  {
    name: "Grok 3",
    developer: "xAI (Elon Musk)",
    releaseDate: "February 2025",
    parameters: "Not Disclosed",
    contextWindow: "1M tokens",
    inputPrice: "$3.00",
    outputPrice: "$15.00",
    accessType: "API",
    strengths: [
      "Real-time web integration",
      "Advanced reasoning (84.6 GPQA)",
      "Deep Search functionality",
      "Social media integration",
      "Think reasoning mode",
    ],
    useCases: [
      "Real-time information retrieval",
      "Live data processing",
      "Social media analysis",
      "Current events research",
      "Dynamic knowledge access",
    ],
    icon: GlobeIcon,
    color: "from-red-500/20 to-rose-500/20 dark:from-red-500/10 dark:to-rose-500/10",
    rating: {
      reasoning: 84.6,
    },
  },
  {
    name: "DeepSeek R1",
    developer: "DeepSeek",
    releaseDate: "January 2025",
    parameters: "671B (37B active)",
    contextWindow: "128K tokens",
    inputPrice: "$0.55",
    outputPrice: "$2.19",
    accessType: "API / Open Source",
    strengths: [
      "Cost-effective performance",
      "Strong math/coding (49.2% SWE-bench)",
      "Mixture-of-experts architecture",
      "Open-source availability",
      "Enterprise data integration",
    ],
    useCases: [
      "Budget-conscious development",
      "Mathematical applications",
      "Scientific computing",
      "Coding assistance",
      "Cost-efficient deployments",
    ],
    icon: DollarSignIcon,
    color: "from-teal-500/20 to-cyan-500/20 dark:from-teal-500/10 dark:to-cyan-500/10",
    rating: {
      coding: 49.2,
    },
  },
  {
    name: "Mistral Medium 3",
    developer: "Mistral AI",
    releaseDate: "January 2025",
    parameters: "Not Disclosed",
    contextWindow: "128K tokens",
    inputPrice: "$0.40",
    outputPrice: "$2.00",
    accessType: "API",
    strengths: [
      "90% of premium performance",
      "8x lower cost than competitors",
      "Professional coding capabilities",
      "Multimodal understanding",
      "Self-hosted deployment",
    ],
    useCases: [
      "Cost-effective enterprise AI",
      "Budget-constrained projects",
      "Professional coding",
      "Moderate-scale applications",
      "European data sovereignty",
    ],
    icon: TrendingUpIcon,
    color: "from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-500/10",
  },
  {
    name: "Claude 4 Sonnet",
    developer: "Anthropic",
    releaseDate: "May 2025",
    parameters: "200B+ (est.)",
    contextWindow: "200K tokens",
    inputPrice: "$3.00",
    outputPrice: "$15.00",
    accessType: "API",
    strengths: [
      "Superior coding/reasoning balance",
      "Cost-effective Claude option",
      "Enhanced safety features",
      "B2B workflow optimization",
      "Multi-file reasoning",
    ],
    useCases: [
      "Balanced coding and reasoning",
      "Business workflows",
      "Cost-conscious enterprises",
      "Multi-file analysis",
      "Workflow automation",
    ],
    icon: LayersIcon,
    color: "from-amber-500/20 to-yellow-500/20 dark:from-amber-500/10 dark:to-yellow-500/10",
    rating: {
      reasoning: 75,
    },
  },
  {
    name: "Llama 4 Maverick",
    developer: "Meta AI",
    releaseDate: "April 2025",
    parameters: "400B (17B active)",
    contextWindow: "1M tokens",
    inputPrice: "Open Source",
    outputPrice: "Open Source",
    accessType: "Open Source",
    strengths: [
      "Mixture-of-experts architecture",
      "Multilingual (200+ languages)",
      "Multimodal native support",
      "Open-source flexibility",
      "Balanced performance",
    ],
    useCases: [
      "Multilingual applications",
      "Multimodal projects",
      "Open-source development",
      "Custom model fine-tuning",
      "International deployments",
    ],
    icon: BarChart3Icon,
    color: "from-violet-500/20 to-purple-500/20 dark:from-violet-500/10 dark:to-purple-500/10",
  },
];

const comparisonCategories = [
  {
    title: "Best for Coding",
    models: ["Claude 4 Opus", "DeepSeek R1", "Mistral Medium 3"],
    description: "Superior performance in software engineering tasks",
  },
  {
    title: "Best for Reasoning",
    models: ["Gemini 2.5 Pro", "OpenAI o3", "Grok 3"],
    description: "Advanced reasoning capabilities and complex problem-solving",
  },
  {
    title: "Best for Cost-Efficiency",
    models: ["Mistral Medium 3", "DeepSeek R1", "Llama 4 Series"],
    description: "Excellent performance-to-cost ratios",
  },
  {
    title: "Best for Large Context",
    models: ["Llama 4 Scout", "Gemini 2.5 Pro", "Grok 3"],
    description: "Massive context windows for extensive document processing",
  },
  {
    title: "Best for Multimodal",
    models: ["Gemini 2.5 Pro", "GPT-4.5/5", "Llama 4 Series"],
    description: "Advanced text, image, audio, and video capabilities",
  },
  {
    title: "Best Open Source",
    models: ["Llama 4 Scout", "Llama 4 Maverick", "DeepSeek R1"],
    description: "Open-source models with enterprise-ready features",
  },
];

export default function AIPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Home Button */}
      <HomeButton />

      {/* Hero Section */}
      <header className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-cyan-500/20 dark:from-purple-500/10 dark:via-pink-500/5 dark:to-cyan-500/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-20">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1.5">
            <BrainCircuitIcon className="w-3 h-3 mr-2 inline" />
            Leading AI Models 2025
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Discover the
            <span className="block mt-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Leading AI Models
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            Explore the cutting-edge AI models shaping the industry in 2025. From Claude 4's coding excellence to Gemini 2.5's reasoning dominance, discover which model fits your needs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="#models">Explore Models</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/consulting">Get AI Consulting</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>10+ Leading Models</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Updated 2025 Information</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Performance Benchmarks</span>
            </div>
          </div>
        </div>
      </header>

      {/* Models Overview Section */}
      <section id="models" className="py-20 bg-gradient-to-b from-background to-primary/5 dark:to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">AI Models</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Leading AI Models of 2025
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive overview of the most advanced AI models available today, with detailed capabilities, pricing, and use cases.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {aiModels.map((model, idx) => (
              <Card
                key={idx}
                className={cn(
                  "border-2 hover:border-primary/50 transition-all hover:shadow-lg relative overflow-hidden",
                  "group"
                )}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity", model.color)} />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br", model.color)}>
                      <model.icon className="h-7 w-7 text-foreground" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {model.developer}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{model.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Released: {model.releaseDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Context:</span>
                        <div className="font-medium">{model.contextWindow}</div>
                      </div>
                      {model.parameters && (
                        <div>
                          <span className="text-muted-foreground">Parameters:</span>
                          <div className="font-medium">{model.parameters}</div>
                        </div>
                      )}
                    </div>
                    {(model.inputPrice || model.outputPrice) && (
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                        <div>
                          <span className="text-muted-foreground">Input:</span>
                          <div className="font-medium">{model.inputPrice}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Output:</span>
                          <div className="font-medium">{model.outputPrice}</div>
                        </div>
                      </div>
                    )}
                    {model.rating && (
                      <div className="flex gap-4 pt-2 border-t">
                        {model.rating.reasoning && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Reasoning:</span>
                            <div className="font-medium text-primary">{model.rating.reasoning}</div>
                          </div>
                        )}
                        {model.rating.coding && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Coding:</span>
                            <div className="font-medium text-primary">{model.rating.coding}%</div>
                          </div>
                        )}
                        {model.rating.multimodal && (
                          <Badge variant="outline" className="text-xs">
                            Multimodal
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <div className="text-xs font-medium text-foreground mb-2">Key Strengths:</div>
                      <ul className="space-y-1">
                        {model.strengths.slice(0, 3).map((strength, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-xs font-medium text-foreground mb-2">Best For:</div>
                      <div className="flex flex-wrap gap-1">
                        {model.useCases.slice(0, 2).map((useCase, uIdx) => (
                          <Badge key={uIdx} variant="outline" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant={model.accessType === "Open Source" ? "default" : "secondary"} className="w-full justify-center">
                      {model.accessType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Comparisons</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Find the Right Model for Your Needs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare models across different use cases and requirements to make informed decisions.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {comparisonCategories.map((category, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ShieldCheckIcon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.models.map((model, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{model}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/5 dark:to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Performance Metrics</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Industry-Leading Performance
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BrainCircuitIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground">86.4</div>
              <div className="mt-2 text-sm font-medium text-foreground">Best Reasoning Score</div>
              <div className="mt-1 text-xs text-muted-foreground">Gemini 2.5 Pro (GPQA)</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CodeIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground">72.5%</div>
              <div className="mt-2 text-sm font-medium text-foreground">Best Coding Score</div>
              <div className="mt-1 text-xs text-muted-foreground">Claude 4 Opus (SWE-bench)</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <DatabaseIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground">10M</div>
              <div className="mt-2 text-sm font-medium text-foreground">Largest Context</div>
              <div className="mt-1 text-xs text-muted-foreground">Llama 4 Scout (tokens)</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSignIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground">$0.40</div>
              <div className="mt-2 text-sm font-medium text-foreground">Lowest Cost</div>
              <div className="mt-1 text-xs text-muted-foreground">Mistral Medium 3 (per 1M tokens)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-cyan-500/20 dark:from-purple-500/10 dark:via-pink-500/5 dark:to-cyan-500/10">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Need Help Choosing the Right AI Model?
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Our AI consulting experts can help you select and implement the perfect model for your specific use case and requirements.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/consulting">
                Get AI Consulting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Expert model selection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Custom implementation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Ongoing support</span>
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

