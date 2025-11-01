# Contact Form with NeonDB Setup

This document explains how the contact form is integrated with NeonDB to store form submissions.

## Overview

The contact form on `/contact` now stores all submissions in a PostgreSQL database via NeonDB. The implementation uses Next.js Server Actions for secure server-side processing.

## Architecture

```
┌─────────────────┐
│  Contact Form   │
│  (Client)       │
└────────┬────────┘
         │
         │ FormData
         ▼
┌─────────────────┐
│ Server Action   │
│ (actions.ts)    │
└────────┬────────┘
         │
         │ SQL INSERT
         ▼
┌─────────────────┐
│   NeonDB        │
│  PostgreSQL     │
└─────────────────┘
```

## Setup Instructions

### 1. Database Setup

#### Option A: Vercel + Neon Integration (Recommended)

If you're using Vercel's built-in Neon integration:

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Neon**
3. Create a new database if needed
4. Open the **SQL Editor**
5. Copy and paste the contents of `database/schema.sql`
6. Execute the SQL script

The `DATABASE_URL` will be automatically configured as an environment variable.

#### Option B: Manual Neon Setup

1. **Create a Neon Database:**
   - Go to [Neon Console](https://console.neon.tech)
   - Create a new project and database
   - Copy the connection string

2. **Run the Schema:**
   - Use the Neon SQL Editor to execute `database/schema.sql`
   - Or connect with a PostgreSQL client and run the schema file

3. **Configure Environment Variables:**
   - Add to `.env.local`:
     ```bash
     DATABASE_URL=postgresql://user:password@hostname/dbname
     ```
   - Add to Vercel project settings:
     - Go to **Project Settings** → **Environment Variables**
     - Add `DATABASE_URL` with your Neon connection string
     - Apply to all environments (Production, Preview, Development)

### 2. Verify Installation

The required package is already installed:
- ✅ `@neondatabase/serverless` (v1.0.2)

### 3. Test the Form

1. Navigate to `/contact` in your application
2. Fill out the contact form with test data
3. Submit the form
4. Verify the submission:
   - Check your Neon database using the SQL Editor
   - Query: `SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 1;`

## Database Schema

The `contact_submissions` table stores:

| Column      | Type        | Description                          |
|-------------|-------------|--------------------------------------|
| id          | SERIAL      | Primary key (auto-increment)        |
| name        | VARCHAR(255)| Full name (required)                 |
| email       | VARCHAR(255)| Email address (required, indexed)    |
| company     | VARCHAR(255)| Company name (optional)               |
| phone       | VARCHAR(50) | Phone number (optional)               |
| subject     | VARCHAR(255)| Message subject (required)            |
| message     | TEXT        | Message content (required)            |
| created_at  | TIMESTAMP   | Submission timestamp                 |
| updated_at  | TIMESTAMP   | Last update timestamp                |

## Files Created/Modified

### Created:
1. ✅ `app/contact/actions.ts` - Server action for form submission
2. ✅ `database/schema.sql` - Database schema SQL script
3. ✅ `database/README.md` - Database setup documentation
4. ✅ `CONTACT_FORM_SETUP.md` - This file

### Modified:
1. ✅ `app/contact/contact-form.tsx` - Updated to use server action instead of simulation

## Security Features

- ✅ Server-side validation of all form fields
- ✅ Email format validation
- ✅ SQL injection prevention (using parameterized queries via Neon's tagged template)
- ✅ Error handling with user-friendly messages
- ✅ Environment variable validation

## Error Handling

The server action handles various error scenarios:

- Missing `DATABASE_URL` environment variable
- Database connection errors
- Validation errors (missing fields, invalid email)
- General database errors

All errors return user-friendly messages to the client.

## Next Steps

1. **Monitor Submissions:**
   - Set up database monitoring in Neon dashboard
   - Create admin interface to view submissions (optional)

2. **Email Notifications:**
   - Consider adding email notifications when forms are submitted
   - Use services like Resend, SendGrid, or similar

3. **Spam Protection:**
   - Consider adding reCAPTCHA or similar spam protection
   - Implement rate limiting if needed

4. **Data Export:**
   - Create admin interface to export submissions
   - Set up regular backups of the database

## Troubleshooting

### Database Connection Errors

**Error:** "Database configuration error. Please contact support."

**Solution:** 
- Verify `DATABASE_URL` is set in environment variables
- Check that the connection string is correct
- Ensure the database is accessible from your deployment

### Form Not Submitting

**Error:** Form shows loading state but never completes

**Solution:**
- Check browser console for errors
- Check server logs (Vercel function logs)
- Verify database table exists (`SELECT * FROM contact_submissions;`)
- Check that all required fields are filled

### Data Not Appearing in Database

**Solution:**
- Verify the schema was run successfully
- Check that `created_at` column accepts `NOW()` (should be automatic with the schema)
- Review server action logs for SQL errors

## Support

For issues related to:
- **NeonDB:** See [Neon Documentation](https://neon.tech/docs)
- **Next.js Server Actions:** See [Next.js Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- **Vercel Deployment:** See [Vercel Documentation](https://vercel.com/docs)

