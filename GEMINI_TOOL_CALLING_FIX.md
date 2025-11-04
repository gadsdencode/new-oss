# Gemini 2.5 Flash Tool Calling Fix

## Problem Description

When users asked questions that should trigger tools (e.g., "what is your system status"), the AI would either:
- Respond with a blank/empty message
- Respond with plain text instead of calling the appropriate tool

Despite tools being properly registered and showing in logs as `available: "enabled"`, the LLM (Gemini 2.5 Flash) was choosing NOT to call them.

### Terminal Evidence
```
📨 Received 2 messages, 3 tools
🔧 Tools available:
   1. scheduleConsultation - ...
   2. showCoreServices - ...
   3. getSystemStatus - ...
📝 First user message: whats the system status
🔧 Binding tools to model...
[15:57:37.183] DEBUG: Event stream completed  ← Completed without calling any tool!
```

## Root Cause

Gemini 2.5 Flash + LangChain has a known issue where the model frequently ignores registered tools and responds with text instead. This is documented in multiple sources:

1. **LangChain Forum**: "How to force llm model(gemini-2.5-flash) to use tool"
   - https://forum.langchain.com/t/how-to-force-llm-model-gemini-2-5-flash-to-use-tool/1443
   
2. **Reddit Discussion**: Multiple users reporting tools being skipped
   - https://www.reddit.com/r/LangChain/comments/1hdksj8/why_my_agent_is_not_calling_the_tools_please_help/

3. **GitHub Issues**: Multiple issues in langchain-ai/langchainjs about Gemini function calling
   - Issue #7705: "Gemini Flash 2 not making function calls In Langgraphjs"
   - Issue #8454: "Fails to Parse Parallel Tool Calls from Gemini 2.5 Flash"

The model has a bias against using tools, especially at higher temperatures.

## The Fix

We implemented a **two-pronged approach** to force Gemini to reliably call tools:

### 1. Lower Temperature to 0 (Deterministic Mode)

**File**: `app/api/copilotkit/route.ts`

**Change**:
```typescript
const model = new ChatGoogleGenerativeAI({
  model: modelName,
  apiKey: apiKey,
  temperature: 0,  // Changed from 0.7 to 0 for more reliable tool calling
  maxOutputTokens: 2048,
});
```

**Why**: Lower temperature makes the model more deterministic and reduces the likelihood of it "creatively" avoiding tool calls.

### 2. Hyper-Directive Tool Descriptions

**File**: `components/global-ai-tools.tsx`

**Before**:
```typescript
description: "Fetches and displays the current system status including database and AI endpoint health. Use this when the user asks about system status, uptime, or service health."
```

**After**:
```typescript
description: "CALL THIS TOOL to fetch and display system status. ALWAYS use this tool when the user asks: 'what is the system status', 'check system status', 'system health', 'is the system up', 'server status', or any similar query about system/server/service status or uptime. DO NOT respond with text - CALL THIS TOOL."
```

**Why**: 
- **Imperative language** ("CALL THIS TOOL", "ALWAYS use this", "DO NOT respond with text")
- **Explicit examples** of user queries that should trigger the tool
- **Negative instructions** telling the model what NOT to do
- Makes it unmistakably clear when the tool should be used

## Changes Made

### Modified Files

1. **`app/api/copilotkit/route.ts`**
   - Changed `temperature` from `0.7` to `0` in `ChatGoogleGenerativeAI` configuration
   - Added comments explaining the reasoning

2. **`components/global-ai-tools.tsx`**
   - Updated all three tool descriptions to use hyper-directive language:
     - `scheduleConsultation`: Now explicitly lists user query patterns
     - `showCoreServices`: Emphasizes showing visual card vs. describing
     - `getSystemStatus`: Uses ALL CAPS directives and multiple example queries

## Testing

To test the fix:

