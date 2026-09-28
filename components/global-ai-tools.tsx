"use client";

import { VisitPlannerTool } from "./ai/visit-planner";
import { useRef } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { submitConsultationRequest } from "@/app/contact/submit-consultation";
import { ConsultationForm } from "@/components/ai/consultation-form";
import { ServicesSummaryCard } from "@/components/ai/services-summary-card";
import { toast } from "sonner";
import { ASSISTANT_CONTACT_PATH } from "@/lib/assistant/constants";
import {
  consultationCompleteIsSuccess,
  outcomeFromSubmitResult,
  type ConsultationOutcome,
} from "@/lib/assistant/consultation-outcome";

/**
 * Global assistant tools available on every page.
 * System-health checking is not registered: there is no live visitor status implementation.
 */
export function GlobalAITools() {
  const consultationOutcome = useRef<ConsultationOutcome>("idle");

  useCopilotAction({
    name: "scheduleConsultation",
    description:
      "Shows a form to request a consultation. Use this if they ask to talk to someone, request a consultation, or reach the team. Submitting the form sends a request only; it does not book a calendar meeting. Available on all pages.",
    parameters: [],
    available: "enabled",
    renderAndWaitForResponse: ({ status, respond }) => {
      if (status === "complete") {
        if (consultationCompleteIsSuccess(consultationOutcome.current)) {
          return (
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <p className="text-sm text-green-700">
                Consultation request submitted. We will follow up — this does not schedule a meeting.
              </p>
            </div>
          );
        }
        if (consultationOutcome.current === "cancelled") {
          return (
            <div className="p-4 border rounded-lg bg-muted/40">
              <p className="text-sm">Consultation request was cancelled. You can try again or use the contact page.</p>
            </div>
          );
        }
        return (
          <div className="p-4 border rounded-lg bg-muted/40">
            <p className="text-sm">
              The consultation request was not submitted. Please try again or visit {ASSISTANT_CONTACT_PATH}.
            </p>
          </div>
        );
      }

      consultationOutcome.current = "idle";

      return (
        <ConsultationForm
          onSubmit={async (formData) => {
            try {
              const result = await submitConsultationRequest({
                name: formData.name,
                email: formData.email,
                company: formData.company,
                phone: formData.phone,
                message: formData.message,
              });

              consultationOutcome.current = outcomeFromSubmitResult(result, false);

              if (result.success) {
                toast.success(result.message || "Consultation request submitted.");
                respond?.({
                  success: true,
                  message:
                    "The consultation request was submitted. The team will follow up by email. This does not schedule a meeting.",
                });
              } else {
                toast.error(result.error || "Failed to submit consultation request");
                respond?.({
                  success: false,
                  message: `The request was not submitted: ${result.error || "please try again"}. You can use ${ASSISTANT_CONTACT_PATH}.`,
                });
              }
            } catch {
              consultationOutcome.current = "error";
              toast.error("Failed to submit the consultation request. Please try the contact page.");
              respond?.({
                success: false,
                message: `The request was not submitted. Please try ${ASSISTANT_CONTACT_PATH}.`,
              });
            }
          }}
          onCancel={() => {
            consultationOutcome.current = "cancelled";
            respond?.({
              success: false,
              message: `The consultation request was cancelled. You can try again or visit ${ASSISTANT_CONTACT_PATH}.`,
            });
          }}
        />
      );
    },
  });

  useCopilotAction({
    name: "showCoreServices",
    description:
      "Displays a summary of Overture's core AI consulting services from the published consulting offering. Use this when the user asks what we do or what our services are. Available on all pages.",
    parameters: [],
    render: ({ status }) => {
      if (status === "executing" || status === "complete") {
        return <ServicesSummaryCard />;
      }
      return <></>;
    },
    handler: async () => {
      return "Displayed Overture's published consulting services. Details are on /consulting. Offer /contact if they want to request a consultation.";
    },
  });

  return <VisitPlannerTool />;
}
