# Database Setup for Contact Form

This directory contains the database schema for storing contact form submissions in NeonDB.

## Setup Instructions

### For Vercel + Neon Integration

If you're using Vercel's built-in Neon integration, the database should already be configured. You just need to:

1. **Run the schema migration:**
   - Navigate to your Vercel dashboard
   - Go to your project's Storage tab
   - Select your Neon database
   - Open the SQL Editor
   - Copy and paste the contents of `schema.sql` into the editor
   - Execute the SQL script

### Manual Neon Setup

If you're setting up NeonDB manually:

1. **Get your connection string:**
   - Log into [Neon Console](https://console.neon.tech)
   - Navigate to your project
   - Copy the connection string (it will look like: `postgresql://user:password@hostname/dbname`)

2. **Set environment variable:**
   - Add `DATABASE_URL` to your `.env.local` file:
     ```
     DATABASE_URL=postgresql://user:password@hostname/dbname
     ```
   
   - Also add it to your Vercel project settings:
     - Go to Project Settings → Environment Variables
     - Add `DATABASE_URL` with your Neon connection string

3. **Run the schema:**
   - Use the Neon SQL Editor in the console, or
   - Connect using your preferred PostgreSQL client and run `schema.sql`

## Schema Details

The `contact_submissions` table stores:
- `id`: Primary key (auto-increment)
- `name`: Full name (required)
- `email`: Email address (required, indexed)
- `company`: Company name (optional)
- `phone`: Phone number (optional)
- `subject`: Message subject (required)
- `message`: Message content (required)
- `created_at`: Timestamp when submission was created
- `updated_at`: Timestamp when submission was last updated

## Testing

After setup, test the form submission by:
1. Filling out the contact form on `/contact`
2. Submitting the form
3. Verifying the submission appears in your Neon database

