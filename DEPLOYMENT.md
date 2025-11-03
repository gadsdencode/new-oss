# Deployment Guide

Complete guide for deploying your AI-powered Next.js application to production.

---

## 🚀 Quick Deploy to Vercel

The fastest way to deploy your application.

### **Step 1: Connect Repository**

```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### **Step 2: Import to Vercel**

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Import"

### **Step 3: Set Environment Variables**

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API key:** https://aistudio.google.com/app/apikey

### **Step 4: Deploy**

Vercel will automatically deploy. Wait for build to complete (~2 minutes).

✅ **Done!** Your site is live at `https://your-app.vercel.app`

---

## 🔧 Environment Variables

### **Required**

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key | https://aistudio.google.com/app/apikey |

### **Optional**

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_COPILOT_LICENSE_KEY` | CopilotKit license | Not required for basic use |

---

## 📋 Pre-Deployment Checklist

### **Code Verification**

- [ ] `npm run build` succeeds locally
- [ ] `npm run lint` shows no errors
- [ ] All environment variables documented
- [ ] `.env.local` in `.gitignore`

### **Configuration**

- [ ] Environment variables set in Vercel
- [ ] API keys are valid and active
- [ ] No sensitive data in code

### **Testing**

- [ ] AI chatbot works locally
- [ ] All pages load correctly
- [ ] No console errors in browser

---

## 🌐 Deployment Platforms

### **Vercel (Recommended)**

✅ **Why Vercel:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Serverless functions
- Built for Next.js

**Deploy:**
```bash
npm i -g vercel
vercel --prod
```

### **Netlify**

**Deploy:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Environment Variables:**
- Set in Netlify Dashboard → Site Settings → Environment Variables

### **AWS Amplify**

1. Connect GitHub repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
3. Add environment variables
4. Deploy

### **Railway**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### **DigitalOcean App Platform**

1. Create new app from GitHub
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Add environment variables
5. Deploy

---

## 🧪 Testing After Deployment

### **1. Check Build Logs**

Look for:
```
✅ CopilotKit runtime initialized successfully with Google Gemini
✓ Compiled successfully
```

### **2. Test API Endpoint**

```bash
curl https://your-app.vercel.app/api/copilotkit
# Should return 200 or 405 (not 500)
```

### **3. Test AI Chat**

1. Visit your deployed site
2. Open AI chatbot
3. Ask: "What services does your company offer?"
4. Verify it responds correctly

### **4. Check Browser Console**

- Open DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed requests

---

## 🔍 Troubleshooting

### **Build Fails**

**Error:** `Module not found` or `Cannot find module`

**Solution:**
```bash
# Clean install locally
rm -rf node_modules .next
npm install
npm run build

# If successful, commit and redeploy
git add .
git commit -m "Fix build"
git push
```

### **AI Not Responding**

**Possible Causes:**
1. `GEMINI_API_KEY` not set in deployment platform
2. Invalid or expired API key
3. API rate limits exceeded

**Solution:**
1. Verify environment variable in platform dashboard
2. Test API key at https://aistudio.google.com
3. Check Google Cloud console for quota

### **500 Internal Server Error**

**Check:**
1. Deployment logs for errors
2. Function logs (in platform dashboard)
3. Environment variables are set correctly

**Solution:**
```bash
# Check logs
vercel logs

# Or in dashboard:
# Deployments → Latest → View Function Logs
```

### **Slow Response Times**

**Causes:**
- Cold starts on serverless functions
- Large AI context
- Network latency

**Solutions:**
1. Upgrade to paid plan (reduced cold starts)
2. Optimize `useCopilotReadable` data size
3. Use edge functions if available

---

## 📊 Monitoring

### **Vercel Analytics**

Enable in dashboard:
- Real-time traffic
- Performance metrics
- Error tracking

### **Custom Monitoring**

Add monitoring service:
- Sentry for error tracking
- LogRocket for session replay
- New Relic for performance

---

## 🔐 Security

### **Best Practices**

✅ **DO:**
- Use environment variables for API keys
- Enable HTTPS (automatic on most platforms)
- Set appropriate CORS headers
- Validate user inputs
- Implement rate limiting

❌ **DON'T:**
- Commit API keys to git
- Expose sensitive data in client-side code
- Skip input validation
- Use weak API keys

### **API Key Security**

```env
# ✅ Good - Server-side only
GEMINI_API_KEY=AIza...

# ❌ Bad - Never do this
NEXT_PUBLIC_GEMINI_API_KEY=AIza...
```

---

## 🚦 Production Checklist

Before going live:

### **Performance**

- [ ] Images optimized
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized
- [ ] Lazy loading implemented

### **SEO**

- [ ] Meta tags set
- [ ] `robots.txt` configured
- [ ] Sitemap generated
- [ ] Analytics installed

### **Functionality**

- [ ] All pages load correctly
- [ ] AI chatbot works
- [ ] Forms submit successfully
- [ ] Links are not broken

### **Security**

- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] Rate limiting configured
- [ ] Error messages don't leak info

---

## 📈 Scaling

### **Traffic Growth**

As your traffic grows:

1. **Upgrade plan** on your deployment platform
2. **Add CDN** for static assets
3. **Enable caching** for API responses
4. **Monitor** performance metrics

### **Cost Optimization**

- Use free tier initially
- Monitor API usage
- Implement response caching
- Optimize AI context size

---

## 🔄 Continuous Deployment

### **Automatic Deployments**

Most platforms auto-deploy on git push:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Automatically deploys to production
```

### **Preview Deployments**

Create preview for PRs:
```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create PR → Automatic preview deployment
```

---

## 📝 Deployment Logs

### **Expected Success Logs**

```log
[BUILD] ✓ Creating optimized production build
[BUILD] ✓ Compiled successfully
[BUILD] ✓ Collecting page data
[BUILD] ✓ Generating static pages
[DEPLOY] ✓ Deployment completed
[FUNCTION] 🤖 Initializing CopilotKit with Google Gemini
[FUNCTION] ✅ CopilotKit runtime initialized successfully
```

### **Common Warnings (Safe to Ignore)**

```log
Warning: You have enabled the JIT engine...
Warning: Fast Refresh had to perform a full reload...
```

---

## 🎯 Post-Deployment

After successful deployment:

1. **Test thoroughly** - Try all features
2. **Monitor logs** - Watch for errors
3. **Check analytics** - Track user behavior
4. **Set up alerts** - Get notified of issues
5. **Document** - Keep deployment notes

---

## 📞 Support

If you encounter issues:

1. Check platform status page
2. Review deployment logs
3. Search platform documentation
4. Contact platform support

---

## ✅ Summary

**Deployment Steps:**
1. ✅ Push code to GitHub
2. ✅ Connect to deployment platform
3. ✅ Set `GEMINI_API_KEY` environment variable
4. ✅ Deploy
5. ✅ Test AI chatbot

**Your AI-powered website is live! 🎉**

For detailed platform-specific guides, see:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- AWS: https://docs.aws.amazon.com/amplify

