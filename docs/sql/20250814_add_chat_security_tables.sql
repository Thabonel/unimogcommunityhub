-- ====================================
-- CHAT SECURITY AND RATE LIMITING TABLES
-- ====================================
-- This migration adds tables for chat rate limiting and logging

-- ====================================
-- STEP 1: CREATE CHAT RATE LIMITS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS chat_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient rate limit checks
CREATE INDEX IF NOT EXISTS idx_chat_rate_limits_user_time 
ON chat_rate_limits(user_id, created_at DESC);

-- ====================================
-- STEP 2: CREATE CHAT LOGS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB,
  response TEXT,
  model TEXT DEFAULT 'gpt-4-turbo-preview',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user chat history
CREATE INDEX IF NOT EXISTS idx_chat_logs_user 
ON chat_logs(user_id, created_at DESC);

-- ====================================
-- STEP 3: ENABLE RLS
-- ====================================

ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- ====================================
-- STEP 4: CREATE RLS POLICIES
-- ====================================

-- Chat rate limits - users can only see their own
CREATE POLICY "chat_rate_limits_own_read" ON chat_rate_limits
  FOR SELECT
  USING (user_id = auth.uid());

-- Chat rate limits - system can insert for any user (via service role)
CREATE POLICY "chat_rate_limits_system_insert" ON chat_rate_limits
  FOR INSERT
  WITH CHECK (true);

-- Chat logs - users can see their own
CREATE POLICY "chat_logs_own_read" ON chat_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Chat logs - system can insert (via service role)
CREATE POLICY "chat_logs_system_insert" ON chat_logs
  FOR INSERT
  WITH CHECK (true);

-- Admin can view all for monitoring
CREATE POLICY "chat_logs_admin_read" ON chat_logs
  FOR SELECT
  USING (check_admin_access());

CREATE POLICY "chat_rate_limits_admin_all" ON chat_rate_limits
  FOR ALL
  USING (check_admin_access());

-- ====================================
-- STEP 5: CREATE CLEANUP FUNCTION
-- ====================================

-- Function to clean old rate limit records (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_rate_limits 
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- STEP 6: GRANT PERMISSIONS
-- ====================================

GRANT SELECT ON chat_rate_limits TO authenticated;
GRANT SELECT ON chat_logs TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_rate_limits() TO authenticated;

-- ====================================
-- STEP 7: CREATE SCHEDULED CLEANUP (OPTIONAL)
-- ====================================

-- Note: This requires pg_cron extension which may not be available
-- If available, uncomment the following:
/*
SELECT cron.schedule(
  'cleanup-chat-rate-limits',
  '0 * * * *', -- Every hour
  $$SELECT cleanup_old_rate_limits();$$
);
*/

-- Return success
SELECT 'Chat security tables created successfully!' as message;