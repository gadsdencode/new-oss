# CopilotKit <> Gemini Starter

This is a starter template for building AI copilots using [Google Gemini](https://ai.google.dev/) and [CopilotKit](https://copilotkit.ai). It provides a modern Next.js application with direct Gemini API integration. LangGraph support is included but disabled by default.

## Prerequisites

- Node.js 18+ 
- Any of the following package managers:
  - [pnpm](https://pnpm.io/installation) (recommended)
  - npm
  - [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
  - [bun](https://bun.sh/)
- Google Gemini API Key - Get yours at [Google AI Studio](https://makersuite.google.com/app/apikey)

> **Note:** This repository ignores lock files (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb) to avoid conflicts between different package managers. Each developer should generate their own lock file using their preferred package manager. After that, make sure to delete it from the .gitignore.

## Getting Started

1. Install dependencies using your preferred package manager:
```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

2. Set up your Google Gemini API key in the root directory:
```bash
# Create .env.local file in the root directory
echo "GEMINI_API_KEY=your-gemini-api-key-here" > .env.local
```

> **Note:** You can also use `GOOGLE_API_KEY` as the environment variable name. Both are supported.

3. Start the development server:
```bash
# Using pnpm (recommended)
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

This will start the Next.js development server with Gemini API integration.

## Available Scripts
The following scripts can also be run using your preferred package manager:
- `dev` - Starts the Next.js development server
- `build` - Builds the Next.js application for production
- `start` - Starts the production server
- `lint` - Runs ESLint for code linting

## Configuration Options

### Using Direct Gemini API (Current Setup - Default)
The project is currently configured to use Google Gemini API directly through CopilotKit's `GoogleGenerativeAIAdapter`. This is simpler and doesn't require running a separate agent server.

**Benefits:**
- No separate backend server needed
- Simpler setup and deployment
- Direct integration with Gemini API
- Lower latency

### Using LangGraph Agents (Optional - Advanced)
If you need more complex agent workflows with LangGraph, you can enable the LangGraph configuration:

1. Install Python dependencies:
```bash
cd agent
pnpm install  # or npm/yarn/bun
```

2. Set up environment variables in `agent/.env`:
```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

3. Uncomment the LangGraph agent configuration in `src/app/api/copilotkit/route.ts`

4. Update the layout to include the agent name:
```tsx
<CopilotKit runtimeUrl="/api/copilotkit" agent="starterAgent" ...>
```

5. Start with the multi-server script:
```bash
pnpm dev  # This will start both UI and LangGraph agent
```

## Documentation

The main UI component is in `src/app/page.tsx`. You can:
- Modify the theme colors and styling
- Add new frontend actions
- Utilize shared-state
- Customize your user-interface for interactin with LangGraph

## 📚 Documentation

- [CopilotKit Documentation](https://docs.copilotkit.ai) - Explore CopilotKit's capabilities
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/) - Learn more about LangGraph and its features
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API

## Contributing

Feel free to submit issues and enhancement requests! This starter is designed to be easily extensible.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

**"Agent 'starterAgent' failed to execute: fetch failed"**
- This error occurs when LangGraph agent configuration is enabled but the agent server isn't running
- Solution: The project is now configured to use direct Gemini API (no agent server needed)
- If you see this error, make sure the `agent="starterAgent"` prop is removed from the `<CopilotKit>` provider in `layout.tsx`

**API Key Issues**
If the copilot isn't responding, verify:
1. Your Gemini API key is set in `.env.local` (either `GEMINI_API_KEY` or `GOOGLE_API_KEY`)
2. You have an active API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. The API key has proper permissions and quota
4. Restart the development server after adding environment variables

**LangGraph Agent Connection (if enabled)**
If you've enabled LangGraph and see connection errors:
1. Make sure the LangGraph agent is running on port 8123
2. Check that both UI and agent servers started successfully
3. Verify `GEMINI_API_KEY` is set in both root `.env.local` and `agent/.env`
