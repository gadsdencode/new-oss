import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";

/**
 * GET /api/v1/services
 * 
 * Returns a list of all available Overture Systems services
 * 
 * Authentication: Required (X-API-Key header)
 * 
 * This endpoint is designed for AI integrations (GPT Actions, Copilot Connectors)
 * to discover available services programmatically.
 */
export async function GET(request: NextRequest) {
  // Authenticate request
  const authResponse = authenticateRequest(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Core services data (matches the structure from the website)
    const services = [
      {
        id: "consulting",
        name: "AI Strategy & Implementation",
        description: "End-to-end AI consulting from strategy development to production deployment. We help you identify opportunities, build roadmaps, and deliver measurable results.",
        category: "Consulting",
        href: "/consulting",
        features: ["Strategic Planning", "Custom Solutions", "ROI Optimization"],
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
        results: {
          averageROI: "3.5x within 18 months",
          costReduction: "60% reduction in operational costs",
          successRate: "95%",
          clientsServed: "200+",
        },
      },
      {
        id: "research",
        name: "B2B Research Platform",
        description: "AI-powered research solutions for healthcare and non-profit organizations. HIPAA-compliant, secure, and designed for impact.",
        category: "Platform",
        href: "/research",
        features: ["HIPAA Compliant", "Advanced Analytics", "Impact Measurement"],
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
          timeSavings: "80% reduction in research time",
          accuracy: "95%",
          costReduction: "70%",
          organizationsServed: "500+",
          dataPoints: "10M+",
        },
      },
      {
        id: "compliance",
        name: "Compliance & Security",
        description: "Enterprise-grade security and compliance services. SOC 2 Type II, HIPAA, GDPR, ISO 27001, CCPA, and FedRAMP ready.",
        category: "Compliance",
        href: "/compliance",
        features: ["SOC 2 Type II", "HIPAA Compliance", "GDPR Ready", "ISO 27001"],
        standards: [
          {
            name: "SOC 2 Type II",
            description: "Comprehensive security, availability, and confidentiality controls independently audited and certified annually.",
          },
          {
            name: "HIPAA",
            description: "Full compliance with Health Insurance Portability and Accountability Act for handling protected health information.",
          },
          {
            name: "GDPR",
            description: "General Data Protection Regulation compliance for processing EU citizen data with privacy-by-design principles.",
          },
          {
            name: "ISO 27001",
            description: "International standard for information security management systems ensuring systematic risk management.",
          },
        ],
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: services,
        meta: {
          total: services.length,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API v1/services] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to retrieve services. Please try again later.",
      },
      { status: 500 }
    );
  }
}

