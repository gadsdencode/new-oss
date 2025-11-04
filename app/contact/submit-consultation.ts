"use server";

import { submitContactForm } from "./actions";

/**
 * Helper function to submit consultation form data from the AI chatbot.
 * This wraps the existing submitContactForm to convert object data to FormData.
 */
export async function submitConsultationRequest(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) {
  // Convert object data to FormData format expected by submitContactForm
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("company", data.company || "");
  formData.append("phone", ""); // Optional field
  formData.append("subject", "AI Consultation Request");
  formData.append("message", data.message);

  // Call the existing server action
  const result = await submitContactForm(null, formData);
  return result;
}

