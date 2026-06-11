import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";

/**
 * GET /api/v1/services/{serviceId}
 * 
 * Returns detailed information about a specific service
 * 
 * Authentication: Required (X-API-Key header)
 * 
 * Service IDs:
 * - consulting: AI Strategy & Implementation
 * - research: B2B Research Platform
 * - compliance: Compliance & Security
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  // Authenticate request
  const authResponse = authenticateRequest(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const { serviceId } = await params;

    // Service details database (in production, this would come from a database)
    const serviceDetails: Record<string, any> = {
      consulting: {
        id: "consulting",
        name: "AI Strategy & Implementation",
        description: "End-to-end AI consulting from strategy development to production deployment. We help you identify opportunities, build roadmaps, and deliver measurable results.",
        category: "Consulting",
        process: {
          discovery: "1-2 weeks",
          planning: "2-3 weeks",
          implementation: "8-16 weeks",
          optimization: "Ongoing",
        },
        subServices: [
          {
            id: "strategy-roadmap",
            name: "AI Strategy & Roadmap",
            description: "Develop comprehensive AI strategies aligned with your business objectives and create actionable implementation roadmaps.",
            features: ["Strategic planning", "ROI analysis", "Technology assessment", "Risk evaluation"],
          },
          {
            id: "implementation",
            name: "AI Implementation",
            description: "End-to-end AI solution implementation from proof-of-concept to production deployment with ongoing support.",
            features: ["Custom AI solutions", "System integration", "Performance optimization", "Quality assurance"],
          },
          {
            id: "operations",
            name: "AI Operations & Optimization",
            description: "Optimize existing AI systems for better performance, cost-efficiency, and scalability in production environments.",
            features: ["Model optimization", "Cost reduction", "Performance tuning", "Infrastructure design"],
          },
          {
            id: "training",
            name: "AI Training & Enablement",
            description: "Empower your teams with AI knowledge through customized training programs and workshops.",
            features: ["Team training", "Best practices", "Hands-on workshops", "Ongoing mentorship"],
          },
          {
            id: "governance",
            name: "AI Governance & Ethics",
            description: "Establish responsible AI practices with governance frameworks, compliance strategies, and ethical guidelines.",
            features: ["Policy development", "Compliance frameworks", "Ethics assessment", "Risk management"],
          },
          {
            id: "analytics",
            name: "AI Analytics & Insights",
            description: "Transform data into actionable insights using advanced AI analytics and predictive modeling techniques.",
            features: ["Predictive analytics", "Data strategy", "Business intelligence", "Performance metrics"],
          },
        ],
        industries: ["Healthcare", "Financial Services", "Retail & E-commerce", "Manufacturing", "Technology", "Non-Profits"],
        trackRecord: {
          yearsInBusiness: "20+ (founded 2005)",
          icduPipeline: "Patent-pending ICDU evaluation pipeline (https://icdu.ai)",
          engagementModel: "Fixed-scope entry engagements with defined deliverables and timelines",
          coverage: "End-to-end delivery from strategy through production",
        },
        contactUrl: "/contact",
      },
      research: {
        id: "research",
        name: "B2B Research Platform",
        description: "AI-powered research solutions for healthcare and non-profit organizations with secure, governed data handling and designed for impact.",
        category: "Platform",
        features: ["Secure, Governed Data Handling", "Advanced Analytics", "Impact Measurement", "Real-Time Updates"],
        useCases: {
          healthcare: [
            "Hospital systems market analysis and competitive intelligence",
            "Medical device and pharmaceutical partnership opportunities",
            "Healthcare provider network expansion research",
            "Clinical trial site identification and evaluation",
            "Payer and reimbursement landscape analysis",
          ],
          nonProfits: [
            "Grant funding opportunity identification and tracking",
            "Donor prospect research and wealth screening",
            "Foundation and corporate partnership discovery",
            "Impact measurement and program evaluation",
            "Non-profit landscape and competitive analysis",
          ],
        },
        results: {
          organizationsServed: "500+",
          dataPoints: "10M+",
        },
        contactUrl: "/contact",
      },
      compliance: {
        id: "compliance",
        name: "Security & Data Protection",
        description: "Enterprise-grade security and data protection built around recognized security frameworks, with privacy-first engineering.",
        category: "Compliance",
        standards: [
          {
            name: "Security & Availability Controls",
            description: "Security, availability, and confidentiality controls built around recognized security frameworks.",
            features: ["Framework-aligned controls", "Continuous monitoring", "Documented policies", "Documentation on request"],
          },
          {
            name: "Healthcare Data Protection",
            description: "Secure, governed data handling designed for sensitive healthcare and research information.",
            features: ["Data-handling agreements", "Encryption of sensitive data", "Access controls", "Audit logging"],
          },
          {
            name: "GDPR-Aligned Privacy",
            description: "Privacy-by-design principles that support General Data Protection Regulation requirements for EU citizen data.",
            features: ["Data portability", "Right to deletion", "Consent management", "Privacy controls"],
          },
          {
            name: "ISO 27001-Informed Practices",
            description: "Information security management practices designed around the international standard for systematic risk management.",
            features: ["Risk assessment", "Security policies", "Incident response", "Business continuity"],
          },
          {
            name: "CCPA-Aligned Transparency",
            description: "Practices designed to support California Consumer Privacy Act requirements for consumer privacy rights and data transparency.",
            features: ["Data disclosure", "Opt-out rights", "Non-discrimination", "Consumer requests"],
          },
          {
            name: "Government-Grade Design",
            description: "Architecture designed with federal cloud security expectations, such as FedRAMP, in mind.",
            features: ["Security controls", "Continuous monitoring", "Government standards", "Hardened architecture"],
          },
        ],
        securityFeatures: [
          "End-to-End Encryption (AES-256 at rest, TLS 1.3 in transit)",
          "Multi-Factor Authentication (TOTP, SMS, hardware keys)",
          "Real-Time Monitoring (24/7 threat detection)",
          "Infrastructure Security (DDoS protection, redundancy)",
        ],
        contactUrl: "/contact",
      },
    };

    const service = serviceDetails[serviceId];

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: "Not Found",
          message: `Service with ID "${serviceId}" not found. Available services: consulting, research, compliance`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: service,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[API v1/services/${(await params).serviceId}] Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to retrieve service details. Please try again later.",
      },
      { status: 500 }
    );
  }
}

