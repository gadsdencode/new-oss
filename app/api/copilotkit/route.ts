import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  langGraphPlatformEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { handleApiError, createErrorResponse, validateEnvVars } from "@/lib/errors";

// Validate required environment variables
const envValidation = validateEnvVars([
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "LANGGRAPH_API_KEY",
]);
if (!envValidation.valid && !process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn(
    "Warning: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set. API functionality may be limited."
  );
}

// Critical security check for LangGraph authentication
if (!process.env.LANGGRAPH_API_KEY) {
  console.error(
    "⚠️  CRITICAL SECURITY WARNING: LANGGRAPH_API_KEY is not set! " +
    "Your LangGraph agent endpoint is UNSECURED and can be accessed by anyone."
  );
}

// Service adapter is required even when using LangGraph agents
// It handles multi-agent coordination and fallback scenarios
let serviceAdapter: GoogleGenerativeAIAdapter;
let runtime: CopilotRuntime;

try {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing required API key: GEMINI_API_KEY or GOOGLE_API_KEY must be set");
  }

  // Initialize the Google Gemini adapter
  serviceAdapter = new GoogleGenerativeAIAdapter();

  // Create the CopilotRuntime instance with LangGraph Platform endpoint
  // This connects to the LangGraph agent running on port 8123
  // SECURITY: API key authentication is added via headers
  runtime = new CopilotRuntime({
    remoteEndpoints: [
      langGraphPlatformEndpoint({
        deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
        langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
        agents: [{
          name: "starterAgent",
          description: "A helpful AI agent powered by Google Gemini"
        }],
        // Add authentication headers to secure the agent endpoint
        headers: {
          "x-langgraph-api-key": process.env.LANGGRAPH_API_KEY || "",
        },
      })
    ],
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
    // Check if runtime and serviceAdapter were initialized successfully
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

    // Get the request handler with both runtime and serviceAdapter
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

