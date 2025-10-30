import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Use LangChainAdapter with ChatGoogleGenerativeAI from @langchain/google-genai
// This is the CORRECT package for Gemini API (not @langchain/google-gauth which is for Vertex AI)
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

const serviceAdapter = new LangChainAdapter({ model });
 
// 2. Create the CopilotRuntime instance without LangGraph agents
//    LangGraph configuration is commented out but preserved for future use
const runtime = new CopilotRuntime({
  // Uncomment the following to enable LangGraph agents:
  // agents: {
  //   starterAgent: new LangGraphAgent({
  //     deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
  //     graphId: "starterAgent",
  //     langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
  //   })
  // }
});
 
// 2. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, 
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};

