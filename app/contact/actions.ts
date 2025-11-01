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
  console.log('[Contact Form] Submission started');
  
  try {
    // Validate required DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      console.error('[Contact Form] DATABASE_URL environment variable is not set');
      return {
        success: false,
        error: 'Database configuration error. Please contact support.'
      };
    }

    // Connect to the Neon database
    const sql = neon(process.env.DATABASE_URL);
    console.log('[Contact Form] Database connection initialized');

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

