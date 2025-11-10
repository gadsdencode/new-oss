// app/api/payment-intent/route.ts
// API endpoint for creating Stripe payment intents
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { handleApiError, createErrorResponse } from "@/lib/errors";

// Initialize Stripe client
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    })
  : null;

/**
 * POST handler for creating payment intents
 * Accepts amount (in cents) and currency, returns client_secret
 */
export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
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
      return createErrorResponse(
        "Validation Error",
        "Amount must be a positive number in cents",
        400
      );
    }

    // Validate currency
    if (typeof currency !== "string" || currency.length !== 3) {
      return createErrorResponse(
        "Validation Error",
        "Currency must be a valid 3-letter currency code (e.g., 'usd')",
        400
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return handleApiError(error);
  }
}

