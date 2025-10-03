CREATE OR REPLACE FUNCTION find_conversation_by_participants(user_ids UUID[])
RETURNS TABLE (
  conversation_id UUID,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT c.id, c.updated_at
  FROM conversations c
  WHERE c.id IN (
    SELECT cp.conversation_id
    FROM conversation_participants cp
    WHERE cp.user_id = ANY(user_ids)
    GROUP BY cp.conversation_id
    HAVING COUNT(DISTINCT cp.user_id) = array_length(user_ids, 1)
      AND NOT EXISTS (
        SELECT 1
        FROM conversation_participants cp2
        WHERE cp2.conversation_id = cp.conversation_id
          AND cp2.user_id != ALL(user_ids)
      )
  )
  ORDER BY c.updated_at DESC
  LIMIT 1;
END;
$$;

COMMENT ON FUNCTION find_conversation_by_participants IS 'Finds an existing conversation with exactly the specified participants, preventing duplicates. Uses updated_at since conversations table has no created_at column.';
