"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BrainCircuitIcon,
  LayersIcon,
  Settings2Icon,
  GraduationCapIcon,
  ShieldCheckIcon,
  LineChartIcon,
  HeartPulseIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  FactoryIcon,
  LaptopIcon,
  HeartIcon,
  TargetIcon,
  LightbulbIcon,
  RocketIcon,
  TrendingUpIcon,
  ClockIcon,
  AwardIcon,
  UsersIcon,
  CheckCircle2,
  Loader2,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Consulting Page Tools Component
 * 
 * This component registers CopilotKit actions that are available ONLY on the consulting page.
 * These "getter" actions allow the AI to answer specific questions without needing all data pre-loaded.
 * 
 * Available Tools:
 * 1. getConsultingServiceDetails - Get details for a specific consulting service
 * 2. getIndustryExpertiseDetails - Get industry-specific expertise information
 * 3. getConsultingProcessSteps - Get information about the consulting engagement process
 * 4. getConsultingResults - Get results, statistics, and success metrics
 */

// Data definitions (matching the main page)
const consultingServices = [
  {
    title: "AI Strategy & Roadmap",
    description: "Develop comprehensive AI strategies aligned with your business objectives and create actionable implementation roadmaps.",
    features: ["Strategic planning", "ROI analysis", "Technology assessment", "Risk evaluation"],
  },
  {
    title: "AI Implementation",
    description: "End-to-end AI solution implementation from proof-of-concept to production deployment with ongoing support.",
    features: ["Custom AI solutions", "System integration", "Performance optimization", "Quality assurance"],
  },
  {
    title: "AI Operations & Optimization",
    description: "Optimize existing AI systems for better performance, cost-efficiency, and scalability in production environments.",
    features: ["Model optimization", "Cost reduction", "Performance tuning", "Infrastructure design"],
  },
  {
    title: "AI Training & Enablement",
    description: "Empower your teams with AI knowledge through customized training programs and workshops.",
    features: ["Team training", "Best practices", "Hands-on workshops", "Ongoing mentorship"],
  },
  {
    title: "AI Governance & Ethics",
    description: "Establish responsible AI practices with governance frameworks, compliance strategies, and ethical guidelines.",
    features: ["Policy development", "Compliance frameworks", "Ethics assessment", "Risk management"],
  },
  {
    title: "AI Analytics & Insights",
    description: "Transform data into actionable insights using advanced AI analytics and predictive modeling techniques.",
    features: ["Predictive analytics", "Data strategy", "Business intelligence", "Performance metrics"],
  },
];

