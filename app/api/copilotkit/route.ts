import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { handleApiError, createErrorResponse, handleLLMAdapterError } from "@/lib/errors";
import { logError, ErrorContext } from "@/lib/monitoring";

/**
 * CopilotKit API Route - Direct-to-LLM Pattern with Native Gemini Adapter
 * 
 * This endpoint connects directly to Google Gemini using CopilotKit's native GoogleGenerativeAIAdapter.
 * This is the CORRECT and RECOMMENDED approach for Gemini integration.
 * 
 * Environment Variables Required:
 * - GEMINI_API_KEY: Your Google Gemini API key (or GOOGLE_API_KEY as alternative)
 * - GEMINI_MODEL: (Optional) Model name, defaults to "gemini-2.5-flash"
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
 * Initialize and return the Google Generative AI adapter as a module-level singleton
 * This reduces per-request overhead by reusing the same adapter instance across requests
 * 
 * Using lazy initialization to handle cases where API key might not be available at module load time
 */
function getServiceAdapter(): GoogleGenerativeAIAdapter | null {
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

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    
    // Create the native Google Generative AI adapter
    // This is the CORRECT way to integrate Gemini with CopilotKit
    const adapter = new GoogleGenerativeAIAdapter({
      model: modelName,
      apiKey: apiKey,
    });

    return adapter;
  } catch (error) {
    console.error("❌ Failed to create GoogleGenerativeAIAdapter:", error);
    if (error instanceof Error) {
      console.error("   - Error name:", error.name);
      console.error("   - Error message:", error.message);
      console.error("   - Error stack:", error.stack);
    }
    return null;
  }
}

// Module-level singleton adapter - initialized lazily on first request
let serviceAdapter: GoogleGenerativeAIAdapter | null = null;
let adapterInitialized = false;

/**
 * Get or initialize the service adapter singleton
 * Initializes once and reuses the same instance for subsequent requests
 */
function getOrCreateServiceAdapter(): GoogleGenerativeAIAdapter | null {
  if (!adapterInitialized) {
    serviceAdapter = getServiceAdapter();
    adapterInitialized = true;
    if (serviceAdapter) {
      const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      console.log(`✅ GoogleGenerativeAIAdapter singleton initialized (model: ${modelName})`);
    }
  }
  return serviceAdapter;
}

// Module-level singleton runtime - initialized once at module load
// This reduces per-request overhead by reusing the same runtime instance
const copilotRuntime = new CopilotRuntime();

/**
 * POST handler for CopilotKit requests
 * Handles chat requests and communicates directly with Google Gemini
 */
export const POST = async (req: NextRequest) => {
  console.log("\n========== NEW COPILOTKIT REQUEST ==========");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  
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

    // Get or create the module-level singleton adapter
    // This reuses the same adapter instance across requests for better performance
    const serviceAdapter = getOrCreateServiceAdapter();
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

    // Get the request handler with debug logging enabled
    // Uses module-level singleton runtime and adapter for better performance
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime: copilotRuntime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
      logLevel: "debug",  // Enable debug logging to see detailed errors
    });

    // Handle the request with error catching
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      // Prepare error context for monitoring
      const errorContext: ErrorContext = {
        errorCode: "LLM_ADAPTER_ERROR",
        source: "copilotkit-route",
        endpoint: "/api/copilotkit",
        method: "POST",
        adapterName: "GoogleGenerativeAIAdapter",
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        environment: process.env.NODE_ENV || process.env.VERCEL_ENV || "unknown",
      };

      // Extract error details for logging
      if (handlerError instanceof Error) {
        errorContext.errorName = handlerError.name;
        errorContext.errorMessage = handlerError.message;
        errorContext.errorStack = process.env.NODE_ENV === "development" ? handlerError.stack : undefined;
        
        console.error("❌ Error in CopilotKit POST handler:", {
          name: handlerError.name,
          message: handlerError.message,
          stack: handlerError.stack,
        });
      } else {
        errorContext.errorType = typeof handlerError;
        errorContext.errorConstructor = handlerError?.constructor?.name;
        console.error("❌ Error in CopilotKit POST handler (non-Error type):", handlerError);
      }

      // Log to monitoring service with full context
      logError(handlerError, errorContext, "high");

      // Return structured JSON response for LLM adapter errors
      return handleLLMAdapterError(handlerError, errorContext);
    }
  } catch (error) {
    // Catch any unexpected errors in the route handler
    const errorContext: ErrorContext = {
      errorCode: "COPILOTKIT_ROUTE_ERROR",
      source: "copilotkit-route",
      endpoint: "/api/copilotkit",
      method: "POST",
      environment: process.env.NODE_ENV || process.env.VERCEL_ENV || "unknown",
    };

    // Extract error details
    if (error instanceof Error) {
      errorContext.errorName = error.name;
      errorContext.errorMessage = error.message;
      errorContext.errorStack = process.env.NODE_ENV === "development" ? error.stack : undefined;
      
      console.error("❌ Unexpected error in CopilotKit POST route:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      errorContext.errorType = typeof error;
      errorContext.errorConstructor = error?.constructor?.name;
      console.error("❌ Unexpected error in CopilotKit POST route (non-Error type):", error);
    }

    // Log to monitoring service with full context
    logError(error, errorContext, "critical");

    // Return structured error response
    return handleApiError(error, errorContext, "critical");
  }
};