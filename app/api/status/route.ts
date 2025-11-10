import { NextResponse } from "next/server";

export async function GET() {
  // In a real app, you might check your database, NeonDB, etc.
  // For now, we'll return a simple status response
  return NextResponse.json({
    status: "All systems operational",
    database: "connected",
    ai_endpoint: "healthy",
  });
}

