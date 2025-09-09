
-- Create a stored procedure to start a user trial
-- This function will be called with security definer to bypass RLS
CREATE OR REPLACE FUNCTION start_user_trial(
  p_user_id UUID,
  p_started_at TIMESTAMPTZ,
  p_expires_at TIMESTAMPTZ
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trial_id UUID;
BEGIN
  -- Insert the trial record
  INSERT INTO user_trials (
    user_id,
    started_at,
    expires_at,
    is_active,
    created_at,
    email_sent_at,
    converted_to_subscription
  )
  VALUES (
    p_user_id,
    p_started_at,
    p_expires_at,
    true,
    NOW(),
    NULL,
    false
  )
  RETURNING id INTO v_trial_id;
  
  -- Return the created trial record
  RETURN QUERY
  SELECT
    ut.id,
    ut.user_id,
    ut.started_at,
    ut.expires_at,
    ut.is_active
  FROM
    user_trials ut
  WHERE
    ut.id = v_trial_id;
END;
$$;

-- Add comment for the function
COMMENT ON FUNCTION start_user_trial IS 'Creates a trial for a user, bypassing RLS policies. To be used by authenticated users only.';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION start_user_trial TO authenticated;
