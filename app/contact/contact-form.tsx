"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  SendIcon,
  CheckCircle2,
  Loader2Icon,
  XCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { submitContactForm } from "./actions";

interface FormError {
  type: "error" | "warning";
  title: string;
  message: string;
}

interface FormState {
  success: boolean;
  message?: string;
  error?: string;
}

export function ContactForm() {
  const initialState: FormState = { success: false };
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitContactForm,
    initialState
  );
  const [error, setError] = useState<FormError | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle server action response
  useEffect(() => {
    if (state.success) {
      setIsSubmitted(true);
      setError(null);
      
      // Reset form after 5 seconds
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        // Reset form by clearing it
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          form.reset();
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    } else if (state.error) {
      setError({
        type: "error",
        title: "Submission Failed",
        message: state.error,
      });
      setIsSubmitted(false);
    }
  }, [state]);

  const handleRetry = () => {
    setError(null);
    setIsSubmitted(false);
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        {/* Error Alert */}
        {error && (
          <Alert variant={error.type === "error" ? "destructive" : "default"} className="mb-6">
            <div className="flex items-start gap-2">
              {error.type === "error" ? (
                <XCircleIcon className="h-5 w-5 mt-0.5" />
              ) : (
                <AlertTriangleIcon className="h-5 w-5 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertTitle className="font-semibold">{error.title}</AlertTitle>
                <AlertDescription className="mt-1">{error.message}</AlertDescription>
              </div>
            </div>
            {error.type === "error" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-4 w-full"
              >
                Try Again
              </Button>
            )}
          </Alert>
        )}

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Message Sent!
            </h3>
            <p className="text-muted-foreground text-center">
              Thank you for contacting us. We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Your Company"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="How can we help you?"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us more about your needs..."
                rows={6}
                required
                disabled={isPending}
                className="resize-none"
                minLength={10}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

