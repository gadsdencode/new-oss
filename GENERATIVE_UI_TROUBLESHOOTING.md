# CopilotKit Generative UI Troubleshooting Guide

**Issue:** Tools not being invoked by the AI

---

## Diagnostic Steps

### Step 1: Check Terminal Logs

When you send a message, check your **development terminal** for these logs:

```
========== NEW COPILOTKIT REQUEST ==========
Timestamp: 2025-11-04T...
📨 Received X messages, Y tools
```

**Expected Result:**
- Should show `3 tools` (scheduleConsultation, showCoreServices, getSystemStatus)
- If it shows `0 tools`, the actions aren't being registered

**If you see `⚠️ WARNING: No tools received!`:**
→ The actions aren't being passed to the backend. Continue to Step 2.

---

### Step 2: Verify Page is Loading Tools Component

1. Open browser console (F12)
2. Navigate to `/consulting`
3. Check for any React errors
4. Verify the page loads without errors

**Common Issue:** `ConsultingPageTools` component not imported or not rendering.

**Fix:** Verify `app/consulting/page.tsx` has:
```tsx
import { ConsultingPageTools } from "./consulting-tools";

export default function AIConsultingPage() {
  return (
    <>
      <PageAiContext ... />
      <ConsultingPageTools />  {/* ← Must be here! */}
      <div>...</div>
    </>
  );
}
```

---

### Step 3: Check Browser Console for Errors

Open browser DevTools (F12) → Console tab

**Look for:**
- CopilotKit errors
- React component errors
- Failed fetch requests
- Hook errors

**Common errors:**
```
Error: useCopilotAction must be called within CopilotProvider
```
→ The CopilotKit provider might not be wrapping the page correctly.

---

### Step 4: Verify CopilotKit Provider Setup

Check `app/layout.tsx`:

```tsx
<CopilotKit runtimeUrl="/api/copilotkit">
  {children}
</CopilotKit>
```

**The provider must wrap all pages using CopilotKit hooks.**

---

### Step 5: Test if Tools are Registered

Add this debug code to `app/consulting/consulting-tools.tsx`:

```tsx
export function ConsultingPageTools() {
  console.log("🎯 ConsultingPageTools component mounted!");
  
  useCopilotAction({
    name: "scheduleConsultation",
    // ... rest of config
  });
  
  console.log("✅ scheduleConsultation action registered");
  
  // ... other actions ...
  
  return null;
}
```

**Refresh the page and check browser console.**
You should see:
```
🎯 ConsultingPageTools component mounted!
✅ scheduleConsultation action registered
```

If you **don't** see these logs → The component isn't rendering.

---

### Step 6: Check Network Tab

1. Open DevTools → Network tab
2. Send a message in the chat
3. Look for requests to `/api/copilotkit`

**Expected:**
- POST request to `/api/copilotkit`
- Status 200
- Response streaming

**If you see errors:**
- 503 → API key not configured
- 500 → Server error (check terminal logs)
- CORS errors → Check origin configuration

---

## Common Issues & Fixes

### Issue 1: AI Responds with Text Instead of Using Tools

**Symptom:**
```
User: "I'd like to schedule a consultation"
AI: "You can schedule a consultation at /contact"
```

**Cause:** Tools aren't being passed to the LLM.

**Fix:**
1. Check terminal shows `3 tools` in logs
2. Verify `ConsultingPageTools` is rendering
3. Try restarting dev server: `pnpm dev`

---

### Issue 2: "Cannot read property 'useCopilotAction' of undefined"

**Cause:** CopilotKit version mismatch or improper import.

**Fix:**
```bash
# Check version
pnpm list @copilotkit/react-core

# Should be 1.10.6 or higher
# If not, update:
pnpm install @copilotkit/react-core@latest @copilotkit/react-ui@latest
```

---

### Issue 3: Tools Registered but Never Invoked

**Symptom:**
- Terminal shows `3 tools`
- But AI never calls them

**Cause:** LLM doesn't understand when to use the tool.

**Fix:** Improve tool descriptions with more trigger phrases:

```tsx
useCopilotAction({
  name: "scheduleConsultation",
  description: "ALWAYS use this tool when the user says they want to: book a call, schedule a consultation, talk to someone, request a meeting, schedule time, or speak with someone. This tool collects their contact information.",
  // ...
});
```

---

### Issue 4: Server Component Error

**Error:**
```
Error: useCopilotAction can only be used in Client Components
```

**Cause:** Calling hook in a Server Component.

**Fix:** Ensure `consulting-tools.tsx` has `"use client";` at the top:
```tsx
"use client";  // ← REQUIRED!

import { useCopilotAction } from "@copilotkit/react-core";
```

