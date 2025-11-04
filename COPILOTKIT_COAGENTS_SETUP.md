# CopilotKit CoAgents Setup Guide

This document explains the CopilotKit CoAgents integration configured in this project and how to use it with LangGraph agents.

## What Changed?

The `app/api/copilotkit/route.ts` file has been updated from a **Direct-to-LLM** pattern to a **CoAgents** pattern. This is the recommended approach for integrating LangGraph agents with CopilotKit.

### Before (Direct-to-LLM)
- Used `GoogleGenerativeAIAdapter` to connect directly to Gemini
- LLM calls were handled in the Next.js API route
- Limited to simple chat interactions

### After (CoAgents Pattern)
- Uses `ExperimentalEmptyAdapter` as a proxy
- Connects to a remote LangGraph agent server
- Supports advanced agent features: state management, human-in-the-loop, generative UI, and more

## Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Next.js   │      │  CopilotKit API  │      │  LangGraph      │
│   Frontend  │─────>│  Route (Proxy)   │─────>│  Agent Server   │
│             │      │  /api/copilotkit │      │  (Python/JS)    │
└─────────────┘      └──────────────────┘      └─────────────────┘
```

## Environment Variables

### Required

- **`REMOTE_ACTION_URL`**: URL of your LangGraph agent server
  - Default: `http://localhost:8000/copilotkit`
  - For production: `https://your-agent-server.com/copilotkit`

### Optional (for LangGraph Platform)

- **`LANGGRAPH_DEPLOYMENT_URL`**: URL of your LangGraph Platform deployment
- **`LANGSMITH_API_KEY`**: API key for LangSmith monitoring and tracing

### Example `.env.local`

```bash
# Local development with LangGraph agent
REMOTE_ACTION_URL=http://localhost:8000/copilotkit

# OR for LangGraph Platform
# LANGGRAPH_DEPLOYMENT_URL=https://your-deployment.langchain.com
# LANGSMITH_API_KEY=your-langsmith-api-key
```

## Setting Up Your LangGraph Agent

### Option 1: Use the CoAgents Starter Template (Recommended)

Clone the official CopilotKit CoAgents starter repository:

```bash
# Python agent
git clone -n --depth=1 --filter=tree:0 https://github.com/CopilotKit/CopilotKit
cd CopilotKit
git sparse-checkout set --no-cone examples/coagents-starter/agent-py
git checkout
cd examples/coagents-starter/agent-py

# Install dependencies
pip install poetry
poetry install

# Start the agent server
poetry run dev
```

```bash
# TypeScript agent
git clone -n --depth=1 --filter=tree:0 https://github.com/CopilotKit/CopilotKit
cd CopilotKit
git sparse-checkout set --no-cone examples/coagents-starter/agent-js
git checkout
cd examples/coagents-starter/agent-js

# Install dependencies
npm install

# Start the agent server
npm run dev
```

The agent server will start on `http://localhost:8000`.

### Option 2: Bring Your Own LangGraph Agent

If you already have a LangGraph agent, you need to:

1. Install the CopilotKit SDK:

```bash
# Python
pip install copilotkit

# JavaScript
npm install @copilotkit/sdk-js
```

2. Wrap your LangGraph graph with CopilotKit's SDK:

**Python Example:**
```python
from copilotkit import CopilotKitSDK
from langgraph.graph import StateGraph

# Your LangGraph graph
graph = StateGraph(...)
# ... define your graph ...

# Wrap with CopilotKit
sdk = CopilotKitSDK(graph=graph)
app = sdk.create_fastapi_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**TypeScript Example:**
```typescript
import { CopilotKitSDK } from '@copilotkit/sdk-js';
import { StateGraph } from '@langchain/langgraph';

// Your LangGraph graph
const graph = new StateGraph(...);
// ... define your graph ...

// Wrap with CopilotKit
const sdk = new CopilotKitSDK({ graph });
const app = sdk.createExpressApp();

app.listen(8000, () => {
  console.log('Agent server running on http://localhost:8000');
});
```

## Using LangGraph Platform

For production deployments, you can use LangGraph Platform with LangSmith monitoring.

1. Uncomment the `langGraphPlatformEndpoint` section in `app/api/copilotkit/route.ts`:

```typescript
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  ExperimentalEmptyAdapter,
  langGraphPlatformEndpoint, // Uncomment this
} from "@copilotkit/runtime";

const runtime = new CopilotRuntime({
  remoteEndpoints: [
    langGraphPlatformEndpoint({
      deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8000",
      langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
      agents: [
        {
          name: "your_agent_name",
          description: "Description of your agent",
        },
      ],
    }),
  ],
});
```

2. Set the environment variables:

```bash
LANGGRAPH_DEPLOYMENT_URL=https://your-deployment.langchain.com
LANGSMITH_API_KEY=your-langsmith-api-key
```

## Frontend Integration

To use the CoAgent in your frontend, use the `useCoAgent` hook:

```typescript
import { useCoAgent } from "@copilotkit/react-core";

function MyComponent() {
  const { state, setState } = useCoAgent({
    name: "your_agent_name",
    initialState: {
      // Your initial state
    },
  });

  // The state is now synced bidirectionally with your LangGraph agent
  return <div>{/* Your UI */}</div>;
}
```

## Advanced Features

With the CoAgents pattern, you can now use:

1. **Shared State**: Bidirectional state sync between frontend and agent
   ```typescript
   const { state, setState } = useCoAgent({ name: "agent" });
   ```

2. **Human-in-the-Loop**: Request user input during agent execution
   ```typescript
   useLangGraphInterrupt({ agent: "agent_name" });
   ```

3. **Generative UI**: Render custom UI based on agent state
   ```typescript
   useCoAgentStateRender({ agent: "agent_name", render: (state) => <UI /> });
   ```

4. **Progressive State Updates**: Stream intermediate agent state to the UI

## Development Workflow

1. **Start your LangGraph agent server** (on port 8000)
2. **Start your Next.js dev server**:
   ```bash
   npm run dev
   ```
3. The Next.js API route will proxy requests to your agent server

## Troubleshooting

### "Failed to connect to agent server"
- Ensure your agent server is running on the correct port
- Verify `REMOTE_ACTION_URL` is set correctly
- Check firewall settings if using a remote server

### "Agent not responding"
- Check agent server logs for errors
- Verify the agent is properly wrapped with CopilotKit SDK
- Ensure the endpoint path is `/copilotkit`

### "State not syncing"
- Verify you're using `useCoAgent` hook in your frontend
- Check that agent name matches between frontend and backend
- Review agent state schema definition

## Resources

- [CopilotKit Documentation](https://docs.copilotkit.ai)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [CoAgents Quickstart](https://docs.copilotkit.ai/langgraph/quickstart)
- [CopilotKit GitHub](https://github.com/CopilotKit/CopilotKit)
- [CoAgents Starter Repo](https://github.com/CopilotKit/coagents-starter-langgraph)

## Migration Notes

If you were previously using the Direct-to-LLM pattern with GoogleGenerativeAIAdapter:

1. Your Gemini API key is no longer needed in the Next.js environment
2. You'll need to configure your LLM in your LangGraph agent instead
3. The frontend integration remains similar, but you now have access to advanced agent features
4. Consider using LangSmith for monitoring and debugging your agents

## Next Steps

1. Set up your LangGraph agent server
2. Configure the `REMOTE_ACTION_URL` environment variable
3. Update your frontend components to use `useCoAgent` hooks
4. Explore advanced features like Human-in-the-Loop and Generative UI
5. Deploy your agent to LangGraph Platform for production use

