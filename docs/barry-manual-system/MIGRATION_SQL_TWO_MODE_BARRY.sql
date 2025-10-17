-- Migrate Barry AI services to Claude Haiku 4.5 for Two-Mode Barry
-- Date: 2025-10-17
-- Purpose: Enable two-mode Barry (Mechanic + Helper) with web search capabilities

-- Step 1: Update query expansion, reranking, and verification services to Claude Haiku 4.5
UPDATE ai_model_config
SET
  provider = 'anthropic',
  model_name = 'claude-haiku-4.5',
  api_key_env_var = 'ANTHROPIC_API_KEY',
  fallback_provider = 'openai',
  fallback_model = 'gpt-4o-mini'
WHERE service_name IN ('barry_query_expansion', 'barry_reranking', 'barry_verification');

-- Step 2: Add new routing service for intelligent Mechanic/Helper mode selection
INSERT INTO ai_model_config (
  service_name,
  provider,
  model_name,
  api_key_env_var,
  temperature,
  max_tokens,
  fallback_provider,
  fallback_model,
  is_active
) VALUES (
  'barry_routing',
  'anthropic',
  'claude-haiku-4.5',
  'ANTHROPIC_API_KEY',
  0.3,
  100,
  'openai',
  'gpt-4o-mini',
  true
)
ON CONFLICT (service_name) DO UPDATE SET
  provider = EXCLUDED.provider,
  model_name = EXCLUDED.model_name,
  api_key_env_var = EXCLUDED.api_key_env_var,
  temperature = EXCLUDED.temperature,
  max_tokens = EXCLUDED.max_tokens,
  fallback_provider = EXCLUDED.fallback_provider,
  fallback_model = EXCLUDED.fallback_model,
  is_active = EXCLUDED.is_active;

-- Step 3: Verify the migration
SELECT
  service_name,
  provider,
  model_name,
  fallback_provider,
  fallback_model,
  is_active
FROM ai_model_config
ORDER BY service_name;
