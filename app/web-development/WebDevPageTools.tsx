// app/web-development/WebDevPageTools.tsx
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GlobeIcon,
  BrainCircuitIcon,
  RocketIcon,
  SearchIcon,
  CheckCircle2,
  Loader2,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

const servicePackages = [
  {
    name: "Starter",
    price: "$8,000+",
    description:
      "Perfect for small businesses and startups looking for a professional web presence with AI-powered engagement.",
    features: [
      "Up to 5 pages",
      "AI chatbot integration",
      "Responsive design (mobile-first)",
      "Basic SEO optimization",
      "CMS integration",
      "Contact forms with lead capture",
      "Analytics setup",
      "30 days post-launch support",
    ],
  },
  {
    name: "Business",
    price: "$25,000+",
    description:
      "For growing companies that need a powerful digital platform with the full AI integration suite.",
    features: [
      "Up to 15 pages",
      "Full AI suite (chatbot + search + recommendations)",
      "Custom design system",
      "Advanced SEO & structured data",
      "Analytics & conversion dashboard",
      "Headless CMS",
      "Performance optimization",
      "API integrations",
      "90 days post-launch support",
    ],
  },
  {
    name: "Enterprise",
    price: "$75,000+",
    description:
      "Fully custom enterprise platform with dedicated AI systems, compliance, and ongoing partnership.",
    features: [
      "Unlimited pages & features",
      "Custom AI systems & training",
      "Dedicated design team",
      "Headless architecture",
      "SSO / RBAC authentication",
      "API-first development",
      "Enterprise security & compliance ready",
      "SLA guarantees",
      "12 months dedicated support",
    ],
  },
];

const techStack = [
  {
    category: "Frontend",
    technologies: ["Next.js 15+", "React 19", "TypeScript", "Tailwind CSS"],
    description:
      "Modern, performant frontends built on the latest frameworks with server-side rendering and edge deployment.",
  },
  {
    category: "AI & Intelligence",
    technologies: ["CopilotKit", "LangChain", "Custom LLMs", "Vector Search"],
    description:
      "Native AI capabilities woven into every site — from conversational agents to intelligent content discovery.",
  },
  {
    category: "Content Management",
    technologies: ["Sanity", "Contentful", "Zoho", "Strapi", "Custom CMS"],
    description:
      "Headless CMS architecture that gives your team full control over content without touching code.",
  },
  {
    category: "Infrastructure",
    technologies: ["Vercel", "AWS", "Azure", "Cloudflare"],
    description:
      "Enterprise-grade hosting with global CDN, automatic scaling, and 99.9% uptime guarantees.",
  },
  {
    category: "Data & Backend",
    technologies: ["PostgreSQL", "MongoDB", "Redis", "NeonDB"],
    description:
      "Robust data layer engineered for speed, reliability, and seamless integration with AI systems.",
  },
  {
    category: "Security & Auth",
    technologies: ["NextAuth", "Clerk", "SSO/SAML", "RBAC"],
    description:
      "Enterprise authentication and authorization with compliance-ready security configurations.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & Strategy",
    duration: "1-2 weeks",
    description:
      "We map your business goals, analyze competitors, identify AI opportunities, and architect the technical foundation.",
    deliverables: [
      "Requirements document",
      "Competitive analysis",
      "AI opportunity map",
      "Technical architecture",
    ],
  },
  {
    step: "02",
    title: "Design & Prototyping",
    duration: "2-3 weeks",
    description:
      "High-fidelity wireframes and UI/UX design with your feedback baked into every iteration.",
    deliverables: [
      "Wireframes",
      "Design system",
      "Interactive prototype",
      "Brand guidelines",
    ],
  },
  {
    step: "03",
    title: "Development & AI Integration",
    duration: "4-8 weeks",
    description:
      "Full-stack development with AI features built natively — not bolted on. Continuous testing and QA throughout.",
    deliverables: [
      "Production website",
      "AI integrations",
      "CMS setup",
      "Test coverage",
    ],
  },
  {
    step: "04",
    title: "Launch & Optimization",
    duration: "1-2 weeks",
    description:
      "Deployment, performance tuning, SEO audit, team training, and a smooth handoff with ongoing support.",
    deliverables: [
      "Live deployment",
      "Performance report",
      "SEO audit",
      "Training sessions",
    ],
  },
];

