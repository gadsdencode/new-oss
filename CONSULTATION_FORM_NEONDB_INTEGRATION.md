# Consultation Form → NeonDB Integration

## Overview

This document describes how the AI-generated consultation form properly captures user input and saves it to the NeonDB database through the existing secure contact form infrastructure.

## Complete Data Flow

```
User Input → ConsultationForm → GlobalAITools → submitConsultationRequest → submitContactForm → NeonDB
  (UI)         (Client)          (Handler)         (Wrapper)                (Server Action)    (Database)
```

## Components & Files

### 1. **ConsultationForm** (`components/ai/consultation-form.tsx`)

**Purpose**: UI form rendered by CopilotKit's Generative UI

**Fields** (matches database schema):
- ✅ `name` (required) - User's full name
- ✅ `email` (required) - User's email address  
- ✅ `phone` (optional) - User's phone number
- ✅ `company` (optional) - User's company name
- ✅ `message` (required) - Consultation request details

**Validation**:
- Uses `react-hook-form` for form state management
- Uses `zod` for client-side validation
- Validates name (min 2 chars), email format, message (min 10 chars)

**Key Features**:
- Receives `onSubmit` and `onCancel` callbacks from CopilotKit
- Auto-submits when user clicks "Submit Request"
- Displays validation errors inline

---

### 2. **GlobalAITools** (`components/global-ai-tools.tsx`)

**Purpose**: Registers CopilotKit actions available on all pages

**`scheduleConsultation` Action**:
```typescript
useCopilotAction({
  name: "scheduleConsultation",
  description: "Schedules a consultation call with the user...",
  render: ({ status }) => {
    if (status === "executing" || status === "complete") {
      return <ConsultationForm />;
    }
    return null;
  },
  handler: async (args) => {
    // 1. Render form and wait for user to fill it out
    const formData = await context.renderAndWaitForResponse(ConsultationForm);
    
    // 2. Submit to server action
    const result = await submitConsultationRequest({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      phone: formData.phone,
      message: formData.message,
    });
    
    // 3. Show success/error toast and return message to AI
    if (result.success) {
      toast.success(result.message);
      return "✅ Thanks! Your consultation request has been submitted.";
    } else {
      toast.error(result.error);
      return `❌ Sorry, there was an error: ${result.error}`;
    }
  }
});
```

**Logging**: Logs form data received from user for debugging

---

### 3. **submitConsultationRequest** (`app/contact/submit-consultation.ts`)

**Purpose**: Wrapper to convert object data to FormData format

**Server Action** (marked with `"use server"`):
```typescript
export async function submitConsultationRequest(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}) {
  // Convert to FormData
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("company", data.company || "");
  formData.append("phone", data.phone || "");
  formData.append("subject", "AI Consultation Request"); // Auto-populated
  formData.append("message", data.message);
  
  // Call existing server action
  return await submitContactForm(null, formData);
}
```

**Key Features**:
- Auto-populates `subject` field with "AI Consultation Request"
- Handles optional fields (company, phone) by converting to empty strings
- Comprehensive logging for debugging
- Returns same `FormState` as regular contact form

---

### 4. **submitContactForm** (`app/contact/actions.ts`)

**Purpose**: Main server action that handles database insertion

**Security Features**:
- ✅ Rate limiting (prevents DoS attacks)
- ✅ Zod schema validation (type-safe, comprehensive validation)
- ✅ Parameterized SQL queries (prevents SQL injection)
- ✅ Server-side execution only (marked `"use server"`)

**Process**:
1. **Rate Limit Check**: Uses `checkRateLimit()` to prevent abuse
2. **Database Connection**: Connects to NeonDB via `DATABASE_URL` or `NEWOSS_DATABASE_URL`
3. **Validation**: Validates all fields with Zod schema from `lib/contact-form-schema.ts`
4. **Database Insertion**: 
   ```sql
   INSERT INTO contact_submissions (
     name, email, company, phone, subject, message
   ) VALUES (
     $1, $2, $3, $4, $5, $6
   )
   ```
5. **Response**: Returns `{ success: boolean, message?: string, error?: string }`

