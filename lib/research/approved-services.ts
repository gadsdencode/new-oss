/**
 * Approved B2B research service descriptions used by the public research page
 * and the assistant. Quantitative marketing claims on the page (time/cost/accuracy
 * percentages, organization counts) are not included here because they are not
 * independently verified for assistant use.
 */
export const RESEARCH_SERVICE_PATH = "/research";

export const RESEARCH_OVERVIEW =
  "AI-powered B2B research solutions specifically designed for healthcare and non-profit organizations, with secure, governed data handling and built for impact.";

export const RESEARCH_FEATURES = [
  {
    title: "AI-Powered Insights",
    description:
      "Leverage advanced machine learning to uncover hidden patterns and trends in healthcare and non-profit data.",
  },
  {
    title: "Intelligent Research",
    description: "Automated data collection and analysis across multiple sources with AI-driven accuracy.",
  },
  {
    title: "Data Integration",
    description: "Seamlessly integrate disparate data sources for comprehensive B2B intelligence.",
  },
  {
    title: "Predictive Analytics",
    description: "Forecast market trends and identify opportunities before your competitors.",
  },
  {
    title: "Secure, Governed Data Handling",
    description: "Enterprise-grade security with governed data handling and privacy controls.",
  },
  {
    title: "Real-Time Updates",
    description: "Get instant alerts on market changes, competitor moves, and industry developments.",
  },
] as const;

export const RESEARCH_USE_CASES = {
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
} as const;

export const RESEARCH_UNAVAILABLE_DATA_NOTICE =
  "This website assistant cannot search research databases, list organizations, produce market figures, or cite live sources. Those deliverables require a research engagement. Describe the question and needed sources, then use /research or /contact.";

export function approvedResearchAssistantPayload() {
  return {
    source: "approved-research-services",
    overview: RESEARCH_OVERVIEW,
    path: RESEARCH_SERVICE_PATH,
    contactPath: "/contact",
    features: RESEARCH_FEATURES.map((feature) => ({ ...feature })),
    healthcareUseCases: [...RESEARCH_USE_CASES.healthcare],
    nonProfitUseCases: [...RESEARCH_USE_CASES.nonProfits],
    unavailable: RESEARCH_UNAVAILABLE_DATA_NOTICE,
  };
}