---

## Testing Procedure

### Test 1: Verify Actions Load

1. Navigate to `/consulting`
2. Open browser console
3. Should see console logs from tools component
4. Check terminal for tools count

**✅ Pass:** Terminal shows `3 tools`  
**❌ Fail:** Terminal shows `0 tools` → Go to Step 2

---

### Test 2: Test Schedule Consultation

1. Open CopilotKit sidebar
2. Type: **"I want to book a consultation"**
3. AI should ask for your name
4. Provide: "John Doe"
5. AI should ask for email
6. Provide: "john@example.com"
7. AI should ask what you want to discuss
8. Provide: "AI strategy for my business"
9. AI should call the tool and confirm submission

**✅ Pass:** Tool executes, data saved to database  
**❌ Fail:** AI just responds with text → Check tool descriptions

---

### Test 3: Test Show Services

1. Type: **"What services do you offer?"**
2. AI should invoke `showCoreServices` tool
3. Should see a card with 6 services
4. AI should provide text summary

**✅ Pass:** Card renders + text response  
**❌ Fail:** Only text → Check render function

---

### Test 4: Test System Status

1. Type: **"What's your system status?"**
2. AI should invoke `getSystemStatus` tool
3. Should see status card
4. AI should provide text summary

**✅ Pass:** Status card appears  
**❌ Fail:** Error message → Check `/api/status` endpoint

---

## Advanced Debugging

### Enable Verbose Logging

In `app/api/copilotkit/route.ts`, the logLevel is already set to `"debug"`:

```tsx
const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime: copilotRuntime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
  logLevel: "debug",  // ← Enables detailed logs
});
```

Check terminal for detailed execution logs.

---

### Inspect Tool Transmission

Add this to `app/api/copilotkit/route.ts` in the `chainFn`:

```tsx
chainFn: async ({ messages, tools }) => {
  console.log("🔍 DETAILED TOOL INSPECTION:");
  if (tools) {
    tools.forEach(tool => {
      console.log("Tool:", JSON.stringify(tool, null, 2));
    });
  }
  // ... rest of function
}
```

---

### Check CopilotKit Version Compatibility

```bash
pnpm list @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
```

**All should be version 1.10.6 or higher.**

If not:
```bash
pnpm install @copilotkit/react-core@latest @copilotkit/react-ui@latest @copilotkit/runtime@latest
```

---

## Still Not Working?

### Quick Reset

1. **Clear Next.js cache:**
```bash
rm -rf .next
pnpm dev
```

2. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
pnpm dev
```

3. **Hard refresh browser:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

### Check Environment Variables

Verify `.env.local` has:
```bash
GEMINI_API_KEY=your_key_here
# or
GOOGLE_API_KEY=your_key_here
```

Test the API:
```bash
curl http://localhost:3000/api/test-env
```

---

### Simplest Possible Test

Create a minimal test action to verify the system works:

```tsx
// In consulting-tools.tsx
useCopilotAction({
  name: "testAction",
  description: "TEST ACTION - Use this when user says 'test'",
  parameters: [],
  handler: async () => {
    console.log("🎉 TEST ACTION CALLED!");
    return "Test action works!";
  },
});
```

Then type: **"test"** in the chat.

If this works → Your setup is correct, tool descriptions need improvement  
If this doesn't work → There's a configuration issue

---

## Reporting Issues

If none of these steps work, provide:

1. **Terminal logs** (full output)
2. **Browser console logs** (screenshot)
3. **Network tab** (screenshot of /api/copilotkit request)
4. **Package versions:**
```bash
pnpm list @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
```
5. **Node version:**
```bash
node --version
```

---

## Expected Behavior

### Successful Tool Invocation:

**Terminal:**
```
========== NEW COPILOTKIT REQUEST ==========
📨 Received 2 messages, 3 tools
🔧 Tools available:
   1. scheduleConsultation - Schedules a consultation call...
   2. showCoreServices - Displays a summary of core AI consulting services...
   3. getSystemStatus - Fetches and displays current system status...
🔧 Binding tools to model...
✅ Stream created successfully
```

**User sees:**
- AI asks follow-up questions to collect parameters
- OR AI renders a UI component
- Tool handler executes
- Result shown to user

---

## Additional Resources

- [CopilotKit Actions Docs](https://docs.copilotkit.ai/reference/hooks/useCopilotAction)
- [LangChain Adapter Docs](https://docs.copilotkit.ai/coagents/langchain-adapter)
- [Generative UI Guide](https://docs.copilotkit.ai/concepts/generative-ui)

---

**Last Updated:** November 4, 2025  
**Status:** Production Ready

