// app/api/payment-intent/route.ts
// API endpoint for creating Stripe payment intents
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { handleApiError, createErrorResponse } from "@/lib/errors";
import { logError, logMessage, ErrorContext } from "@/lib/monitoring";

// Force Node.js runtime - Stripe SDK requires Node.js modules (events, http, etc.)
// Edge runtime does not support these Node.js-specific dependencies
export const runtime = "nodejs";

// Initialize Stripe client
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

/**
 * POST handler for creating payment intents
 * Accepts amount (in cents) and currency, returns client_secret
 */
export async function POST(req: NextRequest) {
  // Generate request ID for tracing
  const requestId = crypto.randomUUID();
  const context: ErrorContext = {
    endpoint: "/api/payment-intent",
    method: "POST",
    requestId,
    source: "payment-intent-route",
  };

  try {
    if (!stripe) {
      logMessage(
        "Stripe not configured - missing STRIPE_SECRET_KEY",
        { ...context, errorCode: "STRIPE_NOT_CONFIGURED" },
        "error"
      );
      return createErrorResponse(
        "Service Unavailable",
        "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.",
        503
      );
    }

    const body = await req.json();
    const { amount, currency } = body;

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      logMessage(
        "Invalid payment amount validation",
        { ...context, errorCode: "VALIDATION_ERROR", amount, currency },
        "warn"
      );
      return createErrorResponse(
        "Validation Error",
        "Amount must be a positive number in cents",
        400
      );
    }

    // Validate currency
    if (typeof currency !== "string" || currency.length !== 3) {
      logMessage(
        "Invalid currency validation",
        { ...context, errorCode: "VALIDATION_ERROR", amount, currency },
        "warn"
      );
      return createErrorResponse(
        "Validation Error",
        "Currency must be a valid 3-letter currency code (e.g., 'usd')",
        400
      );
    }

    // Create payment intent
    logMessage(
      "Creating payment intent",
      { ...context, amount, currency },
      "info"
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logMessage(
      "Payment intent created successfully",
      {
        ...context,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
      "info"
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Enhanced error logging with full context
    logError(error, {
      ...context,
      errorCode: "PAYMENT_INTENT_CREATION_FAILED",
    }, "high");
    
    return handleApiError(error, context, "high");
  }
}

