# Contact Form Troubleshooting Guide

## Issues Fixed

This document outlines the issues that were identified and fixed in the contact form implementation.

### 1. SQL INSERT Statement Issue

**Problem:** The original INSERT statement explicitly set `created_at` to `NOW()`, which could conflict with the `DEFAULT CURRENT_TIMESTAMP` in the schema.

**Fix:** Removed `created_at` from the INSERT statement to let the database use the DEFAULT value automatically.

**Before:**
```sql
INSERT INTO contact_submissions (
  name, email, company, phone, subject, message, created_at
) VALUES (
  ${name}, ${email}, ${company}, ${phone}, ${subject}, ${message}, NOW()
)
```

**After:**
```sql
INSERT INTO contact_submissions (
  name, email, company, phone, subject, message
) VALUES (
  ${name}, ${email}, ${companyValue}, ${phoneValue}, ${subject}, ${message}
)
```

### 2. Optional Field Handling

**Problem:** Optional fields (company, phone) were being set to empty strings instead of `NULL`, which could cause issues with database constraints or expectations.

**Fix:** Properly convert empty strings to `NULL` for optional fields before inserting into the database.

**Before:**
```typescript
const company = formData.get('company')?.toString().trim() || null;
const phone = formData.get('phone')?.toString().trim() || null;
```

**After:**
```typescript
const company = companyRaw ? String(companyRaw).trim() : null;
const phone = phoneRaw ? String(phoneRaw).trim() : null;
// Convert empty strings to null for optional fields
const companyValue = company && company.length > 0 ? company : null;
const phoneValue = phone && phone.length > 0 ? phone : null;
```

### 3. Error Handling and Logging

**Problem:** Insufficient error logging made it difficult to diagnose issues. Errors weren't providing enough detail about what went wrong.

**Fix:** Added comprehensive logging throughout the server action and improved error messages with specific database error handling.

**Improvements:**
- Added detailed console logging at each step
- Enhanced error messages for common database errors
- Specific messages for:
  - Table not found errors
  - Constraint violations
  - Connection errors
  - General database errors

### 4. FormData Type Handling

**Problem:** FormData.get() can return `null` or `string`, but wasn't being handled explicitly.

**Fix:** Added explicit type checking and conversion before using form data values.

## Verification Steps

### Step 1: Verify Database Schema

Run the verification script in your Neon SQL Editor:

```bash
# Copy and paste the contents of database/verify-schema.sql
```

This will:
- Check if the table exists
- Verify column structure
- Test an INSERT operation (rolled back)

### Step 2: Check Server Logs

After submitting the form, check your server logs for:

```
[Contact Form] Submission started
[Contact Form] Database connection initialized
[Contact Form] Form data extracted: {...}
[Contact Form] Executing database INSERT...
[Contact Form] Successfully inserted submission into database
```

If you see errors, they will be prefixed with `[Contact Form]` and include detailed information.

### Step 3: Test Form Submission

1. Navigate to `/contact`
2. Fill out all required fields:
   - Name: "Test User"
   - Email: "test@example.com"
   - Subject: "Test Subject"
   - Message: "This is a test message"
3. Optionally fill company and phone
4. Submit the form

### Step 4: Verify Database Entry

In your Neon SQL Editor, run:

```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 1;
```

You should see your test submission.

## Common Errors and Solutions

### Error: "Database table not found"

**Cause:** The schema hasn't been run on your database.

**Solution:**
1. Go to your Neon SQL Editor (via Vercel dashboard or Neon console)
2. Copy and paste the contents of `database/schema.sql`
3. Execute the SQL script
4. Verify the table exists using the verification script

### Error: "Database constraint violation"

**Cause:** Required fields are missing or invalid data is being passed.

**Solution:**
- Check that all required fields (name, email, subject, message) are provided
- Verify email format is correct
- Check server logs for which field is causing the violation

### Error: "Database connection error"

**Cause:** DATABASE_URL environment variable is incorrect or database is unreachable.

**Solution:**
- Verify `DATABASE_URL` is set in your environment variables
- Check that the connection string is correct
- Ensure your database is accessible from your deployment

### Error: Form submits but nothing happens

**Cause:** Server action might not be executing or returning properly.

**Solution:**
- Check browser console for client-side errors
- Check server logs for execution logs
- Verify `useActionState` is correctly implemented
- Ensure the form action is properly bound

## Debugging Tips

### 1. Enable Verbose Logging

The server action now includes detailed logging. Check your deployment logs (Vercel function logs) to see each step of execution.

### 2. Test with Minimal Form

Try submitting with just the required fields to isolate the issue:
- Name
- Email
- Subject
- Message

### 3. Check Database Permissions

Ensure your `DATABASE_URL` has INSERT permissions on the `contact_submissions` table.

### 4. Verify Environment Variables

In your Vercel deployment:
1. Go to Project Settings → Environment Variables
2. Verify `DATABASE_URL` is set for the correct environment (Production, Preview, Development)
3. Redeploy if you just added it

### 5. Test Database Connection

You can test the database connection directly in your Neon SQL Editor:

```sql
-- Test connection and basic INSERT
INSERT INTO contact_submissions (
  name, email, subject, message
) VALUES (
  'Direct Test', 'test@example.com', 'Test', 'Testing direct insert'
);

-- Verify it was inserted
SELECT * FROM contact_submissions WHERE name = 'Direct Test';

-- Clean up
DELETE FROM contact_submissions WHERE name = 'Direct Test';
```

## Still Having Issues?

If you're still experiencing issues after trying all the above:

1. **Check Server Logs:** Look for `[Contact Form]` prefixed logs in your deployment logs
2. **Verify Schema:** Ensure the database schema matches exactly what's in `database/schema.sql`
3. **Test Connection:** Verify DATABASE_URL is accessible and correct
4. **Check Network:** Ensure there are no network/firewall issues blocking the connection

## Files Changed

- ✅ `app/contact/actions.ts` - Fixed SQL syntax, null handling, and error logging
- ✅ `database/verify-schema.sql` - Created verification script

## Next Steps

Once the form is working:
1. Test with real data
2. Verify submissions appear in your database
3. Set up monitoring/alerts for form submissions
4. Consider adding email notifications for new submissions

