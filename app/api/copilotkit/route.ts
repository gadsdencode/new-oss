import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { handleApiError, createErrorResponse } from "@/lib/errors";

/**
 * Extract detailed error information from GraphQL errors
 * GraphQL errors typically have an extensions object with originalError
 */
function extractGraphQLErrorDetails(error: unknown): {
  message: string;
  originalError?: unknown;
  extensions?: Record<string, unknown>;
  stack?: string;
} {
  const errorObj = error as Record<string, unknown>;
  
  // Check if it's a GraphQL error with extensions
  if (errorObj && typeof errorObj === 'object') {
    const extensions = errorObj.extensions as Record<string, unknown> | undefined;
    const originalError = extensions?.originalError;
    
    return {
      message: (errorObj.message as string) || String(error),
      originalError: originalError,
      extensions: extensions,
      stack: errorObj.stack as string | undefined,
    };
  }
  
  // Fallback for regular Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }
  
  return {
    message: String(error),
  };
}

/**
 * Validate request headers for POST requests (without consuming body)
 */
function validateRequestHeaders(req: NextRequest): { valid: boolean; error?: string } {
  const contentType = req.headers.get("content-type");
  
  if (!contentType || !contentType.includes("application/json")) {
    return { valid: false, error: "Content-Type must be application/json" };
  }
  
  return { valid: true };
}

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

    // Initialize the Google Gemini adapter
    // Default to gemini-1.5-flash (widely supported, fast, cost-effective)
    // Can be overridden with GEMINI_MODEL environment variable
    // Supported models: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash, etc.
    // Check https://ai.google.dev/gemini-api/docs/models for latest available models
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    
    console.log(`🔧 Creating Google Gemini adapter with model: ${modelName}`);
    
    const adapter = new GoogleGenerativeAIAdapter({
      model: modelName,
      apiKey: apiKey,
    });

    console.log(`✅ Google Gemini adapter created successfully with model: ${modelName}`);
    return adapter;
  } catch (error) {
    console.error("❌ Failed to create Google Gemini adapter:", error);
    
    if (error instanceof Error) {
      console.error("   - Error name:", error.name);
      console.error("   - Error message:", error.message);
      console.error("   - Error stack:", error.stack);
      
      // Provide specific guidance based on error type
      if (error.message.includes("API key") || error.message.includes("invalid")) {
        console.error("   💡 Tip: Check that your GEMINI_API_KEY is valid at https://aistudio.google.com/app/apikey");
      }
      if (error.message.includes("model")) {
        console.error("   💡 Tip: Verify the GEMINI_MODEL value is a supported model name");
      }
    } else {
      console.error("   - Unknown error type:", typeof error);
      console.error("   - Error value:", String(error));
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

    // Validate request headers before processing (without consuming body)
    const headerValidation = validateRequestHeaders(req);
    if (!headerValidation.valid) {
      console.error("❌ POST request failed: Invalid request headers");
      console.error("Validation error:", headerValidation.error);
      return createErrorResponse(
        "Bad Request",
        headerValidation.error || "Invalid request headers",
        400,
        { reason: "Request validation failed" }
      );
    }

    // Handle the request with comprehensive error catching
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      console.error("❌ Error in CopilotKit POST handler:", handlerError);
      
      // Extract detailed error information
      const errorDetails = extractGraphQLErrorDetails(handlerError);
      console.error("📋 Error Details:", {
        message: errorDetails.message,
        hasOriginalError: !!errorDetails.originalError,
        hasExtensions: !!errorDetails.extensions,
        stack: errorDetails.stack,
      });

      // Log original error if present (this is the actual underlying error)
      if (errorDetails.originalError) {
        console.error("🔍 Original Error:", errorDetails.originalError);
        if (errorDetails.originalError instanceof Error) {
          console.error("   - Name:", errorDetails.originalError.name);
          console.error("   - Message:", errorDetails.originalError.message);
          console.error("   - Stack:", errorDetails.originalError.stack);
        } else {
          console.error("   - Type:", typeof errorDetails.originalError);
          console.error("   - Value:", String(errorDetails.originalError));
        }
      }

      // Log extensions for debugging
      if (errorDetails.extensions) {
        console.error("📦 Error Extensions:", JSON.stringify(errorDetails.extensions, null, 2));
      }

      // Check for GraphQL errors specifically
      const isGraphQLError = errorDetails.message.includes("GraphQL") || 
                             errorDetails.message.includes("GraphQLError") ||
                             !!errorDetails.extensions;
      
      if (isGraphQLError) {
        console.error("📊 GraphQL Error detected - Detailed Analysis:");
        console.error("");
        
        // Analyze the original error if available
        if (errorDetails.originalError instanceof Error) {
          const origMsg = errorDetails.originalError.message.toLowerCase();
          
          if (origMsg.includes("api key") || origMsg.includes("authentication") || origMsg.includes("401")) {
            console.error("🔐 Authentication Issue Detected:");
            console.error("   - The Gemini API key may be invalid, expired, or missing required permissions");
            console.error("   - Verify API key at: https://aistudio.google.com/app/apikey");
            console.error("   - Ensure GEMINI_API_KEY is set correctly in environment variables");
            console.error("   - Check that the API key has Gemini API enabled in Google Cloud Console");
          } else if (origMsg.includes("quota") || origMsg.includes("429") || origMsg.includes("rate limit")) {
            console.error("⏱️ Rate Limit / Quota Issue Detected:");
            console.error("   - API quota may have been exceeded");
            console.error("   - Check usage at: https://console.cloud.google.com");
            console.error("   - Consider upgrading your API tier or waiting before retrying");
          } else if (origMsg.includes("network") || origMsg.includes("timeout") || origMsg.includes("fetch")) {
            console.error("🌐 Network Issue Detected:");
            console.error("   - Network connectivity problem with Gemini API");
            console.error("   - Check internet connection and firewall settings");
            console.error("   - The API endpoint may be temporarily unavailable");
          } else if (origMsg.includes("model") || origMsg.includes("invalid")) {
            console.error("⚙️ Configuration Issue Detected:");
            console.error("   - The model name or configuration may be invalid");
            console.error("   - Check GEMINI_MODEL environment variable");
            console.error("   - Verify model name is supported: gemini-1.5-flash, gemini-1.5-pro, etc.");
          } else {
            console.error("❓ Unknown Error Type:");
            console.error(`   - Original error message: ${errorDetails.originalError.message}`);
          }
        }
        
        console.error("");
        console.error("💡 Common Fixes:");
        console.error("1. Verify API key: https://aistudio.google.com/app/apikey");
        console.error("2. Check quota: https://console.cloud.google.com");
        console.error("3. Ensure GEMINI_API_KEY is set in Vercel environment variables");
        console.error("4. Verify API key has Gemini API enabled");
        console.error("5. Check model name is valid (GEMINI_MODEL env var)");
      }

      // Check for authentication errors
      if (errorDetails.message.includes("401") || 
          errorDetails.message.includes("Unauthorized") || 
          errorDetails.message.includes("API key")) {
        console.error("🔐 Authentication Error detected");
        console.error("The API key may be invalid or expired");
        console.error("Please verify the API key in Vercel environment variables");
      }

      // Check for rate limiting
      if (errorDetails.message.includes("429") || 
          errorDetails.message.includes("quota") || 
          errorDetails.message.includes("rate limit")) {
        console.error("⏱️ Rate Limit Error detected");
        console.error("The API quota may have been exceeded");
        console.error("Check usage at: https://console.cloud.google.com");
      }

      // Log request details for debugging
      try {
        const url = new URL(req.url);
        console.error("📡 Request Details:");
        console.error("   - URL:", url.pathname);
        console.error("   - Method:", req.method);
        console.error("   - Headers:", Object.fromEntries(req.headers.entries()));
      } catch (urlError) {
        console.error("Could not parse request details");
      }

      // Return error response with more details in development
      if (process.env.NODE_ENV === "development" && errorDetails.originalError) {
        return createErrorResponse(
          "Internal Server Error",
          errorDetails.originalError instanceof Error 
            ? errorDetails.originalError.message 
            : String(errorDetails.originalError),
          500,
          {
            graphQLError: true,
            message: errorDetails.message,
            originalError: errorDetails.originalError instanceof Error
              ? {
                  name: errorDetails.originalError.name,
                  message: errorDetails.originalError.message,
                  stack: errorDetails.originalError.stack,
                }
              : String(errorDetails.originalError),
          }
        );
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
