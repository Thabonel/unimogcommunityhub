-- Create chat_logs table for Barry analytics
CREATE TABLE IF NOT EXISTS chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  messages jsonb NOT NULL,
  response text,
  model text,
  tokens_used integer DEFAULT 0,
  knowledge_source text,
  has_location boolean DEFAULT false,
  routing_rule text,
  routing_match text,
  pdf_references_found integer DEFAULT 0,
  manual_sections_found integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create chat_rate_limits table for rate limiting
CREATE TABLE IF NOT EXISTS chat_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_rate_limits_user_id ON chat_rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_rate_limits_created_at ON chat_rate_limits(created_at);

-- Enable RLS
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_logs
CREATE POLICY "Users can insert their own chat logs"
  ON chat_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat logs"
  ON chat_logs FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for chat_rate_limits
CREATE POLICY "Users can insert their own rate limits"
  ON chat_rate_limits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own rate limits"
  ON chat_rate_limits FOR SELECT
  USING (auth.uid() = user_id);