// app/api/stripe-webhook/route.ts
// Stripe webhook endpoint for handling payment events
// Securely verifies webhook signatures and updates database on successful payments

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { handleApiError, createErrorResponse } from "@/lib/errors";
import { logError, logMessage, ErrorContext } from "@/lib/monitoring";

// Force Node.js runtime - Stripe SDK requires Node.js modules
export const runtime = "nodejs";

// Disable body parsing - we need raw body for signature verification
// Next.js App Router automatically parses JSON, but we need the raw text
export const dynamic = "force-dynamic";

// Initialize Stripe client
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

// Get webhook secret from environment
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Get database connection
 */
function getDatabase() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.NEWOSS_DATABASE_URL ||
    process.env.NEWOSS_POSTGRES_URL ||
    process.env.NEWOSS_POSTGRES_PRISMA_URL ||
    process.env.NEWOSS_POSTGRES_URL_NON_POOLING ||
    process.env.NEWOSS_DATABASE_URL_UNPOOLED;

  if (!databaseUrl) {
    throw new Error("Database URL not configured");
  }

  return neon(databaseUrl);
}

/**
 * Handle payment_intent.succeeded event
 * This event is fired when a payment intent is successfully completed
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  context: ErrorContext
): Promise<void> {
  const sql = getDatabase();

  logMessage(
    "Processing payment_intent.succeeded event",
    {
      ...context,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    },
    "info"
  );

  // Extract customer information
  const customerEmail =
    paymentIntent.customer && typeof paymentIntent.customer === "string"
      ? null // We'll need to fetch the customer to get email
      : paymentIntent.customer && typeof paymentIntent.customer === "object"
      ? paymentIntent.customer.email || null
      : null;

  const customerId =
    typeof paymentIntent.customer === "string"
      ? paymentIntent.customer
      : paymentIntent.customer?.id || null;

  // Fetch customer details if we have a customer ID
  let customerEmailFinal = customerEmail;
  let customerName: string | null = null;

  if (customerId && stripe) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && "email" in customer) {
        customerEmailFinal = customer.email || null;
        customerName =
          customer.name ||
          (customer.metadata?.name || null) ||
          null;
      }
    } catch (error) {
      logMessage(
        "Failed to fetch customer details",
        { ...context, customerId, error: String(error) },
        "warn"
      );
    }
  }

  // Check if payment already exists (idempotency)
  const existingPayment = await sql`
    SELECT id FROM payments 
    WHERE stripe_payment_intent_id = ${paymentIntent.id}
  `;

  if (existingPayment.length > 0) {
    logMessage(
      "Payment already processed (idempotency check)",
      {
        ...context,
        paymentIntentId: paymentIntent.id,
        existingPaymentId: existingPayment[0].id,
      },
      "info"
    );
    return;
  }

  // Insert payment record
  await sql`
    INSERT INTO payments (
      stripe_payment_intent_id,
      stripe_customer_id,
      amount,
      currency,
      status,
      customer_email,
      customer_name,
      metadata
    ) VALUES (
      ${paymentIntent.id},
      ${customerId},
      ${paymentIntent.amount},
      ${paymentIntent.currency},
      ${paymentIntent.status},
      ${customerEmailFinal},
      ${customerName},
      ${JSON.stringify(paymentIntent.metadata || {})}
    )
  `;

  logMessage(
    "Payment record created successfully",
    {
      ...context,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    },
    "info"
  );

  // TODO: Add business logic here to provision user access
  // Example: UPDATE users SET plan = 'premium' WHERE email = ${customerEmailFinal}
  // This depends on your user management system
}

/**
 * Handle checkout.session.completed event
 * This event is fired when a checkout session is successfully completed
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  context: ErrorContext
): Promise<void> {
  const sql = getDatabase();

  logMessage(
    "Processing checkout.session.completed event",
    {
      ...context,
      sessionId: session.id,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
    },
    "info"
  );

  // Extract payment intent ID from session
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  if (!paymentIntentId) {
    logMessage(
      "No payment intent ID found in checkout session",
      { ...context, sessionId: session.id },
      "warn"
    );
    return;
  }

  // Check if payment already exists (idempotency)
  const existingPayment = await sql`
    SELECT id FROM payments 
    WHERE stripe_payment_intent_id = ${paymentIntentId}
  `;

  if (existingPayment.length > 0) {
    logMessage(
      "Payment already processed (idempotency check)",
      {
        ...context,
        paymentIntentId,
        existingPaymentId: existingPayment[0].id,
      },
      "info"
    );
    return;
  }

  // Extract customer information
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null;

  const customerEmail = session.customer_email || null;
  const customerName = session.customer_details?.name || null;

  // Insert payment record
  await sql`
    INSERT INTO payments (
      stripe_payment_intent_id,
      stripe_checkout_session_id,
      stripe_customer_id,
      amount,
      currency,
      status,
      customer_email,
      customer_name,
      metadata
    ) VALUES (
      ${paymentIntentId},
      ${session.id},
      ${customerId},
      ${session.amount_total || 0},
      ${session.currency || "usd"},
      ${session.payment_status || "paid"},
      ${customerEmail},
      ${customerName},
      ${JSON.stringify(session.metadata || {})}
    )
  `;

  logMessage(
    "Payment record created successfully from checkout session",
    {
      ...context,
      paymentIntentId,
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
    },
    "info"
  );

  // TODO: Add business logic here to provision user access
  // Example: UPDATE users SET plan = 'premium' WHERE email = ${customerEmail}
  // This depends on your user management system
}

/**
 * POST handler for Stripe webhooks
 * Verifies webhook signature and processes events
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const context: ErrorContext = {
    endpoint: "/api/stripe-webhook",
    method: "POST",
    requestId,
    source: "stripe-webhook-route",
  };

  try {
    // Validate Stripe configuration
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

    // Validate webhook secret
    if (!webhookSecret) {
      logMessage(
        "Webhook secret not configured - missing STRIPE_WEBHOOK_SECRET",
        { ...context, errorCode: "WEBHOOK_SECRET_NOT_CONFIGURED" },
        "error"
      );
      return createErrorResponse(
        "Service Unavailable",
        "Webhook secret is not configured. Please set STRIPE_WEBHOOK_SECRET environment variable.",
        503
      );
    }

    // Get raw body for signature verification
    // Next.js App Router requires special handling for webhook endpoints
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      logMessage(
        "Missing Stripe signature header",
        { ...context, errorCode: "MISSING_SIGNATURE" },
        "warn"
      );
      return createErrorResponse(
        "Bad Request",
        "Missing stripe-signature header",
        400
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      logError(
        error,
        {
          ...context,
          errorCode: "WEBHOOK_SIGNATURE_VERIFICATION_FAILED",
        },
        "high"
      );
      return createErrorResponse(
        "Unauthorized",
        "Webhook signature verification failed",
        401
      );
    }

    logMessage(
      `Received Stripe webhook event: ${event.type}`,
      {
        ...context,
        eventType: event.type,
        eventId: event.id,
      },
      "info"
    );

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
          { ...context, eventId: event.id }
        );
        break;

      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          { ...context, eventId: event.id }
        );
        break;

      default:
        logMessage(
          `Unhandled event type: ${event.type}`,
          {
            ...context,
            eventType: event.type,
            eventId: event.id,
          },
          "info"
        );
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    logError(
      error,
      {
        ...context,
        errorCode: "WEBHOOK_PROCESSING_FAILED",
      },
      "high"
    );

    return handleApiError(error, context, "high");
  }
}

