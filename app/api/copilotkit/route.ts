import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { handleApiError, createErrorResponse } from "@/lib/errors";

/**
 * CopilotKit API Route - Direct-to-LLM Pattern with LangChain
 * 
 * This endpoint connects directly to Google Gemini using LangChain adapter.
 * This approach is more stable and reliable than using GoogleGenerativeAIAdapter directly.
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
 * Create and initialize the LangChain adapter with Google Gemini
 * This is called per-request to avoid serverless environment issues
 * Using LangChain adapter is more stable than GoogleGenerativeAIAdapter
 */
function createServiceAdapter(): LangChainAdapter | null {
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
    
    console.log(`✅ Initializing Gemini model: ${modelName}`);
    
    // Create the Google Gemini model instance
    const model = new ChatGoogleGenerativeAI({
      model: modelName,
      apiKey: apiKey,
      temperature: 0.7,
      maxOutputTokens: 2048,
    });

    // Create LangChain adapter with the model
    const adapter = new LangChainAdapter({
      chainFn: async ({ messages, tools }) => {
        try {
          console.log(`📨 Received ${messages.length} messages, ${tools?.length || 0} tools`);
          const userMessage = messages.find(m => m._getType?.() === 'human');
          const content = userMessage?.content;
          const contentPreview = typeof content === 'string' ? content.substring(0, 100) : '[complex content]';
          console.log("📝 First user message:", contentPreview);
          
          if (tools && tools.length > 0) {
            console.log("🔧 Binding tools to model...");
            return model.bindTools(tools).stream(messages);
          }
          
          console.log("🚀 Starting model stream without tools...");
          const stream = await model.stream(messages);
          console.log("✅ Stream created successfully");
          return stream;
        } catch (chainError) {
          console.error("❌ ERROR in chainFn:", chainError);
          if (chainError instanceof Error) {
            console.error("   - Error name:", chainError.name);
            console.error("   - Error message:", chainError.message);
            console.error("   - Error stack:", chainError.stack);
          }
          throw chainError;
        }
      },
    });

    console.log("✅ LangChain adapter created successfully");
    return adapter;
  } catch (error) {
    console.error("❌ Failed to create LangChain adapter:", error);
    if (error instanceof Error) {
      console.error("   - Error name:", error.name);
      console.error("   - Error message:", error.message);
      console.error("   - Error stack:", error.stack);
    }
    return null;
  }
}

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

    // Get the request handler with debug logging enabled
    console.log("✅ Creating CopilotKit endpoint handler...");
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime: copilotRuntime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
      logLevel: "debug",  // Enable debug logging to see detailed errors
    });
    console.log("✅ Endpoint handler created successfully");

    // Handle the request with error catching
    try {
      const response = await handleRequest(req);
      return response;
    } catch (handlerError) {
      console.error("❌ Error in CopilotKit POST handler:", handlerError);
      if (handlerError instanceof Error) {
        console.error("Error message:", handlerError.message);
        console.error("Error stack:", handlerError.stack);
        console.error("Error name:", handlerError.name);
        console.error("Full error object:", JSON.stringify(handlerError, Object.getOwnPropertyNames(handlerError), 2));
      }
      // Log any additional properties on the error
      console.error("Error type:", typeof handlerError);
      console.error("Error constructor:", handlerError?.constructor?.name);
      return handleApiError(handlerError);
    }
  } catch (error) {
    // Catch any unexpected errors in the route handler
    console.error("❌ Unexpected error in CopilotKit POST route:", error);
    return handleApiError(error);
  }
};