This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) with integrated LangGraph agent support and CopilotKit.

## 🔒 Security Notice

**IMPORTANT**: This project includes a LangGraph agent endpoint that **MUST** be secured with API key authentication to prevent unauthorized access and API quota drainage.

👉 **See [SECURITY_SETUP.md](./SECURITY_SETUP.md) for complete setup instructions**

### Quick Security Setup

1. Generate a secure API key:
   ```bash
   node -e "console.log('langgraph-api-key-' + require('crypto').randomBytes(32).toString('base64url'))"
   ```

2. Create `.env.local` in the project root:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key
   LANGGRAPH_API_KEY=your_generated_key_here
   LANGGRAPH_DEPLOYMENT_URL=http://localhost:8123
   TAVILY_API_KEY=your_tavily_api_key
   ```

3. Create `agent/.env` with the same keys:
   ```bash
   LANGGRAPH_API_KEY=your_generated_key_here
   GEMINI_API_KEY=your_gemini_api_key
   TAVILY_API_KEY=your_tavily_api_key
   ```

## Getting Started

### Obtaining API Keys

1. **Gemini API Key**: Get your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Tavily API Key**: Get your Tavily Search API key from [Tavily](https://tavily.com) to enable the `searchApi` tool for web searches

First, run the development server:

```bash
# Option 1: Run both Next.js and LangGraph agent together
npm run dev

# Option 2: Run separately in different terminals
# Terminal 1: Next.js app
npm run dev:ui

# Terminal 2: LangGraph agent
npm run dev:agent
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing Authentication

After setting up the environment variables, test the authentication:

```bash
node test-auth.js
```

This will verify that:
- ✅ Requests without API keys are rejected (401)
- ✅ Requests with invalid API keys are rejected (401)
- ✅ Requests with valid API keys are accepted (200)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
new-oss/
├── app/                          # Next.js app directory
│   ├── api/copilotkit/          # CopilotKit API route with auth
│   └── ...
├── agent/                        # LangGraph agent service
│   ├── src/
│   │   ├── agent.ts             # Agent logic and tools
│   │   ├── auth.ts              # 🔒 Authentication middleware
│   │   └── index.ts             # Entry point
│   ├── langgraph.json           # LangGraph configuration
│   └── .env                     # Agent environment variables
├── components/                   # React components
├── .env.local                   # Next.js environment variables
├── SECURITY_SETUP.md            # 📖 Security documentation
└── test-auth.js                 # Authentication test script
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [CopilotKit Documentation](https://docs.copilotkit.ai) - Build AI copilots
- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/) - Build agent workflows
- [LangGraph Authentication](https://langchain-ai.github.io/langgraphjs/concepts/auth/) - Secure your agents

## Security Features

This project implements enterprise-grade security for the LangGraph agent:

- 🔐 **API Key Authentication**: All agent requests require valid API keys
- 🛡️ **Request Validation**: Every request is validated by authentication middleware
- 📝 **Audit Logging**: Invalid access attempts are logged with IP addresses
- 🔒 **Environment-based Secrets**: API keys stored securely in environment variables
- ⚡ **Zero Trust Architecture**: No requests are trusted by default

See [SECURITY_SETUP.md](./SECURITY_SETUP.md) for detailed security documentation.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
