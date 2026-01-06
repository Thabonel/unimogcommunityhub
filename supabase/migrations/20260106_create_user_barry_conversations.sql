-- Migration: Create user_barry_conversations table for Barry memory
-- Run this in Supabase SQL Editor

BEGIN;

CREATE TABLE user_barry_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_barry_conversations_user_id ON user_barry_conversations(user_id);
CREATE INDEX idx_user_barry_conversations_updated_at ON user_barry_conversations(updated_at DESC);

ALTER TABLE user_barry_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON user_barry_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON user_barry_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON user_barry_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON user_barry_conversations FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_barry_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_barry_conversation_timestamp
  BEFORE UPDATE ON user_barry_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_barry_conversation_timestamp();

COMMIT;
