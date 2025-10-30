import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { handleApiError, createErrorResponse, validateEnvVars } from "@/lib/errors";

// Validate required environment variables
const envValidation = validateEnvVars(["GEMINI_API_KEY", "GOOGLE_API_KEY"]);
if (!envValidation.valid && !process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn(
    "Warning: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set. API functionality may be limited."
  );
}

// Use LangChainAdapter with ChatGoogleGenerativeAI from @langchain/google-genai
// This is the CORRECT package for Gemini API (not @langchain/google-gauth which is for Vertex AI)
let model: ChatGoogleGenerativeAI;
let serviceAdapter: LangChainAdapter;
let runtime: CopilotRuntime;

try {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing required API key: GEMINI_API_KEY or GOOGLE_API_KEY must be set");
  }

  model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    apiKey,
  });

  serviceAdapter = new LangChainAdapter({ model });
  
  // Create the CopilotRuntime instance without LangGraph agents
  // LangGraph configuration is commented out but preserved for future use
  runtime = new CopilotRuntime({
    // Uncomment the following to enable LangGraph agents:
    // agents: {
    //   starterAgent: new LangGraphAgent({
    //     deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
    //     graphId: "starterAgent",
    //     langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
    //   })
    // }
  });
} catch (error) {
  console.error("Failed to initialize CopilotKit runtime:", error);
  // We'll handle this in the POST handler
}

/**
 * POST handler for CopilotKit runtime requests
 * Handles all errors gracefully and returns structured error responses
 */
export const POST = async (req: NextRequest) => {
  try {
    // Check if runtime was initialized successfully
    if (!runtime || !serviceAdapter) {
      return createErrorResponse(
        "Service Unavailable",
        "CopilotKit runtime failed to initialize. Please check server configuration.",
        503,
        { reason: "Runtime initialization failed" }
      );
    }

    // Validate request
    if (!req.body) {
      return createErrorResponse(
        "Bad Request",
        "Request body is required",
        400
      );
    }

    // Get the request handler
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    // Handle the request with additional error catching
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      console.error("Error in CopilotKit request handler:", handlerError);
      return handleApiError(handlerError);
    }
  } catch (error) {
    // Catch any unexpected errors in the route handler
    console.error("Unexpected error in CopilotKit POST route:", error);
    return handleApiError(error);
  }
};

