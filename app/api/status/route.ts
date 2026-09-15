import { NextResponse } from "next/server";

/**
 * Compatibility status payload. This route does not probe database or model
 * connectivity. Environment variable presence is not treated as health.
 */
export async function GET() {
  return NextResponse.json({
    status: "unknown",
    database: "unchecked",
    ai_endpoint: "unchecked",
    checked: false,
    note: "This endpoint does not perform live health checks.",
  });
}
