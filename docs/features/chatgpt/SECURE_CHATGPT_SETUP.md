# Secure ChatGPT Integration Setup

This guide explains how to set up ChatGPT integration without exposing your API key in the frontend.

## Architecture Overview

```
Frontend (React) → Supabase Edge Function → OpenAI API
     ↓                      ↓
  Auth Token          API Key (Server-side)
```

## Step 1: Deploy the Edge Function

1. **Install Supabase CLI** (if not already installed):
```bash
npm install -g supabase
```

2. **Link your project**:
```bash
supabase link --project-ref your-project-ref
```

3. **Set the OpenAI API key as a secret**:
```bash
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key
```

4. **Deploy the Edge Function**:
```bash
supabase functions deploy chat-with-barry
```

## Step 2: Run Database Migrations

Apply the rate limiting tables:

```bash
supabase db push
```

Or manually run the migration in the Supabase SQL editor:
```sql
-- Copy contents of supabase/migrations/20240106_chat_rate_limits.sql
```

## Step 3: Update Environment Variables

Remove the OpenAI key from your `.env` file (it's now stored securely in Supabase):

```bash
# Remove this line from .env:
# VITE_OPENAI_API_KEY=sk-xxx
```

## Step 4: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Log in to your account
3. Navigate to Knowledge Base > AI Mechanic
4. Try chatting with Barry

## Security Features

### 1. Authentication Required
- Users must be logged in to chat
- Each request is authenticated via Supabase Auth

### 2. Rate Limiting
- 10 messages per minute per user
- Prevents abuse and controls costs
- Customizable in the Edge Function

### 3. Server-Side API Key
- OpenAI API key never exposed to frontend
- Stored securely in Supabase secrets

### 4. Request Logging
- Optional chat logging for analytics
- User can only see their own logs
- Helps track usage and costs

## Monitoring & Maintenance

### View Edge Function Logs
```bash
supabase functions logs chat-with-barry
```

### Monitor Usage
Check the `chat_logs` table in Supabase to monitor:
- Total requests per user
- Token usage
- Popular questions

### Clean Up Old Rate Limits
Run periodically or set up a cron job:
```sql
SELECT clean_old_rate_limits();
```

## Cost Optimization

### 1. Adjust Rate Limits
Edit the Edge Function to change limits:
```typescript
// Change from 10 to 5 messages per minute
if (recentChats && recentChats.length >= 5) {
```

### 2. Change Model
Switch to a cheaper model if needed:
```typescript
// Change from gpt-4-turbo-preview to gpt-3.5-turbo
model: 'gpt-3.5-turbo',
```

### 3. Reduce Token Limit
Lower the max tokens:
```typescript
max_tokens: 500, // Down from 800
```

## Troubleshooting

### "Unauthorized" Error
- Check if user is logged in
- Verify Supabase Auth is working

### "Rate limit exceeded"
- User hitting rate limits
- Wait 1 minute or adjust limits

### "OpenAI API key not configured"
- Run: `supabase secrets set OPENAI_API_KEY=sk-xxx`
- Redeploy the function

### Function Not Found
- Ensure function is deployed: `supabase functions deploy chat-with-barry`
- Check function name matches in frontend

## Local Development

To test Edge Functions locally:

1. Start Supabase locally:
```bash
supabase start
```

2. Set local secrets:
```bash
echo "OPENAI_API_KEY=sk-your-key" > supabase/.env.local
```

3. Serve functions locally:
```bash
supabase functions serve
```

4. Update your frontend to use local function URL:
```typescript
// In development
const functionUrl = 'http://localhost:54321/functions/v1/chat-with-barry'
```

## Production Checklist

- [ ] Edge Function deployed
- [ ] OpenAI API key set as Supabase secret
- [ ] Rate limiting tables created
- [ ] RLS policies applied
- [ ] Remove API key from frontend code
- [ ] Test with real user account
- [ ] Monitor initial usage
- [ ] Set up alerts for high usage

## Additional Security Considerations

1. **IP Restrictions**: Add IP allowlists in Supabase dashboard
2. **CORS**: Configure allowed origins in Edge Function
3. **Budget Alerts**: Set up OpenAI usage alerts
4. **User Quotas**: Implement per-user monthly limits
5. **Content Filtering**: Add moderation for user inputs

This setup ensures your OpenAI API key remains secure while providing a smooth chat experience for your users.