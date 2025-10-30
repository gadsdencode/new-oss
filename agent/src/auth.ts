/**
 * Authentication middleware for LangGraph agent
 * This file implements API key-based authentication to secure the agent endpoint
 */

import { Auth, HTTPException } from "@langchain/langgraph-sdk/auth";

// Load the API key from environment variables
const VALID_API_KEY = process.env.LANGGRAPH_API_KEY;

if (!VALID_API_KEY) {
  console.error(
    "⚠️  SECURITY WARNING: LANGGRAPH_API_KEY is not set! Agent endpoint is unsecured."
  );
}

/**
 * Create and configure the Auth object
 * Authentication runs as middleware on every request
 */
export const auth = new Auth()
  .authenticate(async (request: Request) => {
    // Extract API key from request headers
    // Support both x-langgraph-api-key and Authorization headers
    const apiKeyHeader = 
      request.headers.get("x-langgraph-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    // Validate API key is configured
    if (!VALID_API_KEY) {
      console.error("⚠️  LANGGRAPH_API_KEY not configured!");
      throw new HTTPException(503, {
        message: "Authentication not configured - LANGGRAPH_API_KEY not set",
      });
    }

    // Validate API key is present
    if (!apiKeyHeader) {
      console.warn("⚠️  API key missing in request");
      throw new HTTPException(401, {
        message: "Missing API key - x-langgraph-api-key header required",
      });
    }

    // Validate API key matches
    if (apiKeyHeader !== VALID_API_KEY) {
      console.warn(
        "⚠️  Invalid API key attempt from:",
        request.headers.get("x-forwarded-for") || "unknown"
      );
      throw new HTTPException(401, {
        message: "Invalid API key",
      });
    }

    // Authentication successful - return user identity
    console.log("✅ Authentication successful");
    return "authenticated-user";
  })
  // Authorization handler for all resources
  // Allow all operations after successful authentication
  .on("*", ({ value, user }) => {
    // Add owner metadata to resources
    if (!value.metadata) {
      value.metadata = {};
    }
    value.metadata.owner = user;
    
    // Return filters for resource access
    // For single-user scenarios, allow all
    return { owner: user };
  });

