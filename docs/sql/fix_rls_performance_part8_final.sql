DO $$
DECLARE
    policy_record RECORD;
    table_name TEXT;
    policy_name TEXT;
    policy_definition TEXT;
    new_definition TEXT;
BEGIN
    FOR policy_record IN
        SELECT schemaname, tablename, policyname, definition
        FROM pg_policies
        WHERE schemaname = 'public'
        AND (
            definition LIKE '%auth.uid()%'
            OR definition LIKE '%( SELECT auth.uid() AS uid)%'
            OR definition LIKE '%(SELECT auth.uid() AS uid)%'
            OR definition LIKE '%auth.uid( )%'
            OR definition LIKE '%auth . uid ( )%'
        )
        AND NOT (
            definition LIKE '%(select auth.uid())%'
            OR definition LIKE '%(SELECT auth.uid())%'
        )
    LOOP
        table_name := policy_record.tablename;
        policy_name := policy_record.policyname;
        policy_definition := policy_record.definition;

        new_definition := policy_definition;

        new_definition := REPLACE(new_definition, 'auth.uid()', '(select auth.uid())');
        new_definition := REPLACE(new_definition, '( SELECT auth.uid() AS uid)', '(select auth.uid())');
        new_definition := REPLACE(new_definition, '(SELECT auth.uid() AS uid)', '(select auth.uid())');
        new_definition := REPLACE(new_definition, 'auth.uid( )', '(select auth.uid())');
        new_definition := REPLACE(new_definition, 'auth . uid ( )', '(select auth.uid())');

        IF new_definition != policy_definition THEN
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);

            IF policy_definition LIKE '%FOR SELECT%' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (%s)',
                    policy_name, table_name,
                    SUBSTRING(new_definition FROM 'USING \((.*)\)'));
            ELSIF policy_definition LIKE '%FOR INSERT%' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR INSERT WITH CHECK (%s)',
                    policy_name, table_name,
                    SUBSTRING(new_definition FROM 'WITH CHECK \((.*)\)'));
            ELSIF policy_definition LIKE '%FOR UPDATE%' THEN
                IF new_definition LIKE '%WITH CHECK%' THEN
                    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE USING (%s) WITH CHECK (%s)',
                        policy_name, table_name,
                        SUBSTRING(new_definition FROM 'USING \((.*)\) WITH CHECK'),
                        SUBSTRING(new_definition FROM 'WITH CHECK \((.*)\)'));
                ELSE
                    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE USING (%s)',
                        policy_name, table_name,
                        SUBSTRING(new_definition FROM 'USING \((.*)\)'));
                END IF;
            ELSIF policy_definition LIKE '%FOR DELETE%' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR DELETE USING (%s)',
                    policy_name, table_name,
                    SUBSTRING(new_definition FROM 'USING \((.*)\)'));
            ELSIF policy_definition LIKE '%FOR ALL%' THEN
                EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (%s)',
                    policy_name, table_name,
                    SUBSTRING(new_definition FROM 'USING \((.*)\)'));
            END IF;

            RAISE NOTICE 'Updated policy % on table %', policy_name, table_name;
        END IF;
    END LOOP;
END $$;