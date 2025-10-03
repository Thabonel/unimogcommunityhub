DROP POLICY IF EXISTS "trips_shared_select_policy" ON trips;

CREATE POLICY "trips_select_policy" ON trips
FOR SELECT
TO public
USING (
  user_id = auth.uid()
  OR created_by = auth.uid()
  OR is_public = true
  OR (shared_with_users IS NOT NULL AND auth.uid() = ANY(shared_with_users))
  OR (shared_with_groups IS NOT NULL AND auth.uid() IN (
    SELECT user_id FROM group_members
    WHERE group_id = ANY(trips.shared_with_groups)
  ))
);
