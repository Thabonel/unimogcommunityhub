-- Migration: Create events system for community event coordination
-- Date: 2025-01-15
-- Purpose: Enable user-created events with RSVP functionality, location-based matching,
--          and support for Barry AI facilitation

-- Enable PostGIS extension for proximity matching
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================================================
-- TABLE: events
-- =============================================================================
-- Core events table supporting trips, working bees, social meetups, and emergency help

CREATE TABLE events (
  -- Core identification
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  organizer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Event categorization
  event_type text NOT NULL CHECK (event_type IN ('trip', 'working_bee', 'social', 'emergency_help', 'meetup')),
  category text,
  tags text[] DEFAULT '{}',

  -- Scheduling
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  rsvp_deadline timestamptz,

  -- Location (for proximity matching)
  location_name text,
  location_address text,
  location_lat numeric(10, 7),
  location_lng numeric(10, 7),
  location_coordinates geography(POINT, 4326),

  -- Participant management
  max_participants integer,
  min_participants integer DEFAULT 1,

  -- Requirements
  vehicle_requirements jsonb DEFAULT '{}',
  skill_level text CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  required_equipment text[],

  -- Visibility and status
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'friends_only')),
  status text DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
  is_barry_suggested boolean DEFAULT false,

  -- Emergency-specific fields
  is_emergency boolean DEFAULT false,
  emergency_severity text CHECK (emergency_severity IN ('low', 'medium', 'high', 'critical')),
  emergency_resolved_at timestamptz,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  cancellation_reason text
);

-- Trigger to auto-update location_coordinates from lat/lng
CREATE OR REPLACE FUNCTION update_event_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
    NEW.location_coordinates := ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_coordinates
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_event_coordinates();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_events_timestamp
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();

-- =============================================================================
-- TABLE: event_participants
-- =============================================================================
-- Tracks RSVPs and participant status for events

CREATE TABLE event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- RSVP status
  status text DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going', 'waitlist')),

  -- Timestamps
  rsvp_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  checked_in boolean DEFAULT false,
  checked_in_at timestamptz,

  -- Participant metadata
  notes text,
  can_provide text[],

  -- Unique constraint: one RSVP per user per event
  UNIQUE(event_id, user_id)
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_participants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_participants_timestamp
  BEFORE UPDATE ON event_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_event_participants_updated_at();

-- =============================================================================
-- TABLE: event_invitations
-- =============================================================================
-- Tracks invitations to private events

CREATE TABLE event_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  invited_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invited_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),

  created_at timestamptz DEFAULT now(),
  responded_at timestamptz,

  UNIQUE(event_id, invited_user_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Events table indexes
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_visibility ON events(visibility);
CREATE INDEX idx_events_location ON events USING GIST(location_coordinates);
CREATE INDEX idx_events_barry_suggested ON events(is_barry_suggested) WHERE is_barry_suggested = true;
CREATE INDEX idx_events_emergency ON events(is_emergency) WHERE is_emergency = true;

-- Event participants indexes
CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_event_participants_user ON event_participants(user_id);
CREATE INDEX idx_event_participants_status ON event_participants(status);

-- Event invitations indexes
CREATE INDEX idx_event_invitations_event ON event_invitations(event_id);
CREATE INDEX idx_event_invitations_user ON event_invitations(invited_user_id);
CREATE INDEX idx_event_invitations_status ON event_invitations(status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Public events visible to all" ON events
  FOR SELECT USING (
    visibility = 'public'
    OR organizer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their events" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- Admin can do everything with events
CREATE POLICY "Admins have full access to events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

-- Event participants policies
CREATE POLICY "Users can view event participants" ON event_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
        AND (
          events.visibility = 'public'
          OR events.organizer_id = auth.uid()
          OR event_participants.user_id = auth.uid()
        )
    )
  );

CREATE POLICY "Users can RSVP to events" ON event_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVP" ON event_participants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their own RSVP" ON event_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Event organizers can manage participants
CREATE POLICY "Organizers can manage participants" ON event_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_participants.event_id
        AND events.organizer_id = auth.uid()
    )
  );

