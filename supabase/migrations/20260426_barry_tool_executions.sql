-- Barry tool execution log for the barry-tools edge function
CREATE TABLE IF NOT EXISTS barry_tool_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_name text NOT NULL,
  tool_phase text NOT NULL CHECK (tool_phase IN ('1', '2', '3')),
  latency_ms integer NOT NULL,
  success boolean NOT NULL,
  error_code text,
  claude_iteration integer NOT NULL DEFAULT 1,
  was_cited boolean,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_barry_tool_executions_conversation ON barry_tool_executions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_barry_tool_executions_tool_name ON barry_tool_executions(tool_name);
CREATE INDEX IF NOT EXISTS idx_barry_tool_executions_created_at ON barry_tool_executions(created_at);

ALTER TABLE barry_tool_executions ENABLE ROW LEVEL SECURITY;

-- Service role has full access for logging
CREATE POLICY "Service role full access" ON barry_tool_executions
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can read all rows (no individual conversation content, just metrics)
CREATE POLICY "Admins can read" ON barry_tool_executions
  FOR SELECT USING (check_admin_access());

-- Analytics views
CREATE OR REPLACE VIEW barry_tool_stats AS
SELECT
  tool_name,
  COUNT(*) AS total_calls,
  ROUND(AVG(latency_ms)) AS avg_latency_ms,
  SUM(CASE WHEN success THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) AS success_rate,
  SUM(CASE WHEN was_cited THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) AS citation_rate,
  MIN(created_at) AS first_seen,
  MAX(created_at) AS last_seen
FROM barry_tool_executions
GROUP BY tool_name
ORDER BY total_calls DESC;
