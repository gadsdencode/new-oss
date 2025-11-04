# Consultation Form - renderAndWaitForResponse Fix

## Problem

The consultation form created by generative UI was failing to submit to the database with the error:
```
context.renderAndWaitForResponse is not a function
```

The AI would display the form, but when submitted, it would show:
> "I apologize, but there was an unexpected error when trying to schedule a consultation."

## Root Cause

The initial implementation incorrectly used `useCopilotContext()` to access `renderAndWaitForResponse`, which is **not** the correct pattern for CopilotKit's Human-in-the-Loop (HITL) forms.

### Incorrect Pattern (Before):
```typescript
// ❌ WRONG - This doesn't work!
const context = useCopilotContext();

useCopilotAction({
  name: "scheduleConsultation",
  render: ({ status }) => { /* ... */ },
  handler: async () => {
    const formData = await context.renderAndWaitForResponse(ConsultationForm);
    // ... submit to database
  }
});
```

## Solution

The correct pattern uses `renderAndWaitForResponse` as a **property** of `useCopilotAction`, not as a separate function. This property **replaces** both `render` and `handler`.

### Correct Pattern (After):
```typescript
// ✅ CORRECT!
useCopilotAction({
  name: "scheduleConsultation",
  parameters: [],
  available: "enabled",
  renderAndWaitForResponse: ({ status, respond }) => {
    if (status === "inProgress" || status === "executing") {
      return (
        <ConsultationForm
          onSubmit={async (formData) => {
            // 1. Submit to database
            const result = await submitConsultationRequest(formData);
            
            // 2. Notify CopilotKit of the result
            respond?.({
              success: result.success,
              message: result.success 
                ? "✅ Thanks! We'll be in touch soon."
                : `❌ Error: ${result.error}`
            });
          }}
          onCancel={() => {
            respond?.({
              success: false,
              message: "Consultation request was cancelled."
            });
          }}
        />
      );
    }
    return null;
  },
});
```

## Complete Data Flow

```
1. User: "I need to schedule a consult"
   ↓
2. AI: Calls scheduleConsultation action
   ↓
3. CopilotKit: Calls renderAndWaitForResponse({ status: "inProgress", respond })
   ↓
4. UI: ConsultationForm renders in chat
   ↓
5. User: Fills out form (name, email, phone, company, message)
   ↓
6. User: Clicks "Submit Request"
   ↓
7. Form: Calls onSubmit(formData) (async)
   ↓
8. Handler: submitConsultationRequest(formData)
   ↓
9. Server Action: 
   - Validates form data (Zod)
   - Checks rate limit
   - Saves to NeonDB contacts table
   ↓
10. Handler: Receives result from server action
   ↓
11. Handler: Calls respond?.({ success: true/false, message: "..." })
   ↓
12. CopilotKit: Receives response data
   ↓
13. AI: Displays success/error message to user
```

## Files Changed

### 1. `components/global-ai-tools.tsx`
**Changes:**
- ✅ Removed `useCopilotContext()` import and usage
- ✅ Replaced `render` + `handler` with `renderAndWaitForResponse`
- ✅ Moved database submission logic into the `onSubmit` callback
- ✅ Added proper error handling with `respond?.()`
- ✅ Added comprehensive console logging for debugging

**Key Code:**
```typescript
renderAndWaitForResponse: ({ status, respond }) => {
  if (status === "inProgress" || status === "executing") {
    return (
      <ConsultationForm
        onSubmit={async (formData) => {
          try {
            const result = await submitConsultationRequest({ ...formData });
            if (result.success) {
              toast.success(result.message);
              respond?.({ success: true, message: "✅ Thanks! ..." });
            } else {
              toast.error(result.error);
              respond?.({ success: false, message: `❌ Error: ...` });
            }
          } catch (error) {
            console.error("Error submitting consultation:", error);
            respond?.({ success: false, message: `❌ Unexpected error: ...` });
          }
        }}
        onCancel={() => {
          respond?.({ success: false, message: "Cancelled." });
        }}
      />
    );
  }
  return null;
},
```

