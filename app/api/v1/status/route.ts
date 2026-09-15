import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";

/**
 * GET /api/v1/status
 * 
 * Returns configuration flags only. This is not a live health check.
 * Environment variable presence does not establish service health.
 */
export async function GET(request: NextRequest) {
  // Authenticate request
  const authResponse = authenticateRequest(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const databaseUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL;

    const databaseConfigured = Boolean(databaseUrl);
    const aiEndpointConfigured = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const apiAuthConfigured = Boolean(process.env.API_KEY);

    const status = {
      status: "unknown",
      timestamp: new Date().toISOString(),
      note: "Configuration presence is not a live health check. Services are reported as unchecked.",
      services: {
        database: {
          status: "unchecked",
          configured: databaseConfigured,
        },
        ai_endpoint: {
          status: "unchecked",
          configured: aiEndpointConfigured,
        },
        api_auth: {
          status: "unchecked",
          configured: apiAuthConfigured,
        },
      },
      version: "1.0.0",
    };

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

