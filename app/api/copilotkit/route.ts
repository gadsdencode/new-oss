import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  langGraphPlatformEndpoint,
  copilotKitEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { handleApiError, createErrorResponse, validateEnvVars } from "@/lib/errors";

// Validate optional environment variables (warn-only; follow CopilotKit docs behavior)
const envValidation = validateEnvVars([
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "NEXT_PUBLIC_LANGGRAPH_URL",
  "LANGGRAPH_DEPLOYMENT_URL",
]);
if (!envValidation.valid && !process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn(
    "Warning: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set. API functionality may be limited."
  );
}

// Critical security check for LangGraph URL
const langGraphUrl = 
  process.env.NEXT_PUBLIC_LANGGRAPH_URL ||
  process.env.LANGGRAPH_DEPLOYMENT_URL ||
  "http://localhost:8123";

if (!process.env.LANGGRAPH_DEPLOYMENT_URL && !process.env.NEXT_PUBLIC_LANGGRAPH_URL) {
  console.warn(
    "⚠️  WARNING: LANGGRAPH_DEPLOYMENT_URL or NEXT_PUBLIC_LANGGRAPH_URL is not set! " +
    "Falling back to http://localhost:8123. Set this environment variable for production."
  );
}

// Service adapter is required even when using LangGraph agents
// It handles multi-agent coordination and fallback scenarios
let serviceAdapter: GoogleGenerativeAIAdapter;
let runtime: CopilotRuntime;

try {
  // Initialize the Google Gemini adapter (per CopilotKit docs; uses env for keys)
  serviceAdapter = new GoogleGenerativeAIAdapter();

  // Create the CopilotRuntime with remoteEndpoints (official CopilotKit method for self-hosted agents)
  // Reference: https://www.copilotkit.ai/blog/heres-how-to-build-fullstack-agent-apps-gemini-copilotkit-langgraph
  // For self-hosted LangGraph deployments, use langGraphPlatformEndpoint with agent configuration
  // The agent name "starterAgent" comes from agent/langgraph.json
  
  // Check if we have authentication key for LangGraph
  const langGraphApiKey = process.env.LANGGRAPH_API_KEY;
  
  // Build remote endpoints configuration
  // For self-hosted LangGraph deployments, use copilotKitEndpoint with onBeforeRequest for auth
  // This handles the /info endpoint with authentication headers
  // For LangGraph Platform Cloud deployments, use langGraphPlatformEndpoint
  if (langGraphUrl.includes("localhost") || langGraphUrl.includes("127.0.0.1") || !langGraphUrl.includes("platform.langchain.com")) {
    // Self-hosted LangGraph: use copilotKitEndpoint with authentication
    runtime = new CopilotRuntime({
      remoteEndpoints: [
        copilotKitEndpoint({
          url: langGraphUrl,
          onBeforeRequest: () => {
            const headers: Record<string, string> = {};
            if (langGraphApiKey) {
              headers["x-langgraph-api-key"] = langGraphApiKey;
            }
            return { headers };
          },
        }),
      ],
    });
  } else {
    // LangGraph Platform Cloud: use langGraphPlatformEndpoint with agent configuration
    runtime = new CopilotRuntime({
      remoteEndpoints: [
        langGraphPlatformEndpoint({
          deploymentUrl: langGraphUrl,
          langsmithApiKey: process.env.LANGSMITH_API_KEY || undefined,
          agents: [
            {
              name: "starterAgent",
              description: "A helpful LLM agent that can assist with various tasks.",
            },
          ],
        }),
      ],
    });
  }
} catch (error) {
  console.error("Failed to initialize CopilotKit runtime:", error);
  // We'll handle this in the POST handler
}

/**
 * GET handler for CopilotKit info endpoint
 * Returns information about available agents and actions
 */
export const GET = async (req: NextRequest) => {
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

    // Get the request handler with both runtime and serviceAdapter
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    // Handle the GET request
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      console.error("Error in CopilotKit GET handler:", handlerError);
      return handleApiError(handlerError);
    }
  } catch (error) {
    console.error("Unexpected error in CopilotKit GET route:", error);
    return handleApiError(error);
  }
};

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

