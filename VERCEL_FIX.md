# Fix GraphQL Error on Vercel

## 🔧 The Issue

You're seeing this error:
```
GraphQLError: An unexpected error occurred
```

## ✅ The Solution

The issue is that the Google Gemini adapter needs an API key configured explicitly. Follow these steps:

---

## **Step 1: Verify Environment Variable on Vercel**

1. Go to **Vercel Dashboard**
2. Select your project (`new-oss`)
3. Go to **Settings** → **Environment Variables**
4. Check if `GEMINI_API_KEY` or `GOOGLE_API_KEY` is set

### **If Not Set:**

Add the environment variable:

**Variable Name:** `GEMINI_API_KEY`  
**Value:** Your Google Gemini API key (get it from https://aistudio.google.com/app/apikey)  
**Environment:** Production, Preview, Development (select all three)

Click **Save**

---

## **Step 2: Get a Valid API Key**

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** or choose existing project
4. Copy the API key (starts with `AIza...`)

**Important:** Make sure to enable the Gemini API in your Google Cloud project.

---

## **Step 3: Redeploy**

After adding the environment variable:

### **Option A: Redeploy via Vercel Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **...** (three dots)
4. Click **"Redeploy"**

### **Option B: Redeploy via CLI**
```bash
vercel --prod --force
```

### **Option C: Push to GitHub**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## **Step 4: Verify the Fix**

After redeployment, check the function logs:

1. Go to **Deployments** → Latest deployment
2. Click **"View Function Logs"**
3. Look for these SUCCESS messages:

```log
✅ Google Gemini adapter created with API key
✅ CopilotKit runtime initialized successfully
API Key configured: Yes
```

If you see:
```log
❌ Cannot create adapter: No API key available
API Key configured: No
```

Then the environment variable is still not set properly.

---

## **Step 5: Test the AI**

1. Visit your deployed site
2. Open the AI chatbot
3. Try asking: "What services does your company offer?"
4. You should get a response about AI Strategy, B2B Research, and Uterpi

---

## 🐛 **Still Not Working?**

### **Check API Key Validity**

Test your API key:
```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your actual key.

**Expected:** JSON response with generated text  
**If error:** Your API key is invalid or needs permissions

### **Common Issues**

#### **1. API Key Not Enabled**

Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

Click **"Enable"** if not already enabled.

#### **2. API Key Has Restrictions**

In Google Cloud Console:
1. Go to **APIs & Services** → **Credentials**
2. Find your API key
3. Check **API restrictions**
4. Ensure **"Generative Language API"** is allowed

#### **3. Quota Exceeded**

Check quota at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

Free tier limits:
- 15 requests per minute
- 1,500 requests per day

#### **4. Wrong Environment Variable Name**

Make sure you used exactly: `GEMINI_API_KEY` or `GOOGLE_API_KEY`

Not:
- ❌ `GEMINI_KEY`
- ❌ `GOOGLE_GEMINI_API_KEY`
- ❌ `API_KEY`

#### **5. Environment Variable Not Applied**

Environment variables are only applied to NEW deployments.

After changing them, you MUST redeploy.

---

## 📊 **Expected Logs (Success)**

When everything is working, you should see:

```log
🚀 Running on Vercel
Environment: production
API Key configured: Yes
🤖 Initializing CopilotKit with Google Gemini
✅ Google Gemini adapter created with API key
✅ CopilotKit runtime initialized successfully
```

And when a user chats:
```log
POST /api/copilotkit 200 (2.3s)
```

---

## 📋 **Checklist**

Before asking for help, verify:

- [ ] `GEMINI_API_KEY` is set in Vercel environment variables
- [ ] API key starts with `AIza...` and is from Google AI Studio
- [ ] API key is valid (test with curl command above)
- [ ] Generative Language API is enabled in Google Cloud
- [ ] You redeployed after adding environment variable
- [ ] Function logs show "API Key configured: Yes"
- [ ] No quota/rate limit errors in logs

---

## 🎯 **Quick Fix Summary**

```bash
# 1. Get API key
# Visit: https://aistudio.google.com/app/apikey

# 2. Add to Vercel
# Dashboard → Settings → Environment Variables
# Name: GEMINI_API_KEY
# Value: AIza...

# 3. Redeploy
vercel --prod --force

# 4. Test
# Visit your site and test the AI chatbot
```

---

## 💡 **Why This Happened**

The simplified CopilotKit setup requires the Google Gemini adapter to be configured with an explicit API key. The adapter can't automatically read it from environment variables without being told where to look.

**Old setup:** LangGraph agent handled this  
**New setup:** Direct adapter needs explicit configuration

---

## ✅ **After Fix**

Once fixed, your AI will:
- ✅ Respond to questions
- ✅ Understand your company services
- ✅ Use context from `useCopilotReadable`
- ✅ Work reliably in production

---

## 📞 **Need More Help?**

If you've followed all steps and still see errors:

1. **Check Vercel function logs** for detailed error messages
2. **Copy the error message** exactly
3. **Verify API key** works with curl test
4. **Check Google Cloud Console** for API status

The enhanced error logging will now show exactly what's wrong.

