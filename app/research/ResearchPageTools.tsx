"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  SearchCheckIcon, 
  TrendingUpIcon, 
  DatabaseIcon,
  BarChart3Icon,
  HeartPulseIcon,
  HandHeartIcon,
  SparklesIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Research Page Tools Component
 * 
 * This component registers CopilotKit actions that are available ONLY on the research page.
 * Import this into app/research/page.tsx to enable page-specific AI capabilities.
 * 
 * Available Tools:
 * 1. searchResearchDatabase - Search the research database with queries
 * 2. summarizeHealthcareTrend - Summarize healthcare trends and insights
 * 3. analyzeNonProfitLandscape - Analyze non-profit landscape data
 * 4. getResearchInsights - Get comprehensive research insights on any topic
 */
export function ResearchPageTools() {
  // Tool 1: Search Research Database
  useCopilotAction({
    name: "searchResearchDatabase",
    description:
      "Searches the research database for healthcare and non-profit organizations, partnerships, opportunities, and market intelligence. Use this when the user asks to search, find, or look up information in the research database. This tool is ONLY available on the research page.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The search query to find relevant research data, organizations, or opportunities",
        required: true,
      },
      {
        name: "industry",
        type: "string",
        description: "Filter by industry: 'healthcare', 'non-profit', or 'both' (optional)",
        required: false,
        enum: ["healthcare", "non-profit", "both"],
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
                <CardTitle className="text-lg">Searching Research Database</CardTitle>
              </div>
              <CardDescription>
                Query: "{args?.query || '...'}"
                {args?.industry && ` • Industry: ${args.industry}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Analyzing data sources and compiling results...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <SearchCheckIcon className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Research Results</CardTitle>
              </div>
              <CardDescription>Query: "{args?.query || '...'}"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.results && Array.isArray(result.results) && result.results.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Found {result.results.length} result{result.results.length !== 1 ? 's' : ''}
                  </p>
                  {result.results.slice(0, 5).map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-background rounded-lg border">
                      <p className="font-medium text-sm">{item.title || item.name || `Result ${idx + 1}`}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      )}
                      {item.industry && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {item.industry}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {result.results.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      + {result.results.length - 5} more result{result.results.length - 5 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No results found for this query.</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try refining your search terms or using different keywords.
                  </p>
                </div>
              )}
              {result.summary && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
                    <p className="text-sm text-foreground">{result.summary}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async ({ query, industry }) => {
      try {
        // Simulate database search (in production, this would call your actual API/database)
        // For now, return mock data based on the query
        const mockResults = generateMockSearchResults(query, industry);
        
        return {
          success: true,
          query,
          industry: industry || "both",
          results: mockResults,
          summary: `Found ${mockResults.length} relevant result${mockResults.length !== 1 ? 's' : ''} for "${query}"${industry ? ` in the ${industry} industry` : ''}.`,
        };
      } catch (error) {
        console.error("Error searching research database:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to search database: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 2: Summarize Healthcare Trend
  useCopilotAction({
    name: "summarizeHealthcareTrend",
    description:
      "Summarizes healthcare trends, market analysis, and industry insights for a specific topic. Use this when the user asks about healthcare trends, market analysis, or industry insights. This tool is ONLY available on the research page.",
    parameters: [
      {
        name: "topic",
        type: "string",
        description: "The healthcare topic or trend to analyze and summarize (e.g., 'telemedicine', 'hospital partnerships', 'pharmaceutical innovations')",
        required: true,
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
                <CardTitle className="text-lg">Analyzing Healthcare Trend</CardTitle>
              </div>
              <CardDescription>Topic: "{args?.topic || '...'}"</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Gathering data and generating insights...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <HeartPulseIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Healthcare Trend Analysis</CardTitle>
              </div>
              <CardDescription>Topic: "{args?.topic || '...'}"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.summary && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Summary</p>
                  <p className="text-sm text-foreground">{result.summary}</p>
                </div>
              )}
              {result.keyPoints && Array.isArray(result.keyPoints) && result.keyPoints.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Points</p>
                  <ul className="space-y-2">
                    {result.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.marketSize && (
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Market Size</p>
                  <p className="text-sm font-medium text-foreground">{result.marketSize}</p>
                </div>
              )}
              {result.opportunities && Array.isArray(result.opportunities) && result.opportunities.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Opportunities</p>
                  <ul className="space-y-1">
                    {result.opportunities.map((opp: string, idx: number) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <SparklesIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{opp}</span>
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
    handler: async ({ topic }) => {
      try {
        // Simulate healthcare trend analysis (in production, this would call your actual API)
        const mockAnalysis = generateMockHealthcareTrend(topic);
        
        return {
          success: true,
          topic,
          ...mockAnalysis,
        };
      } catch (error) {
        console.error("Error summarizing healthcare trend:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to analyze healthcare trend: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 3: Analyze Non-Profit Landscape
  useCopilotAction({
    name: "analyzeNonProfitLandscape",
    description:
      "Analyzes the non-profit landscape including funding opportunities, donor prospects, foundation partnerships, and impact measurement data. Use this when the user asks about non-profit research, funding, donors, or foundations. This tool is ONLY available on the research page.",
    parameters: [
      {
        name: "criteria",
        type: "string",
        description: "The criteria for analysis (e.g., 'grant opportunities', 'donor prospects', 'foundation partnerships', 'impact measurement')",
        required: true,
      },
      {
        name: "focus",
        type: "string",
        description: "The focus area for analysis (optional, e.g., 'education', 'healthcare', 'environment')",
        required: false,
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
                <CardTitle className="text-lg">Analyzing Non-Profit Landscape</CardTitle>
              </div>
              <CardDescription>
                Criteria: "{args?.criteria || '...'}"
                {args?.focus && ` • Focus: ${args.focus}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Processing data and generating insights...</p>
            </CardContent>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <HandHeartIcon className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Non-Profit Landscape Analysis</CardTitle>
              </div>
              <CardDescription>
                Criteria: "{args?.criteria || '...'}"
                {args?.focus && ` • Focus: ${args.focus}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.summary && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Summary</p>
                  <p className="text-sm text-foreground">{result.summary}</p>
                </div>
              )}
              {result.findings && Array.isArray(result.findings) && result.findings.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Findings</p>
                  <ul className="space-y-2">
                    {result.findings.map((finding: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.opportunities && Array.isArray(result.opportunities) && result.opportunities.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Opportunities</p>
                  <div className="space-y-2">
                    {result.opportunities.map((opp: any, idx: number) => (
                      <div key={idx} className="p-3 bg-background rounded-lg border">
                        <p className="font-medium text-sm">{opp.title || `Opportunity ${idx + 1}`}</p>
                        {opp.description && (
                          <p className="text-xs text-muted-foreground mt-1">{opp.description}</p>
                        )}
                        {opp.funding && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Funding: {opp.funding}
                          </Badge>
                        )}
                      </div>
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
    handler: async ({ criteria, focus }) => {
      try {
        // Simulate non-profit landscape analysis (in production, this would call your actual API)
        const mockAnalysis = generateMockNonProfitAnalysis(criteria, focus);
        
        return {
          success: true,
          criteria,
          focus: focus || "general",
          ...mockAnalysis,
        };
      } catch (error) {
        console.error("Error analyzing non-profit landscape:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to analyze non-profit landscape: ${errorMessage}`);
        throw error;
      }
    },
  });

  // Tool 4: Get Research Insights
  useCopilotAction({
    name: "getResearchInsights",
    description:
      "Gets comprehensive research insights on any topic including market analysis, trends, opportunities, and competitive intelligence. Use this when the user asks for insights, analysis, or research on a topic. This tool is ONLY available on the research page.",
    parameters: [
      {
        name: "topic",
        type: "string",
        description: "The topic to get research insights on",
        required: true,
      },
      {
        name: "industry",
        type: "string",
        description: "Industry focus: 'healthcare', 'non-profit', or 'both' (optional)",
        required: false,
        enum: ["healthcare", "non-profit", "both"],
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
                <CardTitle className="text-lg">Generating Research Insights</CardTitle>
              </div>
              <CardDescription>
                Topic: "{args?.topic || '...'}"
                {args?.industry && ` • Industry: ${args.industry}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Analyzing data and compiling comprehensive insights...</p>
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
                <CardTitle className="text-lg">Research Insights</CardTitle>
              </div>
              <CardDescription>
                Topic: "{args?.topic || '...'}"
                {args?.industry && ` • Industry: ${args.industry}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.overview && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Overview</p>
                  <p className="text-sm text-foreground">{result.overview}</p>
                </div>
              )}
              {result.keyInsights && Array.isArray(result.keyInsights) && result.keyInsights.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Insights</p>
                  <ul className="space-y-2">
                    {result.keyInsights.map((insight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <TrendingUpIcon className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recommendations && Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <SparklesIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.dataPoints && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {Object.entries(result.dataPoints).map(([key, value]) => (
                    <div key={key} className="p-3 bg-background rounded-lg border text-center">
                      <p className="text-xs text-muted-foreground mb-1">{key}</p>
                      <p className="text-lg font-bold text-foreground">{String(value)}</p>
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
    handler: async ({ topic, industry }) => {
      try {
        // Simulate comprehensive research insights (in production, this would call your actual API)
        const mockInsights = generateMockResearchInsights(topic, industry);
        
        return {
          success: true,
          topic,
          industry: industry || "both",
          ...mockInsights,
        };
      } catch (error) {
        console.error("Error getting research insights:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to get research insights: ${errorMessage}`);
        throw error;
      }
    },
  });

  return null; // This component renders no UI
}

// Helper functions for mock data generation
// In production, these would be replaced with actual API calls

function generateMockSearchResults(query: string, industry?: string) {
  const healthcareResults = [
    { title: "Hospital Systems Market Analysis", description: "Comprehensive analysis of major hospital systems and their partnership opportunities", industry: "healthcare" },
    { title: "Pharmaceutical Partnership Opportunities", description: "Current opportunities for medical device and pharmaceutical partnerships", industry: "healthcare" },
    { title: "Clinical Trial Site Database", description: "Database of qualified clinical trial sites available for partnerships", industry: "healthcare" },
  ];

  const nonProfitResults = [
    { title: "Grant Funding Opportunities", description: "Current grant funding opportunities from major foundations", industry: "non-profit" },
    { title: "Donor Prospect Research", description: "Wealth screening and prospect research for major donors", industry: "non-profit" },
    { title: "Foundation Partnership Database", description: "Database of foundations offering partnership opportunities", industry: "non-profit" },
  ];

  const allResults = [...healthcareResults, ...nonProfitResults];
  
  // Filter by industry if specified
  if (industry === "healthcare") {
    return healthcareResults.filter(r => 
      r.title.toLowerCase().includes(query.toLowerCase()) || 
      r.description.toLowerCase().includes(query.toLowerCase())
    );
  } else if (industry === "non-profit") {
    return nonProfitResults.filter(r => 
      r.title.toLowerCase().includes(query.toLowerCase()) || 
      r.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Return all results matching query
  return allResults.filter(r => 
    r.title.toLowerCase().includes(query.toLowerCase()) || 
    r.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
}

function generateMockHealthcareTrend(topic: string) {
  const trends: Record<string, any> = {
    telemedicine: {
      summary: "Telemedicine has seen explosive growth, with the market expected to reach $300B by 2028.",
      keyPoints: [
        "75% of healthcare providers now offer telemedicine services",
        "Patient adoption rates have increased by 200% since 2020",
        "Major hospital systems are investing heavily in telehealth infrastructure",
      ],
      marketSize: "$300B by 2028",
      opportunities: [
        "Partnership opportunities with telehealth platform providers",
        "Rural healthcare expansion through telemedicine",
        "Integration with existing hospital systems",
      ],
    },
    "hospital partnerships": {
      summary: "Hospital partnership opportunities are growing, with 500+ active partnerships tracked in our database.",
      keyPoints: [
        "Increased focus on value-based care is driving partnerships",
        "Regional hospital systems are consolidating",
        "Technology partnerships are a key growth area",
      ],
      marketSize: "500+ active partnerships",
      opportunities: [
        "Regional hospital system expansion",
        "Technology integration partnerships",
        "Clinical service line partnerships",
      ],
    },
  };

  const defaultTrend = {
    summary: `The ${topic} trend shows significant growth and opportunity in the healthcare sector.`,
    keyPoints: [
      `Market analysis indicates strong growth potential for ${topic}`,
      "Major healthcare organizations are investing in this area",
      "Partnership opportunities are emerging across the sector",
    ],
    marketSize: "Market size data available on request",
    opportunities: [
      `Strategic partnerships in ${topic}`,
      "Market expansion opportunities",
      "Technology integration possibilities",
    ],
  };

  return trends[topic.toLowerCase()] || defaultTrend;
}

function generateMockNonProfitAnalysis(criteria: string, focus?: string) {
  const analyses: Record<string, any> = {
    "grant opportunities": {
      summary: `Found 150+ active grant opportunities${focus ? ` in ${focus}` : ''} with $50M+ in available funding.`,
      findings: [
        "Foundation giving increased 15% year-over-year",
        "Education and healthcare sectors receive the most funding",
        "Corporate partnerships are growing rapidly",
      ],
      opportunities: [
        { title: "Education Innovation Grant", description: "Funding for innovative education programs", funding: "$500K - $2M" },
        { title: "Healthcare Access Grant", description: "Supporting healthcare access initiatives", funding: "$250K - $1M" },
        { title: "Environmental Impact Grant", description: "Environmental conservation and sustainability", funding: "$100K - $500K" },
      ],
    },
    "donor prospects": {
      summary: `Identified 500+ high-value donor prospects${focus ? ` in ${focus}` : ''} with capacity for $10K+ annual giving.`,
      findings: [
        "Donor retention rates are highest in healthcare sector",
        "Major donors prefer multi-year commitments",
        "Corporate giving programs are expanding",
      ],
      opportunities: [
        { title: "Major Donor Program", description: "Engagement opportunities for high-capacity donors", funding: "$10K+" },
        { title: "Corporate Partnership Program", description: "Corporate giving and sponsorship opportunities", funding: "$25K+" },
        { title: "Foundation Partnership", description: "Strategic foundation partnerships", funding: "$50K+" },
      ],
    },
  };

  const defaultAnalysis = {
    summary: `Analysis of ${criteria}${focus ? ` in ${focus}` : ''} reveals multiple opportunities for engagement and growth.`,
    findings: [
      `Strong market presence in ${criteria}`,
      "Multiple partnership opportunities available",
      "Growing funding landscape",
    ],
    opportunities: [
      { title: "Partnership Opportunity 1", description: "Strategic partnership opportunity", funding: "Varies" },
      { title: "Partnership Opportunity 2", description: "Additional partnership opportunity", funding: "Varies" },
    ],
  };

  return analyses[criteria.toLowerCase()] || defaultAnalysis;
}

function generateMockResearchInsights(topic: string, industry?: string) {
  return {
    overview: `Comprehensive research on ${topic}${industry ? ` in the ${industry} industry` : ''} reveals significant opportunities and trends worth exploring.`,
    keyInsights: [
      `Market growth in ${topic} is accelerating`,
      "Partnership opportunities are emerging",
      "Technology integration is a key driver",
      "Competitive landscape is evolving",
    ],
    recommendations: [
      `Explore strategic partnerships in ${topic}`,
      "Consider market expansion opportunities",
      "Invest in technology and innovation",
      "Monitor competitive landscape closely",
    ],
    dataPoints: {
      "Market Size": "$2.5B",
      "Growth Rate": "15% YoY",
      "Opportunities": "500+",
      "Partners": "200+",
    },
  };
}

