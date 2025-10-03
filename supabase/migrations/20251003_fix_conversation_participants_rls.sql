DROP POLICY IF EXISTS "conversation_participants_insert_policy" ON conversation_participants;

CREATE POLICY "conversation_participants_insert_policy" ON conversation_participants
FOR INSERT TO public
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
  OR NOT EXISTS (
    SELECT 1
    FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
  )
);

COMMENT ON POLICY "conversation_participants_insert_policy" ON conversation_participants IS 'Allow inserting yourself, or inserting others if you are already a participant, or inserting first participant of new conversation';
