"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheckIcon,
  FileCheckIcon,
  GlobeIcon,
  DatabaseIcon,
  FileTextIcon,
  NetworkIcon,
  LockIcon,
  KeyIcon,
  EyeIcon,
  ServerIcon,
  ClipboardCheckIcon,
  UserCheckIcon,
  ShieldAlertIcon,
  LayersIcon,
  TrophyIcon,
  HeartPulseIcon,
  CreditCardIcon,
  AwardIcon,
  CheckCircle2,
  Loader2,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Compliance Page Tools Component
 * 
 * This component registers CopilotKit actions that are available ONLY on the compliance page.
 * These "getter" actions allow the AI to answer specific questions without needing all data pre-loaded.
 * 
 * Available Tools:
 * 1. getComplianceStandardDetails - Get details for a specific compliance standard
 * 2. getCertificationStatus - Get status and details for certifications
 * 3. getSecurityFeatureDetails - Get details about specific security features
 * 4. getComplianceProcessSteps - Get information about the compliance implementation process
 */

// Data definitions (matching the main page)
const complianceStandards = [
  {
    title: "SOC 2 Type II",
    description: "Comprehensive security, availability, and confidentiality controls independently audited and certified annually.",
    features: ["Annual audits", "Continuous monitoring", "Independent validation", "Public reports available"],
  },
  {
    title: "HIPAA Compliance",
    description: "Full compliance with Health Insurance Portability and Accountability Act for handling protected health information.",
    features: ["BAA agreements", "PHI encryption", "Access controls", "Audit logging"],
  },
  {
    title: "GDPR Ready",
    description: "General Data Protection Regulation compliance for processing EU citizen data with privacy-by-design principles.",
    features: ["Data portability", "Right to deletion", "Consent management", "Privacy controls"],
  },
  {
    title: "ISO 27001",
    description: "International standard for information security management systems ensuring systematic risk management.",
    features: ["Risk assessment", "Security policies", "Incident response", "Business continuity"],
  },
  {
    title: "CCPA Compliant",
    description: "California Consumer Privacy Act compliance protecting consumer privacy rights and data transparency.",
    features: ["Data disclosure", "Opt-out rights", "Non-discrimination", "Consumer requests"],
  },
  {
    title: "FedRAMP Ready",
    description: "Federal Risk and Authorization Management Program readiness for government cloud services.",
    features: ["Security controls", "Continuous monitoring", "Government standards", "Authorization package"],
  },
];

const certifications = [
  {
    name: "SOC 2 Type II",
    issuer: "AICPA",
    status: "Active",
    year: "2025",
  },
  {
    name: "HIPAA",
    issuer: "HHS",
    status: "Compliant",
    year: "2025",
  },
  {
    name: "ISO 27001",
    issuer: "ISO",
    status: "Certified",
    year: "2024",
  },
  {
    name: "PCI DSS",
    issuer: "PCI SSC",
    status: "Level 1",
    year: "2025",
  },
];

const securityFeatures = [
  {
    title: "End-to-End Encryption",
    description: "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
    category: "Data Protection",
  },
  {
    title: "Multi-Factor Authentication",
    description: "Mandatory MFA with support for TOTP, SMS, and hardware security keys",
    category: "Access Control",
  },
  {
    title: "Real-Time Monitoring",
    description: "24/7 security monitoring with automated threat detection and response",
    category: "Monitoring",
  },
  {
    title: "Infrastructure Security",
    description: "Enterprise-grade infrastructure with redundancy and DDoS protection",
    category: "Infrastructure",
  },
  {
    title: "Compliance Audits",
    description: "Regular third-party security audits and penetration testing",
    category: "Audit & Compliance",
  },
  {
    title: "Access Controls",
    description: "Role-based access control with principle of least privilege",
    category: "Access Control",
  },
];

const complianceProcess = [
  {
    step: "01",
    title: "Security Assessment",
    description: "Comprehensive evaluation of your security requirements, compliance needs, and existing infrastructure to identify gaps.",
    duration: "1 week",
  },
  {
    step: "02",
    title: "Implementation Planning",
    description: "Develop detailed compliance roadmap with timelines, resource allocation, and milestone definitions.",
    duration: "1-2 weeks",
  },
  {
    step: "03",
    title: "Controls Deployment",
    description: "Implement security controls, policies, and procedures aligned with compliance requirements.",
    duration: "4-8 weeks",
  },
  {
    step: "04",
    title: "Continuous Compliance",
    description: "Ongoing monitoring, documentation, and updates to maintain compliance certification status.",
    duration: "Ongoing",
  },
];

