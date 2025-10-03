DROP POLICY IF EXISTS "Users can see conversations they participate in" ON conversations;
DROP POLICY IF EXISTS "Users can see conversation participants of their conversations" ON conversation_participants;

CREATE POLICY "conversations_select_policy" ON conversations
FOR SELECT
TO public
USING (
  id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "conversation_participants_select_policy" ON conversation_participants
FOR SELECT
TO public
USING (
  user_id = auth.uid()
  OR conversation_id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_id = auth.uid()
  )
);
