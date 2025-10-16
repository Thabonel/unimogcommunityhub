-- Migration: Update Barry to use Claude Haiku 4.3 for main responses
-- Date: 2025-10-16
-- Purpose: Switch from GPT-4o to Claude Haiku for better accuracy and lower cost

UPDATE ai_model_config 
SET 
  provider = 'anthropic',
  model_name = 'claude-3-5-haiku-20241022',
  api_key_env_var = 'ANTHROPIC_API_KEY',
  temperature = 0.7,
  max_tokens = 2000,
  updated_at = NOW()
WHERE service_name = 'barry_main_response';
