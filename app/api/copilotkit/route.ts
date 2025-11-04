import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { handleApiError, createErrorResponse } from "@/lib/errors";

/**
 * CopilotKit API Route - Direct-to-LLM Pattern
 * 
 * This endpoint connects directly to Google Gemini without requiring a separate agent server.
 * It uses the Direct-to-LLM pattern for simple, straightforward AI chat functionality.
 * 
 * Environment Variables Required:
 * - GEMINI_API_KEY: Your Google Gemini API key (or GOOGLE_API_KEY as alternative)
 * - GEMINI_MODEL: (Optional) Model name, defaults to "gemini-1.5-flash"
 * 
 * Get your API key from: https://aistudio.google.com/app/apikey
 */

// Force Node.js runtime to ensure process.env is available
export const runtime = "nodejs";

/**
 * Get API key from environment variables
 * Supports both GEMINI_API_KEY and GOOGLE_API_KEY for compatibility
 */
function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
}

/**
 * Create and initialize the Google Gemini adapter
 * This is called per-request to avoid serverless environment issues
 */
function createServiceAdapter(): GoogleGenerativeAIAdapter | null {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("❌ ERROR: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set.");
    return null;
  }

  try {
    // Validate API key format (should be non-empty string)
    if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
      console.error("❌ Invalid API key format: API key must be a non-empty string");
      return null;
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    
    const adapter = new GoogleGenerativeAIAdapter({
      model: modelName,
      apiKey: apiKey,
    });

    return adapter;
  } catch (error) {
    console.error("❌ Failed to create Google Gemini adapter:", error);
    if (error instanceof Error) {
      console.error("   - Error name:", error.name);
      console.error("   - Error message:", error.message);
    }
    return null;
  }
}

/**
 * POST handler for CopilotKit requests
 * Handles chat requests and communicates directly with Google Gemini
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate API key
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error("❌ POST request failed: API key not configured");
      return createErrorResponse(
        "Service Unavailable",
        "GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment variables. Please configure it in Vercel project settings.",
        503,
        {
          reason: "API key not configured",
          hasApiKey: false,
        }
      );
    }

    // Create adapter per-request for serverless compatibility
    const serviceAdapter = createServiceAdapter();
    if (!serviceAdapter) {
      console.error("❌ POST request failed: Service adapter initialization failed");
      return createErrorResponse(
        "Service Unavailable",
        "Failed to initialize Google Gemini adapter. Please check API key validity and server logs.",
        503,
        {
          reason: "Adapter initialization failed",
          hasApiKey: true,
        }
      );
    }

    // Create runtime per-request
    const copilotRuntime = new CopilotRuntime();

    // Get the request handler
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime: copilotRuntime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    // Handle the request with error catching
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      console.error("❌ Error in CopilotKit POST handler:", handlerError);
      if (handlerError instanceof Error) {
        console.error("Error message:", handlerError.message);
        console.error("Error stack:", handlerError.stack);
      }
      return handleApiError(handlerError);
    }
  } catch (error) {
    // Catch any unexpected errors in the route handler
    console.error("❌ Unexpected error in CopilotKit POST route:", error);
    return handleApiError(error);
  }
};