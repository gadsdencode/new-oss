import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { handleApiError, createErrorResponse, validateEnvVars } from "@/lib/errors";

// Get API key from environment
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Validate API key
if (!apiKey) {
  console.error(
    "❌ ERROR: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is set. AI functionality will not work."
  );
  console.error("Please set one of these environment variables in your Vercel project settings.");
}

// Determine if we're in production/deployed environment
const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
const isDeployed = !!process.env.VERCEL; // Running on Vercel

// Log environment configuration
if (isDeployed) {
  console.log("🚀 Running on Vercel");
  console.log("Environment:", process.env.VERCEL_ENV || "unknown");
  console.log("API Key configured:", apiKey ? "Yes" : "No");
}

console.log("🤖 Initializing CopilotKit with Google Gemini");

// Initialize service adapter and runtime
let serviceAdapter: GoogleGenerativeAIAdapter | undefined;
let runtime: CopilotRuntime;

try {
  // Initialize the Google Gemini adapter with explicit configuration
  // Pass the API key and model name directly to the adapter
  if (apiKey) {
    serviceAdapter = new GoogleGenerativeAIAdapter({
      model: "gemini-1.5-pro", // Use the latest Gemini model
      // @ts-ignore - apiKey might not be in type definitions but is supported
      apiKey: apiKey,
    });
    console.log("✅ Google Gemini adapter created with API key");
  } else {
    console.error("❌ Cannot create adapter: No API key available");
  }
  
  // Create runtime (adapter will be passed to endpoint handler)
  runtime = new CopilotRuntime();
  
  console.log("✅ CopilotKit runtime initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize CopilotKit runtime:", error);
  console.error("Error details:", error instanceof Error ? error.message : String(error));
  
  if (error instanceof Error && error.message) {
    console.error("Error stack:", error.stack);
  }
  
  // Create a basic runtime as fallback
  try {
    runtime = new CopilotRuntime();
    console.log("✅ Fallback runtime created (without adapter)");
  } catch (fallbackError) {
    console.error("❌ Failed to create fallback runtime:", fallbackError);
    throw fallbackError; // Re-throw if we can't even create basic runtime
  }
}

/**
 * GET handler for CopilotKit info endpoint
 * Returns information about available agents and actions
 */
export const GET = async (req: NextRequest) => {
  try {
    // Check if runtime and serviceAdapter were initialized successfully
    if (!runtime || !serviceAdapter) {
      console.error("❌ GET request failed: Runtime or serviceAdapter not initialized");
      console.error("Runtime exists:", !!runtime);
      console.error("ServiceAdapter exists:", !!serviceAdapter);
      console.error("API Key present:", !!apiKey);
      
      const errorMessage = !apiKey 
        ? "GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment variables. Please configure it in Vercel project settings."
        : "CopilotKit runtime failed to initialize. Please check server logs.";
      
      return createErrorResponse(
        "Service Unavailable",
        errorMessage,
        503,
        { 
          reason: !apiKey ? "API key not configured" : "Runtime initialization failed",
          hasRuntime: !!runtime,
          hasServiceAdapter: !!serviceAdapter,
          hasApiKey: !!apiKey
        }
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
      console.error("❌ Error in CopilotKit GET handler:", handlerError);
      console.error("Error type:", handlerError instanceof Error ? handlerError.constructor.name : typeof handlerError);
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
    // Check if runtime and serviceAdapter were initialized successfully
    if (!runtime || !serviceAdapter) {
      console.error("❌ POST request failed: Runtime or serviceAdapter not initialized");
      console.error("Runtime exists:", !!runtime);
      console.error("ServiceAdapter exists:", !!serviceAdapter);
      console.error("API Key present:", !!apiKey);
      console.error("Environment check:");
      console.error("- GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Set (length: " + process.env.GEMINI_API_KEY.length + ")" : "Not set");
      console.error("- GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "Set (length: " + process.env.GOOGLE_API_KEY.length + ")" : "Not set");
      console.error("- VERCEL_ENV:", process.env.VERCEL_ENV || "Not set");
      
      const errorMessage = !apiKey 
        ? "GEMINI_API_KEY or GOOGLE_API_KEY is not set. Please configure it in Vercel project settings: Settings → Environment Variables"
        : "CopilotKit runtime failed to initialize. Please check server logs.";
      
      return createErrorResponse(
        "Service Unavailable",
        errorMessage,
        503,
        { 
          reason: !apiKey ? "API key not configured" : "Runtime initialization failed",
          hasRuntime: !!runtime,
          hasServiceAdapter: !!serviceAdapter,
          hasApiKey: !!apiKey,
          environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown"
        }
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
      console.error("❌ Error in CopilotKit POST handler:", handlerError);
      console.error("Error type:", handlerError instanceof Error ? handlerError.constructor.name : typeof handlerError);
      
      if (handlerError instanceof Error) {
        console.error("Error message:", handlerError.message);
        console.error("Error stack:", handlerError.stack);
        
        // Check for specific GraphQL errors
        if (handlerError.message.includes("GraphQL")) {
          console.error("📊 GraphQL Error detected");
          console.error("Common causes:");
          console.error("1. Invalid or expired API key");
          console.error("2. API key lacks necessary permissions");
          console.error("3. Google Gemini API quota exceeded");
          console.error("4. Network connectivity issues");
          console.error("5. Incorrect model name or configuration");
          console.error("");
          console.error("To fix:");
          console.error("- Verify API key at: https://aistudio.google.com/app/apikey");
          console.error("- Check quota at: https://console.cloud.google.com");
          console.error("- Ensure GEMINI_API_KEY is set correctly in Vercel");
        }
      }
      
      // Log request details for debugging
      try {
        const url = new URL(req.url);
        console.error("Request URL:", url.pathname);
        console.error("Request method:", req.method);
      } catch (urlError) {
        console.error("Could not parse request URL");
      }
      
      return handleApiError(handlerError);
    }
  } catch (error) {
    // Catch any unexpected errors in the route handler
    console.error("❌ Unexpected error in CopilotKit POST route:", error);
    console.error("Error details:", error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error);
    
    return handleApiError(error);
  }
};

