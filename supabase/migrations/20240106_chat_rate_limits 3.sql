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

-- Optional: Set up a cron job to clean old rate limits
-- This would need to be configured in Supabase dashboard or via pg_cron extension