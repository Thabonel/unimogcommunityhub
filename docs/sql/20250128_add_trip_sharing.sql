-- Add trip sharing functionality
-- Allows users to share trips with specific users, groups, or make them public

-- Add sharing columns to trips table
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS shared_with_users uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shared_with_groups uuid[] DEFAULT '{}';

-- Create trip_shares table for tracking individual shares
CREATE TABLE IF NOT EXISTS trip_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  shared_with_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  shared_with_group_id uuid REFERENCES community_groups(id) ON DELETE CASCADE,
  shared_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure at least one share target is specified
  CONSTRAINT must_have_target CHECK (
    shared_with_user_id IS NOT NULL OR shared_with_group_id IS NOT NULL
  ),
  
  -- Prevent duplicate shares
  UNIQUE(trip_id, shared_with_user_id),
  UNIQUE(trip_id, shared_with_group_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_trip_shares_trip_id ON trip_shares(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_shares_user_id ON trip_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_trip_shares_group_id ON trip_shares(shared_with_group_id);
CREATE INDEX IF NOT EXISTS idx_trip_shares_shared_by ON trip_shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_trips_shared_users ON trips USING GIN(shared_with_users);
CREATE INDEX IF NOT EXISTS idx_trips_shared_groups ON trips USING GIN(shared_with_groups);

-- RLS Policies for trip_shares table
ALTER TABLE trip_shares ENABLE ROW LEVEL SECURITY;

-- Users can view shares for trips they own or are shared with
CREATE POLICY "Users can view relevant trip shares"
  ON trip_shares FOR SELECT
  USING (
    auth.uid() = shared_by OR
    auth.uid() = shared_with_user_id OR
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_shares.trip_id 
      AND (trips.user_id = auth.uid() OR trips.created_by = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = trip_shares.shared_with_group_id 
      AND group_members.user_id = auth.uid()
    )
  );

-- Only trip owners can create shares
CREATE POLICY "Trip owners can create shares"
  ON trip_shares FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_shares.trip_id 
      AND (trips.user_id = auth.uid() OR trips.created_by = auth.uid())
    ) AND
    auth.uid() = shared_by
  );

-- Only trip owners can delete shares
CREATE POLICY "Trip owners can delete shares"
  ON trip_shares FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_shares.trip_id 
      AND (trips.user_id = auth.uid() OR trips.created_by = auth.uid())
    )
  );

-- Clean up existing duplicate policies first
DROP POLICY IF EXISTS "Users can view their own trips" ON trips;
DROP POLICY IF EXISTS "Users can view own trips" ON trips;
DROP POLICY IF EXISTS "Users can view public trips" ON trips;
DROP POLICY IF EXISTS "Users can view trips based on visibility" ON trips;
DROP POLICY IF EXISTS "trips_user_select" ON trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON trips;
DROP POLICY IF EXISTS "Users can update own trips" ON trips;
DROP POLICY IF EXISTS "trips_user_update" ON trips;
DROP POLICY IF EXISTS "Users can delete their own trips" ON trips;
DROP POLICY IF EXISTS "Users can delete own trips" ON trips;
DROP POLICY IF EXISTS "trips_user_delete" ON trips;
DROP POLICY IF EXISTS "Users can create trips" ON trips;
DROP POLICY IF EXISTS "Users can insert their own trips" ON trips;
DROP POLICY IF EXISTS "trips_user_insert" ON trips;

-- Combined policy for viewing trips (own, public, or shared)
CREATE POLICY "trips_shared_select_policy"
  ON trips FOR SELECT
  USING (
    -- User owns the trip (handle both user_id and created_by columns)
    (user_id = auth.uid() OR created_by = auth.uid()) OR
    -- Trip is public
    is_public = true OR
    -- Trip is shared with user directly (when arrays exist)
    (shared_with_users IS NOT NULL AND auth.uid() = ANY(shared_with_users)) OR
    -- Trip is shared via trip_shares table
    EXISTS (
      SELECT 1 FROM trip_shares 
      WHERE trip_shares.trip_id = trips.id 
      AND trip_shares.shared_with_user_id = auth.uid()
    ) OR
    -- Trip is shared with a group the user belongs to
    EXISTS (
      SELECT 1 FROM trip_shares 
      JOIN group_members ON group_members.group_id = trip_shares.shared_with_group_id
      WHERE trip_shares.trip_id = trips.id 
      AND group_members.user_id = auth.uid()
    ) OR
    -- Trip is shared with groups (array - when it exists)
    (shared_with_groups IS NOT NULL AND EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = ANY(trips.shared_with_groups)
      AND group_members.user_id = auth.uid()
    ))
  );

-- Users can only update their own trips
CREATE POLICY "trips_shared_update_policy"
  ON trips FOR UPDATE
  USING (user_id = auth.uid() OR created_by = auth.uid())
  WITH CHECK (user_id = auth.uid() OR created_by = auth.uid());

-- Users can only delete their own trips  
CREATE POLICY "trips_shared_delete_policy"
  ON trips FOR DELETE
  USING (user_id = auth.uid() OR created_by = auth.uid());

-- Users can insert their own trips
CREATE POLICY "trips_shared_insert_policy"
  ON trips FOR INSERT
  WITH CHECK (user_id = auth.uid() OR created_by = auth.uid());

-- Function to get trips shared with a user
CREATE OR REPLACE FUNCTION get_shared_trips(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  owner_id uuid,
  owner_name text,
  shared_via text,
  distance_km numeric,
  difficulty text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    t.id,
    t.name,
    t.description,
    COALESCE(t.user_id, t.created_by) as owner_id,
    p.display_name as owner_name,
    CASE 
      WHEN t.is_public THEN 'public'
      WHEN p_user_id = ANY(t.shared_with_users) THEN 'direct'
      WHEN ts.shared_with_user_id IS NOT NULL THEN 'direct'
      ELSE 'group'
    END as shared_via,
    t.distance_km,
    t.difficulty,
    t.created_at
  FROM trips t
  JOIN profiles p ON p.id = COALESCE(t.user_id, t.created_by)
  LEFT JOIN trip_shares ts ON ts.trip_id = t.id AND ts.shared_with_user_id = p_user_id
  LEFT JOIN trip_shares tsg ON tsg.trip_id = t.id
  LEFT JOIN group_members gm ON gm.group_id = tsg.shared_with_group_id AND gm.user_id = p_user_id
  WHERE 
    -- Not the owner's own trips
    COALESCE(t.user_id, t.created_by) != p_user_id AND
    (
      -- Public trips
      t.is_public = true OR
      -- Directly shared with user
      p_user_id = ANY(t.shared_with_users) OR
      ts.shared_with_user_id IS NOT NULL OR
      -- Shared via group
      gm.user_id IS NOT NULL OR
      EXISTS (
        SELECT 1 FROM group_members gm2
        WHERE gm2.group_id = ANY(t.shared_with_groups)
        AND gm2.user_id = p_user_id
      )
    )
  ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_shared_trips TO authenticated;