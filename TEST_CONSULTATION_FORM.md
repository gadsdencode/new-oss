# Quick Test Guide: Consultation Form → NeonDB

## 🧪 Quick Test

### Step 1: Trigger the Form
In the AI chat, type:
```
I'd like to schedule a consultation
```
OR
```
Can we book a meeting?
```

### Step 2: Fill Out the Form
The AI will render a form with these fields:

**Required:**
- ✅ Full Name (min 2 characters)
- ✅ Email (valid email format)
- ✅ Message (min 10 characters)

**Optional:**
- 📞 Phone
- 🏢 Company

### Step 3: Submit
Click **"Submit Request"** button

### Step 4: Verify Success
You should see:
1. ✅ Green toast notification: "Your message has been sent successfully!"
2. ✅ AI response: "✅ Thanks! Your consultation request has been submitted. We'll be in touch soon via email."

---

## 📊 Verify in Database

Connect to your NeonDB and run:

```sql
-- Get the most recent consultation request
SELECT 
  id,
  name,
  email,
  phone,
  company,
  subject,
  message,
  created_at
FROM contact_submissions
WHERE subject = 'AI Consultation Request'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
- ✅ All filled fields are saved
- ✅ Subject is "AI Consultation Request"
- ✅ Optional empty fields are NULL
- ✅ Timestamp is recent

---

## 🔍 Check Logs

### Browser Console (F12)
Look for:
```
[Global AI Tools] Form data received from user: {
  name: "...",
  email: "...",
  hasCompany: true/false,
  hasPhone: true/false,
  messageLength: ##
}
```

### Server Terminal
Look for:
```
[Consultation Wrapper] Processing consultation request: {...}
[Contact Form] ✅ Rate limit check passed (remaining: #)
[Contact Form] Form data validated successfully
[Contact Form] Successfully inserted submission into database
[Consultation Wrapper] Server action result: { success: true, ... }
```

---

## ✅ Test Scenarios

### Test 1: All Fields Filled
```
Name: John Doe
Email: john@company.com
Phone: +1 (555) 123-4567
Company: Acme Inc.
Message: I need help implementing AI into our workflow
```
**Expected**: All fields saved to database

---

### Test 2: Required Fields Only
```
Name: Jane Smith
Email: jane@example.com
Phone: [empty]
Company: [empty]
Message: I'm interested in your consulting services
```
**Expected**: Saves successfully with phone/company as NULL

---

### Test 3: Invalid Email
```
Name: Bob
Email: notanemail
Message: Hello
```
**Expected**: ❌ Client-side error: "Invalid email address"

---

### Test 4: Name Too Short
```
Name: J
Email: j@test.com
Message: Test message here
```
**Expected**: ❌ Client-side error: "Name must be at least 2 characters"

---

### Test 5: Message Too Short
```
Name: John Doe
Email: john@test.com
Message: Hi
```
**Expected**: ❌ Client-side error: "Please provide at least 10 characters"

---

## 🐛 Troubleshooting

### Issue: Form doesn't appear
**Check**: 
- Is `pnpm run dev` running?
- Are there console errors?
- Is CopilotKit chat visible?

### Issue: Form submits but no database entry
**Check**:
1. Environment variables (DATABASE_URL or NEWOSS_DATABASE_URL)
2. Database connection in terminal logs
3. Table `contact_submissions` exists
4. Check for SQL errors in terminal

### Issue: "Rate limit exceeded"
**Wait**: Rate limit resets after time window (check `lib/rate-limit.ts`)

### Issue: Validation errors not showing
**Check**: Form field has `<FormMessage />` component

---

## 📝 Data Flow Diagram

```
User Types "schedule consultation"
         ↓
AI invokes scheduleConsultation action
         ↓
ConsultationForm renders in chat
         ↓
User fills form + clicks Submit
         ↓
Client-side validation (Zod)
         ↓
submitConsultationRequest() wrapper
         ↓
Convert to FormData
         ↓
submitContactForm() server action
         ↓
Rate limit check
         ↓
Server-side validation (Zod)
         ↓
INSERT into NeonDB contact_submissions
         ↓
Return success/error
         ↓
Show toast notification
         ↓
AI responds to user
```

---

## 🎯 Success Indicators

✅ Form renders when user asks  
✅ All fields present (name, email, phone, company, message)  
✅ Validation works (client + server)  
✅ Data saves to database  
✅ Success toast appears  
✅ AI confirms submission  
✅ Phone field saves (or NULL)  
✅ Subject = "AI Consultation Request"  
✅ created_at timestamp is correct  

---

## 📚 Documentation

- **Full Integration Guide**: `CONSULTATION_FORM_NEONDB_INTEGRATION.md`
- **Fix Summary**: `CONSULTATION_FORM_FIX_SUMMARY.md`

---

## 🚀 Ready to Test!

1. Start dev server: `pnpm run dev`
2. Open http://localhost:3000
3. Open AI chat sidebar
4. Type: "I'd like to schedule a consultation"
5. Fill out the form
6. Click Submit
7. Check for success toast
8. Verify in database

**That's it! Your consultation form is now fully integrated with NeonDB! 🎉**

