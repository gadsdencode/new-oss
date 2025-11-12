import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";
import { submitContactForm } from "@/app/contact/actions";
import { validateContactForm } from "@/lib/contact-form-schema";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/v1/consultations
 * 
 * Books a consultation with Overture Systems
 * 
 * Authentication: Required (X-API-Key header)
 * 
 * This endpoint allows AI assistants (GPT Actions, Copilot Connectors) to
 * book consultations on behalf of users.
 * 
 * Request Body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "company": "Acme Corp" (optional),
 *   "phone": "+1234567890" (optional),
 *   "message": "I'm interested in AI consulting services"
 * }
 */
export async function POST(request: NextRequest) {
  // Authenticate request
  const authResponse = authenticateRequest(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "Missing required fields. Required: name, email, message",
          details: {
            name: body.name ? "provided" : "missing",
            email: body.email ? "provided" : "missing",
            message: body.message ? "provided" : "missing",
          },
        },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit();
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate Limit Exceeded",
          message: rateLimitResult.error || "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Convert JSON body to FormData format (required by submitContactForm)
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("email", body.email);
    formData.append("company", body.company || "");
    formData.append("phone", body.phone || "");
    formData.append("subject", body.subject || "AI Consultation Request");
    formData.append("message", body.message);

    // Validate form data using Zod schema
    const validationResult = validateContactForm(formData);

    if (!validationResult.success) {
      const errorMessages = validationResult.errors.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );

      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: "Invalid input data",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    // Submit the consultation request
    const result = await submitContactForm(null, formData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Submission Failed",
          message: result.error || "Failed to submit consultation request",
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: result.message || "Consultation request submitted successfully",
        data: {
          submittedAt: new Date().toISOString(),
          name: validationResult.data.name,
          email: validationResult.data.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API v1/consultations] Error:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Request",
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "Failed to process consultation request. Please try again later.",
      },
      { status: 500 }
    );
  }
}

