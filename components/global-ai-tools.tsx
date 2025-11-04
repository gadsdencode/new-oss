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
          return "✅ Thanks! Your consultation request has been submitted. We'll be in touch soon via email.";
        } else {
          toast.error(result.error || "Failed to submit consultation request");
          return `❌ Sorry, there was an error: ${result.error}. Please try our contact page at /contact.`;
        }
      } catch (error) {
        console.error("Error in scheduleConsultation handler:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Failed to schedule consultation: ${errorMessage}`);
        return `❌ Sorry, there was an unexpected error: ${errorMessage}. Please try contacting us directly through our contact page.`;
      }
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

