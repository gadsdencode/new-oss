# CopilotKit CoAgents - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start Your LangGraph Agent Server

**Option A: Use CoAgents Starter (Recommended)**

```bash
# Python
git clone --depth=1 https://github.com/CopilotKit/CopilotKit
cd CopilotKit/examples/coagents-starter/agent-py
pip install poetry
poetry install
poetry run dev
```

**Option B: Bring Your Own Agent**

```bash
# Install CopilotKit SDK in your agent project
pip install copilotkit  # Python
# OR
npm install @copilotkit/sdk-js  # JavaScript
```

### Step 2: Configure Environment

Create or update `.env.local`:

```bash
REMOTE_ACTION_URL=http://localhost:8000/copilotkit
```

### Step 3: Start Next.js

```bash
npm run dev
```

### Step 4: Test the Connection

Open your Next.js app and try the Copilot chat. It should now connect to your LangGraph agent!

---

## 📝 Essential Code Snippets

### Frontend: Using CoAgent State

```typescript
import { useCoAgent } from "@copilotkit/react-core";

function MyComponent() {
  // Sync state with your LangGraph agent
  const { state, setState } = useCoAgent({
    name: "your_agent_name",
    initialState: {
      // Your initial state
    },
  });

  return <div>{JSON.stringify(state)}</div>;
}
```

### Agent: Python with CopilotKit SDK

```python
from copilotkit import CopilotKitSDK
from langgraph.graph import StateGraph

# Create your LangGraph graph
graph = StateGraph(YourState)
# ... build your graph ...

# Wrap with CopilotKit
sdk = CopilotKitSDK(graph=graph)
app = sdk.create_fastapi_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Agent: TypeScript with CopilotKit SDK

```typescript
import { CopilotKitSDK } from '@copilotkit/sdk-js';
import { StateGraph } from '@langchain/langgraph';

// Create your LangGraph graph
const graph = new StateGraph(...);
// ... build your graph ...

// Wrap with CopilotKit
const sdk = new CopilotKitSDK({ graph });
const app = sdk.createExpressApp();

app.listen(8000);
```

---

## 🔧 Configuration Options

### Option 1: Direct Remote Endpoint (Default)

```typescript
// app/api/copilotkit/route.ts
const runtime = new CopilotRuntime({
  remoteEndpoints: [
    {
      url: process.env.REMOTE_ACTION_URL || "http://localhost:8000/copilotkit",
    },
  ],
});
```

### Option 2: LangGraph Platform (Production)

```typescript
// Uncomment in app/api/copilotkit/route.ts
import { langGraphPlatformEndpoint } from "@copilotkit/runtime";

const runtime = new CopilotRuntime({
  remoteEndpoints: [
    langGraphPlatformEndpoint({
      deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL,
      langsmithApiKey: process.env.LANGSMITH_API_KEY,
      agents: [
        {
          name: "your_agent",
          description: "Your agent description",
        },
      ],
    }),
  ],
});
```

---

## 🎯 Common Use Cases

### 1. Research Assistant

```typescript
const { state } = useCoAgent({
  name: "research_agent",
  initialState: {
    query: "",
    results: [],
  },
});
```

### 2. Travel Planner

```typescript
const { state } = useCoAgent({
  name: "travel_agent",
  initialState: {
    destination: "",
    itinerary: [],
  },
});
```

### 3. Code Generator

```typescript
const { state } = useCoAgent({
  name: "code_agent",
  initialState: {
    prompt: "",
    code: "",
  },
});
```

---

## 🐛 Troubleshooting

### "Cannot connect to agent"
```bash
# Verify agent is running
curl http://localhost:8000/health

# Check environment variable
echo $REMOTE_ACTION_URL
```

### "State not syncing"
```typescript
// Ensure agent name matches
useCoAgent({ name: "exact_agent_name" })  // Must match your agent
```

### "Port already in use"
```bash
# Change agent port in your agent startup
# Then update REMOTE_ACTION_URL accordingly
REMOTE_ACTION_URL=http://localhost:8001/copilotkit
```

---

## 📚 Learn More

| Resource | Link |
|----------|------|
| Full Setup Guide | `COPILOTKIT_COAGENTS_SETUP.md` |
| Update Summary | `COPILOTKIT_UPDATE_SUMMARY.md` |
| Official Docs | https://docs.copilotkit.ai |
| CoAgents Starter | https://github.com/CopilotKit/coagents-starter-langgraph |

---

## ✅ Checklist

Before you start:
- [ ] LangGraph agent server is ready
- [ ] `REMOTE_ACTION_URL` is configured
- [ ] Next.js dev server is running
- [ ] CopilotKit packages are installed (already done in this project)

For production:
- [ ] Deploy agent to LangGraph Platform or your infrastructure
- [ ] Update `REMOTE_ACTION_URL` to production URL
- [ ] Enable LangSmith monitoring (optional)
- [ ] Test agent connections from production frontend

---

**Need Help?**
- Discord: https://discord.gg/copilotkit
- GitHub: https://github.com/CopilotKit/CopilotKit/issues

