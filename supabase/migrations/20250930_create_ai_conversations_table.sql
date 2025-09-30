-- Create ai_conversations table for Barry AI logging
-- Date: 2025-09-30
-- Purpose: Track all Barry conversations with routing metrics

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Session tracking
  session_id TEXT,

  -- Conversation data
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,

  -- Routing decision
  mode TEXT NOT NULL CHECK (mode IN ('manual', 'chatgpt')),
  classification_rule TEXT,
  matched_term TEXT,

  -- New routing metrics (database-first routing)
  routing_confidence DECIMAL(3,2),
  db_query_time_ms INTEGER,
  manual_references_count INTEGER DEFAULT 0,

  -- Context
  context_used TEXT
);

-- Index for session lookups
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);

-- Index for routing analysis
CREATE INDEX IF NOT EXISTS idx_ai_conversations_mode ON ai_conversations(mode);

-- Enable RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for logging)
CREATE POLICY "Allow public insert for logging"
  ON ai_conversations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Service role can read all
CREATE POLICY "Service role can read all"
  ON ai_conversations
  FOR SELECT
  TO service_role
  USING (true);