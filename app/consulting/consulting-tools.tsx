"use client";

/**
 * ⚠️ DEPRECATED: This file is no longer used
 *
 * All AI tools have been moved to components/global-ai-tools.tsx
 * to make them available on ALL pages, not just /consulting.
 *
 * This file is kept for reference only.
 *
 * IMPORTANT: This file shows the CORRECTED render pattern.
 * The render property should be defined as a function that CopilotKit calls,
 * NOT called manually inside the handler.
 *
 * See: components/global-ai-tools.tsx for the current implementation
 * See: GLOBAL_AI_TOOLS_SETUP.md for documentation
 * See: GENERATIVE_UI_FIX_RENDER_PATTERN.md for the fix details
 */

import { useCopilotAction } from "@copilotkit/react-core";
import { submitConsultationRequest } from "@/app/contact/submit-consultation";
import { ConsultationForm } from "@/components/ai/consultation-form";
import { ServicesSummaryCard } from "@/components/ai/services-summary-card";
import { StatusCard } from "@/components/ai/status-card";
import { toast } from "sonner";

/**
 * @deprecated Use GlobalAITools from components/global-ai-tools.tsx instead
 */
export function ConsultingPageTools() {
  // Tool 1: HITL Form - Schedule a consultation
  useCopilotAction({
    name: "scheduleConsultation",
    description:
      "Schedules a consultation call with the user. Use this if they ask to book a meeting, schedule time, or talk to someone.",
    parameters: [],
    render: ({ status, args }) => {
      if (status === "executing" || status === "complete") {
        return <ConsultationForm />;
      }
      return null;
    },
    handler: async (args, { renderAndWaitForResponse }) => {
      try {
        // 1. Render the form and wait for the user to fill it out
        const formData = await renderAndWaitForResponse(ConsultationForm);

        // 2. Call the existing, secure Server Action with the data
        const result = await submitConsultationRequest({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        });

        // 3. Inform the user of the result
        if (result.success) {
          toast.success(result.message || "Consultation request submitted successfully!");
          return "Thanks! Your consultation request is submitted. We'll be in touch soon.";
        } else {
          toast.error(result.error || "Failed to submit consultation request");
          return `Sorry, there was an error: ${result.error}`;
        }
      } catch (error) {
        console.error("Error in scheduleConsultation handler:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Failed to schedule consultation: ${errorMessage}`);
        return `Sorry, there was an unexpected error: ${errorMessage}. Please try contacting us directly through our contact page.`;
      }
    },
  });

  // Tool 2: Render Component - Show services summary
  // ✅ CORRECT PATTERN: render is a property, not called in handler
  useCopilotAction({
    name: "showCoreServices",
    description:
      "Displays a summary of the company's core AI consulting services. Use this when the user asks what we do, what our services are, or for a summary.",
    parameters: [],
    render: ({ status }) => {
      if (status === "executing" || status === "complete") {
        return <ServicesSummaryCard />;
      }
      return null;
    },
    handler: async () => {
      return "I've displayed our core services above. Would you like to know more about any specific service?";
    },
  });

  // Tool 3: Fetch and Render - Get system status
  // ✅ CORRECT PATTERN: render checks status and uses result
  useCopilotAction({
    name: "getSystemStatus",
    description: "Fetches and displays the current system status.",
    parameters: [],
    render: ({ status, result }) => {
      if (status === "executing") {
        return (
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">🔄 Checking system status...</p>
          </div>
        );
      }
      if (status === "complete" && result) {
        return <StatusCard {...result} />;
      }
      return null;
    },
    handler: async () => {
      const response = await fetch("/api/status");
      const data = (await response.json()) as { status: string; database: string; ai_endpoint: string };
      return data; // This becomes 'result' in render()
    },
  });

  return null; // This component renders no UI
}

