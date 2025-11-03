import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { handleApiError, createErrorResponse } from "@/lib/errors";

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
    // Initialize the Google Gemini adapter
    // Default to gemini-1.5-flash (widely supported, fast, cost-effective)
    // Can be overridden with GEMINI_MODEL environment variable
    // Supported models: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash, etc.
    // Check https://ai.google.dev/gemini-api/docs/models for latest available models
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    
    const adapter = new GoogleGenerativeAIAdapter({
      model: modelName,
      apiKey: apiKey,
    });

    console.log(`✅ Google Gemini adapter created successfully with model: ${modelName}`);
    return adapter;
  } catch (error) {
    console.error("❌ Failed to create Google Gemini adapter:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}

/**
 * GET handler for CopilotKit info endpoint
 * Returns information about available agents and actions
 */
export const GET = async (req: NextRequest) => {
  try {
    const apiKey = getApiKey();

    if (!apiKey) {
      console.error("❌ GET request failed: API key not configured");
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
      return createErrorResponse(
        "Service Unavailable",
        "Failed to initialize Google Gemini adapter. Please check server logs.",
        503,
        {
          reason: "Adapter initialization failed",
          hasApiKey: true,
        }
      );
    }

    // Create runtime per-request
    const runtime = new CopilotRuntime();

    // Get the request handler
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
      logLevel: process.env.NODE_ENV === "production" ? "error" : "debug",
    });

    // Handle the GET request
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      console.error("❌ Error in CopilotKit GET handler:", handlerError);
      if (handlerError instanceof Error) {
        console.error("Error message:", handlerError.message);
        console.error("Error stack:", handlerError.stack);
      }
      return handleApiError(handlerError);
    }
  } catch (error) {
    console.error("❌ Unexpected error in CopilotKit GET route:", error);
    return handleApiError(error);
  }
};

/**
 * POST handler for CopilotKit runtime requests
 * Handles all errors gracefully and returns structured error responses
 */
export const POST = async (req: NextRequest) => {
  try {
    const apiKey = getApiKey();

    if (!apiKey) {
      console.error("❌ POST request failed: API key not configured");
      console.error("Environment check:");
      console.error("- GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? `Set (length: ${process.env.GEMINI_API_KEY.length})` : "Not set");
      console.error("- GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? `Set (length: ${process.env.GOOGLE_API_KEY.length})` : "Not set");
      console.error("- VERCEL_ENV:", process.env.VERCEL_ENV || "Not set");
      console.error("- NODE_ENV:", process.env.NODE_ENV || "Not set");

      return createErrorResponse(
        "Service Unavailable",
        "GEMINI_API_KEY or GOOGLE_API_KEY is not set. Please configure it in Vercel project settings: Settings → Environment Variables",
        503,
        {
          reason: "API key not configured",
          hasApiKey: false,
          environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
        }
      );
    }

    // Create adapter per-request for serverless compatibility
    // This ensures fresh initialization on each request
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
    // This is important for serverless environments where module-level state can cause issues
    const runtime = new CopilotRuntime();

    // Get the request handler with both runtime and serviceAdapter
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
      logLevel: process.env.NODE_ENV === "production" ? "error" : "debug",
    });

    // Handle the request with additional error catching
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      console.error("❌ Error in CopilotKit POST handler:", handlerError);
      console.error("Error type:", handlerError instanceof Error ? handlerError.constructor.name : typeof handlerError);

      if (handlerError instanceof Error) {
        console.error("Error message:", handlerError.message);
        console.error("Error stack:", handlerError.stack);

        // Check for specific GraphQL errors
        if (handlerError.message.includes("GraphQL") || handlerError.message.includes("GraphQLError")) {
          console.error("📊 GraphQL Error detected - Common causes:");
          console.error("1. Invalid or expired API key");
          console.error("2. API key lacks necessary permissions");
          console.error("3. Google Gemini API quota exceeded");
          console.error("4. Network connectivity issues");
          console.error("5. Incorrect model name or configuration");
          console.error("6. Service adapter not properly initialized");
          console.error("");
          console.error("To fix:");
          console.error("- Verify API key at: https://aistudio.google.com/app/apikey");
          console.error("- Check quota at: https://console.cloud.google.com");
          console.error("- Ensure GEMINI_API_KEY is set correctly in Vercel");
          console.error("- Verify the API key has Gemini API enabled");
        }

        // Check for authentication errors
        if (handlerError.message.includes("401") || handlerError.message.includes("Unauthorized") || handlerError.message.includes("API key")) {
          console.error("🔐 Authentication Error detected");
          console.error("The API key may be invalid or expired");
          console.error("Please verify the API key in Vercel environment variables");
        }

        // Check for rate limiting
        if (handlerError.message.includes("429") || handlerError.message.includes("quota") || handlerError.message.includes("rate limit")) {
          console.error("⏱️ Rate Limit Error detected");
          console.error("The API quota may have been exceeded");
          console.error("Check usage at: https://console.cloud.google.com");
        }
      }

      // Log request details for debugging
      try {
        const url = new URL(req.url);
        console.error("Request URL:", url.pathname);
        console.error("Request method:", req.method);
        console.error("Request headers:", Object.fromEntries(req.headers.entries()));
      } catch (urlError) {
        console.error("Could not parse request details");
      }

      return handleApiError(handlerError);
    }
  } catch (error) {
    // Catch any unexpected errors in the route handler
    console.error("❌ Unexpected error in CopilotKit POST route:", error);
    console.error("Error details:", error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error);

    return handleApiError(error);
  }
};
