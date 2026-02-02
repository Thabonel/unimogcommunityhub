-- Barry OpenClaw Database Tables
-- Migration for OpenClaw skill-based architecture support

BEGIN;

-- Table: barry_openclaw_memory
-- Stores conversation context and memory for OpenClaw sessions
CREATE TABLE IF NOT EXISTS barry_openclaw_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  skill_chain TEXT[] DEFAULT '{}',
  total_tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for barry_openclaw_memory
CREATE INDEX IF NOT EXISTS idx_barry_openclaw_memory_user_id ON barry_openclaw_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_barry_openclaw_memory_session_id ON barry_openclaw_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_barry_openclaw_memory_created_at ON barry_openclaw_memory(created_at DESC);

-- Table: barry_skill_executions
-- Tracks individual skill executions for debugging and analytics
CREATE TABLE IF NOT EXISTS barry_skill_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  skill_name TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  execution_time_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for barry_skill_executions
CREATE INDEX IF NOT EXISTS idx_barry_skill_executions_user_id ON barry_skill_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_barry_skill_executions_skill_name ON barry_skill_executions(skill_name);
CREATE INDEX IF NOT EXISTS idx_barry_skill_executions_created_at ON barry_skill_executions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_barry_skill_executions_success ON barry_skill_executions(success);

-- Table: barry_ab_metrics
-- A/B testing metrics for comparing legacy vs OpenClaw
CREATE TABLE IF NOT EXISTS barry_ab_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  used_openclaw BOOLEAN NOT NULL,
  fallback_used BOOLEAN DEFAULT FALSE,
  execution_time_ms INTEGER,
  knowledge_mode TEXT,
  reference_count INTEGER DEFAULT 0,
  openclaw_percentage INTEGER,
  user_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for barry_ab_metrics
CREATE INDEX IF NOT EXISTS idx_barry_ab_metrics_used_openclaw ON barry_ab_metrics(used_openclaw);
CREATE INDEX IF NOT EXISTS idx_barry_ab_metrics_created_at ON barry_ab_metrics(created_at DESC);

-- Table: barry_openclaw_config
-- Configuration for OpenClaw rollout and feature flags
CREATE TABLE IF NOT EXISTS barry_openclaw_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO barry_openclaw_config (config_key, config_value, description)
VALUES
  ('openclaw_percentage', '0'::jsonb, 'Percentage of traffic to route to OpenClaw (0-100)'),
  ('enable_fallback', 'true'::jsonb, 'Fall back to legacy if OpenClaw fails'),
  ('track_metrics', 'true'::jsonb, 'Track A/B comparison metrics'),
  ('max_skill_execution_time_ms', '30000'::jsonb, 'Maximum time for a skill chain execution')
ON CONFLICT (config_key) DO NOTHING;

-- RLS Policies
ALTER TABLE barry_openclaw_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_skill_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_ab_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_openclaw_config ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read/write their own memory
CREATE POLICY barry_openclaw_memory_user_policy ON barry_openclaw_memory
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role has full access to memory
CREATE POLICY barry_openclaw_memory_service_policy ON barry_openclaw_memory
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Service role can write skill executions
CREATE POLICY barry_skill_executions_service_policy ON barry_skill_executions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Admins can read skill executions
CREATE POLICY barry_skill_executions_admin_read_policy ON barry_skill_executions
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Policy: Service role can write AB metrics
CREATE POLICY barry_ab_metrics_service_policy ON barry_ab_metrics
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Admins can read AB metrics
CREATE POLICY barry_ab_metrics_admin_read_policy ON barry_ab_metrics
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Policy: Admins can manage config
CREATE POLICY barry_openclaw_config_admin_policy ON barry_openclaw_config
  FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Policy: Service role can read config
CREATE POLICY barry_openclaw_config_service_read_policy ON barry_openclaw_config
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Function: Update timestamp trigger
CREATE OR REPLACE FUNCTION update_barry_openclaw_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update memory timestamp
DROP TRIGGER IF EXISTS barry_openclaw_memory_updated_at ON barry_openclaw_memory;
CREATE TRIGGER barry_openclaw_memory_updated_at
  BEFORE UPDATE ON barry_openclaw_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_barry_openclaw_updated_at();

-- Trigger: Auto-update config timestamp
DROP TRIGGER IF EXISTS barry_openclaw_config_updated_at ON barry_openclaw_config;
CREATE TRIGGER barry_openclaw_config_updated_at
  BEFORE UPDATE ON barry_openclaw_config
  FOR EACH ROW
  EXECUTE FUNCTION update_barry_openclaw_updated_at();

-- Function: Get OpenClaw config value
CREATE OR REPLACE FUNCTION get_openclaw_config(p_key TEXT)
RETURNS JSONB AS $$
  SELECT config_value FROM barry_openclaw_config WHERE config_key = p_key;
$$ LANGUAGE SQL STABLE;

-- Function: Set OpenClaw config value
CREATE OR REPLACE FUNCTION set_openclaw_config(p_key TEXT, p_value JSONB)
RETURNS VOID AS $$
BEGIN
  UPDATE barry_openclaw_config
  SET config_value = p_value, updated_by = auth.uid()
  WHERE config_key = p_key;

  IF NOT FOUND THEN
    INSERT INTO barry_openclaw_config (config_key, config_value, updated_by)
    VALUES (p_key, p_value, auth.uid());
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Get OpenClaw rollout percentage
CREATE OR REPLACE FUNCTION get_openclaw_percentage()
RETURNS INTEGER AS $$
  SELECT COALESCE((config_value)::text::integer, 0)
  FROM barry_openclaw_config
  WHERE config_key = 'openclaw_percentage';
$$ LANGUAGE SQL STABLE;

-- View: OpenClaw metrics summary
CREATE OR REPLACE VIEW barry_openclaw_metrics_summary AS
SELECT
  DATE_TRUNC('hour', created_at) AS hour,
  COUNT(*) AS total_requests,
  COUNT(*) FILTER (WHERE used_openclaw = true) AS openclaw_requests,
  COUNT(*) FILTER (WHERE used_openclaw = false) AS legacy_requests,
  COUNT(*) FILTER (WHERE fallback_used = true) AS fallback_count,
  AVG(execution_time_ms) FILTER (WHERE used_openclaw = true) AS avg_openclaw_time_ms,
  AVG(execution_time_ms) FILTER (WHERE used_openclaw = false) AS avg_legacy_time_ms,
  AVG(reference_count) FILTER (WHERE used_openclaw = true) AS avg_openclaw_refs,
  AVG(reference_count) FILTER (WHERE used_openclaw = false) AS avg_legacy_refs
FROM barry_ab_metrics
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- View: Skill execution stats
CREATE OR REPLACE VIEW barry_skill_execution_stats AS
SELECT
  skill_name,
  COUNT(*) AS total_executions,
  COUNT(*) FILTER (WHERE success = true) AS successful,
  COUNT(*) FILTER (WHERE success = false) AS failed,
  AVG(execution_time_ms) AS avg_time_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY execution_time_ms) AS p95_time_ms,
  MAX(execution_time_ms) AS max_time_ms
FROM barry_skill_executions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY skill_name
ORDER BY total_executions DESC;

COMMIT;
