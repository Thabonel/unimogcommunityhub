
-- SQL schema for Community Improvement Framework

-- Roadmap items table
CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'on_hold')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  target_completion TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  user_votes INTEGER DEFAULT 0
);

-- Relation between feedback and roadmap items
CREATE TABLE IF NOT EXISTS public.feedback_roadmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES public.feedback(id) ON DELETE CASCADE,
  roadmap_id UUID NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(feedback_id, roadmap_id)
);

-- A/B testing experiments table
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  variants JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  weightings JSONB,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Experiment results
CREATE TABLE IF NOT EXISTS public.experiment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_results ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Roadmap items accessible to all authenticated users
CREATE POLICY "Roadmap items viewable by all authenticated users"
  ON public.roadmap_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify roadmap items
CREATE POLICY "Only admins can insert roadmap items"
  ON public.roadmap_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update roadmap items"
  ON public.roadmap_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Experiment policies
CREATE POLICY "Experiments viewable by all authenticated users"
  ON public.experiments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage experiments"
  ON public.experiments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Helper function to get unassigned feedback for roadmap
CREATE OR REPLACE FUNCTION public.get_unassigned_feedback_for_roadmap()
RETURNS SETOF public.feedback
LANGUAGE sql
STABLE
AS $$
  SELECT f.*
  FROM public.feedback f
  LEFT JOIN public.feedback_roadmap fr ON f.id = fr.feedback_id
  WHERE fr.id IS NULL
    AND f.type IN ('feature_request', 'suggestion')
    AND f.votes > 0
    AND (f.status IS NULL OR f.status != 'implemented')
  ORDER BY f.votes DESC, f.created_at DESC
$$;

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_roadmap_items_status ON public.roadmap_items(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_priority ON public.roadmap_items(priority);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_category ON public.roadmap_items(category);
CREATE INDEX IF NOT EXISTS idx_feedback_roadmap_feedback_id ON public.feedback_roadmap(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_roadmap_roadmap_id ON public.feedback_roadmap(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_experiments_active ON public.experiments(active);
CREATE INDEX IF NOT EXISTS idx_experiment_results_experiment_id ON public.experiment_results(experiment_id);

