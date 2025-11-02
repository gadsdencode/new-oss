'use server';

import { neon } from '@neondatabase/serverless';

interface FormState {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server action to handle contact form submission
 * Stores form data in NeonDB PostgreSQL database
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
    // Check for DATABASE_URL (Vercel Neon integration standard)
    // Also check for POSTGRES_URL (some integrations use this)
    const databaseUrl = 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_URL || 
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL_UNPOOLED;

    // Log available environment variables for debugging (without sensitive data)
    const availableEnvKeys = Object.keys(process.env)
      .filter(key => key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEON'))
      .sort();
    
    console.log('[Contact Form] Available database-related env keys:', availableEnvKeys);
    console.log('[Contact Form] Checked variables:', {
      DATABASE_URL: process.env.DATABASE_URL ? `SET (${process.env.DATABASE_URL.length} chars)` : 'NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? `SET (${process.env.POSTGRES_URL.length} chars)` : 'NOT SET',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET',
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'NOT SET',
      DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ? 'SET' : 'NOT SET',
    });

    if (!databaseUrl) {
      console.error('[Contact Form] ❌ CRITICAL: No database URL found in environment variables');
      console.error('[Contact Form] This means DATABASE_URL is not accessible in the server runtime');
      console.error('[Contact Form] Visit /api/test-env to diagnose environment variable availability');
      return {
        success: false,
        error: 'Database not configured. Check Vercel environment variables and redeploy. Visit /api/test-env for diagnostics.'
      };
    }

    console.log('[Contact Form] ✅ Database URL found (length:', databaseUrl.length, 'chars)');

    // Connect to the Neon database
    const sql = neon(databaseUrl);
    console.log('[Contact Form] Database connection object created');

    // Extract form data with proper null handling
    const nameRaw = formData.get('name');
    const emailRaw = formData.get('email');
    const companyRaw = formData.get('company');
    const phoneRaw = formData.get('phone');
    const subjectRaw = formData.get('subject');
    const messageRaw = formData.get('message');

    const name = nameRaw ? String(nameRaw).trim() : '';
    const email = emailRaw ? String(emailRaw).trim() : '';
    const company = companyRaw ? String(companyRaw).trim() : null;
    const phone = phoneRaw ? String(phoneRaw).trim() : null;
    const subject = subjectRaw ? String(subjectRaw).trim() : '';
    const message = messageRaw ? String(messageRaw).trim() : '';

    // Convert empty strings to null for optional fields
    const companyValue = company && company.length > 0 ? company : null;
    const phoneValue = phone && phone.length > 0 ? phone : null;

    console.log('[Contact Form] Form data extracted:', {
      name: name ? 'provided' : 'missing',
      email: email ? 'provided' : 'missing',
      company: companyValue ? 'provided' : 'null',
      phone: phoneValue ? 'provided' : 'null',
      subject: subject ? 'provided' : 'missing',
      message: message ? 'provided' : 'missing'
    });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!subject) missingFields.push('subject');
      if (!message) missingFields.push('message');
      
      console.error('[Contact Form] Missing required fields:', missingFields);
      return {
        success: false,
        error: 'Missing required fields. Please fill in all required fields.'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('[Contact Form] Invalid email format:', email);
      return {
        success: false,
        error: 'Invalid email address format.'
      };
    }

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
        ${companyValue}, 
        ${phoneValue}, 
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

