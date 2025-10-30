# Security Setup Guide - LangGraph Agent Authentication

## ⚠️ Critical Security Implementation

This guide explains the API key authentication system implemented to protect your LangGraph agent endpoint from unauthorized access.

## Problem

Without authentication, anyone who discovers your `LANGGRAPH_DEPLOYMENT_URL` can:
- Drain your Gemini API quota
- Access your agent functionality
- Potentially incur significant costs

## Solution

We've implemented a **three-layer security architecture**:

1. **Environment Variable Configuration** - Secure API key storage
2. **Next.js API Route Protection** - Sends authentication headers
3. **LangGraph Agent Middleware** - Validates every incoming request

---

## Setup Instructions

### Step 1: Generate a Secure API Key

Run this command to generate a cryptographically secure API key:

```bash
node -e "console.log('langgraph-api-key-' + require('crypto').randomBytes(32).toString('base64url'))"
```

**Example output:**
```
langgraph-api-key-RfUJaWQn_kVNDPg5w13n3yGmS0JhncN7U4pdacO6JTc
```

### Step 2: Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# LangGraph Agent API Key - REQUIRED FOR SECURITY
LANGGRAPH_API_KEY=langgraph-api-key-YOUR_GENERATED_KEY_HERE

# LangGraph Deployment URL
LANGGRAPH_DEPLOYMENT_URL=http://localhost:8123

# LangSmith API Key (optional)
LANGSMITH_API_KEY=your_langsmith_api_key_here
```

**Also create** `agent/.env` with the same `LANGGRAPH_API_KEY`:

```bash
LANGGRAPH_API_KEY=langgraph-api-key-YOUR_GENERATED_KEY_HERE
GEMINI_API_KEY=your_gemini_api_key_here
```

⚠️ **IMPORTANT**: Never commit these files to version control. They should already be in `.gitignore`.

### Step 3: Verify Configuration

After setting up the environment variables, start your services:

```bash
# Terminal 1: Start the Next.js app
npm run dev:ui

# Terminal 2: Start the LangGraph agent
npm run dev:agent
```

Or run both together:

```bash
npm run dev
```

### Step 4: Test Authentication

The authentication system will:

✅ **Allow requests** with valid API key:
- Logs: `✅ Authentication successful`
- HTTP Status: 200

❌ **Reject requests** without API key:
- Logs: `⚠️ API key missing in request`
- HTTP Status: 401
- Message: "Missing API key - x-langgraph-api-key header required"

❌ **Reject requests** with invalid API key:
- Logs: `⚠️ Invalid API key attempt from: [IP]`
- HTTP Status: 401
- Message: "Invalid API key"

---

## Architecture Overview

### 1. Next.js API Route (`app/api/copilotkit/route.ts`)

**Responsibility**: Send authentication headers to LangGraph agent

```typescript
langGraphPlatformEndpoint({
  deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL,
  agents: [{ name: "starterAgent", ... }],
  headers: {
    "x-langgraph-api-key": process.env.LANGGRAPH_API_KEY,
  },
})
```

### 2. LangGraph Authentication Middleware (`agent/src/auth.ts`)

**Responsibility**: Validate API key on every request

```typescript
export const auth = new Auth()
  .authenticate(async (request: Request) => {
    const apiKey = request.headers.get("x-langgraph-api-key");
    if (apiKey !== VALID_API_KEY) {
      throw new HTTPException(401, { message: "Invalid API key" });
    }
    return "authenticated-user";
  })
  .on("*", ({ value, user }) => {
    // Authorization logic
    return { owner: user };
  });
```

### 3. LangGraph Configuration (`agent/langgraph.json`)

**Responsibility**: Register authentication middleware

```json
{
  "graphs": {
    "starterAgent": "./src/agent.ts:graph"
  },
  "auth": {
    "path": "./src/auth.ts:auth"
  }
}
```

---

## Security Best Practices

### ✅ DO

- **Generate strong keys**: Use cryptographically secure random keys (32+ bytes)
- **Rotate keys regularly**: Change API keys periodically (e.g., every 90 days)
- **Use environment variables**: Never hardcode keys in source code
- **Monitor logs**: Watch for unauthorized access attempts
- **Secure production**: Use HTTPS in production deployments
- **Restrict network access**: Use firewall rules to limit access to known IPs

### ❌ DON'T

- **Don't commit keys**: Never commit `.env` or `.env.local` files
- **Don't share keys**: Each environment should have unique keys
- **Don't use weak keys**: Avoid simple or guessable API keys
- **Don't expose endpoints**: Keep your deployment URLs private
- **Don't disable auth**: Authentication should always be enabled in production

---

## Production Deployment

When deploying to production (e.g., Vercel, Railway, etc.):

1. **Set environment variables** in your hosting platform's dashboard
2. **Update LANGGRAPH_DEPLOYMENT_URL** to your production agent URL
3. **Enable HTTPS** for all endpoints
4. **Consider additional security**:
   - Rate limiting
   - IP whitelisting
   - Request logging and monitoring
   - DDoS protection

---

## Troubleshooting

### Issue: "LANGGRAPH_API_KEY is not set" warning

**Solution**: Ensure the environment variable is set in both:
- Root `.env.local` (for Next.js app)
- `agent/.env` (for LangGraph agent)

### Issue: 401 Unauthorized errors

**Solution**: Verify that:
1. The same API key is set in both `.env.local` and `agent/.env`
2. You've restarted both the Next.js app and LangGraph agent after setting the key
3. There are no extra spaces or quotes around the key value

### Issue: Authentication not working

**Solution**: Check the console logs:
- Next.js logs: `http://localhost:3000` terminal
- LangGraph logs: `http://localhost:8123` terminal

Look for authentication-related error messages.

---

## Additional Resources

- [LangGraph Authentication Documentation](https://langchain-ai.github.io/langgraphjs/concepts/auth/)
- [Environment Variables Best Practices](https://12factor.net/config)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

---

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify environment variable configuration
3. Ensure all dependencies are installed (`pnpm install`)
4. Review the authentication middleware code in `agent/src/auth.ts`

**Last Updated**: October 30, 2025

