"use server";

import { submitContactForm } from "./actions";

/**
 * Helper function to submit consultation form data from the AI chatbot.
 * This wraps the existing submitContactForm to convert object data to FormData.
 * 
 * All fields are passed to the secure server action which:
 * - Validates data with Zod schema
 * - Applies rate limiting
 * - Saves to NeonDB with parameterized queries (SQL injection protection)
 */
export async function submitConsultationRequest(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}) {
  console.log('[Consultation Wrapper] Processing consultation request:', {
    name: data.name,
    email: data.email,
    hasCompany: !!data.company,
    hasPhone: !!data.phone,
    messageLength: data.message.length
  });

  // Convert object data to FormData format expected by submitContactForm
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("company", data.company || "");
  formData.append("phone", data.phone || ""); // Now properly passed from form
  formData.append("subject", "AI Consultation Request"); // Auto-populated subject
  formData.append("message", data.message);

  console.log('[Consultation Wrapper] Calling submitContactForm with FormData');

  // Call the existing server action which will:
  // 1. Check rate limits
  // 2. Validate with Zod schema
  // 3. Insert into NeonDB contact_submissions table
  const result = await submitContactForm(null, formData);

  console.log('[Consultation Wrapper] Server action result:', {
    success: result.success,
    hasMessage: !!result.message,
    hasError: !!result.error
  });

  return result;
}

