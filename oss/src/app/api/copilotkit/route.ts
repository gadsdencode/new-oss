import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

// 1. Use GoogleGenerativeAIAdapter for direct Gemini API integration
//    This adapter uses Google Gemini API directly without requiring LangGraph
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Log for debugging (remove in production)
if (!apiKey) {
  console.error("ERROR: No Gemini API key found. Please set GEMINI_API_KEY or GOOGLE_API_KEY in .env.local");
}

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: "gemini-1.5-pro",
  apiKey: apiKey,
});
 
// 2. Create the CopilotRuntime instance without LangGraph agents
//    LangGraph configuration is commented out but preserved for future use
const runtime = new CopilotRuntime({
  // Uncomment the following to enable LangGraph agents:
  // agents: {
  //   starterAgent: new LangGraphAgent({
  //     deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
  //     graphId: "starterAgent",
  //     langsmithApiKey: process.env.LANGSMITH_API_KEY || ""
  //   })
  // }
});
 
// 3. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, 
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};