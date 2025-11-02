# Contact Form Security Enhancements

## Overview

This document describes the security enhancements implemented for the contact form Server Action, addressing critical vulnerabilities in validation and rate limiting.

## Issues Addressed

### 1. Weak Validation
**Problem**: The form used simple `if (!name || !email)` checks and a basic regex for email validation.

**Impact**: 
- Insufficient input validation
- Poor error messages
- Potential security vulnerabilities from malformed input
- Missed opportunity to leverage existing Zod dependency

### 2. No Rate Limiting
**Problem**: The Server Action had no rate limiting, allowing an attacker to submit the form millions of times.

**Impact**: 
- **Denial of Service (DoS) Attack**: An attacker could flood the server with requests
- **Excessive Costs**: Massive serverless function and database costs
- **Resource Exhaustion**: Database and server resources could be overwhelmed

## Solutions Implemented

### 1. Zod Schema Validation (`lib/contact-form-schema.ts`)

**Features**:
- ✅ Comprehensive type-safe validation using Zod
- ✅ RFC 5322 compliant email validation
- ✅ Length constraints on all fields (matches database schema)
- ✅ Character validation (e.g., name characters)
- ✅ Phone number format validation (permissive for international formats)
- ✅ Detailed, user-friendly error messages
- ✅ Automatic data sanitization (trim, lowercase email)

**Schema Details**:
```typescript
- name: 2-255 characters, alphanumeric + spaces/hyphens
- email: RFC 5322 compliant, max 255 characters, auto-lowercased
- company: Optional, max 255 characters
- phone: Optional, 7-20 characters, international format
- subject: 3-255 characters
- message: 10-5000 characters
```

### 2. Rate Limiting (`lib/rate-limit.ts`)

**Features**:
- ✅ **Production**: Uses Vercel KV with Upstash Ratelimit (sliding window algorithm)
- ✅ **Development**: Falls back to in-memory rate limiting (works locally)
- ✅ **Configuration**: 5 requests per minute per IP address
- ✅ **IP Detection**: Supports multiple header formats (x-forwarded-for, x-real-ip, cf-connecting-ip)
- ✅ **Error Handling**: Graceful degradation - rate limiting failures don't block requests
- ✅ **User-Friendly Messages**: Clear error messages with countdown to retry

**Rate Limit Configuration**:
- **Limit**: 5 requests
- **Window**: 1 minute (sliding window)
- **Identifier**: IP address

## Implementation Details

### Updated Server Action (`app/contact/actions.ts`)

1. **Rate Limiting Check** (first step):
   - Checks rate limit before any processing
   - Returns error immediately if limit exceeded
   - Logs rate limit status for monitoring

2. **Zod Validation** (after rate limit):
   - Validates all form data using schema
   - Returns user-friendly error messages
   - Transforms data (trim, lowercase email, etc.)

3. **Database Insert** (after validation):
   - Uses validated, sanitized data
   - Continues to use parameterized queries (SQL injection prevention)

## Environment Variables Required

### For Production (Vercel KV)

To enable production-grade rate limiting with Vercel KV, set these environment variables in your Vercel project:

```bash
KV_REST_API_URL=https://your-kv-store.vercel.app
KV_REST_API_TOKEN=your-kv-token
```

**How to get these**:
1. Go to your Vercel project dashboard
2. Navigate to Storage → KV
3. Create a new KV store (if not already created)
4. Copy the `KV_REST_API_URL` and `KV_REST_API_TOKEN` from the store settings

### For Development

No environment variables needed! The system automatically falls back to in-memory rate limiting when KV is not available.

## Security Benefits

### Before
- ❌ Simple validation (if statements)
- ❌ Basic regex for email
- ❌ No rate limiting
- ❌ Vulnerable to DoS attacks
- ❌ High risk of cost overruns

### After
- ✅ Robust Zod schema validation
- ✅ Comprehensive input sanitization
- ✅ Production-grade rate limiting
- ✅ Protection against DoS attacks
- ✅ Cost protection via rate limiting
- ✅ Type-safe validation
- ✅ User-friendly error messages

## Testing

### Test Validation

1. **Valid Submission**: Submit a form with all required fields properly filled
2. **Missing Fields**: Try submitting without required fields
3. **Invalid Email**: Try `invalid-email` or `test@` or `@example.com`
4. **Invalid Phone**: Try invalid phone formats (if provided)
5. **Long Fields**: Try exceeding maximum lengths

### Test Rate Limiting

1. **Normal Usage**: Submit 3-4 forms (should work)
2. **Rate Limit**: Submit 6+ forms in quick succession
3. **Verify**: Should receive rate limit error after 5 requests
4. **Wait**: Wait 1 minute and try again (should work)

### Local Testing

Rate limiting uses in-memory cache when KV is not configured, so it will work locally without any setup.

### Production Testing

To test in production:
1. Ensure `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
2. Rate limiting will use Vercel KV for distributed rate limiting across serverless functions

## Monitoring

The implementation includes comprehensive logging:

- `[Contact Form] ✅ Rate limit check passed (remaining: X)`
- `[Contact Form] Rate limit exceeded: {...}`
- `[Contact Form] Validating form data with Zod schema...`
- `[Contact Form] Validation failed: {...}`

Monitor these logs in your Vercel function logs to track rate limiting and validation issues.

## Packages Added

```json
{
  "@upstash/ratelimit": "^2.0.6",
  "@vercel/kv": "^3.0.0"
}
```

**Existing Packages Used**:
- `zod`: "^4.1.12" (already installed)

## Files Created/Modified

### Created
- `lib/rate-limit.ts` - Rate limiting utility
- `lib/contact-form-schema.ts` - Zod validation schema

### Modified
- `app/contact/actions.ts` - Updated to use validation and rate limiting
- `package.json` - Added rate limiting packages

## Next Steps

1. **Set up Vercel KV** (recommended for production):
   - Create KV store in Vercel dashboard
   - Add environment variables
   - Deploy and verify rate limiting works

2. **Monitor Rate Limits**:
   - Check Vercel function logs for rate limit hits
   - Adjust limits if needed (edit `RATE_LIMIT_REQUESTS` and `RATE_LIMIT_WINDOW` in `lib/rate-limit.ts`)

3. **Consider Additional Security** (optional):
   - reCAPTCHA integration
   - Honeypot fields
   - IP-based blocking for repeat offenders

## Configuration Options

To adjust rate limits, edit `lib/rate-limit.ts`:

```typescript
const RATE_LIMIT_REQUESTS = 5; // Maximum requests
const RATE_LIMIT_WINDOW = '1 m'; // Time window
```

Common options:
- `'1 m'` = 1 minute
- `'1 h'` = 1 hour
- `'1 d'` = 1 day

