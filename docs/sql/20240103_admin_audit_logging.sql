-- Admin Audit Logging System

-- Create audit_logs table for tracking all admin actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- RLS policies for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs" ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Nobody can update or delete audit logs (immutable)
CREATE POLICY "Audit logs are immutable" ON public.audit_logs
  FOR ALL
  USING (false);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Verify the user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can log admin actions';
  END IF;

  -- Insert the audit log
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data,
    metadata
  ) VALUES (
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_old_data,
    p_new_data,
    p_metadata
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;

-- Trigger function to automatically log changes to sensitive tables
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
BEGIN
  -- Skip if not an admin action
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Prepare old and new data
  IF TG_OP = 'DELETE' THEN
    v_old_data = to_jsonb(OLD);
    v_new_data = NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    v_old_data = to_jsonb(OLD);
    v_new_data = to_jsonb(NEW);
  ELSIF TG_OP = 'INSERT' THEN
    v_old_data = NULL;
    v_new_data = to_jsonb(NEW);
  END IF;

  -- Log the action
  PERFORM public.log_admin_action(
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id::TEXT
      ELSE NEW.id::TEXT
    END,
    v_old_data,
    v_new_data,
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'trigger_name', TG_NAME
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_profiles_admin_changes
  AFTER UPDATE OR DELETE ON public.profiles
  FOR EACH ROW 
  WHEN (pg_trigger_depth() = 0)
  EXECUTE FUNCTION public.audit_trigger_function();