**Database Schema** (`contact_submissions` table):
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | SERIAL | Yes | Auto-increment primary key |
| `name` | VARCHAR(255) | Yes | User's full name |
| `email` | VARCHAR(255) | Yes | User's email (validated) |
| `company` | VARCHAR(255) | No | User's company |
| `phone` | VARCHAR(50) | No | User's phone number |
| `subject` | VARCHAR(255) | Yes | Message subject |
| `message` | TEXT | Yes | Full message content |
| `created_at` | TIMESTAMP | Yes | Auto-populated (DEFAULT CURRENT_TIMESTAMP) |

---

## Validation Schema

From `lib/contact-form-schema.ts`:

```typescript
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters')
    .trim()
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Invalid email address format')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  
  company: z.string()
    .max(255, 'Company name must not exceed 255 characters')
    .trim()
    .optional(),
  
  phone: z.string()
    .max(50, 'Phone number must not exceed 50 characters')
    .trim()
    .optional()
    .refine((val) => !val || PHONE_REGEX.test(val)),
  
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(255, 'Subject must not exceed 255 characters')
    .trim(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .trim(),
});
```

---

## Testing the Integration

### Test Case 1: Complete Form with All Fields

**User Action**: Ask AI "I'd like to schedule a consultation"

**Expected Behavior**:
1. AI renders `ConsultationForm` in chat
2. User fills out all fields:
   - Name: "John Doe"
   - Email: "john@company.com"
   - Phone: "+1 (555) 123-4567"
   - Company: "Acme Inc."
   - Message: "I need help with AI implementation"
3. User clicks "Submit Request"
4. Form validates client-side (Zod)
5. Data passes to `submitConsultationRequest`
6. Data validates server-side (Zod)
7. Rate limit check passes
8. Data inserts into NeonDB
9. Success toast appears: "Your message has been sent successfully!"
10. AI responds: "✅ Thanks! Your consultation request has been submitted. We'll be in touch soon via email."

**Database Verification**:
```sql
SELECT * FROM contact_submissions 
WHERE subject = 'AI Consultation Request' 
ORDER BY created_at DESC 
LIMIT 1;
```

Should show:
- ✅ name: "John Doe"
- ✅ email: "john@company.com"
- ✅ phone: "+1 (555) 123-4567"
- ✅ company: "Acme Inc."
- ✅ subject: "AI Consultation Request"
- ✅ message: "I need help with AI implementation"
- ✅ created_at: [timestamp]

---

### Test Case 2: Minimum Required Fields Only

**User Action**: Ask AI "Can we schedule a consult?"

**Expected Behavior**:
1. AI renders form
2. User fills only required fields:
   - Name: "Jane Smith"
   - Email: "jane@example.com"
   - Message: "I'm interested in your AI services"
   - (Phone: empty)
   - (Company: empty)
3. Form submits successfully
4. Data saves to NeonDB with NULL values for optional fields

**Database Verification**:
```sql
SELECT * FROM contact_submissions 
WHERE email = 'jane@example.com' 
ORDER BY created_at DESC 
LIMIT 1;
```

Should show:
- ✅ name: "Jane Smith"
- ✅ email: "jane@example.com"
- ✅ phone: NULL
- ✅ company: NULL
- ✅ subject: "AI Consultation Request"
- ✅ message: "I'm interested in your AI services"

---

### Test Case 3: Validation Errors

**Expected Behaviors**:
- ❌ Name too short (< 2 chars): Shows "Name must be at least 2 characters"
- ❌ Invalid email: Shows "Invalid email address"
- ❌ Message too short (< 10 chars): Shows "Please provide at least 10 characters"
- ❌ Rate limit exceeded: Shows "Too many requests. Please try again later."

---

### Test Case 4: Database Connection Issues

**Scenario**: DATABASE_URL not configured

**Expected Behavior**:
- Error message: "Database not configured. No DATABASE_URL or NEWOSS_DATABASE_URL found."
- Error logged in server console
- User sees friendly error message

---

## Debugging

### Console Logs