export function CompliancePageTools() {
  // Tool 1: Get Compliance Standard Details
  useCopilotAction({
    name: "getComplianceStandardDetails",
    description:
      "Get detailed information about a specific compliance standard (SOC 2 Type II, HIPAA Compliance, GDPR Ready, ISO 27001, CCPA Compliant, FedRAMP Ready). Use this when the user asks about specific compliance standards, certifications, or regulatory requirements. This tool is ONLY available on the compliance page.",
    parameters: [
      {
        name: "standardName",
        type: "string",
        description: "The name of the compliance standard to get details for",
        required: true,
        enum: complianceStandards.map((s) => s.title),
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
                <CardTitle className="text-lg">Retrieving Compliance Standard</CardTitle>
              </div>
              <CardDescription>Standard: "{args?.standardName || '...'}"</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching compliance details...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
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
    handler: async ({ standardName }) => {
      try {
        const standard = complianceStandards.find((s) => s.title === standardName);
        
        if (!standard) {
          throw new Error(`Compliance standard "${standardName}" not found`);
        }

        return {
          success: true,
          ...standard,
        };
      } catch (error) {
        console.error("Error getting compliance standard details:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get compliance details: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 2: Get Certification Status
  useCopilotAction({
    name: "getCertificationStatus",
    description:
      "Get the current status and details for security certifications (SOC 2 Type II, HIPAA, ISO 27001, PCI DSS). Use this when the user asks about certification status, audit history, or compliance verification. This tool is ONLY available on the compliance page.",
    parameters: [
      {
        name: "certificationName",
        type: "string",
        description: "The name of the certification to check status for (optional - if not provided, returns all certifications)",
        required: false,
        enum: certifications.map((c) => c.name),
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
                <CardTitle className="text-lg">Checking Certification Status</CardTitle>
              </div>
              <CardDescription>
                {args?.certificationName ? `Certification: "${args.certificationName}"` : "All Certifications"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Retrieving certification information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AwardIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">
                  {result.certifications && result.certifications.length > 1
                    ? "Certifications Status"
                    : "Certification Status"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.certifications && Array.isArray(result.certifications) && (
                <div className="space-y-3">
                  {result.certifications.map((cert: any, idx: number) => (
                    <div key={idx} className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{cert.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Issuer: {cert.issuer} • Year: {cert.year}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {cert.status}
                        </Badge>
                      </div>
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
    handler: async ({ certificationName }) => {
      try {
        if (certificationName) {
          const cert = certifications.find((c) => c.name === certificationName);
          if (!cert) {
            throw new Error(`Certification "${certificationName}" not found`);
          }
          return {
            success: true,
            certifications: [cert],
          };
        }

        // Return all certifications
        return {
          success: true,
          certifications,
        };
      } catch (error) {
        console.error("Error getting certification status:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get certification status: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 3: Get Security Feature Details
  useCopilotAction({
    name: "getSecurityFeatureDetails",
    description:
      "Get detailed information about specific security features (End-to-End Encryption, Multi-Factor Authentication, Real-Time Monitoring, Infrastructure Security, Compliance Audits, Access Controls). Use this when the user asks about security measures, data protection, or technical security implementations. This tool is ONLY available on the compliance page.",
    parameters: [
      {
        name: "featureName",
        type: "string",
        description: "The name of the security feature to get details for (optional - if not provided, returns all features)",
        required: false,
        enum: securityFeatures.map((f) => f.title),
      },
      {
        name: "category",
        type: "string",
        description: "Filter by security category (optional)",
        required: false,
        enum: ["Data Protection", "Access Control", "Monitoring", "Infrastructure", "Audit & Compliance"],
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
                <CardTitle className="text-lg">Retrieving Security Features</CardTitle>
              </div>
              <CardDescription>
                {args?.featureName
                  ? `Feature: "${args.featureName}"`
                  : args?.category
                  ? `Category: ${args.category}`
                  : "All Security Features"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching security feature details...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <LockIcon className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Security Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.features && Array.isArray(result.features) && result.features.length > 0 && (
                <div className="space-y-3">
                  {result.features.map((feature: any, idx: number) => (
                    <div key={idx} className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{feature.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {feature.category}
                        </Badge>
                      </div>
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
    handler: async ({ featureName, category }) => {
      try {
        let features = securityFeatures;

        // Filter by feature name if provided
        if (featureName) {
          const feature = securityFeatures.find((f) => f.title === featureName);
          if (!feature) {
            throw new Error(`Security feature "${featureName}" not found`);
          }
          features = [feature];
        }
        // Filter by category if provided
        else if (category) {
          features = securityFeatures.filter((f) => f.category === category);
          if (features.length === 0) {
            throw new Error(`No security features found in category "${category}"`);
          }
        }

        return {
          success: true,
          features,
        };
      } catch (error) {
        console.error("Error getting security feature details:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get security feature details: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 4: Get Compliance Process Steps
  useCopilotAction({
    name: "getComplianceProcessSteps",
    description:
      "Get information about the compliance implementation process steps (Security Assessment, Implementation Planning, Controls Deployment, Continuous Compliance). Use this when the user asks about the compliance journey, implementation timeline, or what to expect during onboarding. This tool is ONLY available on the compliance page.",
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
          <Card className="border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
                <CardTitle className="text-lg">Retrieving Process Steps</CardTitle>
              </div>
              <CardDescription>
                {args?.stepNumber ? `Step: ${args.stepNumber}` : "All Process Steps"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Fetching compliance process information...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <ClipboardCheckIcon className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Compliance Process</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.steps && Array.isArray(result.steps) && result.steps.length > 0 && (
                <div className="space-y-3">
                  {result.steps.map((step: any, idx: number) => (
                    <div key={idx} className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-2xl font-bold text-primary/30">{step.step}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm text-foreground">{step.title}</p>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {result.totalDuration && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <SparklesIcon className="h-4 w-4 inline mr-1 text-orange-500" />
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
        let steps = complianceProcess;

        // Filter by step number if provided
        if (stepNumber) {
          const step = complianceProcess.find((s) => s.step === stepNumber);
          if (!step) {
            throw new Error(`Process step "${stepNumber}" not found`);
          }
          steps = [step];
        }

        return {
          success: true,
          steps,
          totalDuration:
            steps.length === complianceProcess.length
              ? "5-10 weeks initial implementation, plus ongoing monitoring"
              : undefined,
        };
      } catch (error) {
        console.error("Error getting compliance process steps:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get process steps: ${errorMessage}`);
        throw error;
      }
    },
  });

  return null; // This component renders no UI
}

