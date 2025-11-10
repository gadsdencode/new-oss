// app/ai/AIPageTools.tsx
// Define AI tools with Generative UI for CopilotKit
"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { z } from "zod";
import { StripePaymentForm } from "@/components/ai/stripe-payment-form";
import { Spinner } from "@/components/ui/spinner";

/**
 * Payment tool definition for AI
 * Allows the AI to initiate payments within the chat UI
 */
export function usePaymentTools() {
  useCopilotAction({
    name: "initiatePayment",
    description:
      "Call this function to initiate a payment. Ask the user for the amount and product name first, then call the createPaymentIntent action with the details.",
    parameters: z.object({
      amount: z
        .number()
        .int()
        .positive()
        .describe("The payment amount in cents (e.g., 1000 for $10.00)"),
      currency: z
        .string()
        .length(3)
        .describe("The currency code (e.g., 'usd', 'eur')"),
    }),
    render: async ({ status, result }) => {
      if (status === "executing") {
        return (
          <div className="flex items-center justify-center p-4 rounded-lg border">
            <Spinner className="mr-2" />
            <span className="text-sm text-muted-foreground">
              Creating payment intent...
            </span>
          </div>
        );
      }

      if (status === "complete" && result?.clientSecret) {
        return (
          <div className="w-full">
            <StripePaymentForm clientSecret={result.clientSecret} />
          </div>
        );
      }

      if (status === "error") {
        return (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            Failed to create payment intent. Please try again.
          </div>
        );
      }

      return null;
    },
    handler: async ({ amount, currency }) => {
      try {
        // Call the backend API to create payment intent
        const response = await fetch("/api/payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create payment intent");
        }

        const data = await response.json();
        return {
          clientSecret: data.clientSecret,
        };
      } catch (error) {
        console.error("Error creating payment intent:", error);
        throw error;
      }
    },
  });
}

