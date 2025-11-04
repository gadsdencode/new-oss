# Quick Test Guide: Global AI Tools

**Goal:** Verify that Generative UI tools work on EVERY page

---

## Prerequisites

```bash
# Start dev server
pnpm dev
```

Wait for: `✓ Ready on http://localhost:3000`

---

## Test Matrix

| Page | URL | Test Phrase | Expected Result |
|------|-----|-------------|-----------------|
| Home | `/` | "I want to schedule a consultation" | ✅ Form appears |
| Consulting | `/consulting` | "What services do you offer?" | ✅ Services card appears |
| Research | `/research` | "Check system status" | ✅ Status card appears |
| Compliance | `/compliance` | "Book a call" | ✅ Form appears |
| Contact | `/contact` | "Show me your services" | ✅ Services card appears |

---

## Detailed Test 1: Homepage

### Steps:
1. Navigate to: `http://localhost:3000/`
2. Open CopilotKit chat (click chat icon)
3. Type: **"I'd like to schedule a consultation"**

### Expected Outcome:
```
✅ AI recognizes intent
✅ Form renders in chat window
✅ Form has fields: Name, Email, Company, Message
✅ Submit and Cancel buttons visible
```

### Terminal Should Show:
```
========== NEW COPILOTKIT REQUEST ==========
📨 Received 2 messages, 3 tools
🔧 Tools available:
   1. scheduleConsultation - Schedules a consultation call...
   2. showCoreServices - Displays a summary...
   3. getSystemStatus - Fetches and displays...
```

**Key Check:** **"3 tools"** should appear!

---

## Detailed Test 2: Fill Out Form

### Steps:
1. Continue from Test 1 (form should be visible)
2. Fill in form:
   - Name: "John Doe"
   - Email: "john@test.com"
   - Company: "Test Corp" (optional)
   - Message: "I need help with AI strategy for my business"
3. Click "Submit Request"

### Expected Outcome:
```
✅ Form submits successfully
✅ Toast notification appears: "Your message has been sent successfully!"
✅ AI responds: "Thanks! Your consultation request has been submitted..."
```

### Terminal Should Show:
```
[Contact Form] ===== SUBMISSION STARTED =====
[Contact Form] ✅ Rate limit check passed
[Contact Form] ✅ Database URL found
[Contact Form] Form data validated successfully
[Contact Form] Successfully inserted submission into database
```

---

## Detailed Test 3: Services on Different Page

### Steps:
1. Navigate to: `http://localhost:3000/consulting`
2. Open CopilotKit chat
3. Type: **"What services do you offer?"**

### Expected Outcome:
```
✅ AI responds immediately
✅ Services card renders in chat
✅ Card shows 6 services:
   • AI Strategy & Roadmap
   • AI Implementation
   • AI Operations & Optimization
   • AI Training & Enablement
   • AI Governance & Ethics
   • AI Analytics & Insights
✅ AI text response appears below card
```

---

## Detailed Test 4: System Status on Another Page

### Steps:
1. Navigate to: `http://localhost:3000/research`
2. Open CopilotKit chat
3. Type: **"What's your system status?"**

### Expected Outcome:
```
✅ AI shows "Checking system status..." (briefly)
✅ Status card renders with:
   • Overall Status: "All systems operational"
   • Database: "connected"
   • AI Endpoint: "healthy"
✅ All badges are green
```

---

## Quick Test All Pages

### Test Consultation Form Availability:

Type **"book a call"** on each page:

- ✅ `/` (homepage) → Form appears
- ✅ `/consulting` → Form appears
- ✅ `/research` → Form appears
- ✅ `/compliance` → Form appears
- ✅ `/contact` → Form appears

**If form appears on ALL pages → ✅ WORKING!**

---

## What Success Looks Like

### Terminal Output (Every Page):
```bash
========== NEW COPILOTKIT REQUEST ==========
Timestamp: 2025-11-04T...
📨 Received X messages, 3 tools
🔧 Tools available:
   1. scheduleConsultation - Schedules a consultation call with the user...
   2. showCoreServices - Displays a summary of the company's core AI...
   3. getSystemStatus - Fetches and displays the current system status...
🔧 Binding tools to model...
✅ Stream created successfully
```

### Browser Behavior:
```
✅ Chat opens on any page
✅ Tools work on any page
✅ Forms render correctly
✅ Components display properly
✅ Data submits successfully
✅ Toast notifications appear
```

---

## Troubleshooting

### Problem: "0 tools" in terminal

**Solution:**
```bash
rm -rf .next
pnpm dev
```

### Problem: Form doesn't appear

**Check:**
1. Browser console for errors (F12 → Console)
2. Verify on `/consulting` page first
3. Check if `<GlobalAITools />` is in `app/layout.tsx`

### Problem: Works on one page, not others

**Solution:**
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Restart dev server

---

## Alternative Test Phrases

### For Consultation Form:
- "I want to schedule a consultation"
- "Book a call"
- "I'd like to talk to someone"
- "Schedule a meeting"
- "Request a consultation"

### For Services Card:
- "What services do you offer?"
- "Tell me what you do"
- "Show me your services"
- "What are your offerings?"
- "What can you help me with?"

### For System Status:
- "What's your system status?"
- "Are your systems working?"
- "Check system health"
- "Show me the status"
- "Is everything operational?"

---

## Expected Results Summary

| Test | Status | Details |
|------|--------|---------|
| Tools Available Everywhere | ✅ | 3 tools on all pages |
| Consultation Form | ✅ | Renders and submits |
| Services Card | ✅ | Displays 6 services |
| System Status | ✅ | Shows live status |
| Database Integration | ✅ | Data saves correctly |
| Toast Notifications | ✅ | Success/error messages |
| Performance | ✅ | Fast, no lag |

---

## Report Results

### ✅ If Everything Works:

**You'll see:**
- Forms render on all pages
- Components display correctly
- Data submits successfully
- Terminal shows "3 tools" everywhere

**Message:** "All tests passed! Global tools working perfectly."

---

### ❌ If Something Fails:

**Provide:**
1. **Which page** you're testing on
2. **What you typed** in chat
3. **What happened** (or didn't happen)
4. **Terminal output** (copy from "NEW COPILOTKIT REQUEST")
5. **Browser console errors** (F12 → Console tab)

---

## Quick Checklist

Before reporting success, verify:

- [ ] Dev server running (`pnpm dev`)
- [ ] Tested on at least 3 different pages
- [ ] Terminal shows "3 tools" on each page
- [ ] Consultation form renders and submits
- [ ] Services card displays all 6 services
- [ ] System status fetches and renders
- [ ] No errors in browser console
- [ ] No errors in terminal

**If all checked → ✅ WORKING!**

---

## Time Required

- **Quick Test:** 5 minutes (test one tool on 3 pages)
- **Thorough Test:** 15 minutes (all tools on all pages)
- **Full Test:** 30 minutes (all tools, all pages, all variations)

---

## Next Steps After Testing

### If Working:
1. ✅ Mark as production ready
2. ✅ Consider adding more global tools
3. ✅ Add page-specific tools where needed
4. ✅ Monitor usage analytics

### If Issues:
1. Document specific failure
2. Check `GLOBAL_AI_TOOLS_SETUP.md` for troubleshooting
3. Verify environment variables
4. Check for conflicting components

---

**Ready to test? Start with Test 1 on the homepage!** 🚀

