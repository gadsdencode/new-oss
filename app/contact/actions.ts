'use server';

import { neon } from '@neondatabase/serverless';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateContactForm, formatValidationError } from '@/lib/contact-form-schema';
import {
  appendSubmissionMetadata,
  resolveCoeIntent,
} from '@/lib/contact/coe-intent';

interface FormState {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server action to handle contact form submission
 * Stores form data in NeonDB PostgreSQL database
 *
 * Security features:
 * - Rate limiting to prevent DoS attacks
 * - Honeypot field rejection
 * - Zod schema validation for robust type safety
 * - SQL injection prevention via parameterized queries
 */
export async function submitContactForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  try {
    // Honeypot: reject silently-looking failure if bots fill the hidden field
    const honeypot = formData.get('website')?.toString() ?? '';
    if (honeypot.trim().length > 0) {
      return { success: false, error: 'Unable to send your message. Please try again later.' };
    }

    const rateLimitResult = await checkRateLimit();
    if (!rateLimitResult.success) {
      return {
        success: false,
        error: rateLimitResult.error || 'Too many requests. Please try again later.',
      };
    }

    const databaseUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.NEWOSS_DATABASE_URL ||
      process.env.NEWOSS_POSTGRES_URL ||
      process.env.NEWOSS_POSTGRES_PRISMA_URL ||
      process.env.NEWOSS_POSTGRES_URL_NON_POOLING ||
      process.env.NEWOSS_DATABASE_URL_UNPOOLED;

    if (!databaseUrl) {
      return {
        success: false,
        error: 'Database not configured. No DATABASE_URL or NEWOSS_DATABASE_URL found.',
      };
    }

    const sql = neon(databaseUrl);

    const validationResult = validateContactForm(formData);

    if (!validationResult.success) {
      return {
        success: false,
        error: formatValidationError(validationResult.errors),
      };
    }

    const { name, email, company, phone, subject, message, intent, source, coe_context } =
      validationResult.data;

    const normalizedIntent = resolveCoeIntent(intent ?? null);
    const inquirySource = source?.trim() || (intent ? 'ai-coe' : 'website');

    // Persist intent + non-sensitive CoE context in the stored message body
    // so submission data always includes the handoff even without DB migrations.
    const messageForStorage =
      inquirySource === 'ai-coe' || intent
        ? appendSubmissionMetadata({
            message,
            intent: normalizedIntent === 'general' && intent ? resolveCoeIntent(intent) : normalizedIntent,
            source: inquirySource,
            coeContextJson: coe_context,
          })
        : message;

    await sql`
      INSERT INTO contact_submissions (
        name,
        email,
        company,
        phone,
        subject,
        message
      ) VALUES (
        ${name},
        ${email},
        ${company ?? null},
        ${phone ?? null},
        ${subject},
        ${messageForStorage}
      )
    `;

    return {
      success: true,
      message: 'Your message has been received. We will follow up — this does not schedule a meeting.',
    };
  } catch (error) {
    let errorMessage = 'Unable to send your message. Please try again later.';

    if (error instanceof Error) {
      const errorString = error.message || String(error);
      if (errorString.includes('relation') && errorString.includes('does not exist')) {
        errorMessage = 'Database table not found. Please ensure the database schema has been created.';
      } else if (errorString.includes('violates not-null constraint')) {
        errorMessage = 'Database constraint violation. Please ensure all required fields are provided.';
      } else if (errorString.includes('connection') || errorString.includes('timeout')) {
        errorMessage = 'Database connection error. Please try again later.';
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