1. **Start the dev server**: `pnpm run dev`
2. **Open the app**: Navigate to any page (tools are global)
3. **Test each tool**:
   - "what is your system status" → Should call `getSystemStatus` and show StatusCard
   - "what services do you offer" → Should call `showCoreServices` and show ServicesSummaryCard
   - "book a consultation" → Should call `scheduleConsultation` and show ConsultationForm

### Expected Behavior

When a tool is called, you should see in the terminal:
```
🔧 Binding tools to model...
```

And in the chat UI:
- A visual component rendered (form, card, etc.)
- NOT just a text response

## Why This Approach Over `tool_choice`

The LangChain forum post suggested using `bindTools` with `tool_choice: "any"` to force tool calls. However:

1. **`tool_choice` is NOT supported** by `ChatGoogleGenerativeAI` in the LangChain TypeScript SDK
2. **`tool_choice: "any"` would force ALL queries** to call tools, even "hello" or "tell me a joke"
3. **Our approach is more nuanced**: The LLM can still respond normally to general queries, but is heavily biased toward using tools for appropriate queries

## Alternative Solutions Considered

### Option A: Force Tool Choice (Rejected)
```typescript
model.bindTools(tools, { tool_choice: "any" })
```
- **Pros**: Guarantees tool usage
- **Cons**: 
  - Not supported by ChatGoogleGenerativeAI
  - Would force tool calls for every query
  - Poor UX for conversational queries

### Option B: Switch LLM Provider (Not Pursued)
- Use OpenAI GPT-4 or Claude instead of Gemini
- **Pros**: More reliable tool calling
- **Cons**: 
  - Different cost structure
  - Requires API key changes
  - Gemini 2.5 Flash is faster and cheaper

### Option C: Add System-Level Instructions (Could Be Added)
```typescript
useCopilotAdditionalInstructions({
  instructions: "You MUST use available tools when the user asks questions that match tool descriptions. Do not respond with text when a tool is available."
});
```
- Could be added as an additional layer if current fix insufficient
- Would affect all pages globally

## Monitoring

Watch for these patterns in terminal logs:

### ✅ Good - Tool Called
```
📨 Received 2 messages, 3 tools
🔧 Tools available:
   1. scheduleConsultation - ...
   2. showCoreServices - ...
   3. getSystemStatus - ...
📝 First user message: whats the system status
🔧 Binding tools to model...
[Tool execution logs...]
```

### ❌ Bad - Tool Ignored
```
📨 Received 2 messages, 3 tools
🔧 Tools available:
   1. scheduleConsultation - ...
   2. showCoreServices - ...
   3. getSystemStatus - ...
📝 First user message: whats the system status
🔧 Binding tools to model...
[15:57:37.183] DEBUG: Event stream completed  ← No tool call!
```

## Related Documentation

- `FINAL_FIX_AVAILABLE_PROPERTY.md` - Previous fix for `available` property
- `GENERATIVE_UI_FIX_RENDER_PATTERN.md` - How render patterns work
- `GLOBAL_AI_TOOLS_SETUP.md` - How global tools are configured
- `IMPLEMENTATION_COMPLETE.md` - Overall Generative UI implementation

## If the Fix Doesn't Work

If tools are still not being called after this fix:

1. **Check terminal logs** - Confirm tools are being registered
2. **Verify API key** - Ensure Gemini API key is valid
3. **Try even more directive language** - Make descriptions even MORE imperative
4. **Add global instructions** - Use `useCopilotAdditionalInstructions` in layout
5. **Consider switching models** - Try `gemini-2.0-pro` instead of `gemini-2.5-flash`
6. **Report to CopilotKit** - This may be a framework-level issue that needs addressing

## Resources

- LangChain Forum: https://forum.langchain.com/t/how-to-force-llm-model-gemini-2-5-flash-to-use-tool/1443
- LangChain Tool Calling Docs: https://js.langchain.com/docs/how_to/tool_calling/
- Google Gemini API: https://aistudio.google.com/app/apikey
- CopilotKit Docs: https://docs.copilotkit.ai/

## Date
November 4, 2025