const industryExpertise = [
  {
    name: "Healthcare",
    description: "HIPAA-compliant AI solutions for clinical operations, patient care, and research.",
    specializations: [
      "Clinical decision support systems",
      "Patient data analysis and predictive modeling",
      "Medical imaging and diagnostics",
      "Hospital operations optimization",
    ],
  },
  {
    name: "Financial Services",
    description: "Secure AI for fraud detection, risk assessment, and automated trading.",
    specializations: [
      "Real-time fraud detection systems",
      "Credit risk modeling and assessment",
      "Algorithmic trading strategies",
      "Regulatory compliance automation",
    ],
  },
  {
    name: "Retail & E-commerce",
    description: "Personalization engines, demand forecasting, and inventory optimization.",
    specializations: [
      "Customer personalization and recommendation engines",
      "Dynamic pricing optimization",
      "Demand forecasting and inventory management",
      "Customer churn prediction",
    ],
  },
  {
    name: "Manufacturing",
    description: "Predictive maintenance, quality control, and supply chain optimization.",
    specializations: [
      "Predictive maintenance systems",
      "Quality control and defect detection",
      "Supply chain optimization",
      "Production planning and scheduling",
    ],
  },
  {
    name: "Technology",
    description: "MLOps, AI product development, and scalable AI infrastructure.",
    specializations: [
      "MLOps pipeline implementation",
      "AI-powered product features",
      "Scalable AI infrastructure design",
      "Model deployment and monitoring",
    ],
  },
  {
    name: "Non-Profits",
    description: "Cost-effective AI for donor management, impact analysis, and operations.",
    specializations: [
      "Donor behavior prediction and engagement",
      "Impact measurement and reporting",
      "Grant opportunity identification",
      "Operations optimization",
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & Assessment",
    description: "Deep dive into your business challenges, existing infrastructure, and AI readiness. We identify opportunities and define success metrics.",
    duration: "1-2 weeks",
    deliverables: [
      "Current state assessment report",
      "AI readiness evaluation",
      "Opportunity identification",
      "Success metrics definition",
    ],
  },
  {
    step: "02",
    title: "Strategy & Planning",
    description: "Develop tailored AI strategy with detailed roadmap, resource requirements, and ROI projections based on your unique needs.",
    duration: "2-3 weeks",
    deliverables: [
      "Comprehensive AI strategy document",
      "Detailed implementation roadmap",
      "Resource and budget planning",
      "ROI projections and business case",
    ],
  },
  {
    step: "03",
    title: "Implementation & Integration",
    description: "Execute the AI strategy with agile development, rigorous testing, and seamless integration into your existing systems.",
    duration: "8-16 weeks",
    deliverables: [
      "AI solution development and deployment",
      "System integration and testing",
      "Documentation and training materials",
      "Performance monitoring setup",
    ],
  },
  {
    step: "04",
    title: "Optimization & Support",
    description: "Continuous monitoring, performance optimization, and ongoing support to ensure sustained value and improvement.",
    duration: "Ongoing",
    deliverables: [
      "Performance monitoring and reporting",
      "Model retraining and optimization",
      "Technical support and maintenance",
      "Continuous improvement recommendations",
    ],
  },
];

const results = {
  roi: {
    stat: "3.5x",
    label: "Average ROI",
    description: "Clients see 3.5x return on AI investments within 18 months",
    details: "Our clients typically achieve return on investment through increased efficiency, reduced costs, and new revenue opportunities.",
  },
  timeSavings: {
    stat: "60%",
    label: "Time Savings",
    description: "Reduce operational costs through intelligent automation",
    details: "On average, clients reduce operational time and costs by 60% through process automation and optimization.",
  },
  successRate: {
    stat: "95%",
    label: "Success Rate",
    description: "Project success rate with measurable business impact",
    details: "95% of our projects deliver measurable business impact and meet or exceed client expectations.",
  },
  clientsServed: {
    stat: "200+",
    label: "Clients Served",
    description: "Organizations transformed through AI consulting",
    details: "We've helped over 200 organizations across various industries successfully implement AI solutions.",
  },
};

export function ConsultingPageTools() {
  // Tool 1: Get Consulting Service Details
  useCopilotAction({
    name: "getConsultingServiceDetails",
    description:
      "Get detailed information about a specific AI consulting service (AI Strategy & Roadmap, AI Implementation, AI Operations & Optimization, AI Training & Enablement, AI Governance & Ethics, AI Analytics & Insights). Use this when the user asks about specific consulting services, what's included, or service capabilities. This tool is ONLY available on the consulting page.",
    parameters: [
      {
        name: "serviceName",
        type: "string",
        description: "The name of the consulting service to get details for",
        required: true,
        enum: consultingServices.map((s) => s.title),
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
                <CardTitle className="text-lg">Retrieving Service Details</CardTitle>
              </div>
              <CardDescription>Service: "{args?.serviceName || '...'}"</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching consulting service information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BrainCircuitIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{result.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.description && (
                <div>
                  <p className="text-sm text-foreground">{result.description}</p>
                </div>
              )}
              {result.features && Array.isArray(result.features) && result.features.length > 0 && (
                <div>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Features</p>
                  <ul className="space-y-2">
                    {result.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ serviceName }) => {
      try {
        const service = consultingServices.find((s) => s.title === serviceName);

        if (!service) {
          throw new Error(`Consulting service "${serviceName}" not found`);
        }

        return {
          success: true,
          ...service,
        };
      } catch (error) {
        console.error("Error getting consulting service details:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get service details: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 2: Get Industry Expertise Details
  useCopilotAction({
    name: "getIndustryExpertiseDetails",
    description:
      "Get detailed information about industry-specific AI expertise (Healthcare, Financial Services, Retail & E-commerce, Manufacturing, Technology, Non-Profits). Use this when the user asks about industry experience, sector-specific solutions, or capabilities in a particular industry. This tool is ONLY available on the consulting page.",
    parameters: [
      {
        name: "industryName",
        type: "string",
        description: "The name of the industry to get expertise details for (optional - if not provided, returns all industries)",
        required: false,
        enum: industryExpertise.map((i) => i.name),
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
                <CardTitle className="text-lg">Retrieving Industry Expertise</CardTitle>
              </div>
              <CardDescription>
                {args?.industryName ? `Industry: "${args.industryName}"` : "All Industries"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching industry expertise information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TargetIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Industry Expertise</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.industries && Array.isArray(result.industries) && result.industries.length > 0 && (
                <div className="space-y-4">
                  {result.industries.map((industry: any, idx: number) => (
                    <div key={idx} className="p-3 bg-background rounded-lg border">
                      <div className="mb-2">
                        <p className="font-medium text-sm text-foreground">{industry.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{industry.description}</p>
                      </div>
                      {industry.specializations && Array.isArray(industry.specializations) && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Specializations</p>
                          <ul className="space-y-1">
                            {industry.specializations.map((spec: string, specIdx: number) => (
                              <li key={specIdx} className="flex items-start gap-2 text-xs">
                                <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ industryName }) => {
      try {
        if (industryName) {
          const industry = industryExpertise.find((i) => i.name === industryName);
          if (!industry) {
            throw new Error(`Industry expertise for "${industryName}" not found`);
          }
          return {
            success: true,
            industries: [industry],
          };
        }

        // Return all industries
        return {
          success: true,
          industries: industryExpertise,
        };
      } catch (error) {
        console.error("Error getting industry expertise details:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get industry expertise: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 3: Get Consulting Process Steps
  useCopilotAction({
    name: "getConsultingProcessSteps",
    description:
      "Get information about the consulting engagement process steps (Discovery & Assessment, Strategy & Planning, Implementation & Integration, Optimization & Support). Use this when the user asks about the consulting process, timeline, what to expect, or deliverables. This tool is ONLY available on the consulting page.",
    parameters: [
      {
        name: "stepNumber",
        type: "string",
        description: "The step number to get details for (01-04, optional - if not provided, returns all steps)",
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
              <p className="text-sm text-muted-foreground">Fetching consulting process information...</p>
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
                <CardTitle className="text-lg">Consulting Process</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.steps && Array.isArray(result.steps) && result.steps.length > 0 && (
                <div className="space-y-4">
                  {result.steps.map((step: any, idx: number) => (
                    <div key={idx} className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-2xl font-bold text-primary/30">{step.step}</span>
                        </div>
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
                              <p className="text-xs font-medium text-muted-foreground mb-1">Deliverables</p>
                              <ul className="space-y-1">
                                {step.deliverables.map((deliverable: string, delIdx: number) => (
                                  <li key={delIdx} className="flex items-start gap-2 text-xs">
                                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{deliverable}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

        // Filter by step number if provided
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
              ? "11-21 weeks initial implementation, plus ongoing optimization and support"
              : undefined,
        };
      } catch (error) {
        console.error("Error getting consulting process steps:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get process steps: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 4: Get Consulting Results and Statistics
  useCopilotAction({
    name: "getConsultingResults",
    description:
      "Get information about consulting results, success metrics, and client statistics (ROI, time savings, success rate, clients served). Use this when the user asks about results, outcomes, track record, or success metrics. This tool is ONLY available on the consulting page.",
    parameters: [
      {
        name: "metric",
        type: "string",
        description: "The specific metric to get details for (optional - if not provided, returns all metrics)",
        required: false,
        enum: ["roi", "timeSavings", "successRate", "clientsServed"],
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
                <CardTitle className="text-lg">Retrieving Results & Metrics</CardTitle>
              </div>
              <CardDescription>
                {args?.metric ? `Metric: ${args.metric}` : "All Metrics"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching consulting results...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Consulting Results & Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.metrics && Array.isArray(result.metrics) && result.metrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.metrics.map((metric: any, idx: number) => (
                    <div key={idx} className="p-4 bg-background rounded-lg border">
                      <div className="text-center mb-2">
                        <p className="text-3xl font-bold text-primary">{metric.stat}</p>
                        <p className="text-sm font-medium text-foreground mt-1">{metric.label}</p>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">{metric.description}</p>
                      {metric.details && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground">{metric.details}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ metric }) => {
      try {
        if (metric) {
          const metricData = results[metric as keyof typeof results];
          if (!metricData) {
            throw new Error(`Metric "${metric}" not found`);
          }
          return {
            success: true,
            metrics: [metricData],
          };
        }

        // Return all metrics
        return {
          success: true,
          metrics: Object.values(results),
        };
      } catch (error) {
        console.error("Error getting consulting results:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get consulting results: ${errorMessage}`);
        throw error;
      }
    },
  });

  return null; // This component renders no UI
}

