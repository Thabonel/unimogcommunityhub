-- DIAGNOSTIC: First let's see what we're working with
-- Run this to see the actual profiles table structure

-- Show all columns in profiles table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'profiles'
AND tc.constraint_type = 'FOREIGN KEY';

-- Check if profiles.id references auth.users
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.table_name = 'profiles'
            AND kcu.column_name = 'id'
            AND ccu.table_name = 'users'
            AND ccu.table_schema = 'auth'
        )
        THEN 'profiles.id references auth.users.id'
        ELSE 'profiles.id does NOT reference auth.users.id'
    END as profile_structure;