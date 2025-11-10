"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BrainCircuitIcon,
  SparklesIcon,
  CodeIcon,
  GlobeIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  DollarSignIcon,
  CpuIcon,
  DatabaseIcon,
  LayersIcon,
  BarChart3Icon,
  CheckCircle2,
  Loader2,
  ZapIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { StripePaymentForm } from "@/components/ai/stripe-payment-form";
import { Spinner } from "@/components/ui/spinner";

/**
 * AI Page Tools Component
 * 
 * This component registers CopilotKit actions that are available ONLY on the AI page.
 * These actions provide intelligent model comparison and recommendation capabilities.
 * 
 * Available Tools:
 * 1. compareModels - Compare two AI models side-by-side
 * 2. findBestModelFor - Find the best model for a specific task or requirement
 * 3. getModelDetails - Get comprehensive details about a specific AI model
 * 4. getModelsByCategory - Get models filtered by category (coding, reasoning, cost, etc.)
 */

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
  rating?: {
    reasoning?: number;
    coding?: number;
    multimodal?: boolean;
  };
}

// AI Models data (matching the main page)
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
  },
];

export function AIPageTools() {
  // Tool 1: Compare Models
  useCopilotAction({
    name: "compareModels",
    description:
      "Compare two AI models side-by-side to see their differences in pricing, performance, capabilities, and use cases. Use this when the user wants to compare specific models or decide between options. This tool is ONLY available on the AI page.",
    parameters: [
      {
        name: "modelA",
        type: "string",
        description: "The first model to compare",
        required: true,
        enum: aiModels.map((m) => m.name),
      },
      {
        name: "modelB",
        type: "string",
        description: "The second model to compare",
        required: true,
        enum: aiModels.map((m) => m.name),
      },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                <CardTitle className="text-lg">Comparing AI Models</CardTitle>
              </div>
              <CardDescription>
                {args?.modelA || "Model A"} vs {args?.modelB || "Model B"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Analyzing model specifications and capabilities...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3Icon className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Model Comparison</CardTitle>
              </div>
              <CardDescription>
                {result.modelA?.name} vs {result.modelB?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              {result.summary && (
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-purple-500" />
                    Comparison Summary
                  </p>
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                </div>
              )}

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-2 gap-3">
                {/* Model A */}
                <div className="space-y-2">
                  <div className="font-medium text-sm text-foreground border-b pb-2">
                    {result.modelA?.name}
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-muted-foreground">Developer:</span>
                      <div className="font-medium">{result.modelA?.developer}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Context:</span>
                      <div className="font-medium">{result.modelA?.contextWindow}</div>
                    </div>
                    {result.modelA?.inputPrice && (
                      <div>
                        <span className="text-muted-foreground">Input Price:</span>
                        <div className="font-medium">{result.modelA.inputPrice}</div>
                      </div>
                    )}
                    {result.modelA?.rating?.coding && (
                      <div>
                        <span className="text-muted-foreground">Coding:</span>
                        <div className="font-medium">{result.modelA.rating.coding}%</div>
                      </div>
                    )}
                    {result.modelA?.rating?.reasoning && (
                      <div>
                        <span className="text-muted-foreground">Reasoning:</span>
                        <div className="font-medium">{result.modelA.rating.reasoning}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Model B */}
                <div className="space-y-2">
                  <div className="font-medium text-sm text-foreground border-b pb-2">
                    {result.modelB?.name}
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-muted-foreground">Developer:</span>
                      <div className="font-medium">{result.modelB?.developer}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Context:</span>
                      <div className="font-medium">{result.modelB?.contextWindow}</div>
                    </div>
                    {result.modelB?.inputPrice && (
                      <div>
                        <span className="text-muted-foreground">Input Price:</span>
                        <div className="font-medium">{result.modelB.inputPrice}</div>
                      </div>
                    )}
                    {result.modelB?.rating?.coding && (
                      <div>
                        <span className="text-muted-foreground">Coding:</span>
                        <div className="font-medium">{result.modelB.rating.coding}%</div>
                      </div>
                    )}
                    {result.modelB?.rating?.reasoning && (
                      <div>
                        <span className="text-muted-foreground">Reasoning:</span>
                        <div className="font-medium">{result.modelB.rating.reasoning}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Differences */}
              {result.keyDifferences && result.keyDifferences.length > 0 && (
                <div>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Differences</p>
                  <ul className="space-y-2">
                    {result.keyDifferences.map((diff: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <ArrowRightIcon className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              {result.recommendation && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                    Recommendation
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300">{result.recommendation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ modelA, modelB }) => {
      try {
        const model1 = aiModels.find((m) => m.name === modelA);
        const model2 = aiModels.find((m) => m.name === modelB);

        if (!model1 || !model2) {
          throw new Error(`Model not found: ${!model1 ? modelA : modelB}`);
        }

        // Generate comparison insights
        const keyDifferences: string[] = [];
        let recommendation = "";

        // Compare pricing
        if (model1.inputPrice && model2.inputPrice && model1.inputPrice !== "Open Source" && model2.inputPrice !== "Open Source") {
          const price1 = parseFloat(model1.inputPrice.replace("$", ""));
          const price2 = parseFloat(model2.inputPrice.replace("$", ""));
          if (Math.abs(price1 - price2) > 1) {
            keyDifferences.push(
              `${model1.name} costs $${price1} vs ${model2.name} at $${price2} per 1M input tokens (${price1 < price2 ? model1.name : model2.name} is more cost-effective)`
            );
          }
        }

        // Compare context windows
        if (model1.contextWindow !== model2.contextWindow) {
          keyDifferences.push(
            `${model1.name} has ${model1.contextWindow} context vs ${model2.name} with ${model2.contextWindow}`
          );
        }

        // Compare coding capabilities
        if (model1.rating?.coding && model2.rating?.coding) {
          keyDifferences.push(
            `Coding: ${model1.name} scores ${model1.rating.coding}% vs ${model2.name} at ${model2.rating.coding}%`
          );
        }

        // Compare reasoning capabilities
        if (model1.rating?.reasoning && model2.rating?.reasoning) {
          keyDifferences.push(
            `Reasoning: ${model1.name} scores ${model1.rating.reasoning} vs ${model2.name} at ${model2.rating.reasoning} on GPQA`
          );
        }

        // Compare access type
        if (model1.accessType !== model2.accessType) {
          keyDifferences.push(
            `${model1.name} is ${model1.accessType} while ${model2.name} is ${model2.accessType}`
          );
        }

        // Generate recommendation
        if (model1.rating?.coding && model2.rating?.coding) {
          recommendation = model1.rating.coding > model2.rating.coding
            ? `Choose ${model1.name} for superior coding tasks.`
            : `Choose ${model2.name} for superior coding tasks.`;
        } else if (model1.rating?.reasoning && model2.rating?.reasoning) {
          recommendation = model1.rating.reasoning > model2.rating.reasoning
            ? `Choose ${model1.name} for advanced reasoning tasks.`
            : `Choose ${model2.name} for advanced reasoning tasks.`;
        } else if (model1.accessType === "Open Source" || model2.accessType === "Open Source") {
          const openSourceModel = model1.accessType === "Open Source" ? model1.name : model2.name;
          recommendation = `Consider ${openSourceModel} for cost savings and customization flexibility.`;
        }

        const summary = `${model1.name} by ${model1.developer} vs ${model2.name} by ${model2.developer}. Both are powerful models with different strengths - ${model1.name} excels in ${model1.useCases[0].toLowerCase()} while ${model2.name} is ideal for ${model2.useCases[0].toLowerCase()}.`;

        return {
          success: true,
          modelA: model1,
          modelB: model2,
          summary,
          keyDifferences,
          recommendation: recommendation || "Both models have unique strengths - choose based on your specific requirements.",
        };
      } catch (error) {
        console.error("Error comparing models:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to compare models: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 2: Find Best Model For Task
  useCopilotAction({
    name: "findBestModelFor",
    description:
      "Find the best AI model for a specific task or requirement (e.g., 'coding', 'reasoning', 'cost-effective', 'large documents', 'multimodal', 'open source'). Provides intelligent recommendations based on the task characteristics. Use this when the user asks which model is best for their needs. This tool is ONLY available on the AI page.",
    parameters: [
      {
        name: "task",
        type: "string",
        description: "The task or requirement to find the best model for (e.g., 'software engineering', 'mathematical reasoning', 'budget-conscious project', 'large codebase analysis', 'creative writing', 'multilingual support')",
        required: true,
      },
      {
        name: "priority",
        type: "string",
        description: "Optional priority factor: 'performance', 'cost', 'context-size', or 'open-source'",
        required: false,
        enum: ["performance", "cost", "context-size", "open-source"],
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
                <CardTitle className="text-lg">Finding Best Model</CardTitle>
              </div>
              <CardDescription>Task: "{args?.task || '...'}"</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Analyzing models and matching to your requirements...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ZapIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Best Model Recommendation</CardTitle>
              </div>
              <CardDescription>For: "{result.task}"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Recommendation */}
              {result.primaryRecommendation && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">
                        {result.primaryRecommendation.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {result.primaryRecommendation.developer}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {result.primaryRecommendation.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {result.primaryRecommendation.contextWindow && (
                      <div>
                        <span className="text-muted-foreground">Context:</span>
                        <div className="font-medium">{result.primaryRecommendation.contextWindow}</div>
                      </div>
                    )}
                    {result.primaryRecommendation.inputPrice && (
                      <div>
                        <span className="text-muted-foreground">Input Price:</span>
                        <div className="font-medium">{result.primaryRecommendation.inputPrice}</div>
                      </div>
                    )}
                  </div>
                  {result.primaryRecommendation.topStrengths && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Why this model:</p>
                      <ul className="space-y-1">
                        {result.primaryRecommendation.topStrengths.map((strength: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Alternative Options */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-3">Alternative Options</p>
                  <div className="space-y-2">
                    {result.alternatives.map((alt: any, idx: number) => (
                      <div key={idx} className="p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm text-foreground">{alt.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {alt.developer}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{alt.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Considerations */}
              {result.considerations && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1 flex items-center gap-2">
                    <AlertCircleIcon className="h-3 w-3" />
                    Considerations
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300">{result.considerations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ task, priority }) => {
      try {
        const taskLower = task.toLowerCase();
        let recommendations: { model: AIModel; score: number; reason: string }[] = [];

        // Score each model based on the task
        aiModels.forEach((model) => {
          let score = 0;
          let reason = "";

          // Task-specific scoring
          if (
            taskLower.includes("cod") ||
            taskLower.includes("software") ||
            taskLower.includes("programming") ||
            taskLower.includes("engineer")
          ) {
            if (model.rating?.coding) {
              score += model.rating.coding * 10;
              reason = `Excellent coding performance (${model.rating.coding}% SWE-bench)`;
            }
            if (model.strengths.some((s) => s.toLowerCase().includes("cod"))) {
              score += 30;
            }
          }

          if (
            taskLower.includes("reason") ||
            taskLower.includes("math") ||
            taskLower.includes("logic") ||
            taskLower.includes("scien")
          ) {
            if (model.rating?.reasoning) {
              score += model.rating.reasoning * 8;
              reason = `Superior reasoning capabilities (${model.rating.reasoning} GPQA)`;
            }
            if (model.strengths.some((s) => s.toLowerCase().includes("reason"))) {
              score += 30;
            }
          }

          if (
            taskLower.includes("cost") ||
            taskLower.includes("budget") ||
            taskLower.includes("cheap") ||
            taskLower.includes("affordable")
          ) {
            if (model.accessType === "Open Source") {
              score += 100;
              reason = "Open source - no API costs";
            } else if (model.inputPrice && model.inputPrice !== "Open Source") {
              const price = parseFloat(model.inputPrice.replace("$", ""));
              score += Math.max(0, 100 - price * 10);
              reason = `Cost-effective at ${model.inputPrice} per 1M tokens`;
            }
          }

          if (
            taskLower.includes("document") ||
            taskLower.includes("large") ||
            taskLower.includes("context") ||
            taskLower.includes("codebase")
          ) {
            const contextSize = model.contextWindow.toLowerCase();
            if (contextSize.includes("10m")) {
              score += 100;
              reason = "Massive 10M token context window";
            } else if (contextSize.includes("1m")) {
              score += 80;
              reason = "Large 1M token context window";
            } else if (contextSize.includes("200k")) {
              score += 60;
            }
          }

          if (taskLower.includes("multimodal") || taskLower.includes("image") || taskLower.includes("visual")) {
            if (model.rating?.multimodal) {
              score += 80;
              reason = "Native multimodal capabilities";
            }
          }

          if (taskLower.includes("open") || taskLower.includes("custom") || taskLower.includes("self-host")) {
            if (model.accessType.includes("Open Source")) {
              score += 90;
              reason = "Open source with full customization";
            }
          }

          // Priority adjustments
          if (priority === "cost") {
            if (model.accessType === "Open Source") score += 50;
            else if (model.inputPrice && model.inputPrice !== "Open Source") {
              const price = parseFloat(model.inputPrice.replace("$", ""));
              if (price < 5) score += 30;
            }
          } else if (priority === "performance") {
            if (model.rating?.coding && model.rating.coding > 60) score += 40;
            if (model.rating?.reasoning && model.rating.reasoning > 80) score += 40;
          } else if (priority === "context-size") {
            if (model.contextWindow.includes("M")) score += 50;
          } else if (priority === "open-source") {
            if (model.accessType.includes("Open Source")) score += 60;
          }

          if (score > 0) {
            recommendations.push({ model, score, reason: reason || model.strengths[0] });
          }
        });

        // Sort by score
        recommendations.sort((a, b) => b.score - a.score);

        if (recommendations.length === 0) {
          throw new Error("No suitable models found for this task");
        }

        const primaryRec = recommendations[0];
        const alternatives = recommendations.slice(1, 4).map((rec) => ({
          name: rec.model.name,
          developer: rec.model.developer,
          reason: rec.reason,
        }));

        return {
          success: true,
          task,
          primaryRecommendation: {
            name: primaryRec.model.name,
            developer: primaryRec.model.developer,
            description: primaryRec.model.strengths[0],
            contextWindow: primaryRec.model.contextWindow,
            inputPrice: primaryRec.model.inputPrice,
            topStrengths: primaryRec.model.strengths.slice(0, 3),
          },
          alternatives,
          considerations: priority
            ? `Recommendation optimized for ${priority}. Consider your specific requirements and constraints when making final decision.`
            : "Consider budget, existing infrastructure, and team expertise when making your final decision.",
        };
      } catch (error) {
        console.error("Error finding best model:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to find best model: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 3: Get Model Details
  useCopilotAction({
    name: "getModelDetails",
    description:
      "Get comprehensive details about a specific AI model including specifications, pricing, strengths, use cases, and ratings. Use this when the user asks about a specific model's capabilities or specifications. This tool is ONLY available on the AI page.",
    parameters: [
      {
        name: "modelName",
        type: "string",
        description: "The name of the AI model to get details for",
        required: true,
        enum: aiModels.map((m) => m.name),
      },
    ],
    available: "enabled",
    render: ({ status, result, args }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                <CardTitle className="text-lg">Retrieving Model Details</CardTitle>
              </div>
              <CardDescription>Model: "{args?.modelName || '...'}"</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching comprehensive model information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BrainCircuitIcon className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">{result.name}</CardTitle>
              </div>
              <CardDescription>
                by {result.developer} • Released {result.releaseDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-background rounded border">
                  <p className="text-xs text-muted-foreground">Context Window</p>
                  <p className="text-sm font-medium">{result.contextWindow}</p>
                </div>
                {result.parameters && (
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Parameters</p>
                    <p className="text-sm font-medium">{result.parameters}</p>
                  </div>
                )}
                {result.inputPrice && (
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Input Price</p>
                    <p className="text-sm font-medium">{result.inputPrice}</p>
                  </div>
                )}
                {result.outputPrice && (
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Output Price</p>
                    <p className="text-sm font-medium">{result.outputPrice}</p>
                  </div>
                )}
              </div>

              {/* Access Type */}
              <div>
                <Badge variant={result.accessType === "Open Source" ? "default" : "secondary"}>
                  {result.accessType}
                </Badge>
              </div>

              {/* Ratings */}
              {result.rating && (
                <div>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-2">Performance Ratings</p>
                  <div className="flex gap-3">
                    {result.rating.reasoning && (
                      <div className="p-2 bg-background rounded border flex-1 text-center">
                        <p className="text-xs text-muted-foreground">Reasoning</p>
                        <p className="text-lg font-bold text-primary">{result.rating.reasoning}</p>
                      </div>
                    )}
                    {result.rating.coding && (
                      <div className="p-2 bg-background rounded border flex-1 text-center">
                        <p className="text-xs text-muted-foreground">Coding</p>
                        <p className="text-lg font-bold text-primary">{result.rating.coding}%</p>
                      </div>
                    )}
                    {result.rating.multimodal && (
                      <div className="p-2 bg-background rounded border flex-1 text-center">
                        <p className="text-xs text-muted-foreground">Multimodal</p>
                        <p className="text-lg font-bold text-primary">✓</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {result.strengths && (
                <div>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Strengths</p>
                  <ul className="space-y-2">
                    {result.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Use Cases */}
              {result.useCases && (
                <div>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-2">Best Use Cases</p>
                  <div className="flex flex-wrap gap-2">
                    {result.useCases.map((useCase: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ modelName }) => {
      try {
        const model = aiModels.find((m) => m.name === modelName);

        if (!model) {
          throw new Error(`Model "${modelName}" not found`);
        }

        return {
          success: true,
          ...model,
        };
      } catch (error) {
        console.error("Error getting model details:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get model details: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 4: Get Models By Category
  useCopilotAction({
    name: "getModelsByCategory",
    description:
      "Get AI models filtered by category or characteristic (coding, reasoning, cost-efficiency, large context, multimodal, open source). Use this when the user wants to see models in a specific category or with certain capabilities. This tool is ONLY available on the AI page.",
    parameters: [
      {
        name: "category",
        type: "string",
        description: "The category to filter models by",
        required: true,
        enum: ["coding", "reasoning", "cost-efficiency", "large-context", "multimodal", "open-source"],
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
                <CardTitle className="text-lg">Finding Models</CardTitle>
              </div>
              <CardDescription>Category: {args?.category || '...'}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Filtering models by category...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <LayersIcon className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Models: {result.category}</CardTitle>
              </div>
              <CardDescription>{result.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.models && result.models.length > 0 ? (
                result.models.map((model: any, idx: number) => (
                  <div key={idx} className="p-3 bg-background rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-foreground">{model.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {model.developer}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{model.highlight}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {model.contextWindow && (
                        <div>
                          <span className="text-muted-foreground">Context:</span>
                          <span className="ml-1 font-medium">{model.contextWindow}</span>
                        </div>
                      )}
                      {model.inputPrice && (
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="ml-1 font-medium">{model.inputPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No models found in this category.</p>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ category }) => {
      try {
        let filteredModels: any[] = [];
        let description = "";

        switch (category) {
          case "coding":
            filteredModels = aiModels
              .filter((m) => m.rating?.coding || m.strengths.some((s) => s.toLowerCase().includes("cod")))
              .sort((a, b) => (b.rating?.coding || 0) - (a.rating?.coding || 0))
              .slice(0, 5)
              .map((m) => ({
                name: m.name,
                developer: m.developer,
                highlight: m.rating?.coding
                  ? `Coding score: ${m.rating.coding}% on SWE-bench`
                  : m.strengths[0],
                contextWindow: m.contextWindow,
                inputPrice: m.inputPrice,
              }));
            description = "Top models for coding and software engineering tasks";
            break;

          case "reasoning":
            filteredModels = aiModels
              .filter((m) => m.rating?.reasoning || m.strengths.some((s) => s.toLowerCase().includes("reason")))
              .sort((a, b) => (b.rating?.reasoning || 0) - (a.rating?.reasoning || 0))
              .slice(0, 5)
              .map((m) => ({
                name: m.name,
                developer: m.developer,
                highlight: m.rating?.reasoning ? `Reasoning score: ${m.rating.reasoning} on GPQA` : m.strengths[0],
                contextWindow: m.contextWindow,
                inputPrice: m.inputPrice,
              }));
            description = "Top models for advanced reasoning and problem-solving";
            break;

          case "cost-efficiency":
            filteredModels = aiModels
              .filter((m) => m.accessType === "Open Source" || (m.inputPrice && parseFloat(m.inputPrice.replace("$", "")) < 5))
              .sort((a, b) => {
                const aPrice = a.accessType === "Open Source" ? 0 : parseFloat(a.inputPrice?.replace("$", "") || "999");
                const bPrice = b.accessType === "Open Source" ? 0 : parseFloat(b.inputPrice?.replace("$", "") || "999");
                return aPrice - bPrice;
              })
              .slice(0, 5)
              .map((m) => ({
                name: m.name,
                developer: m.developer,
                highlight:
                  m.accessType === "Open Source"
                    ? "Open source - no API costs"
                    : `Cost-effective at ${m.inputPrice} per 1M tokens`,
                contextWindow: m.contextWindow,
                inputPrice: m.inputPrice,
              }));
            description = "Most cost-effective models for budget-conscious projects";
            break;

          case "large-context":
            filteredModels = aiModels
              .sort((a, b) => {
                const getContextSize = (ctx: string) => {
                  if (ctx.includes("10M")) return 10000000;
                  if (ctx.includes("1M")) return 1000000;
                  if (ctx.includes("K")) return parseInt(ctx) * 1000;
                  return 0;
                };
                return getContextSize(b.contextWindow) - getContextSize(a.contextWindow);
              })
              .slice(0, 5)
              .map((m) => ({
                name: m.name,
                developer: m.developer,
                highlight: `${m.contextWindow} context window`,
                contextWindow: m.contextWindow,
                inputPrice: m.inputPrice,
              }));
            description = "Models with the largest context windows for extensive document processing";
            break;

          case "multimodal":
            filteredModels = aiModels
              .filter((m) => m.rating?.multimodal === true)
              .map((m) => ({
                name: m.name,
                developer: m.developer,
                highlight: "Native multimodal support (text, image, audio)",
                contextWindow: m.contextWindow,
                inputPrice: m.inputPrice,
              }));
            description = "Models with multimodal capabilities";
            break;

          case "open-source":
            filteredModels = aiModels
              .filter((m) => m.accessType.includes("Open Source"))
              .map((m) => ({
                name: m.name,
                developer: m.developer,
                highlight: "Open source with full customization and self-hosting options",
                contextWindow: m.contextWindow,
                inputPrice: m.inputPrice,
              }));
            description = "Open source models for maximum flexibility and control";
            break;
        }

        return {
          success: true,
          category: category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          description,
          models: filteredModels,
        };
      } catch (error) {
        console.error("Error getting models by category:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get models by category: ${errorMessage}`);
        throw error;
      }
    },
  });

  return null; // This component renders no UI
}

/**
 * Payment tool definition for AI
 * Allows the AI to initiate payments within the chat UI
 */
export function usePaymentTools() {
  useCopilotAction({
    name: "initiatePayment",
    description:
      "Call this function to initiate a payment. Ask the user for the amount and product name first, then call the createPaymentIntent action with the details.",
    parameters: [
      {
        name: "amount",
        type: "number",
        description: "The payment amount in cents (e.g., 1000 for $10.00)",
        required: true,
      },
      {
        name: "currency",
        type: "string",
        description: "The currency code (e.g., 'usd', 'eur')",
        required: true,
      },
    ],
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <div className="flex items-center justify-center p-4 rounded-lg border">
            <Spinner className="mr-2" />
            <span className="text-sm text-muted-foreground">
              Creating payment intent...
            </span>
          </div>
        );
      }

      if (status === "complete" && result?.clientSecret) {
        return (
          <div className="w-full">
            <StripePaymentForm clientSecret={result.clientSecret} />
          </div>
        );
      }

      return <></>;
    },
    handler: async ({ amount, currency }) => {
      try {
        // Call the backend API to create payment intent
        const response = await fetch("/api/payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create payment intent");
        }

        const data = await response.json();
        return {
          clientSecret: data.clientSecret,
        };
      } catch (error) {
        console.error("Error creating payment intent:", error);
        throw error;
      }
    },
  });
}

