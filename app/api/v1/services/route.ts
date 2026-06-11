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
        trackRecord: {
          yearsInBusiness: "20+ (founded 2005)",
          icduPipeline: "Patent-pending ICDU evaluation pipeline (https://icdu.ai)",
          engagementModel: "Fixed-scope entry engagements with defined deliverables and timelines",
          coverage: "End-to-end delivery from strategy through production",
        },
      },
      {
        id: "research",
        name: "B2B Research Platform",
        description: "AI-powered research solutions for healthcare and non-profit organizations with secure, governed data handling and designed for impact.",
        category: "Platform",
        href: "/research",
        features: ["Secure, Governed Data Handling", "Advanced Analytics", "Impact Measurement"],
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
      },
      {
        id: "web-development",
        name: "AI-Powered Web Development",
        description:
          "Custom website development with integrated AI capabilities including intelligent chatbots, predictive analytics, and smart content management.",
        category: "Web Development",
        href: "/web-development",
        features: ["AI Integration", "Custom Design", "Performance Optimization"],
        subServices: [
          {
            id: "starter-package",
            name: "Starter Package",
            description:
              "Professional website with AI chatbot for small businesses and startups.",
            features: [
              "Up to 5 pages",
              "AI chatbot",
              "Responsive design",
              "Basic SEO",
              "CMS integration",
            ],
          },
          {
            id: "business-package",
            name: "Business Package",
            description:
              "Advanced website with full AI integration suite for growing companies.",
            features: [
              "Up to 15 pages",
              "Full AI suite",
              "Custom design system",
              "Advanced SEO",
              "Analytics dashboard",
            ],
          },
          {
            id: "enterprise-package",
            name: "Enterprise Package",
            description:
              "Fully custom enterprise platform with dedicated AI systems and compliance.",
            features: [
              "Unlimited pages",
              "Custom AI systems",
              "Headless architecture",
              "SSO/RBAC",
              "SLA guarantees",
            ],
          },
        ],
      },
      {
        id: "compliance",
        name: "Security & Data Protection",
        description: "Enterprise-grade security and data protection built around recognized security frameworks, with privacy-first engineering.",
        category: "Compliance",
        href: "/compliance",
        features: ["Framework-Aligned Controls", "Secure, Governed Data Handling", "GDPR-Aligned Privacy", "ISO 27001-Informed Practices"],
        standards: [
          {
            name: "Security & Availability Controls",
            description: "Security, availability, and confidentiality controls built around recognized security frameworks.",
          },
          {
            name: "Healthcare Data Protection",
            description: "Secure, governed data handling designed for sensitive healthcare and research information.",
          },
          {
            name: "GDPR-Aligned Privacy",
            description: "Privacy-by-design principles that support General Data Protection Regulation requirements for EU citizen data.",
          },
          {
            name: "ISO 27001-Informed Practices",
            description: "Information security management practices designed around the international standard for systematic risk management.",
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