-- Event invitations policies
CREATE POLICY "Users can view their invitations" ON event_invitations
  FOR SELECT USING (
    auth.uid() = invited_user_id
    OR auth.uid() = invited_by_user_id
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_invitations.event_id
        AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Event organizers can invite users" ON event_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_invitations.event_id
        AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Invited users can update invitation status" ON event_invitations
  FOR UPDATE USING (auth.uid() = invited_user_id);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function: Find events within radius (for proximity matching)
CREATE OR REPLACE FUNCTION find_events_nearby(
  user_lat numeric,
  user_lng numeric,
  radius_km numeric DEFAULT 50,
  p_event_type text DEFAULT NULL
)
RETURNS TABLE (
  event_id uuid,
  title text,
  event_type text,
  start_date timestamptz,
  distance_km numeric,
  organizer_id uuid,
  location_name text,
  participant_count bigint,
  max_participants integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    e.event_type,
    e.start_date,
    ROUND((ST_Distance(
      e.location_coordinates,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000)::numeric, 2) AS distance_km,
    e.organizer_id,
    e.location_name,
    COUNT(ep.id) FILTER (WHERE ep.status IN ('going', 'maybe')) AS participant_count,
    e.max_participants
  FROM events e
  LEFT JOIN event_participants ep ON e.id = ep.event_id
  WHERE e.location_coordinates IS NOT NULL
    AND e.status = 'upcoming'
    AND e.visibility = 'public'
    AND (p_event_type IS NULL OR e.event_type = p_event_type)
    AND ST_DWithin(
      e.location_coordinates,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000
    )
  GROUP BY e.id
  ORDER BY distance_km ASC;
END;
$$;

-- Function: Get event participant count
CREATE OR REPLACE FUNCTION get_event_participant_count(p_event_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM event_participants
  WHERE event_id = p_event_id
    AND status IN ('going', 'maybe');
$$;

-- Function: Check if event is full
CREATE OR REPLACE FUNCTION is_event_full(p_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT
    CASE
      WHEN e.max_participants IS NULL THEN false
      ELSE get_event_participant_count(e.id) >= e.max_participants
    END
  FROM events e
  WHERE e.id = p_event_id;
$$;

-- Function: Get upcoming events for a user (based on location and interests)
CREATE OR REPLACE FUNCTION get_recommended_events_for_user(
  p_user_id uuid,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  event_id uuid,
  title text,
  event_type text,
  start_date timestamptz,
  distance_km numeric,
  match_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_location jsonb;
  v_user_model text;
BEGIN
  -- Get user's location and vehicle from profile
  SELECT location, unimog_model
  INTO v_user_location, v_user_model
  FROM profiles
  WHERE id = p_user_id;

  RETURN QUERY
  SELECT
    e.id,
    e.title,
    e.event_type,
    e.start_date,
    CASE
      WHEN e.location_coordinates IS NOT NULL AND v_user_location IS NOT NULL
      THEN ROUND((ST_Distance(
        e.location_coordinates,
        ST_SetSRID(ST_MakePoint(
          (v_user_location->>'lng')::numeric,
          (v_user_location->>'lat')::numeric
        ), 4326)::geography
      ) / 1000)::numeric, 2)
      ELSE NULL
    END AS distance_km,
    CASE
      WHEN e.vehicle_requirements->>'model' = v_user_model THEN 'Vehicle match'
      WHEN e.location_coordinates IS NOT NULL THEN 'Nearby event'
      ELSE 'General interest'
    END AS match_reason
  FROM events e
  WHERE e.status = 'upcoming'
    AND e.visibility = 'public'
    AND e.start_date > now()
    AND NOT EXISTS (
      SELECT 1 FROM event_participants ep
      WHERE ep.event_id = e.id
        AND ep.user_id = p_user_id
    )
  ORDER BY
    CASE WHEN e.vehicle_requirements->>'model' = v_user_model THEN 1 ELSE 2 END,
    e.start_date ASC
  LIMIT p_limit;
END;
$$;

-- Function: Get event summary with participant info
CREATE OR REPLACE FUNCTION get_event_summary(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'event_id', e.id,
    'title', e.title,
    'event_type', e.event_type,
    'status', e.status,
    'start_date', e.start_date,
    'organizer_id', e.organizer_id,
    'participant_stats', jsonb_build_object(
      'going', COUNT(*) FILTER (WHERE ep.status = 'going'),
      'maybe', COUNT(*) FILTER (WHERE ep.status = 'maybe'),
      'not_going', COUNT(*) FILTER (WHERE ep.status = 'not_going'),
      'total', COUNT(*) FILTER (WHERE ep.status IN ('going', 'maybe')),
      'max_participants', e.max_participants,
      'is_full', is_event_full(e.id)
    ),
    'location', jsonb_build_object(
      'name', e.location_name,
      'address', e.location_address,
      'lat', e.location_lat,
      'lng', e.location_lng
    )
  )
  INTO v_result
  FROM events e
  LEFT JOIN event_participants ep ON e.id = ep.event_id
  WHERE e.id = p_event_id
  GROUP BY e.id;

  RETURN v_result;
END;
$$;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE events IS 'Community events including trips, working bees, social meetups, and emergency coordination';
COMMENT ON TABLE event_participants IS 'RSVP tracking for event participants';
COMMENT ON TABLE event_invitations IS 'Invitations to private events';

COMMENT ON COLUMN events.is_barry_suggested IS 'Flag indicating this event was created by Barry AI as a draft suggestion';
COMMENT ON COLUMN events.location_coordinates IS 'PostGIS geography point for proximity queries';
COMMENT ON COLUMN events.vehicle_requirements IS 'JSON object specifying required vehicle capabilities';

COMMENT ON FUNCTION find_events_nearby IS 'Find public events within specified radius of a location';
COMMENT ON FUNCTION get_event_participant_count IS 'Get count of confirmed and maybe participants';
COMMENT ON FUNCTION is_event_full IS 'Check if event has reached max participant capacity';
COMMENT ON FUNCTION get_recommended_events_for_user IS 'Get personalized event recommendations based on user profile';
COMMENT ON FUNCTION get_event_summary IS 'Get comprehensive event summary including participant statistics';
