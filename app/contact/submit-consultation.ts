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
  phone?: string;
  message: string;
}) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("company", data.company || "");
  formData.append("phone", data.phone || "");
  formData.append("subject", "AI Consultation Request");
  formData.append("message", data.message);

  return submitContactForm(null, formData);
}
