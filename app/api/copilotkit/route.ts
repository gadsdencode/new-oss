import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

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

// Create Google Gemini service adapter
const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
});

// Create CopilotKit runtime instance
const copilotRuntime = new CopilotRuntime();

/**
 * POST handler for CopilotKit requests
 * Handles chat requests and communicates directly with Google Gemini
 */
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotRuntime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};