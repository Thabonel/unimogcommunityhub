CREATE TABLE unimog_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text UNIQUE NOT NULL,
  series text,
  typical_wheelbase_cm integer,
  typical_height_cm integer,
  typical_width_cm integer,
  typical_clearance_cm integer,
  production_years text,
  is_common boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

INSERT INTO unimog_models (model, series, typical_wheelbase_cm, typical_height_cm, typical_width_cm, typical_clearance_cm, production_years, is_common) VALUES
  ('U1300L', '435', 290, 280, 220, 40, '1988-2000', true),
  ('U1700L', '437', 385, 300, 220, 45, '2000-2013', true),
  ('U2450L', '437', 385, 310, 240, 45, '2000-2013', true),
  ('U4000', '437', 385, 310, 240, 45, '2000-2013', true),
  ('U5000', '437', 385, 310, 240, 50, '2000-2013', true),
  ('U400', '405', 280, 260, 210, 38, '1975-1988', true),
  ('U1000', '406', 290, 270, 220, 40, '1975-1988', true),
  ('U1600', '406', 290, 280, 220, 40, '1975-1988', true),
  ('U1250', '424', 290, 275, 220, 40, '1988-2000', true),
  ('U2150', '437', 385, 305, 230, 45, '2000-2013', true),
  ('U3000', '437', 385, 310, 240, 45, '2000-2013', true);

CREATE TABLE unimog_compatibility_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  unimog_model text NOT NULL,
  wheelbase_cm integer NOT NULL,
  total_height_cm integer NOT NULL,
  total_width_cm integer,
  ground_clearance_cm integer,

  body_type text,
  camper_manufacturer text,

  successfully_completed boolean NOT NULL,

  narrowest_section_width_m numeric(4,2),
  width_tight boolean DEFAULT false,
  width_issue_location text,
  scraped_sides boolean DEFAULT false,

  lowest_overhead_m numeric(4,2),
  height_tight boolean DEFAULT false,
  height_issue_location text,
  hit_overhead boolean DEFAULT false,
  overhead_damage text,

  wheelbase_issue boolean DEFAULT false,
  required_reversing boolean DEFAULT false,
  turning_issue_location text,

  ground_contact boolean DEFAULT false,
  clearance_issue_location text,

  recommended_vehicle_type text,
  notes text,
  photos jsonb,

  driven_date date NOT NULL,
  weather_conditions text,

  helpful_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_compatibility_track ON unimog_compatibility_reports(track_id);
CREATE INDEX idx_compatibility_model ON unimog_compatibility_reports(unimog_model);
CREATE INDEX idx_compatibility_user ON unimog_compatibility_reports(user_id);
CREATE INDEX idx_compatibility_date ON unimog_compatibility_reports(driven_date);

ALTER TABLE tracks ADD COLUMN IF NOT EXISTS
  min_track_width_m numeric(4,2),
  min_width_location text,
  min_overhead_clearance_m numeric(4,2),
  min_clearance_location text,
  low_branches boolean DEFAULT false,
  max_wheelbase_m numeric(4,2),
  tight_turns boolean DEFAULT false,
  min_ground_clearance_cm integer,
  suitable_for_short_wb boolean DEFAULT true,
  suitable_for_long_wb boolean DEFAULT true,
  suitable_for_expedition boolean DEFAULT true,
  compatibility_last_updated timestamptz;

CREATE TABLE track_contribution_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id uuid REFERENCES unimog_compatibility_reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at timestamptz DEFAULT now(),

  UNIQUE(contribution_id, user_id)
);

CREATE INDEX idx_contribution_votes_contribution ON track_contribution_votes(contribution_id);
CREATE INDEX idx_contribution_votes_user ON track_contribution_votes(user_id);

CREATE POLICY "Anyone can view compatibility reports"
  ON unimog_compatibility_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add compatibility reports"
  ON unimog_compatibility_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit own compatibility reports within 24 hours"
  ON unimog_compatibility_reports FOR UPDATE
  USING (
    auth.uid() = user_id AND
    created_at > now() - interval '24 hours'
  );

CREATE POLICY "Admins can moderate all compatibility reports"
  ON unimog_compatibility_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view Unimog models"
  ON unimog_models FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view contribution votes"
  ON track_contribution_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON track_contribution_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their own votes"
  ON track_contribution_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON track_contribution_votes FOR DELETE
  USING (auth.uid() = user_id);
