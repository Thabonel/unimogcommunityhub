-- Dynamic RLS Performance Fix - Finds and fixes ALL remaining auth.uid() patterns
DO $$
DECLARE
    policy_record RECORD;
    table_name TEXT;
    policy_name TEXT;
    policy_definition TEXT;
    new_definition TEXT;
    policy_type TEXT;
    using_clause TEXT;
    check_clause TEXT;
BEGIN
    RAISE NOTICE 'Starting dynamic RLS policy optimization...';

    FOR policy_record IN
        SELECT schemaname, tablename, policyname, definition
        FROM pg_policies
        WHERE schemaname = 'public'
        AND (
            definition ~* 'auth\.uid\(\)'
            AND NOT definition ~* '\(select auth\.uid\(\)\)'
        )
    LOOP
        table_name := policy_record.tablename;
        policy_name := policy_record.policyname;
        policy_definition := policy_record.definition;

        -- Replace auth.uid() with (select auth.uid())
        new_definition := regexp_replace(policy_definition, 'auth\.uid\(\)', '(select auth.uid())', 'g');

        -- Determine policy type and extract clauses
        IF policy_definition ~* 'FOR SELECT.*USING' THEN
            policy_type := 'SELECT';
            using_clause := regexp_replace(new_definition, '.*USING \((.*)\)', '\1');
        ELSIF policy_definition ~* 'FOR INSERT.*WITH CHECK' THEN
            policy_type := 'INSERT';
            check_clause := regexp_replace(new_definition, '.*WITH CHECK \((.*)\)', '\1');
        ELSIF policy_definition ~* 'FOR UPDATE.*USING.*WITH CHECK' THEN
            policy_type := 'UPDATE_WITH_CHECK';
            using_clause := regexp_replace(new_definition, '.*USING \((.*)\) WITH CHECK.*', '\1');
            check_clause := regexp_replace(new_definition, '.*WITH CHECK \((.*)\)', '\1');
        ELSIF policy_definition ~* 'FOR UPDATE.*USING' THEN
            policy_type := 'UPDATE';
            using_clause := regexp_replace(new_definition, '.*USING \((.*)\)', '\1');
        ELSIF policy_definition ~* 'FOR DELETE.*USING' THEN
            policy_type := 'DELETE';
            using_clause := regexp_replace(new_definition, '.*USING \((.*)\)', '\1');
        ELSIF policy_definition ~* 'FOR ALL.*USING' THEN
            policy_type := 'ALL';
            using_clause := regexp_replace(new_definition, '.*USING \((.*)\)', '\1');
        ELSE
            RAISE NOTICE 'Skipping policy % on table % - unknown format', policy_name, table_name;
            CONTINUE;
        END IF;

        BEGIN
            -- Drop the old policy
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);

            -- Create the new optimized policy
            IF policy_type = 'SELECT' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (%s)', policy_name, table_name, using_clause);
            ELSIF policy_type = 'INSERT' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR INSERT WITH CHECK (%s)', policy_name, table_name, check_clause);
            ELSIF policy_type = 'UPDATE_WITH_CHECK' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE USING (%s) WITH CHECK (%s)', policy_name, table_name, using_clause, check_clause);
            ELSIF policy_type = 'UPDATE' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE USING (%s)', policy_name, table_name, using_clause);
            ELSIF policy_type = 'DELETE' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR DELETE USING (%s)', policy_name, table_name, using_clause);
            ELSIF policy_type = 'ALL' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (%s)', policy_name, table_name, using_clause);
            END IF;

            RAISE NOTICE 'Optimized policy "%" on table "%"', policy_name, table_name;

        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error updating policy "%" on table "%": %', policy_name, table_name, SQLERRM;
        END;

    END LOOP;

    RAISE NOTICE 'Dynamic RLS policy optimization complete!';
END $$;