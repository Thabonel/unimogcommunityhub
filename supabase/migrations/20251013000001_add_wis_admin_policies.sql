-- Add admin RLS policies for WIS data population
-- Allows admins to INSERT/UPDATE/DELETE systems, components, and procedures

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Admins can insert WIS systems" ON wis_systems;
DROP POLICY IF EXISTS "Admins can update WIS systems" ON wis_systems;
DROP POLICY IF EXISTS "Admins can delete WIS systems" ON wis_systems;

DROP POLICY IF EXISTS "Admins can insert WIS components" ON wis_components;
DROP POLICY IF EXISTS "Admins can update WIS components" ON wis_components;
DROP POLICY IF EXISTS "Admins can delete WIS components" ON wis_components;

DROP POLICY IF EXISTS "Admins can insert WIS procedures" ON wis_procedures;
DROP POLICY IF EXISTS "Admins can update WIS procedures" ON wis_procedures;
DROP POLICY IF EXISTS "Admins can delete WIS procedures" ON wis_procedures;

-- ============================================================================
-- WIS Systems Policies
-- ============================================================================

CREATE POLICY "Admins can insert WIS systems"
ON wis_systems
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update WIS systems"
ON wis_systems
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete WIS systems"
ON wis_systems
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- WIS Components Policies
-- ============================================================================

CREATE POLICY "Admins can insert WIS components"
ON wis_components
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update WIS components"
ON wis_components
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete WIS components"
ON wis_components
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- WIS Procedures Policies
-- ============================================================================

CREATE POLICY "Admins can insert WIS procedures"
ON wis_procedures
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update WIS procedures"
ON wis_procedures
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete WIS procedures"
ON wis_procedures
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- Verification
-- ============================================================================

-- Check policies were created
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies
-- WHERE tablename IN ('wis_systems', 'wis_components', 'wis_procedures')
-- ORDER BY tablename, cmd, policyname;
