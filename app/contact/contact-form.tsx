"use client";

import { useActionState, useState } from "react";
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
} from "lucide-react";
import { submitContactForm } from "./actions";
import {
  buildPrefillMessage,
  getCoeIntentCopy,
  serializeCoeContextForSubmit,
  type ResolvedCoeIntentId,
} from "@/lib/contact/coe-intent";
import { readSnapshotHandoff } from "@/lib/coe/snapshot-handoff";

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

interface ContactFormProps {
  /** Resolved intent from ?intent= (already normalized by the page). */
  intentId?: ResolvedCoeIntentId;
}

function readHandoffSafe() {
  if (typeof window === "undefined") return null;
  return readSnapshotHandoff();
}

export function ContactForm({ intentId = "general" }: ContactFormProps) {
  const intentCopy = getCoeIntentCopy(intentId === "general" ? null : intentId);
  const fromCoe = intentId !== "general";

  const initialState: FormState = { success: false };
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitContactForm,
    initialState
  );

  // Prefill once on mount. Parent remounts with key={intentId} when intent changes.
  const [subject, setSubject] = useState(() => intentCopy.subject);
  const [message, setMessage] = useState(() =>
    buildPrefillMessage(intentId, readHandoffSafe())
  );
  const [coeContext] = useState(() => serializeCoeContextForSubmit(readHandoffSafe()));
  const [dismissedError, setDismissedError] = useState(false);

  const error: FormError | null =
    !dismissedError && state.error
      ? { type: "error", title: "Submission Failed", message: state.error }
      : null;

  const isSubmitted = state.success;

  return (
    <Card className="border-2" id="contact-form">
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <div className="flex items-start gap-2">
              <XCircleIcon className="h-5 w-5 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <AlertTitle className="font-semibold">{error.title}</AlertTitle>
                <AlertDescription className="mt-1">{error.message}</AlertDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDismissedError(true)}
              className="mt-4 w-full"
              type="button"
            >
              Try Again
            </Button>
          </Alert>
        )}

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Message received</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Thank you for contacting us. We&apos;ve received your inquiry and will follow up — this
              confirmation does not schedule a meeting.
            </p>
          </div>
        ) : (
          <form
            action={formAction}
            className="space-y-6"
            onSubmit={() => setDismissedError(false)}
          >
            {/* Honeypot — visually hidden; must remain empty */}
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            {fromCoe && (
              <>
                <input type="hidden" name="intent" value={intentCopy.normalizedIntent} />
                <input type="hidden" name="source" value="ai-coe" />
                {coeContext ? <input type="hidden" name="coe_context" value={coeContext} /> : null}
              </>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jordan Martens"
                  required
                  disabled={isPending}
                  autoComplete="name"
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
                  placeholder="you@company.com"
                  required
                  disabled={isPending}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Your organization"
                  disabled={isPending}
                  autoComplete="organization"
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
                  autoComplete="tel"
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
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {fromCoe && (
                <p className="text-xs text-muted-foreground">
                  Prefilled from your AI CoE path — you can edit this before sending.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us more about your needs..."
                rows={8}
                required
                disabled={isPending}
                className="resize-y min-h-[140px]"
                minLength={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {fromCoe && (
                <p className="text-xs text-muted-foreground">
                  Prefilled for a scoping conversation. Editable. Snapshot details are orientation only.
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" aria-hidden="true" />
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
