# Vercel Environment Variable Setup for Neon Database

## Issue

The contact form is showing "Database configuration error" because `DATABASE_URL` is not available in the server runtime.

## Solution: Set DATABASE_URL in Vercel

### Option A: Using Vercel Neon Integration (Automatic)

If you're using Vercel's built-in Neon integration:

1. **Go to Vercel Dashboard:**
   - Navigate to your project
   - Go to **Storage** tab
   - Click on **Neon** (or create a new Neon database)

2. **Verify Environment Variables:**
   - The integration should automatically set `DATABASE_URL`
   - Go to **Settings** → **Environment Variables**
   - Verify `DATABASE_URL` exists
   - If it doesn't exist, disconnect and reconnect the Neon database

3. **Apply to Environments:**
   - Make sure `DATABASE_URL` is set for:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

4. **Redeploy:**
   - After setting environment variables, **redeploy your application**
   - Vercel requires a redeploy for new environment variables to take effect

### Option B: Manual Setup

If you're not using the Vercel Neon integration:

1. **Get Your Neon Connection String:**
   - Go to [Neon Console](https://console.neon.tech)
   - Navigate to your project
   - Go to **Connection Details**
   - Copy the **Connection string** (should look like: `postgresql://user:password@hostname/dbname`)

2. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project
   - Navigate to **Settings** → **Environment Variables**
   - Click **Add New**
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string (paste it)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

3. **Important: Redeploy**
   - **You must redeploy after adding environment variables**
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**
   - OR push a new commit to trigger a redeploy

## Verification Steps

### Step 1: Check Environment Variables in Vercel

1. Go to **Settings** → **Environment Variables**
2. Look for `DATABASE_URL`
3. Verify it's set for Production, Preview, and Development

### Step 2: Check Server Logs

After redeploying, submit the contact form and check Vercel logs. You should see:

```
[Contact Form] Submission started
[Contact Form] Available database environment variables: ['DATABASE_URL']
[Contact Form] Database URL found (length: XXX chars)
[Contact Form] Database connection initialized
```

If you see:
```
[Contact Form] No database URL found in environment variables
```

Then `DATABASE_URL` is not set correctly.

### Step 3: Verify Database Connection

Once `DATABASE_URL` is set, the form should work. Test by:

1. Submitting the contact form
2. Checking Vercel logs for successful submission
3. Querying your database to verify the entry was created

## Common Issues

### Issue 1: Environment Variable Not Taking Effect

**Problem:** Added `DATABASE_URL` but still getting error

**Solution:**
- ✅ **You must redeploy after adding environment variables**
- Environment variables are only available after redeployment
- Push a commit or manually trigger a redeploy

### Issue 2: Variable Name Mismatch

**Problem:** Vercel might use different variable names

**Solution:**
- The code now checks for multiple variable names:
  - `DATABASE_URL` (most common)
  - `POSTGRES_URL`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `DATABASE_URL_UNPOOLED`
- Check which one Vercel Neon integration sets for your setup
- If it uses a different name, either:
  - Set `DATABASE_URL` manually with the same value, OR
  - Update the code to check for your specific variable name

### Issue 3: Variable Only Set for One Environment

**Problem:** `DATABASE_URL` is only set for Production, not Preview/Development

**Solution:**
- When adding the environment variable, select all environments:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Or add it separately for each environment

## Testing

After setting up `DATABASE_URL` and redeploying:

1. **Submit the form** on your deployed site
2. **Check Vercel logs** - should see successful submission
3. **Query database** - verify entry was created:
   ```sql
   SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 1;
   ```

## Next Steps

Once `DATABASE_URL` is properly configured:

1. ✅ Form submissions will be stored in Neon database
2. ✅ You'll see success message after submission
3. ✅ No more "Database configuration error"

## Still Having Issues?

If you're still seeing the error after:
- ✅ Setting `DATABASE_URL` in Vercel
- ✅ Redeploying your application
- ✅ Verifying the variable exists

Check:
1. **Vercel logs** for the specific error message
2. **Environment variable format** - should not have quotes around the connection string
3. **Connection string validity** - test it directly in Neon SQL Editor

