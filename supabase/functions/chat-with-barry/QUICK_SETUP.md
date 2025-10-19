# Quick Setup - AI Model Hot-Swap

## Step 1: Apply Migration (1 minute)

1. Go to Supabase Dashboard → SQL Editor
2. Paste this SQL and run:

```sql
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

CREATE INDEX IF NOT EXISTS idx_ai_model_config_service ON ai_model_config(service_name);
CREATE INDEX IF NOT EXISTS idx_ai_model_config_active ON ai_model_config(is_active);

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
```

## Step 2: Add Environment Variable (1 minute)

1. Go to Supabase Dashboard → Edge Functions → Settings
2. Add secret:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (your Anthropic API key)

## Step 3: Verify Table Created

```sql
SELECT * FROM ai_model_config ORDER BY service_name;
```

You should see 4 rows:
- barry_query_expansion
- barry_reranking
- barry_verification
- barry_main_response

## Step 4: Test Quick Switch (Optional)

```sql
-- Switch main response to Claude Haiku
UPDATE ai_model_config
SET provider = 'anthropic',
    model_name = 'claude-3-5-haiku-20241022'
WHERE service_name = 'barry_main_response';

-- Check it worked
SELECT service_name, provider, model_name
FROM ai_model_config
WHERE service_name = 'barry_main_response';

-- Switch back to OpenAI
UPDATE ai_model_config
SET provider = 'openai',
    model_name = 'gpt-4o'
WHERE service_name = 'barry_main_response';
```

Done! Barry is now ready for hot-swapping models.
