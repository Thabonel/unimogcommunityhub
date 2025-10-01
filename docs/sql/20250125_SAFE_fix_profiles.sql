-- SAFE Profile Fix - This checks structure before making changes
-- This migration adapts to whatever structure your profiles table has

DO $$ 
DECLARE
    col_record RECORD;
    has_id_column BOOLEAN := false;
    has_user_id_column BOOLEAN := false;
    profile_id_type TEXT;
BEGIN
    -- First, check what columns exist
    FOR col_record IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND table_schema = 'public'
        AND column_name IN ('id', 'user_id')
    LOOP
        IF col_record.column_name = 'id' THEN
            has_id_column := true;
        ELSIF col_record.column_name = 'user_id' THEN
            has_user_id_column := true;
        END IF;
    END LOOP;
    
    -- Determine which column is used for user reference
    IF has_id_column AND NOT has_user_id_column THEN
        profile_id_type := 'id';
        RAISE NOTICE 'Profiles table uses "id" as user reference';
    ELSIF has_user_id_column THEN
        profile_id_type := 'user_id';
        RAISE NOTICE 'Profiles table uses "user_id" as user reference';
    ELSE
        RAISE EXCEPTION 'Profiles table structure unknown';
    END IF;
    
    -- Add missing columns only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'street_address') THEN
        ALTER TABLE profiles ADD COLUMN street_address TEXT;
        RAISE NOTICE 'Added street_address column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'city') THEN
        ALTER TABLE profiles ADD COLUMN city TEXT;
        RAISE NOTICE 'Added city column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'state') THEN
        ALTER TABLE profiles ADD COLUMN state TEXT;
        RAISE NOTICE 'Added state column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'postal_code') THEN
        ALTER TABLE profiles ADD COLUMN postal_code TEXT;
        RAISE NOTICE 'Added postal_code column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'country') THEN
        ALTER TABLE profiles ADD COLUMN country VARCHAR(2);
        RAISE NOTICE 'Added country column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone_number') THEN
        ALTER TABLE profiles ADD COLUMN phone_number TEXT;
        RAISE NOTICE 'Added phone_number column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'currency') THEN
        ALTER TABLE profiles ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
        RAISE NOTICE 'Added currency column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'language') THEN
        ALTER TABLE profiles ADD COLUMN language VARCHAR(5) DEFAULT 'en';
        RAISE NOTICE 'Added language column';
    END IF;
    
    -- Add other commonly needed columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE profiles ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
        ALTER TABLE profiles ADD COLUMN display_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') THEN
        ALTER TABLE profiles ADD COLUMN website TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
        ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to recreate them
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;  
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create simple RLS policies that work regardless of structure
CREATE POLICY "Anyone can view profiles" ON profiles
    FOR SELECT USING (true);

-- For INSERT and UPDATE, we need to check the structure dynamically
DO $$
DECLARE
    has_user_id BOOLEAN;
BEGIN
    -- Check if user_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) INTO has_user_id;
    
    IF has_user_id THEN
        -- Create policies for user_id structure
        EXECUTE 'CREATE POLICY "Users can insert own profile" ON profiles 
                 FOR INSERT WITH CHECK (auth.uid() = user_id)';
        
        EXECUTE 'CREATE POLICY "Users can update own profile" ON profiles 
                 FOR UPDATE USING (auth.uid() = user_id) 
                 WITH CHECK (auth.uid() = user_id)';
    ELSE
        -- Create policies for id structure  
        EXECUTE 'CREATE POLICY "Users can insert own profile" ON profiles 
                 FOR INSERT WITH CHECK (auth.uid() = id)';
        
        EXECUTE 'CREATE POLICY "Users can update own profile" ON profiles 
                 FOR UPDATE USING (auth.uid() = id) 
                 WITH CHECK (auth.uid() = id)';
    END IF;
END $$;

-- Create or update the updated_at trigger
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- Output the final structure for verification
SELECT 
    'Profile columns after migration:' as message,
    string_agg(column_name, ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
GROUP BY table_name;