**Client-side** (Browser Console):
```
[Global AI Tools] Form data received from user: {
  name: "John Doe",
  email: "john@company.com", 
  hasCompany: true,
  hasPhone: true,
  messageLength: 35
}
```

**Server-side** (Terminal):
```
[Consultation Wrapper] Processing consultation request: {
  name: "John Doe",
  email: "john@company.com",
  hasCompany: true,
  hasPhone: true,
  messageLength: 35
}
[Consultation Wrapper] Calling submitContactForm with FormData
[Contact Form] ===== SUBMISSION STARTED =====
[Contact Form] ✅ Rate limit check passed (remaining: 9)
[Contact Form] ✅ Database URL found (length: 135 chars)
[Contact Form] Form data validated successfully
[Contact Form] Executing database INSERT...
[Contact Form] Successfully inserted submission into database
[Consultation Wrapper] Server action result: {
  success: true,
  hasMessage: true,
  hasError: false
}
```

---

## Environment Variables

Required in `.env.local` or Vercel project settings:

```bash
# Primary database URL (choose one)
DATABASE_URL="postgresql://..."
# OR
NEWOSS_DATABASE_URL="postgresql://..."

# Alternative variable names also checked:
# POSTGRES_URL
# POSTGRES_PRISMA_URL
# POSTGRES_URL_NON_POOLING
# NEWOSS_POSTGRES_URL
# NEWOSS_POSTGRES_PRISMA_URL
```

---

## Security Considerations

### ✅ Implemented

1. **SQL Injection Prevention**: Uses parameterized queries via Neon's serverless driver
2. **Rate Limiting**: `checkRateLimit()` prevents abuse (configured in `lib/rate-limit.ts`)
3. **Input Validation**: 
   - Client-side: Zod schema in form
   - Server-side: Zod schema in server action (never trust client)
4. **Server Actions**: All mutations use `"use server"` directive
5. **Type Safety**: TypeScript + Zod ensures type correctness end-to-end
6. **XSS Prevention**: React automatically escapes user input
7. **Email Validation**: RFC 5322 compliant regex
8. **Phone Validation**: International format support

### 🔒 Best Practices

- Never log sensitive data (passwords, credit cards, etc.)
- Always validate on server even if validated on client
- Use environment variables for database credentials
- Keep Neon connection strings secret
- Implement CAPTCHA if spam becomes an issue
- Consider honeypot fields for bot detection

---

## Troubleshooting

### Issue: "Cannot destructure property 'renderAndWaitForResponse' of 'undefined'"

**Solution**: Use `useCopilotContext()` to get context first:
```typescript
const context = useCopilotContext();
const formData = await context.renderAndWaitForResponse(ConsultationForm);
```

### Issue: Form submits but no database entry

**Check**:
1. Database URL is correctly set in environment
2. `contact_submissions` table exists in NeonDB
3. Table schema matches expected columns
4. Check server logs for SQL errors

### Issue: "Rate limit exceeded"

**Solution**: Adjust rate limit settings in `lib/rate-limit.ts` or wait for the limit window to reset.

### Issue: Validation errors not showing

**Check**:
1. Form schema matches server schema
2. Error messages are defined in Zod schema
3. `FormMessage` components are included in form fields

---

## Related Files

- `components/ai/consultation-form.tsx` - Form UI component
- `components/global-ai-tools.tsx` - CopilotKit action registration
- `app/contact/submit-consultation.ts` - Server action wrapper
- `app/contact/actions.ts` - Main server action
- `lib/contact-form-schema.ts` - Zod validation schema
- `lib/rate-limit.ts` - Rate limiting logic

---

## Summary

✅ **Consultation form captures all user input**  
✅ **Data flows through secure server actions**  
✅ **Validation happens client-side and server-side**  
✅ **Rate limiting prevents abuse**  
✅ **Data saves to NeonDB `contact_submissions` table**  
✅ **SQL injection protection via parameterized queries**  
✅ **Comprehensive logging for debugging**  
✅ **Error handling with user-friendly messages**  

The integration is **production-ready** and follows Next.js + CopilotKit best practices! 🎉

