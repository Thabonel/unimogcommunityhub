-- Migration: Create Unimog Compatibility Report System
-- Date: 2025-10-11
-- Purpose: Enable community-driven track compatibility reporting

-- 1. Add missing columns to unimog_models table
ALTER TABLE unimog_models
ADD COLUMN IF NOT EXISTS model text,
ADD COLUMN IF NOT EXISTS typical_wheelbase_cm integer,
ADD COLUMN IF NOT EXISTS typical_height_cm integer,
ADD COLUMN IF NOT EXISTS typical_width_cm integer,
ADD COLUMN IF NOT EXISTS is_common boolean DEFAULT false;

-- Populate model column from existing data
UPDATE unimog_models SET model = name WHERE model IS NULL;

-- 2. Create unimog_compatibility_reports table
CREATE TABLE IF NOT EXISTS unimog_compatibility_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Vehicle details
  unimog_model text NOT NULL,
  wheelbase_cm integer NOT NULL,
  total_height_cm integer NOT NULL,
  total_width_cm integer,
  ground_clearance_cm integer,
  body_type text,
  camper_manufacturer text,

  -- Trip outcome
  successfully_completed boolean NOT NULL DEFAULT true,
  driven_date date NOT NULL,
  weather_conditions text,

  -- Width issues
  narrowest_section_width_m numeric(4,2),
  width_tight boolean DEFAULT false,
  width_issue_location text,
  scraped_sides boolean DEFAULT false,

  -- Height issues
  lowest_overhead_m numeric(4,2),
  height_tight boolean DEFAULT false,
  height_issue_location text,
  hit_overhead boolean DEFAULT false,
  overhead_damage text,

  -- Turning/wheelbase issues
  wheelbase_issue boolean DEFAULT false,
  required_reversing boolean DEFAULT false,
  turning_issue_location text,

  -- Ground clearance issues
  ground_contact boolean DEFAULT false,
  clearance_issue_location text,

  -- Recommendations
  recommended_vehicle_type text NOT NULL DEFAULT 'any_unimog',
  notes text,

  -- Community voting
  helpful_count integer NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create track_contribution_votes table
CREATE TABLE IF NOT EXISTS track_contribution_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id uuid NOT NULL REFERENCES unimog_compatibility_reports(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),

  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(contribution_id, user_id)
);

-- 4. Add compatibility summary columns to tracks table
ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS min_track_width_m numeric(4,2),
ADD COLUMN IF NOT EXISTS min_width_location text,
ADD COLUMN IF NOT EXISTS min_overhead_clearance_m numeric(4,2),
ADD COLUMN IF NOT EXISTS min_clearance_location text,
ADD COLUMN IF NOT EXISTS low_branches boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS max_wheelbase_m numeric(4,2),
ADD COLUMN IF NOT EXISTS tight_turns boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS min_ground_clearance_cm integer,
ADD COLUMN IF NOT EXISTS suitable_for_short_wb boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS suitable_for_long_wb boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS suitable_for_expedition boolean DEFAULT true;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_compatibility_reports_track_id
  ON unimog_compatibility_reports(track_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_reports_user_id
  ON unimog_compatibility_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_contribution_votes_contribution_id
  ON track_contribution_votes(contribution_id);
CREATE INDEX IF NOT EXISTS idx_contribution_votes_user_id
  ON track_contribution_votes(user_id);

-- 6. Set up RLS policies for unimog_compatibility_reports
ALTER TABLE unimog_compatibility_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view compatibility reports"
  ON unimog_compatibility_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON unimog_compatibility_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON unimog_compatibility_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON unimog_compatibility_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to reports"
  ON unimog_compatibility_reports FOR ALL
  TO authenticated
  USING (check_admin_access());

-- 7. Set up RLS policies for track_contribution_votes
ALTER TABLE track_contribution_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
  ON track_contribution_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON track_contribution_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON track_contribution_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON track_contribution_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to votes"
  ON track_contribution_votes FOR ALL
  TO authenticated
  USING (check_admin_access());

-- 8. Create function to update track compatibility from reports
CREATE OR REPLACE FUNCTION update_track_compatibility_summary()
RETURNS trigger AS $$
BEGIN
  UPDATE tracks t
  SET
    min_track_width_m = (
      SELECT MIN(narrowest_section_width_m)
      FROM unimog_compatibility_reports
      WHERE track_id = NEW.track_id AND narrowest_section_width_m IS NOT NULL
    ),
    min_overhead_clearance_m = (
      SELECT MIN(lowest_overhead_m)
      FROM unimog_compatibility_reports
      WHERE track_id = NEW.track_id AND lowest_overhead_m IS NOT NULL
    ),
    low_branches = (
      SELECT bool_or(height_tight)
      FROM unimog_compatibility_reports
      WHERE track_id = NEW.track_id
    ),
    tight_turns = (
      SELECT bool_or(required_reversing)
      FROM unimog_compatibility_reports
      WHERE track_id = NEW.track_id
    ),
    suitable_for_short_wb = (
      SELECT COUNT(*) > 0
      FROM unimog_compatibility_reports
      WHERE track_id = NEW.track_id
        AND wheelbase_cm <= 3000
        AND successfully_completed = true
    ),
    suitable_for_long_wb = (
      SELECT COUNT(*) > 0
      FROM unimog_compatibility_reports
      WHERE track_id = NEW.track_id
        AND wheelbase_cm > 3000
        AND successfully_completed = true
    ),
    suitable_for_expedition = (
      SELECT COUNT(*) > 0
      FROM unimog_compatibility_reports
      WHERE track_id = NEW.track_id
        AND total_height_cm > 300
        AND successfully_completed = true
    )
  WHERE t.id = NEW.track_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create trigger to auto-update track compatibility
DROP TRIGGER IF EXISTS update_track_compatibility_trigger ON unimog_compatibility_reports;
CREATE TRIGGER update_track_compatibility_trigger
  AFTER INSERT OR UPDATE ON unimog_compatibility_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_track_compatibility_summary();

-- 10. Create updated_at trigger for compatibility reports
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_compatibility_reports_updated_at ON unimog_compatibility_reports;
CREATE TRIGGER update_compatibility_reports_updated_at
  BEFORE UPDATE ON unimog_compatibility_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
