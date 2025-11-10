// components/ai/stripe-payment-form.tsx
// Stripe payment form component for Generative UI
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Load Stripe publishable key
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface CheckoutFormProps {
  clientSecret: string;
}

/**
 * Checkout form component that handles payment submission
 */
function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded. Please refresh the page.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
      });

      if (error) {
        console.error("Payment failed:", error);
        toast.error(error.message || "Payment failed. Please try again.");
      } else {
        toast.success("Payment successful! Thank you for your purchase.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border p-4">
        <PaymentElement />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
}

/**
 * Stripe payment form component
 * Wraps the checkout form in Stripe Elements provider
 */
export function StripePaymentForm({ clientSecret }: { clientSecret: string }) {
  if (!stripePromise) {
    return (
      <div className="rounded-lg border p-4 text-center text-muted-foreground">
        Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="rounded-lg border p-4 text-center text-muted-foreground">
        No payment intent found. Please try again.
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
}

