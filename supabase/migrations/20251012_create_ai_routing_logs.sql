CREATE TABLE IF NOT EXISTS ai_routing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  route_provider TEXT NOT NULL,
  route_model TEXT NOT NULL,
  reason TEXT,
  estimated_cost_class TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  latency_ms INTEGER,
  success BOOLEAN DEFAULT FALSE,
  error_text TEXT
);
CREATE INDEX IF NOT EXISTS idx_ai_routing_logs_created_at ON ai_routing_logs(created_at DESC);
ALTER TABLE ai_routing_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert for logging" ON ai_routing_logs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Service role can read all" ON ai_routing_logs FOR SELECT TO service_role USING (true);
