/**
 * API Authentication Utility
 * 
 * Provides secure API key authentication for external AI integrations
 * (GPT Actions, Microsoft Copilot Connectors, etc.)
 * 
 * Environment Variables:
 * - API_KEY: The API key that external services must provide
 * - API_KEY_HEADER: (Optional) Custom header name, defaults to "X-API-Key"
 */

import { NextRequest, NextResponse } from "next/server";

const API_KEY_HEADER_NAME = process.env.API_KEY_HEADER || "X-API-Key";
const REQUIRED_API_KEY = process.env.API_KEY;

/**
 * Validate API key from request headers
 * @param request - Next.js request object
 * @returns API key if valid, null otherwise
 */
export function validateApiKey(request: NextRequest): string | null {
  // Get API key from environment
  if (!REQUIRED_API_KEY) {
    console.warn("[API Auth] API_KEY not configured in environment variables");
    return null;
  }

  // Get API key from request header
  const providedKey = request.headers.get(API_KEY_HEADER_NAME);

  if (!providedKey) {
    return null;
  }

  // Compare keys (use constant-time comparison to prevent timing attacks)
  if (constantTimeCompare(providedKey, REQUIRED_API_KEY)) {
    return providedKey;
  }

  return null;
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Middleware function to authenticate API requests
 * @param request - Next.js request object
 * @returns NextResponse with 401 if unauthorized, null if authorized
 */
export function authenticateRequest(
  request: NextRequest
): NextResponse | null {
  const apiKey = validateApiKey(request);

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing API key. Please provide a valid API key in the X-API-Key header.",
      },
      { status: 401 }
    );
  }

  return null; // Authentication passed
}

/**
 * Check if API authentication is configured
 * @returns True if API_KEY is set in environment
 */
export function isApiAuthConfigured(): boolean {
  return !!REQUIRED_API_KEY;
}

