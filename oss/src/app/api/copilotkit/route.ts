import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest, NextResponse } from "next/server";

/**
 * Standard error response structure
 */
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  details?: unknown;
}

/**
 * Create a standardized error response
 */
function createErrorResponse(
  error: string,
  message: string,
  statusCode: number,
  details?: unknown
): NextResponse<ErrorResponse> {
  const errorResponse: ErrorResponse = {
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  if (details !== undefined) {
    errorResponse.details = details;
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Handle API errors and return appropriate response
 */
function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error("API Error:", error);

  if (error instanceof Error) {
    return createErrorResponse(
      "Internal Server Error",
      error.message || "An unexpected error occurred",
      500,
      { name: error.name, stack: process.env.NODE_ENV === "development" ? error.stack : undefined }
    );
  }

  return createErrorResponse(
    "Internal Server Error",
    "An unexpected error occurred",
    500,
    { error: String(error) }
  );
}

// 1. Use GoogleGenerativeAIAdapter for direct Gemini API integration
//    This adapter uses Google Gemini API directly without requiring LangGraph
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Validate API key
if (!apiKey) {
  console.error("ERROR: No Gemini API key found. Please set GEMINI_API_KEY or GOOGLE_API_KEY in .env.local");
}

let serviceAdapter: GoogleGenerativeAIAdapter;
let runtime: CopilotRuntime;

try {
  if (!apiKey) {
    throw new Error("Missing required API key: GEMINI_API_KEY or GOOGLE_API_KEY must be set");
  }

  serviceAdapter = new GoogleGenerativeAIAdapter({
    model: "gemini-1.5-pro",
    apiKey: apiKey,
  });
  
  // Create the CopilotRuntime instance without LangGraph agents
  // LangGraph configuration is commented out but preserved for future use
  runtime = new CopilotRuntime({
    // Uncomment the following to enable LangGraph agents:
    // agents: {
    //   starterAgent: new LangGraphAgent({
    //     deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
    //     graphId: "starterAgent",
    //     langsmithApiKey: process.env.LANGSMITH_API_KEY || ""
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