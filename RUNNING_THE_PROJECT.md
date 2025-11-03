# Running the Project Guide

## Quick Start

### ✅ **Correct Way** (Recommended)

Run both the UI and Agent server together:

```bash
npm run dev
```

This will start:
- **UI Server** on `http://localhost:3000` (Next.js)
- **Agent Server** on `http://localhost:8123` (LangGraph)

You should see output like:
```
[ui]    ▲ Next.js 16.0.1
[ui]    - Local:        http://localhost:3000
[agent] LangGraph API server running on http://localhost:8123
```

---

## Alternative Commands

### UI Only (Limited Functionality)

If you only need the UI without agent capabilities:

```bash
npm run dev:ui
```

⚠️ **Note**: The agent features will be disabled, but the app will still work with basic AI chat using Google Gemini.

### Agent Server Only

To run just the LangGraph agent server:

```bash
npm run dev:agent
```

---

## What Each Server Does

### UI Server (`npm run dev:ui`)
- Runs the Next.js web application
- Serves pages, API routes, and static assets
- Handles user interactions and UI state
- Uses Google Gemini for basic AI responses

### Agent Server (`npm run dev:agent`)
- Runs the LangGraph workflow engine
- Provides advanced AI agent capabilities:
  - Web search (via Tavily API)
  - Weather information
  - Multi-step reasoning
  - Tool usage and orchestration
- Exposes endpoints at `http://localhost:8123`

---

## Architecture

```
┌─────────────────────────────────────────┐
│  Browser (http://localhost:3000)       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Next.js UI Server                      │
│  (npm run dev:ui)                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  CopilotKit Runtime                     │
│  (/api/copilotkit)                      │
└─────┬────────────────────┬──────────────┘
      │                    │
      ▼                    ▼
┌──────────────┐    ┌─────────────────────┐
│ Google Gemini│    │ LangGraph Agent     │
│ (Fallback)   │    │ (port 8123)         │
└──────────────┘    └─────────────────────┘
```

---

## Troubleshooting

### Error: "Failed to fetch CopilotKit agents/action information"

**Cause**: The agent server isn't running.

**Solution**: 
1. Stop your current dev server (`Ctrl+C`)
2. Run `npm run dev` instead of `npm run dev:ui`

### Port Already in Use

If you see "Port 8123 is already in use":

```bash
# Windows
netstat -ano | findstr :8123
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8123 | xargs kill -9
```

### Agent Server Won't Start

Check that you have the required environment variables:

```env
# Required for agent functionality
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_api_key

# Optional for web search
TAVILY_API_KEY=your_tavily_api_key
```

---

## Production Deployment

For production, you'll need to:

1. Deploy the LangGraph agent separately (or use LangGraph Cloud)
2. Set the environment variable:
   ```env
   LANGGRAPH_DEPLOYMENT_URL=https://your-agent-server.com
   ```
3. Deploy the Next.js app normally:
   ```bash
   npm run build
   npm start
   ```

---

## Development Tips

### See What's Running

```bash
# Check UI server
curl http://localhost:3000

# Check Agent server
curl http://localhost:8123/info
```

### View Agent Logs

The agent server logs are prefixed with `[agent]` in the console output.

### Restart Just One Server

Since `concurrently` is used with `--kill-others`, stopping one server stops both. To restart individually during development, run them in separate terminals:

**Terminal 1:**
```bash
npm run dev:ui
```

**Terminal 2:**
```bash
npm run dev:agent
```

---

## What You Implemented

✅ **useCopilotReadable on All Pages**
- Homepage: Company overview and services
- Consulting: AI consulting services details
- Research: B2B research platform information
- Compliance: Security certifications and standards
- Contact: Contact methods and office locations

✅ **Improved Error Handling**
- Graceful fallback when agent server isn't running
- Clear console warnings with helpful instructions
- No more scary error messages in the UI

---

## Next Steps

1. **Run the full project**: `npm run dev`
2. **Test the AI chat**: Open the chatbot and ask about your services
3. **Verify agent features**: The AI should now understand your company's offerings
4. **Check both servers**: Look for the ✅ confirmation in the console logs

Need help? Check the console output for helpful error messages and warnings.

