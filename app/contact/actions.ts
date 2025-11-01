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
  try {
    // Validate required DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set');
      throw new Error('Database configuration error. Please contact support.');
    }

    // Connect to the Neon database
    const sql = neon(process.env.DATABASE_URL);

    // Extract form data
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const company = formData.get('company')?.toString().trim() || null;
    const phone = formData.get('phone')?.toString().trim() || null;
    const subject = formData.get('subject')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error('Missing required fields. Please fill in all required fields.');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address format.');
    }

    // Insert the contact form submission into the database
    await sql`
      INSERT INTO contact_submissions (
        name, 
        email, 
        company, 
        phone, 
        subject, 
        message,
        created_at
      ) VALUES (
        ${name}, 
        ${email}, 
        ${company}, 
        ${phone}, 
        ${subject}, 
        ${message},
        NOW()
      )
    `;

    return { 
      success: true, 
      message: 'Your message has been sent successfully!' 
    };
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    // Return user-friendly error messages
    if (error instanceof Error) {
      return { 
        success: false, 
        error: error.message || 'Unable to send your message. Please try again later.' 
      };
    }
    
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again later.' 
    };
  }
}

