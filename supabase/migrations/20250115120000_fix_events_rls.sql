DROP POLICY IF EXISTS "Public events visible to all" ON events;

CREATE POLICY "Public events visible to all"
ON events
FOR SELECT
TO public
USING (
  visibility = 'public'
  OR organizer_id = auth.uid()
);
