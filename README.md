# Overture Systems Solutions - AI-Powered Business Platform

Modern business website with integrated AI assistant powered by CopilotKit and Google Gemini.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Architecture

### **Simple & Production-Ready**

```
┌─────────────────────────────────────────┐
│  User's Browser                         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Next.js Application                    │
│  (React 19 + Next.js 16)                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  CopilotKit Runtime                     │
│  (/api/copilotkit)                      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Google Gemini API                      │
│  (AI Model Provider)                    │
└─────────────────────────────────────────┘
```

## ✨ Features

### **AI Assistant**
- ✅ Conversational AI chatbot
- ✅ Understands company services and offerings
- ✅ Context-aware responses using `useCopilotReadable`
- ✅ Powered by Google Gemini

### **Pages with AI Context**
- 🏠 **Homepage** - Company overview and services
- 💼 **Consulting** - AI consulting services and expertise
- 🔬 **Research** - B2B research platform details
- 🔒 **Compliance** - Security certifications and standards
- 📞 **Contact** - Contact methods and office locations

### **Modern Stack**
- ⚡ Next.js 16 with App Router
- ⚛️ React 19
- 🎨 Tailwind CSS 4
- 🤖 CopilotKit for AI integration
- 🔐 Google Gemini for AI responses

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Alternative (if not using GEMINI_API_KEY)
GOOGLE_API_KEY=your_google_api_key_here

# Optional: CopilotKit License
NEXT_PUBLIC_COPILOT_LICENSE_KEY=your_copilotkit_license_key
```

**Get your API key:** https://aistudio.google.com/app/apikey

## 📦 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect Repository**
   - Push your code to GitHub
   - Import project in Vercel Dashboard

2. **Set Environment Variables**
   - Add `GEMINI_API_KEY` in Vercel project settings
   - Go to Settings → Environment Variables

3. **Deploy**
   - Vercel auto-deploys on every push
   - Or manually: `vercel --prod`

### **Environment Variables on Vercel**

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `GOOGLE_API_KEY` | Alternative | Alternative to GEMINI_API_KEY |

## 🧪 Testing

### **Local Testing**

```bash
# Start the dev server
npm run dev

# Test the AI assistant
1. Open http://localhost:3000
2. Click the AI assistant icon (bottom right)
3. Ask: "What services does your company offer?"
```

### **Production Testing**

After deploying to Vercel:

```bash
# Check API endpoint
curl https://your-app.vercel.app/api/copilotkit

# Should return 200 or 405 (not 500)
```

## 📁 Project Structure

```
new-oss/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Homepage
│   ├── consulting/            # Consulting page
│   ├── research/              # Research page
│   ├── compliance/            # Compliance page
│   ├── contact/               # Contact page
│   ├── api/copilotkit/        # CopilotKit API route
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components
│   └── ...
├── lib/                       # Utility functions
│   ├── errors.ts              # Error handling
│   └── utils.ts               # General utilities
├── public/                    # Static assets
├── .env.local                 # Environment variables (git-ignored)
└── package.json               # Dependencies
```

## 🎨 UI Components

Built with **shadcn/ui** and **Tailwind CSS**:

- Modern, accessible components
- Dark mode support
- Fully customizable
- TypeScript-first

## 🔐 Security

- ✅ SOC 2 Type II compliant infrastructure
- ✅ HIPAA-ready for healthcare data
- ✅ Secure API key management
- ✅ Environment variable validation
- ✅ Error boundary protection

## 🤖 AI Features

### **How It Works**

1. **Context Injection**: Each page uses `useCopilotReadable` to provide context
2. **User Query**: User asks a question via the chatbot
3. **AI Processing**: CopilotKit sends context + query to Google Gemini
4. **Intelligent Response**: AI responds with relevant, contextual information

### **Example Usage**

```typescript
// In any page component
import { useCopilotReadable } from "@copilotkit/react-core";

export default function Page() {
  useCopilotReadable({
    description: "Page description",
    value: {
      key: "value",
      data: {...}
    }
  });

  return <div>Your page content</div>;
}
```

## 📚 Documentation

- `VERCEL_DEPLOYMENT.md` - Detailed deployment guide
- `VERCEL_CHECKLIST.md` - Pre-deployment checklist

## 🐛 Troubleshooting

### **AI Not Responding**

1. Check `GEMINI_API_KEY` is set
2. Verify API key is valid at https://aistudio.google.com
3. Check browser console for errors
4. Review Vercel function logs

### **Build Errors**

```bash
# Clean install
rm -rf .next node_modules
npm install
npm run build
```

### **Environment Variable Issues**

Ensure `.env.local` exists with required variables:
```env
GEMINI_API_KEY=AIza...
```

## 🚀 Performance

- ⚡ Fast page loads with Next.js 16
- 📦 Optimized bundle sizes
- 🔄 Incremental Static Regeneration
- 🌐 Edge-ready for global deployment
- 💨 Streaming responses from AI

## 📝 License

Private project - All rights reserved

## 🤝 Support

For issues or questions:
- Email: hello@overturesystems.com
- Website: https://overturesystems.com

---

**Built with ❤️ using Next.js, React, and CopilotKit**
