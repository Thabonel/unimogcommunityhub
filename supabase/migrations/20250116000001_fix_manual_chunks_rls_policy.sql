CREATE POLICY "manual_chunks_admin_insert" ON public.manual_chunks
FOR INSERT
TO public
WITH CHECK (is_super_admin());

CREATE POLICY "manual_chunks_admin_update" ON public.manual_chunks
FOR UPDATE
TO public
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "manual_chunks_admin_delete" ON public.manual_chunks
FOR DELETE
TO public
USING (is_super_admin());