const aiFeatures = [
  {
    name: "AI Chatbot",
    description:
      "Conversational assistant trained on your business content. Handles customer questions 24/7 and routes qualified leads to your team.",
    stat: "60% fewer support tickets",
  },
  {
    name: "Intelligent Search",
    description:
      "Semantic search that understands intent, not just keywords. Visitors find what they need 3x faster.",
    stat: "3x faster content discovery",
  },
  {
    name: "Content Recommendations",
    description:
      "Personalized content suggestions based on visitor behavior and journey stage. Increases engagement and time on site.",
    stat: "40% more engagement",
  },
  {
    name: "Predictive Analytics",
    description:
      "AI-driven insights that predict user behavior, optimize conversion paths, and surface opportunities automatically.",
    stat: "Data-driven decisions",
  },
];

export function WebDevPageTools() {
  // Tool 1: Package Details
  useCopilotAction({
    name: "getWebDevPackageDetails",
    description:
      "Get detailed information about web development service packages (Starter, Business, Enterprise). Use when user asks about pricing, packages, what's included, or which tier to choose. ONLY available on the web development page.",
    parameters: [
      {
        name: "packageName",
        type: "string" as const,
        description: "Package tier (optional — returns all if omitted)",
        required: false,
        enum: ["Starter", "Business", "Enterprise"],
      },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <CardTitle className="text-lg">Retrieving Package Details</CardTitle>
              </div>
              <CardDescription>
                {args?.packageName ? `Package: "${args.packageName}"` : "All Packages"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching web development package information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <GlobeIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Web Development Packages</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.packages &&
                Array.isArray(result.packages) &&
                result.packages.map((pkg: any, idx: number) => (
                  <div key={idx} className="p-3 bg-background rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm text-foreground">{pkg.name}</p>
                      <Badge variant="outline" className="text-xs">{pkg.price}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>
                    {pkg.features && Array.isArray(pkg.features) && (
                      <div>
                        <Separator className="my-2" />
                        <p className="text-xs font-medium text-muted-foreground mb-2">Included</p>
                        <ul className="space-y-1">
                          {pkg.features.map((feature: string, fIdx: number) => (
                            <li key={fIdx} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ packageName }) => {
      try {
        if (packageName) {
          const pkg = servicePackages.find((p) => p.name === packageName);
          if (!pkg) {
            throw new Error(`Package "${packageName}" not found`);
          }
          return { success: true, packages: [pkg] };
        }
        return { success: true, packages: servicePackages };
      } catch (error) {
        console.error("Error getting package details:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get package details: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 2: Tech Stack
  useCopilotAction({
    name: "getWebDevTechStack",
    description:
      "Get information about the web development tech stack and capabilities (Frontend, AI & Intelligence, Content Management, Infrastructure, Data & Backend, Security & Auth). ONLY available on the web development page.",
    parameters: [
      {
        name: "category",
        type: "string" as const,
        description: "Technology category (optional — returns all if omitted)",
        required: false,
        enum: [
          "Frontend",
          "AI & Intelligence",
          "Content Management",
          "Infrastructure",
          "Data & Backend",
          "Security & Auth",
        ],
      },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <CardTitle className="text-lg">Retrieving Tech Stack</CardTitle>
              </div>
              <CardDescription>
                {args?.category ? `Category: "${args.category}"` : "All Categories"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching tech stack information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BrainCircuitIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Tech Stack & Capabilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.categories &&
                Array.isArray(result.categories) &&
                result.categories.map((cat: any, idx: number) => (
                  <div key={idx} className="p-3 bg-background rounded-lg border">
                    <p className="font-medium text-sm text-foreground mb-1">{cat.category}</p>
                    <p className="text-xs text-muted-foreground mb-2">{cat.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {cat.technologies.map((t: string, tIdx: number) => (
                        <Badge key={tIdx} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ category }) => {
      try {
        if (category) {
          const cat = techStack.find((c) => c.category === category);
          if (!cat) {
            throw new Error(`Category "${category}" not found`);
          }
          return { success: true, categories: [cat] };
        }
        return { success: true, categories: techStack };
      } catch (error) {
        console.error("Error getting tech stack:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get tech stack: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 3: Process Steps
  useCopilotAction({
    name: "getWebDevProcessSteps",
    description:
      "Get information about the web development process (Discovery & Strategy, Design & Prototyping, Development & AI Integration, Launch & Optimization). ONLY available on the web development page.",
    parameters: [
      {
        name: "stepNumber",
        type: "string" as const,
        description: "Step number (optional — returns all if omitted)",
        required: false,
        enum: ["01", "02", "03", "04"],
      },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-primary-200 bg-primary-50/50 dark:bg-primary-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                <CardTitle className="text-lg">Retrieving Process Steps</CardTitle>
              </div>
              <CardDescription>
                {args?.stepNumber ? `Step: ${args.stepNumber}` : "All Process Steps"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching process information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-primary-200 bg-primary-50/50 dark:bg-primary-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <RocketIcon className="h-5 w-5 text-primary-600" />
                <CardTitle className="text-lg">Development Process</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.steps &&
                Array.isArray(result.steps) &&
                result.steps.map((step: any, idx: number) => (
                  <div key={idx} className="p-3 bg-background rounded-lg border">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl font-bold text-primary/30 flex-shrink-0">
                        {step.step}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm text-foreground">{step.title}</p>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                        {step.deliverables && Array.isArray(step.deliverables) && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Deliverables
                            </p>
                            <ul className="space-y-1">
                              {step.deliverables.map((d: string, dIdx: number) => (
                                <li key={dIdx} className="flex items-start gap-2 text-xs">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {result.totalDuration && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <SparklesIcon className="h-4 w-4 inline mr-1 text-primary-500" />
                    <span className="font-medium">Total Timeline:</span> {result.totalDuration}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ stepNumber }) => {
      try {
        let steps = processSteps;

        if (stepNumber) {
          const step = processSteps.find((s) => s.step === stepNumber);
          if (!step) {
            throw new Error(`Process step "${stepNumber}" not found`);
          }
          steps = [step];
        }

        return {
          success: true,
          steps,
          totalDuration:
            steps.length === processSteps.length
              ? "8-15 weeks from discovery to launch, plus ongoing optimization and support"
              : undefined,
        };
      } catch (error) {
        console.error("Error getting process steps:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get process steps: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 4: AI Features
  useCopilotAction({
    name: "getWebDevAIFeatures",
    description:
      "Get information about AI features included in websites (AI Chatbot, Intelligent Search, Content Recommendations, Predictive Analytics). ONLY available on the web development page.",
    parameters: [
      {
        name: "featureName",
        type: "string" as const,
        description: "AI feature name (optional — returns all if omitted)",
        required: false,
        enum: [
          "AI Chatbot",
          "Intelligent Search",
          "Content Recommendations",
          "Predictive Analytics",
        ],
      },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
                <CardTitle className="text-lg">Retrieving AI Features</CardTitle>
              </div>
              <CardDescription>
                {args?.featureName ? `Feature: "${args.featureName}"` : "All AI Features"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching AI feature information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <SearchIcon className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">AI Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.features &&
                Array.isArray(result.features) &&
                result.features.map((feature: any, idx: number) => (
                  <div key={idx} className="p-3 bg-background rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm text-foreground">{feature.name}</p>
                      <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/20">
                        {feature.stat}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ featureName }) => {
      try {
        if (featureName) {
          const feature = aiFeatures.find((f) => f.name === featureName);
          if (!feature) {
            throw new Error(`AI feature "${featureName}" not found`);
          }
          return { success: true, features: [feature] };
        }
        return { success: true, features: aiFeatures };
      } catch (error) {
        console.error("Error getting AI features:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get AI features: ${errorMessage}`);
        throw error;
      }
    },
  });

  return null;
}
