CREATE TABLE IF NOT EXISTS canonical_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip TEXT,
  user_id UUID,
  endpoint TEXT NOT NULL,             -- canonical or canonical-search
  entity_type TEXT,                   -- model|procedure|part
  identifier TEXT,                    -- id|slug|code value
  query TEXT,                         -- for search q
  status_code INTEGER,
  success BOOLEAN DEFAULT FALSE,
  error_text TEXT
);

CREATE INDEX IF NOT EXISTS idx_canonical_access_logs_created ON canonical_access_logs(created_at DESC);

ALTER TABLE canonical_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read logs
CREATE POLICY "Admins can read canonical logs" ON canonical_access_logs
  FOR SELECT USING (check_admin_access());

-- Inserts come from service role (bypass RLS); no need for public policies

