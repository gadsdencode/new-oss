"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { StripePaymentForm } from "@/components/ai/stripe-payment-form";
import { Spinner } from "@/components/ui/spinner";
import { ESTIMATE_ASSUMPTIONS } from "@/lib/assistant/estimator-assumptions";
import { ASSISTANT_CONTACT_PATH } from "@/lib/assistant/constants";

/**
 * AI page tools. Ranking, comparison, and catalog-detail actions are not
 * registered: the on-page catalog is undated and unverified.
 */
export function AIPageTools() {
  useCopilotAction({
    name: "explainModelCatalogLimits",
    description:
      "Explains that the website model catalog, comparisons, prices, and benchmarks are educational and undated — not current official rankings or quotes. Use when the visitor asks which model is best, for comparisons, prices, or scores. Direct them to official provider pricing pages and /contact for an engagement.",
    parameters: [],
    available: "enabled",
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <CardTitle className="text-lg">Checking catalog limits</CardTitle>
              </div>
            </CardHeader>
          </Card>
        );
      }

      if (status === "complete" && result) {
        return (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircleIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Model catalog is not current advice</CardTitle>
              </div>
              <CardDescription>Assumptions dated {ESTIMATE_ASSUMPTIONS.asOf}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{result.catalogNote}</p>
              <p>{result.summary}</p>
              <p>
                Official pricing:{" "}
                {ESTIMATE_ASSUMPTIONS.officialPricingLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="underline underline-offset-2 mr-2">
                    {link.name}
                  </Link>
                ))}
              </p>
              <p>
                For a scoped recommendation,{" "}
                <Link href={ASSISTANT_CONTACT_PATH} className="underline underline-offset-2">
                  request a consultation
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        );
      }

      return <></>;
    },
    handler: async () => ({
      canRank: false,
      ...ESTIMATE_ASSUMPTIONS,
    }),
  });

  return null;
}

/**
 * Payment tool definition for AI
 * Allows the AI to initiate payments within the chat UI
 */
export function usePaymentTools() {
  useCopilotAction({
    name: "initiatePayment",
    description:
      "Call this function to initiate a payment. Ask the user for the amount and product name first, then call the createPaymentIntent action with the details.",
    parameters: [
      {
        name: "amount",
        type: "number",
        description: "The payment amount in cents (e.g., 1000 for $10.00)",
        required: true,
      },
      {
        name: "currency",
        type: "string",
        description: "The currency code (e.g., 'usd', 'eur')",
        required: true,
      },
    ],
    render: ({ status, result }) => {
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

      return <></>;
    },
    handler: async ({ amount, currency }) => {
      try {
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
