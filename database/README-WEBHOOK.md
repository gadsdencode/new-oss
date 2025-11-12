# Stripe Webhook Setup Guide

This guide explains how to set up Stripe webhooks to handle payment events and update your database.

## Overview

The webhook endpoint (`/api/stripe-webhook`) securely receives events from Stripe when payments are completed. This solves the "Webhook Blindspot" problem where payments succeed on Stripe but your application never knows about them.

## Database Setup

### 1. Create the Payments Table

Run the payments schema migration in your Neon database:

```sql
-- Run this in your Neon SQL Editor or via your database client
-- File: database/payments-schema.sql
```

Or manually execute the SQL from `database/payments-schema.sql` in your database.

### 2. Verify the Schema

The `payments` table stores:
- `stripe_payment_intent_id`: Unique identifier from Stripe
- `stripe_customer_id`: Customer ID (if available)
- `amount`: Payment amount in cents
- `currency`: Payment currency (e.g., 'usd')
- `status`: Payment status
- `customer_email`: Customer email address
- `customer_name`: Customer name (if available)
- `metadata`: Additional metadata as JSON
- `created_at` / `updated_at`: Timestamps

## Environment Variables

Add the following environment variable to your `.env.local` and Vercel project settings:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: This is different from your `STRIPE_SECRET_KEY`. You'll get this from the Stripe Dashboard when you create a webhook endpoint.

## Stripe Dashboard Configuration

### 1. Create a Webhook Endpoint

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - **Local development**: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) (see below)
   - **Production**: `https://yourdomain.com/api/stripe-webhook`
4. Select events to listen for:
   - `payment_intent.succeeded` (required)
   - `checkout.session.completed` (optional, if using Checkout Sessions)
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`) and add it to your environment variables

### 2. Local Development with Stripe CLI

For local development, use the Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI (if not already installed)
# macOS: brew install stripe/stripe-cli/stripe
# Windows: scoop install stripe
# Linux: See https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe-webhook

# The CLI will display a webhook signing secret
# Copy it and add to your .env.local:
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Testing

### Test the Webhook Endpoint

1. **Using Stripe CLI** (recommended for local testing):
   ```bash
   stripe trigger payment_intent.succeeded
   ```

2. **Using Stripe Dashboard**:
   - Go to your webhook endpoint in Stripe Dashboard
   - Click **"Send test webhook"**
   - Select `payment_intent.succeeded`
   - Click **"Send test webhook"**

3. **Verify in Database**:
   ```sql
   SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;
   ```

### Test a Real Payment

1. Make a test payment using your payment form
2. Check the database:
   ```sql
   SELECT * FROM payments WHERE stripe_payment_intent_id = 'pi_xxxxxxxxxxxxx';
   ```
3. Check your application logs for webhook processing messages

## Security

The webhook endpoint includes several security measures:

1. **Signature Verification**: All webhooks are verified using Stripe's signature verification
2. **Idempotency**: Duplicate events are handled gracefully (prevents double-processing)
3. **Error Handling**: Comprehensive error logging and monitoring
4. **Database Validation**: Prevents duplicate payment records

## Event Handling

The webhook currently handles:

- **`payment_intent.succeeded`**: Fired when a payment intent is successfully completed
- **`checkout.session.completed`**: Fired when a checkout session is completed (if using Checkout Sessions)

### Adding Business Logic

After a successful payment is recorded, you can add business logic to provision user access. In `app/api/stripe-webhook/route.ts`, look for the `TODO` comments:

```typescript
// TODO: Add business logic here to provision user access
// Example: UPDATE users SET plan = 'premium' WHERE email = ${customerEmail}
```

Example implementation:

```typescript
// After inserting payment record
if (customerEmailFinal) {
  await sql`
    UPDATE users 
    SET plan = 'premium', 
        updated_at = CURRENT_TIMESTAMP 
    WHERE email = ${customerEmailFinal}
  `;
  
  logMessage(
    "User access provisioned",
    { ...context, customerEmail: customerEmailFinal },
    "info"
  );
}
```

## Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook URL**: Ensure it's correctly configured in Stripe Dashboard
2. **Check environment variable**: Verify `STRIPE_WEBHOOK_SECRET` is set
3. **Check logs**: Look for webhook processing messages in your application logs
4. **Test with Stripe CLI**: Use `stripe listen` to see if events are being sent

### Signature Verification Fails

1. **Verify webhook secret**: Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe Dashboard
2. **Check raw body**: The endpoint must receive the raw request body (handled automatically in Next.js)
3. **Check Stripe signature header**: Ensure the `stripe-signature` header is present

### Payment Not Appearing in Database

1. **Check webhook logs**: Look for error messages in application logs
2. **Verify database connection**: Ensure `DATABASE_URL` is configured
3. **Check idempotency**: Payment might already exist (check for duplicate `stripe_payment_intent_id`)
4. **Verify event type**: Ensure you're listening for the correct event types

## Next Steps

1. ✅ Run the database migration (`database/payments-schema.sql`)
2. ✅ Set `STRIPE_WEBHOOK_SECRET` environment variable
3. ✅ Configure webhook endpoint in Stripe Dashboard
4. ✅ Test webhook with Stripe CLI or test webhook
5. ⭕ Add business logic to provision user access (see TODO comments in code)
6. ⭕ Set up monitoring/alerts for failed webhook processing

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

