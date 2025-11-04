"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { submitConsultationRequest } from "@/app/contact/submit-consultation";
import { ConsultationForm } from "@/components/ai/consultation-form";
import { ServicesSummaryCard } from "@/components/ai/services-summary-card";
import { StatusCard } from "@/components/ai/status-card";
import { toast } from "sonner";

/**
 * Global AI Tools Component
 * 
 * This component registers CopilotKit actions that are available on ALL pages
 * of the application. Import this in the root layout to make tools globally accessible.
 * 
 * Available Tools:
 * 1. scheduleConsultation - HITL form for booking consultations
 * 2. showCoreServices - Display services summary card
 * 3. getSystemStatus - Fetch and display system health status
 */
export function GlobalAITools() {
  // Tool 1: HITL Form - Schedule a consultation (AVAILABLE GLOBALLY)
  useCopilotAction({
    name: "scheduleConsultation",
    description:
      "Schedules a consultation call with the user. Use this if they ask to book a meeting, schedule time, talk to someone, or request a consultation. This tool is available on ALL pages.",
    parameters: [],
    available: "enabled",
    // renderAndWaitForResponse replaces both render and handler for HITL patterns
    // IMPORTANT: Must ALWAYS return a ReactElement, never null
    renderAndWaitForResponse: ({ status, respond }) => {
      // Show completion message when status is "complete"
      if (status === "complete") {
        return (
          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <p className="text-sm text-green-700">✅ Consultation request submitted successfully!</p>
          </div>
        );
      }

      // Show the form when status is "inProgress" or "executing"
      return (
        <ConsultationForm
          onSubmit={async (formData) => {
            console.log('[Global AI Tools] Form submitted with data:', {
              name: formData.name,
              email: formData.email,
              hasCompany: !!formData.company,
              hasPhone: !!formData.phone,
              messageLength: formData.message?.length || 0
            });

            try {
              // Call the existing, secure Server Action with the data
              // This will validate, rate-limit, and save to NeonDB
              const result = await submitConsultationRequest({
                name: formData.name,
                email: formData.email,
                company: formData.company,
                phone: formData.phone,
                message: formData.message,
              });

              console.log('[Global AI Tools] Server action result:', result);

              // Inform the user of the result
              if (result.success) {
                toast.success(result.message || "Consultation request submitted successfully!");
                // Respond to CopilotKit with success message for the AI
                respond?.({
                  success: true,
                  message: "✅ Thanks! Your consultation request has been submitted. We'll be in touch soon via email."
                });
              } else {
                toast.error(result.error || "Failed to submit consultation request");
                // Respond to CopilotKit with error message for the AI
                respond?.({
                  success: false,
                  message: `❌ Sorry, there was an error: ${result.error}. Please try our contact page at /contact.`
                });
              }
            } catch (error) {
              console.error("Error submitting consultation:", error);
              const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
              toast.error(`Failed to schedule consultation: ${errorMessage}`);
              // Respond to CopilotKit with error message for the AI
              respond?.({
                success: false,
                message: `❌ Sorry, there was an unexpected error: ${errorMessage}. Please try contacting us directly through our contact page.`
              });
            }
          }}
          onCancel={() => {
            // User cancelled the form
            respond?.({
              success: false,
              message: "Consultation request was cancelled. Feel free to ask if you'd like to try again or visit our contact page at /contact."
            });
          }}
        />
      );
    },
  });

  // Tool 2: Render Component - Show services summary (AVAILABLE GLOBALLY)
  useCopilotAction({
    name: "showCoreServices",
    description:
      "Displays a summary of the company's core AI consulting services. Use this when the user asks what we do, what our services are, or for a summary. This tool is available on ALL pages.",
    parameters: [],
    // The render function is called automatically by CopilotKit
    render: ({ status }) => {
      if (status === "executing" || status === "complete") {
        return <ServicesSummaryCard />;
      }
      return null;
    },
    handler: async () => {
      // Return a message that the LLM will use in its response
      return "I've displayed our core AI consulting services above. We specialize in Agentic Architecture, Generative UI Solutions, and RAG & Data Integration. Would you like to know more about any specific service or schedule a consultation?";
    },
  });

  // Tool 3: Fetch and Render - Get system status (AVAILABLE GLOBALLY)
  useCopilotAction({
    name: "getSystemStatus",
    description: "Fetches and displays the current system status including database and AI endpoint health. Use this when the user asks about system status, uptime, or service health. This tool is available on ALL pages.",
    parameters: [],
    // The render function is called automatically by CopilotKit with status and result
    render: ({ status, result }) => {
      if (status === "executing") {
        // Show loading state while fetching
        return (
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">🔄 Checking system status...</p>
          </div>
        );
      }
      
      if (status === "complete" && result) {
        // Show the status card with fetched data
        return <StatusCard {...result} />;
      }
      
      return null;
    },
    handler: async () => {
      try {
        // Fetch data from the API
        const response = await fetch("/api/status");
        if (!response.ok) {
          throw new Error("Failed to fetch system status");
        }
        const data = (await response.json()) as { 
          status: string; 
          database: string; 
          ai_endpoint: string 
        };

        // Return the data - it will be passed to render() as 'result'
        return data;
      } catch (error) {
        console.error("Error fetching system status:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to fetch system status: ${errorMessage}`);
        throw error; // Re-throw so CopilotKit knows it failed
      }
    },
  });

  return null; // This component renders no UI
}

