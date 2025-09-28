-- Barry Knowledge Base Table Creation
-- Run this in Supabase SQL Editor to fix "Failed to load Barry Knowledge" admin error
-- Date: 2025-09-28
-- Purpose: Enable Barry's simplified executive summary + PDF approach

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the barry_knowledge_base table
CREATE TABLE IF NOT EXISTS public.barry_knowledge_base (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Query matching
  question_keyword  text NOT NULL,              -- canonical trigger term (e.g., 'portal hub seals')
  aliases           text[] NOT NULL DEFAULT '{}', -- synonyms: ['hub seal','portal seal','wheel hub seal']

  -- Barry's response
  executive_summary text NOT NULL,              -- short pointer text (2-4 sentences max)

  -- Manual location
  manual_type       text NOT NULL DEFAULT 'U435', -- 'U435', 'U1700L', 'G604', etc.
  manual_section    text,                       -- e.g., 'Section 6.1/1'
  start_page        integer NOT NULL,           -- original manual page number
  end_page          integer,                    -- optional page range end
  pdf_filename      text NOT NULL,              -- chapter PDF filename
  storage_path      text NOT NULL,              -- path in Supabase storage
  bucket            text NOT NULL DEFAULT 'manuals',

  -- Management
  priority          integer NOT NULL DEFAULT 0, -- higher wins on conflicts
  is_active         boolean NOT NULL DEFAULT true,

  -- Optional linkage to existing index
  source_index_id   uuid,
  source_index_table text DEFAULT 'u435_manual_index',

  -- Timestamps
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  -- Full-text search vector (auto-generated)
  search_fts        tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'english',
      unaccent(
        coalesce(question_keyword,'') || ' ' ||
        array_to_string(aliases,' ') || ' ' ||
        coalesce(executive_summary,'')
      )
    )
  ) STORED,

  -- Data validation
  CONSTRAINT chk_pages_positive CHECK (start_page > 0 AND (end_page IS NULL OR end_page >= start_page))
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS barry_kb_keyword_uniq
  ON public.barry_knowledge_base (lower(question_keyword));

CREATE INDEX IF NOT EXISTS barry_kb_storage_idx
  ON public.barry_knowledge_base (bucket, storage_path);

CREATE INDEX IF NOT EXISTS barry_kb_priority_idx
  ON public.barry_knowledge_base (is_active, priority DESC);

CREATE INDEX IF NOT EXISTS barry_kb_fts_idx
  ON public.barry_knowledge_base USING gin (search_fts);

CREATE INDEX IF NOT EXISTS barry_kb_keyword_trgm_idx
  ON public.barry_knowledge_base USING gin (lower(question_keyword) gin_trgm_ops);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.touch_barry_kb_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_touch_barry_kb ON public.barry_knowledge_base;
CREATE TRIGGER trg_touch_barry_kb
BEFORE UPDATE ON public.barry_knowledge_base
FOR EACH ROW EXECUTE FUNCTION public.touch_barry_kb_updated_at();

-- Row Level Security
ALTER TABLE public.barry_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow reads for authenticated users (Barry Edge Function)
DROP POLICY IF EXISTS kb_read_server ON public.barry_knowledge_base;
CREATE POLICY kb_read_server ON public.barry_knowledge_base
  FOR SELECT USING (true);

-- Allow all operations for service role (admin dashboard)
DROP POLICY IF EXISTS kb_write_service ON public.barry_knowledge_base;
CREATE POLICY kb_write_service ON public.barry_knowledge_base
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Sample data for testing
INSERT INTO public.barry_knowledge_base
(question_keyword, aliases, executive_summary, manual_type, manual_section, start_page, end_page, pdf_filename, storage_path, priority)
VALUES
('portal hub seals',
 ARRAY['hub seal','portal seal','wheel hub oil seal','wheel hub seals','portal hub seal replacement','front portal hub'],
 'Portal hub seal replacement is covered in U435 Manual Section 19 (Portal Hub Front), page 555. The procedure includes hub disassembly, seal extraction, and reassembly with proper torque specifications. Review the exploded diagram before starting.',
 'U435',
 'Section 19',
 555, 560,
 'U435_19_Wheel_Hub_Front.pdf',
 'U435_19_Wheel_Hub_Front.pdf',
 100),

('rear portal hub seals',
 ARRAY['rear hub seal','rear portal seal','rear wheel hub seal','portal hub rear'],
 'Rear portal hub seal procedures are detailed in U435 Manual Section 22 (Portal Hub Rear), page 651. Follow the step-by-step disassembly and reassembly sequence with specified torque values.',
 'U435',
 'Section 22',
 651, 655,
 'U435_22_Wheel_Hub_Rear.pdf',
 'U435_22_Wheel_Hub_Rear.pdf',
 100),

('hydraulic brake bleeding',
 ARRAY['brake bleeding','hydraulic brakes','brake system bleeding','bleed brakes'],
 'Hydraulic brake system bleeding procedures are covered in U435 Manual pages 710-755. This includes proper bleeding sequence, fluid specifications, and system testing procedures.',
 'U435',
 'Brake Systems',
 710, 755,
 'U435_23_Service_Brakes.pdf',
 'U435_23_Service_Brakes.pdf',
 80)

ON CONFLICT (lower(question_keyword)) DO NOTHING;

-- Verification query
SELECT
  'barry_knowledge_base created successfully' as status,
  count(*) as sample_rows
FROM public.barry_knowledge_base;

-- Example query Barry will use
/*
SELECT
  executive_summary,
  manual_section,
  start_page,
  end_page,
  pdf_filename,
  storage_path,
  manual_type
FROM public.barry_knowledge_base
WHERE is_active = true
  AND (
    lower(question_keyword) = lower($1)
    OR $1 ILIKE ANY(aliases)
    OR search_fts @@ plainto_tsquery('english', $1)
    OR similarity(lower(question_keyword), lower($1)) > 0.3
  )
ORDER BY priority DESC, similarity(lower(question_keyword), lower($1)) DESC
LIMIT 1;
*/