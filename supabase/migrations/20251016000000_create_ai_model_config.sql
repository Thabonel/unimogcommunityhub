CREATE TABLE IF NOT EXISTS ai_model_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL UNIQUE,
  provider text NOT NULL,
  model_name text NOT NULL,
  api_key_env_var text NOT NULL,
  temperature numeric DEFAULT 0.7,
  max_tokens integer DEFAULT 1500,
  is_active boolean DEFAULT true,
  fallback_provider text,
  fallback_model text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  last_modified_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_ai_model_config_service ON ai_model_config(service_name);
CREATE INDEX idx_ai_model_config_active ON ai_model_config(is_active);

INSERT INTO ai_model_config (service_name, provider, model_name, api_key_env_var, temperature, max_tokens) VALUES
  ('barry_query_expansion', 'openai', 'gpt-4o-mini', 'OPENAI_API_KEY', 0.3, 500),
  ('barry_reranking', 'openai', 'gpt-4o-mini', 'OPENAI_API_KEY', 0.2, 200),
  ('barry_verification', 'openai', 'gpt-4o-mini', 'OPENAI_API_KEY', 0.2, 200),
  ('barry_main_response', 'openai', 'gpt-4o', 'OPENAI_API_KEY', 0.7, 1500)
ON CONFLICT (service_name) DO NOTHING;

ALTER TABLE ai_model_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage AI model config"
  ON ai_model_config
  FOR ALL
  USING (check_admin_access());

CREATE POLICY "Service role has full access"
  ON ai_model_config
  FOR ALL
  USING (true);
