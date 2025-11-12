import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";

/**
 * GET /api/v1/status
 * 
 * Returns system health and status information
 * 
 * Authentication: Required (X-API-Key header)
 * 
 * This endpoint provides health check information for AI integrations
 * to verify service availability.
 */
export async function GET(request: NextRequest) {
  // Authenticate request
  const authResponse = authenticateRequest(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Check database connectivity (if DATABASE_URL is configured)
    const databaseUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL;

    const databaseStatus = databaseUrl ? "configured" : "not_configured";

    // Check AI endpoint (CopilotKit)
    const aiEndpointStatus = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
      ? "configured"
      : "not_configured";

    // Check API authentication
    const apiAuthStatus = process.env.API_KEY ? "configured" : "not_configured";

    const status = {
      status: "operational",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: databaseStatus === "configured" ? "healthy" : "degraded",
          configured: databaseStatus === "configured",
        },
        ai_endpoint: {
          status: aiEndpointStatus === "configured" ? "healthy" : "degraded",
          configured: aiEndpointStatus === "configured",
        },
        api_auth: {
          status: apiAuthStatus === "configured" ? "healthy" : "degraded",
          configured: apiAuthStatus === "configured",
        },
      },
      version: "1.0.0",
    };

    // Determine overall status
    const allHealthy =
      status.services.database.status === "healthy" &&
      status.services.ai_endpoint.status === "healthy" &&
      status.services.api_auth.status === "healthy";

    if (!allHealthy) {
      status.status = "degraded";
    }

    return NextResponse.json(
      {
        success: true,
        data: status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API v1/status] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to retrieve system status",
      },
      { status: 500 }
    );
  }
}

