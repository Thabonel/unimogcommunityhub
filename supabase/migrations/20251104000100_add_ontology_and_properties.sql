-- Ontology and Properties schema for capability-driven Barry
-- Date: 2025-11-04

BEGIN;

-- Required extensions for citext and gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Components master
CREATE TABLE IF NOT EXISTS public.components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name citext UNIQUE NOT NULL,
  system text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Component synonyms
CREATE TABLE IF NOT EXISTS public.component_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id uuid NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
  synonym citext NOT NULL,
  lang text DEFAULT 'en',
  confidence real DEFAULT 0.8,
  approved_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(component_id, synonym)
);

-- Attributes master (e.g., torque, clearance, boost pressure)
CREATE TABLE IF NOT EXISTS public.attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name citext UNIQUE NOT NULL,
  unit_hint text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attribute synonyms
CREATE TABLE IF NOT EXISTS public.attribute_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id uuid NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  synonym citext NOT NULL,
  lang text DEFAULT 'en',
  confidence real DEFAULT 0.8,
  approved_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(attribute_id, synonym)
);

-- Normalized property store for specs answers
CREATE TABLE IF NOT EXISTS public.wis_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_code text,
  engine_code text,
  component_id uuid REFERENCES public.components(id),
  attribute_id uuid REFERENCES public.attributes(id),
  value text,
  unit text,
  source_ref text,          -- e.g., /wis/procedures/{id} or chapter/page
  source_type text CHECK (source_type IN ('WIS','Manual','RPS','Other')) DEFAULT 'WIS',
  confidence real DEFAULT 0.7,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_components_name ON public.components (name);
CREATE INDEX IF NOT EXISTS idx_component_synonyms_synonym ON public.component_synonyms (synonym);
CREATE INDEX IF NOT EXISTS idx_attributes_name ON public.attributes (name);
CREATE INDEX IF NOT EXISTS idx_attribute_synonyms_synonym ON public.attribute_synonyms (synonym);
CREATE INDEX IF NOT EXISTS idx_wis_properties_lookup ON public.wis_properties (model_code, engine_code, component_id, attribute_id);

COMMIT;
