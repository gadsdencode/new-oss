'use server';

import { neon } from '@neondatabase/serverless';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateContactForm, formatValidationError } from '@/lib/contact-form-schema';

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
 * - Zod schema validation for robust type safety
 * - SQL injection prevention via parameterized queries
 */
export async function submitContactForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  // Log entry point for debugging
  console.log('[Contact Form] ===== SUBMISSION STARTED =====');
  console.log('[Contact Form] Timestamp:', new Date().toISOString());
  console.log('[Contact Form] Environment:', process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown');
  
  try {
    // Rate limiting: Check before processing to prevent DoS attacks
    const rateLimitResult = await checkRateLimit();
    if (!rateLimitResult.success) {
      console.warn('[Contact Form] Rate limit exceeded:', rateLimitResult);
      return {
        success: false,
        error: rateLimitResult.error || 'Too many requests. Please try again later.',
      };
    }
    
    console.log('[Contact Form] ✅ Rate limit check passed (remaining:', rateLimitResult.remaining, ')');
  
    // Check for DATABASE_URL with various possible prefixes
    // Vercel's Neon integration may prefix variables with project name (e.g., NEWOSS_)
    const databaseUrl = 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_URL || 
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL_UNPOOLED ||
      // Check for project-prefixed variables (NEWOSS_ prefix)
      process.env.NEWOSS_DATABASE_URL ||
      process.env.NEWOSS_POSTGRES_URL ||
      process.env.NEWOSS_POSTGRES_PRISMA_URL ||
      process.env.NEWOSS_POSTGRES_URL_NON_POOLING ||
      process.env.NEWOSS_DATABASE_URL_UNPOOLED;

    // Log available environment variables for debugging (without sensitive data)
    const availableEnvKeys = Object.keys(process.env)
      .filter(key => key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON'))
      .sort();
    
    console.log('[Contact Form] Available database-related env keys:', availableEnvKeys);
    console.log('[Contact Form] Checked variables:', {
      DATABASE_URL: process.env.DATABASE_URL ? `SET (${process.env.DATABASE_URL.length} chars)` : 'NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? `SET (${process.env.POSTGRES_URL.length} chars)` : 'NOT SET',
      NEWOSS_DATABASE_URL: process.env.NEWOSS_DATABASE_URL ? `SET (${process.env.NEWOSS_DATABASE_URL.length} chars)` : 'NOT SET',
      NEWOSS_POSTGRES_URL: process.env.NEWOSS_POSTGRES_URL ? `SET (${process.env.NEWOSS_POSTGRES_URL.length} chars)` : 'NOT SET',
      NEWOSS_POSTGRES_PRISMA_URL: process.env.NEWOSS_POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET',
    });

    if (!databaseUrl) {
      console.error('[Contact Form] ❌ CRITICAL: No database URL found in environment variables');
      console.error('[Contact Form] Available keys:', availableEnvKeys);
      return {
        success: false,
        error: 'Database not configured. No DATABASE_URL or NEWOSS_DATABASE_URL found.'
      };
    }

    console.log('[Contact Form] ✅ Database URL found (length:', databaseUrl.length, 'chars)');

    // Connect to the Neon database
    const sql = neon(databaseUrl);
    console.log('[Contact Form] Database connection object created');

    // Validate form data using Zod schema
    console.log('[Contact Form] Validating form data with Zod schema...');
    const validationResult = validateContactForm(formData);
    
    if (!validationResult.success) {
      const errorMessage = formatValidationError(validationResult.errors);
      console.error('[Contact Form] Validation failed:', validationResult.errors);
      return {
        success: false,
        error: errorMessage,
      };
    }

    // Extract validated data
    const { name, email, company, phone, subject, message } = validationResult.data;

    console.log('[Contact Form] Form data validated successfully:', {
      name: name ? 'provided' : 'missing',
      email: email ? 'provided' : 'missing',
      company: company ? 'provided' : 'null',
      phone: phone ? 'provided' : 'null',
      subject: subject ? 'provided' : 'missing',
      message: message ? 'provided' : 'missing'
    });

    // Insert the contact form submission into the database
    // Note: created_at will use the DEFAULT value from schema (CURRENT_TIMESTAMP)
    console.log('[Contact Form] Executing database INSERT...');
    
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
        ${message}
      )
    `;

    console.log('[Contact Form] Successfully inserted submission into database');

    return { 
      success: true, 
      message: 'Your message has been sent successfully!' 
    };
  } catch (error) {
    // Enhanced error logging
    console.error('[Contact Form] Submission error:', error);
    
    // Extract more detailed error information
    let errorMessage = 'Unable to send your message. Please try again later.';
    
    if (error instanceof Error) {
      const errorString = error.message || String(error);
      console.error('[Contact Form] Error details:', {
        message: errorString,
        stack: error.stack,
        name: error.name
      });
      
      // Provide specific error messages for common database errors
      if (errorString.includes('relation') && errorString.includes('does not exist')) {
        errorMessage = 'Database table not found. Please ensure the database schema has been created.';
      } else if (errorString.includes('violates not-null constraint')) {
        errorMessage = 'Database constraint violation. Please ensure all required fields are provided.';
      } else if (errorString.includes('connection') || errorString.includes('timeout')) {
        errorMessage = 'Database connection error. Please try again later.';
      } else {
        errorMessage = errorString;
      }
    } else {
      console.error('[Contact Form] Unknown error type:', typeof error, error);
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

