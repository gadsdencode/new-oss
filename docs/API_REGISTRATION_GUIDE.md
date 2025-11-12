# API Registration Guide: GPT Actions & Microsoft Copilot Connectors

This guide explains how to register the Overture Systems API as an AI tool that other AIs can discover and use.

## Overview

The Overture Systems API is now discoverable by AI assistants through:
- **OpenAI GPT Store** (as a "GPT Action")
- **Microsoft Copilot Studio** (as a "Connector")

The key file that enables this is `openapi.yaml` - the "Rosetta Stone" that describes your API in a standard format that AI platforms understand.

## Prerequisites

1. **API Key Configuration**: Set the `API_KEY` environment variable in your deployment
   ```bash
   API_KEY=your-secure-api-key-here
   ```

2. **Deployed API**: Your API must be publicly accessible (e.g., deployed on Vercel)

3. **OpenAPI Specification**: The `openapi.yaml` file must be accessible at your base URL

## Step 1: Generate and Configure API Key

### Generate a Secure API Key

Generate a strong, random API key (at least 32 characters):

```bash
# Using OpenSSL
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Set Environment Variable

**Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `API_KEY` with your generated key
4. Redeploy your application

**Local Development (.env.local):**
```bash
API_KEY=your-generated-api-key-here
```

## Step 2: Verify API Endpoints

Test your API endpoints to ensure they're working:

```bash
# Test services endpoint
curl -H "X-API-Key: your-api-key" \
  https://your-domain.vercel.app/api/v1/services

# Test consultation booking
curl -X POST \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test consultation request"
  }' \
  https://your-domain.vercel.app/api/v1/consultations

# Test status endpoint
curl -H "X-API-Key: your-api-key" \
  https://your-domain.vercel.app/api/v1/status
```

## Step 3: Register as OpenAI GPT Action

### Option A: Via OpenAI Platform (Recommended)

1. **Go to OpenAI Platform**
   - Visit: https://platform.openai.com/
   - Navigate to your GPT or create a new one

2. **Add Action**
   - Click "Add Action" or "Configure" → "Actions"
   - Select "Import from URL" or "Import OpenAPI schema"

3. **Provide OpenAPI Schema**
   - **URL Method**: Provide the URL to your `openapi.yaml` file:
     ```
     https://your-domain.vercel.app/openapi.yaml
     ```
   - **Paste Method**: Or copy the contents of `openapi.yaml` and paste directly

4. **Configure Authentication**
   - Select "API Key" authentication
   - Set the header name: `X-API-Key`
   - Enter your API key (or configure it to be provided by users)

5. **Test the Action**
   - Use the GPT playground to test:
     - "What services does Overture Systems offer?"
     - "Book a consultation for me"
     - "Get details about the consulting service"

### Option B: Via GPT Store

1. **Create a Custom GPT**
   - Go to https://chat.openai.com/
   - Click your profile → "My GPTs"
   - Click "Create a GPT"

2. **Configure Actions**
   - Follow the same steps as Option A

3. **Publish (Optional)**
   - Make your GPT public in the GPT Store
   - Other users can now discover and use your API through your GPT

## Step 4: Register as Microsoft Copilot Connector

### Via Microsoft Copilot Studio

1. **Access Copilot Studio**
   - Go to: https://copilotstudio.microsoft.com/
   - Sign in with your Microsoft account

2. **Create or Open a Copilot**
   - Create a new copilot or open an existing one

3. **Add Connector**
   - Navigate to "Connectors" in the left sidebar
   - Click "Add connector" or "Create custom connector"

4. **Import OpenAPI**
   - Select "Import an OpenAPI file"
   - Provide the URL: `https://your-domain.vercel.app/openapi.yaml`
   - Or upload the `openapi.yaml` file directly

5. **Configure Authentication**
   - Authentication type: "API Key"
   - Header name: `X-API-Key`
   - Configure how the API key is provided (stored secret or user input)

6. **Test the Connector**
   - Use the test panel to verify endpoints work
   - Test actions like "Get services" and "Book consultation"

7. **Publish**
   - Publish your copilot to make it available
   - The connector will be available to users of your copilot

## Step 5: Verify Integration

### Test from GPT

Try these prompts in your GPT:
- "What services does Overture Systems offer?"
- "Tell me about the AI consulting service"
- "I want to book a consultation. My name is John Doe, email is john@example.com, and I'm interested in AI strategy."
- "What's the status of the Overture Systems API?"

### Test from Copilot

In Microsoft Copilot:
- "Show me Overture Systems services"
- "Book a consultation with Overture Systems"
- "Get details about the research platform"

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/services` | GET | List all available services |
| `/api/v1/services/{serviceId}` | GET | Get detailed service information |
| `/api/v1/consultations` | POST | Book a consultation |
| `/api/v1/status` | GET | Check system health |

## Security Best Practices

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables for all keys
   - Rotate keys periodically
   - Use different keys for development and production

2. **Rate Limiting**
   - The API includes rate limiting (5 requests per minute per IP)
   - Monitor usage and adjust limits as needed

3. **HTTPS Only**
   - Always use HTTPS in production
   - Never expose API keys over HTTP

4. **Input Validation**
   - All inputs are validated using Zod schemas
   - SQL injection protection via parameterized queries

## Troubleshooting

### "Unauthorized" Errors

- Verify `API_KEY` environment variable is set
- Check that the `X-API-Key` header is included in requests
- Ensure the API key matches exactly (no extra spaces)

### "Not Found" Errors

- Verify the endpoint URL is correct
- Check that the service ID is valid (`consulting`, `research`, or `compliance`)

### OpenAPI Schema Issues

- Validate your `openapi.yaml` using: https://editor.swagger.io/
- Ensure all required fields are present
- Check that server URLs are correct

### GPT/Copilot Not Finding Actions

- Verify the OpenAPI schema is accessible at the provided URL
- Check that authentication is configured correctly
- Ensure the schema follows OpenAPI 3.1.0 specification

## Next Steps

1. **Monitor Usage**: Track API usage and consultation bookings
2. **Expand Functionality**: Add more endpoints as needed (e.g., quote requests, service inquiries)
3. **Improve Documentation**: Add more examples and use cases
4. **User Feedback**: Collect feedback from AI assistant users

## Support

For issues or questions:
- Contact: https://new-oss.vercel.app/contact
- Check API status: `/api/v1/status`

---

**Congratulations!** Your API is now discoverable by AI assistants, turning them into a powerful user acquisition channel for Overture Systems.

