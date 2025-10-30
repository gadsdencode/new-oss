"use client";

import { useState } from "react";
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

interface FormError {
  type: "error" | "warning";
  title: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    // Client-side validation
    if (!formData.name.trim()) {
      setError({
        type: "warning",
        title: "Validation Error",
        message: "Please enter your full name.",
      });
      return false;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError({
        type: "warning",
        title: "Validation Error",
        message: "Please enter a valid email address.",
      });
      return false;
    }

    if (!formData.subject.trim()) {
      setError({
        type: "warning",
        title: "Validation Error",
        message: "Please enter a subject.",
      });
      return false;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setError({
        type: "warning",
        title: "Validation Error",
        message: "Please enter a message with at least 10 characters.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission (replace with actual API call)
      // Example API call:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demonstration
          // Remove this and use actual API call in production
          const simulateError = Math.random() < 0.1; // 10% chance of error
          if (simulateError) {
            reject(new Error("Network error: Unable to send message"));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      // If we get here, submission was successful
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          subject: "",
          message: "",
        });
        setIsSubmitted(false);
      }, 5000);

    } catch (err) {
      // Handle submission errors
      console.error("Form submission error:", err);
      
      let errorMessage = "Unable to send your message. Please try again later.";
      
      if (err instanceof Error) {
        // Check for specific error types
        if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message || errorMessage;
        }
      }

      setError({
        type: "error",
        title: "Submission Failed",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
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
                  value={formData.company}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
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
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={isSubmitting}
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
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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

