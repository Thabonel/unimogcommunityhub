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
        SELECT schemaname, tablename, policyname, qual, with_check
        FROM pg_policies
        WHERE schemaname = 'public'
        AND (
            qual ~* 'auth\.uid\(\)'
            OR with_check ~* 'auth\.uid\(\)'
        )
        AND NOT (
            qual ~* '\(select auth\.uid\(\)\)'
            AND with_check ~* '\(select auth\.uid\(\)\)'
        )
    LOOP
        table_name := policy_record.tablename;
        policy_name := policy_record.policyname;

        BEGIN
            -- Get the full policy definition
            SELECT pg_get_expr(polqual, polrelid) as qual_expr,
                   pg_get_expr(polwithcheck, polrelid) as check_expr,
                   polcmd
            INTO using_clause, check_clause, policy_type
            FROM pg_policy p
            JOIN pg_class c ON p.polrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = 'public'
            AND c.relname = table_name
            AND p.polname = policy_name;

            -- Replace auth.uid() with (select auth.uid()) in both clauses
            IF using_clause IS NOT NULL THEN
                using_clause := regexp_replace(using_clause, 'auth\.uid\(\)', '(select auth.uid())', 'g');
            END IF;

            IF check_clause IS NOT NULL THEN
                check_clause := regexp_replace(check_clause, 'auth\.uid\(\)', '(select auth.uid())', 'g');
            END IF;

            -- Drop the old policy
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);

            -- Create the new optimized policy based on command type
            IF policy_type = 'r' THEN -- SELECT
                EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (%s)', policy_name, table_name, using_clause);
            ELSIF policy_type = 'a' THEN -- INSERT
                EXECUTE format('CREATE POLICY %I ON %I FOR INSERT WITH CHECK (%s)', policy_name, table_name, check_clause);
            ELSIF policy_type = 'w' THEN -- UPDATE
                IF check_clause IS NOT NULL THEN
                    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE USING (%s) WITH CHECK (%s)', policy_name, table_name, using_clause, check_clause);
                ELSE
                    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE USING (%s)', policy_name, table_name, using_clause);
                END IF;
            ELSIF policy_type = 'd' THEN -- DELETE
                EXECUTE format('CREATE POLICY %I ON %I FOR DELETE USING (%s)', policy_name, table_name, using_clause);
            ELSIF policy_type = '*' THEN -- ALL
                EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (%s)', policy_name, table_name, using_clause);
            END IF;

            RAISE NOTICE 'Optimized policy "%" on table "%"', policy_name, table_name;

        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error updating policy "%" on table "%": %', policy_name, table_name, SQLERRM;
        END;

    END LOOP;

    RAISE NOTICE 'Dynamic RLS policy optimization complete!';
END $$;