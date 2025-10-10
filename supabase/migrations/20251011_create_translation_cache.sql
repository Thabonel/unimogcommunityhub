-- Hybrid AI Translation System - Runtime Translation Cache
-- Created: 2025-10-11
--
-- This migration creates the infrastructure for runtime AI translation fallback.
-- Used when a translation key is missing from pre-generated files.
--
-- Flow:
-- 1. User visits site in German → i18next looks for key in de/common.json
-- 2. Key missing → triggers missingKeyHandler in i18n.ts
-- 3. Checks translation_cache table for existing translation
-- 4. If not cached → calls Edge Function to translate via OpenAI
-- 5. Saves translation to cache for future users
-- 6. Returns translated text to user

CREATE TABLE IF NOT EXISTS translation_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  translation_key text NOT NULL,
  language_code text NOT NULL,

  english_source text NOT NULL,
  translated_text text NOT NULL,

  translation_service text DEFAULT 'openai-gpt4o',
  translation_context text,

  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,

  usage_count integer DEFAULT 0,
  last_used_at timestamptz DEFAULT now(),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(translation_key, language_code)
);

COMMENT ON TABLE translation_cache IS 'Runtime AI translation cache for missing translation keys';
COMMENT ON COLUMN translation_cache.translation_key IS 'i18next key path (e.g., "hero.title")';
COMMENT ON COLUMN translation_cache.language_code IS 'Target language (de, tr, es)';
COMMENT ON COLUMN translation_cache.english_source IS 'Original English text that was translated';
COMMENT ON COLUMN translation_cache.translated_text IS 'AI-generated translation';
COMMENT ON COLUMN translation_cache.translation_service IS 'AI service used (openai-gpt4o or gemini-flash-1.5)';
COMMENT ON COLUMN translation_cache.translation_context IS 'Context provided to AI for better accuracy';
COMMENT ON COLUMN translation_cache.is_verified IS 'Admin has reviewed and approved this translation';
COMMENT ON COLUMN translation_cache.usage_count IS 'How many times this translation has been served';

CREATE INDEX idx_translation_cache_lookup ON translation_cache(translation_key, language_code);
CREATE INDEX idx_translation_cache_language ON translation_cache(language_code);
CREATE INDEX idx_translation_cache_unverified ON translation_cache(is_verified) WHERE is_verified = false;
CREATE INDEX idx_translation_cache_usage ON translation_cache(usage_count DESC);

CREATE OR REPLACE FUNCTION increment_translation_usage()
RETURNS TRIGGER AS $$
BEGIN
  NEW.usage_count = OLD.usage_count + 1;
  NEW.last_used_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_translation_usage
  BEFORE UPDATE ON translation_cache
  FOR EACH ROW
  WHEN (NEW.translated_text = OLD.translated_text)
  EXECUTE FUNCTION increment_translation_usage();

CREATE OR REPLACE FUNCTION update_translation_cache_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER translation_cache_updated_at
  BEFORE UPDATE ON translation_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_cache_timestamp();

ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translation cache is readable by everyone"
  ON translation_cache FOR SELECT
  USING (true);

CREATE POLICY "Translation cache is writable by authenticated users"
  ON translation_cache FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Translation cache is updatable by admins"
  ON translation_cache FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Translation cache is deletable by admins"
  ON translation_cache FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS translation_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  translation_cache_id uuid REFERENCES translation_cache(id) ON DELETE CASCADE,

  original_translation text NOT NULL,
  corrected_translation text NOT NULL,
  correction_reason text,

  corrected_by uuid REFERENCES auth.users(id) NOT NULL,
  corrected_at timestamptz DEFAULT now(),

  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE translation_corrections IS 'Audit log of admin corrections to AI translations';

CREATE INDEX idx_translation_corrections_cache_id ON translation_corrections(translation_cache_id);
CREATE INDEX idx_translation_corrections_user ON translation_corrections(corrected_by);

ALTER TABLE translation_corrections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translation corrections are readable by everyone"
  ON translation_corrections FOR SELECT
  USING (true);

CREATE POLICY "Translation corrections are writable by admins"
  ON translation_corrections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
