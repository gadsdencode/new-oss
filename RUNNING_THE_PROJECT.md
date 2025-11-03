# Running the Project Guide

## 🚀 Quick Start

### **Simple Setup (CopilotKit + Google Gemini)**

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

That's it! No complex setup, no multiple servers.

---

## 🎯 What You Get

### **Single Server Architecture**

```
┌────────────────────────────────────┐
│  Browser (http://localhost:3000)  │
└───────────────┬────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│  Next.js Dev Server                │
│  • UI pages                        │
│  • API routes                      │
│  • CopilotKit runtime              │
└───────────────┬────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│  Google Gemini API                 │
│  (AI Model Provider)               │
└────────────────────────────────────┘
```

### **AI Features**

✅ **Conversational AI** - Chat with your website  
✅ **Context-Aware** - Understands your company services  
✅ **Real-time Responses** - Powered by Google Gemini  
✅ **Production-Ready** - Simple, reliable architecture  

---

## 📋 Prerequisites

1. **Node.js 18+**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **npm or pnpm**
   ```bash
   npm --version
   # or
   pnpm --version
   ```

3. **Google Gemini API Key**
   - Get yours: https://aistudio.google.com/app/apikey
   - Free tier available

---

## 🔧 Environment Setup

### **1. Create Environment File**

```bash
# Create .env.local file
touch .env.local
```

### **2. Add Required Variables**

Edit `.env.local`:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: CopilotKit License (for advanced features)
NEXT_PUBLIC_COPILOT_LICENSE_KEY=your_copilotkit_license_key
```

### **3. Verify Setup**

```bash
# Check that environment variables are loaded
npm run dev

# Look for: "🤖 Initializing CopilotKit with Google Gemini"
# And: "✅ CopilotKit runtime initialized successfully"
```

---

## 🚀 Development

### **Start Development Server**

```bash
npm run dev
```

**Output:**
```
 ▲ Next.js 16.0.1
 - Local:        http://localhost:3000
 - Network:      http://192.168.1.100:3000

🤖 Initializing CopilotKit with Google Gemini
✅ CopilotKit runtime initialized successfully with Google Gemini

 ✓ Ready in 2.3s
```

### **Test the AI**

1. Open http://localhost:3000
2. Look for the AI assistant icon (bottom-right or sidebar)
3. Click to open the chat
4. Try asking:
   - "What services does your company offer?"
   - "Are you HIPAA compliant?"
   - "How do I contact you?"

---

## 🏗️ Build for Production

### **Build the Application**

```bash
npm run build
```

This will:
- ✅ Compile TypeScript
- ✅ Optimize bundles
- ✅ Generate static pages
- ✅ Prepare for deployment

### **Test Production Build Locally**

```bash
npm run build
npm start
```

Open http://localhost:3000 to test the production build.

---

## 📦 Package Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |

---

## 🔍 Troubleshooting

### **Issue: "GEMINI_API_KEY is not set"**

**Solution:**
1. Create `.env.local` file in project root
2. Add: `GEMINI_API_KEY=your_key_here`
3. Restart dev server

### **Issue: "Failed to initialize CopilotKit runtime"**

**Possible causes:**
1. Invalid API key
2. Network connectivity issues
3. API key quota exceeded

**Solution:**
1. Verify API key at https://aistudio.google.com
2. Check internet connection
3. Try regenerating API key

### **Issue: AI not responding**

**Check:**
1. Browser console for errors (F12)
2. Network tab for failed requests
3. Server logs for error messages

**Solution:**
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### **Issue: Port 3000 already in use**

**Solution:**
```bash
# Find and kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

---

## 🎯 Architecture Changes

### **What Changed from Previous Setup**

**Before:**
- ❌ Complex multi-server setup
- ❌ LangGraph agent server (port 8123)
- ❌ Concurrent processes
- ❌ Agent configuration files

**Now:**
- ✅ Single Next.js server
- ✅ Direct Google Gemini integration
- ✅ Simplified deployment
- ✅ No external dependencies

### **Benefits**

| Benefit | Description |
|---------|-------------|
| **Simplicity** | One server, one command |
| **Reliability** | Fewer moving parts = fewer failures |
| **Production-Ready** | Works seamlessly on Vercel, Netlify, etc. |
| **Cost-Effective** | No separate agent server costs |
| **Easy Maintenance** | Simpler to debug and update |

---

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or for production
vercel --prod
```

**Environment Variables on Vercel:**
1. Go to project settings
2. Add `GEMINI_API_KEY`
3. Redeploy

### **Other Platforms**

Works with any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

---

## 📊 Performance

### **Development Mode**

- Fast refresh for instant updates
- Hot module replacement
- Source maps for debugging

### **Production Mode**

- Optimized bundles
- Static generation where possible
- Edge-ready deployment
- Fast response times

---

## 🎨 Customization

### **Modify AI Behavior**

The AI understands your company through `useCopilotReadable` hooks in each page.

**Example:**
```typescript
// In any page
useCopilotReadable({
  description: "Product information",
  value: {
    products: [...],
    pricing: {...}
  }
});
```

### **Change AI Model**

Currently using Google Gemini. To change:

1. Install different adapter:
   ```bash
   npm install @copilotkit/runtime-adapter-openai
   ```

2. Update `app/api/copilotkit/route.ts`:
   ```typescript
   import { OpenAIAdapter } from "@copilotkit/runtime-adapter-openai";
   
   const serviceAdapter = new OpenAIAdapter();
   ```

---

## 📚 Additional Resources

- **CopilotKit Docs**: https://docs.copilotkit.ai
- **Google Gemini**: https://ai.google.dev
- **Next.js Docs**: https://nextjs.org/docs

---

## ✅ Summary

**To run the project:**
1. ✅ Install dependencies: `npm install`
2. ✅ Set `GEMINI_API_KEY` in `.env.local`
3. ✅ Run: `npm run dev`
4. ✅ Open: http://localhost:3000

**That's it!** No complex setup, no multiple servers, just one command.

Your AI-powered website is ready! 🎉
