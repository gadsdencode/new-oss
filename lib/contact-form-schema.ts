/**
 * Zod schema for contact form validation
 * Provides robust type-safe validation with detailed error messages
 */

import { z } from 'zod';

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation regex (supports international formats)
// More permissive: allows various phone formats including international numbers
const PHONE_REGEX = /^[\+]?[0-9\s\-\(\)\.]{7,20}$/;

/**
 * Contact form schema with comprehensive validation
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters')
    .trim()
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address format')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim()
    .regex(EMAIL_REGEX, 'Invalid email address format'),
  
  company: z
    .string()
    .max(255, 'Company name must not exceed 255 characters')
    .trim()
    .optional()
    .transform((val) => val && val.length > 0 ? val : undefined),
  
  phone: z
    .string()
    .max(50, 'Phone number must not exceed 50 characters')
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || val.length === 0 || PHONE_REGEX.test(val), {
      message: 'Invalid phone number format',
    })
    .transform((val) => val && val.length > 0 ? val : undefined),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(3, 'Subject must be at least 3 characters')
    .max(255, 'Subject must not exceed 255 characters')
    .trim(),
  
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .trim(),
});

/**
 * Type inferred from the schema
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Validate form data from FormData object
 * @param formData - FormData object from the form submission
 * @returns Validated data or validation errors
 */
export function validateContactForm(formData: FormData): {
  success: true;
  data: ContactFormData;
} | {
  success: false;
  errors: z.ZodError;
} {
  // Extract and prepare form data
  const rawData = {
    name: formData.get('name')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim() || '',
    company: formData.get('company')?.toString().trim() || '',
    phone: formData.get('phone')?.toString().trim() || '',
    subject: formData.get('subject')?.toString().trim() || '',
    message: formData.get('message')?.toString().trim() || '',
  };

  // Validate using Zod schema
  const result = contactFormSchema.safeParse(rawData);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Format Zod validation errors into user-friendly messages
 * @param errors - ZodError object from validation
 * @returns User-friendly error message
 */
export function formatValidationError(errors: z.ZodError): string {
  const firstError = errors.issues[0];
  if (firstError) {
    return firstError.message || 'Please check your input and try again.';
  }
  return 'Validation failed. Please check your input and try again.';
}