### 2. `components/ai/consultation-form.tsx`
**Changes:**
- ✅ Updated `onSubmit` prop type to support async: `(data: FormData) => void | Promise<void>`
- ✅ Made `handleSubmit` async to properly await database submission
- ✅ Added loading state to submit button
- ✅ Disabled buttons during submission

**Key Code:**
```typescript
const handleSubmit = async (data: FormData) => {
  if (onSubmit) {
    await onSubmit(data); // Properly await async submission
  }
};

// In JSX:
<Button 
  type="submit" 
  disabled={form.formState.isSubmitting}
>
  {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
</Button>
```

## Database Integration

The form now correctly saves data to NeonDB through the existing infrastructure:

1. **Form Data** → `submitConsultationRequest()` (wrapper)
2. **Wrapper** → `submitContactForm()` (server action)
3. **Server Action** → Validates, rate-limits, and saves to NeonDB `contacts` table

### Database Schema (NeonDB `contacts` table):
```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Data Mapping:
- `name` → `contacts.name`
- `email` → `contacts.email`
- `phone` → `contacts.phone` (optional)
- `company` → `contacts.company` (optional)
- `message` → `contacts.message`
- `subject` → "AI Consultation Request" (auto-set)

## Testing

### Test 1: Successful Submission
1. Start dev server: `pnpm run dev`
2. Open chat on any page
3. Type: `"I need to schedule a consultation"`
4. AI should render the form
5. Fill out all required fields:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "+1 555-123-4567" (optional)
   - Company: "Acme Inc" (optional)
   - Message: "Interested in AI consulting services"
6. Click "Submit Request"
7. **Expected:**
   - Green toast: "Your message has been sent successfully!"
   - AI message: "✅ Thanks! Your consultation request has been submitted. We'll be in touch soon via email."
   - Data saved to NeonDB

### Test 2: Cancel Form
1. Open chat, trigger form
2. Click "Cancel" button
3. **Expected:**
   - Form closes
   - AI message: "Consultation request was cancelled..."
   - No data saved

### Test 3: Validation Error
1. Open chat, trigger form
2. Fill only name, leave email blank
3. Try to submit
4. **Expected:**
   - Red validation error under email field
   - Form does NOT submit
   - No database call

### Test 4: Rate Limit
1. Submit 5 consultations quickly
2. Try 6th submission
3. **Expected:**
   - Server action blocks request
   - Red toast: "Too many requests..."
   - AI shows error message

### Verify in Database

Connect to NeonDB and check:
```sql
SELECT * FROM contacts 
WHERE subject = 'AI Consultation Request' 
ORDER BY created_at DESC 
LIMIT 5;
```

## Debug Logging

The implementation includes comprehensive logging:

```typescript
console.log('[Global AI Tools] Form submitted with data:', {
  name: formData.name,
  email: formData.email,
  hasCompany: !!formData.company,
  hasPhone: !!formData.phone,
  messageLength: formData.message?.length || 0
});

console.log('[Global AI Tools] Server action result:', result);
```

Check browser console and terminal for these logs during submission.

## Key Takeaways

1. **`renderAndWaitForResponse` is a property, not a function**
   - It's part of `useCopilotAction`, not accessed via context

2. **It replaces both `render` and `handler`**
   - Don't use separate `render` and `handler` properties with it

3. **The `respond` callback is how you return data to the AI**
   - Call `respond?.({ ...data })` to pass results back

4. **Database operations happen BEFORE calling `respond`**
   - Do async work (like DB saves) first
   - Then call `respond` with the result

5. **The form component should handle async submissions**
   - Make `onSubmit` async
   - Add loading states
   - Disable buttons during submission

## References

- [CopilotKit Documentation](https://docs.copilotkit.ai)
- [CopilotKit GitHub - HITL Examples](https://github.com/CopilotKit/CopilotKit)
- [useCopilotAction Hook Reference](https://docs.copilotkit.ai/reference/hooks/useCopilotAction)

## Status

✅ **FIXED** - Consultation form now correctly:
- Renders in chat via generative UI
- Captures all required fields (name, email, phone, company, message)
- Validates input with Zod
- Submits to NeonDB via secure server action
- Shows loading states during submission
- Displays success/error messages via toast and AI response
- Properly integrates with CopilotKit's HITL pattern

