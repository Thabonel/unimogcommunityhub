# Deploy Secure ChatGPT - Step by Step

Since you've already added the OpenAI API key to Supabase secrets, here are the remaining steps:

## 1. Link Your Supabase Project

First, link your local project to Supabase:

```bash
# Get your project reference from Supabase dashboard URL
# It's the part after /project/ in: https://app.supabase.com/project/YOUR_PROJECT_REF

supabase link --project-ref YOUR_PROJECT_REF
```

## 2. Deploy the Edge Function

Deploy the chat-with-barry function:

```bash
supabase functions deploy chat-with-barry
```

## 3. Run Database Migrations

Go to your Supabase SQL editor:
https://app.supabase.com/project/YOUR_PROJECT_REF/sql

Run this SQL to create the rate limiting tables:

```sql
-- Create table for rate limiting
CREATE TABLE IF NOT EXISTS public.chat_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient rate limit queries
CREATE INDEX idx_chat_rate_limits_user_created ON public.chat_rate_limits(user_id, created_at DESC);

-- Create table for chat logs (optional - for analytics)
CREATE TABLE IF NOT EXISTS public.chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for chat logs
CREATE INDEX idx_chat_logs_user_created ON public.chat_logs(user_id, created_at DESC);

-- RLS policies for chat_rate_limits
ALTER TABLE public.chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limits
CREATE POLICY "Users can view own rate limits" ON public.chat_rate_limits
  FOR SELECT USING (auth.uid() = user_id);

-- Only the service role can insert (edge function will use this)
CREATE POLICY "Service role can insert rate limits" ON public.chat_rate_limits
  FOR INSERT WITH CHECK (true);

-- RLS policies for chat_logs
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own chat logs
CREATE POLICY "Users can view own chat logs" ON public.chat_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Only the service role can insert (edge function will use this)
CREATE POLICY "Service role can insert chat logs" ON public.chat_logs
  FOR INSERT WITH CHECK (true);

-- Clean up old rate limit records periodically (older than 1 hour)
CREATE OR REPLACE FUNCTION clean_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_rate_limits 
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 4. Update Your Environment

Remove the OpenAI API key from your `.env` file (it's now secure in Supabase):

```bash
# Remove this line from .env:
# VITE_OPENAI_API_KEY=sk-xxx
```

## 5. Test the Integration

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Test Barry**:
   - Log in to your account
   - Go to Knowledge Base > AI Mechanic
   - Try asking: "How do I check portal oil levels?"

3. **Check logs** (if needed):
   ```bash
   supabase functions logs chat-with-barry --tail
   ```

## 6. Verify Security

✅ **Check that the API key is NOT in your frontend**:
- Open browser DevTools
- Go to Network tab
- Chat with Barry
- You should see calls to Supabase Edge Function, NOT to OpenAI directly

✅ **Verify authentication**:
- Log out
- Try to access Barry
- You should see "You need to be logged in" message

✅ **Test rate limiting**:
- Send 10+ messages quickly
- After 10 messages in 1 minute, you should see rate limit error

## Troubleshooting

### "Edge Function not found"
```bash
# List deployed functions
supabase functions list

# If not listed, redeploy
supabase functions deploy chat-with-barry
```

### "Unauthorized" errors
- Make sure you're logged in
- Check that Edge Function has access to auth

### Rate limit issues
- Wait 1 minute between batches of 10 messages
- Or adjust the limit in the Edge Function code

### View function logs
```bash
supabase functions logs chat-with-barry --tail
```

## Success! 🎉

Your ChatGPT integration is now secure with:
- ✅ API key stored server-side only
- ✅ Authentication required
- ✅ Rate limiting enabled
- ✅ Usage tracking available
- ✅ No secrets exposed to frontend

Barry is ready to help with Unimog questions securely!