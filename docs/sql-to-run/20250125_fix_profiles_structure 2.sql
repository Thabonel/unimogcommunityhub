-- Fix Profiles Table Structure
-- This migration handles the profiles table which might use 'id' as the user reference

-- First, check what columns exist in profiles
DO $$ 
DECLARE
    has_user_id_column BOOLEAN;
    has_id_column BOOLEAN;
BEGIN
    -- Check if user_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) INTO has_user_id_column;
    
    -- Check if id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'id'
        AND table_schema = 'public'
    ) INTO has_id_column;
    
    -- If profiles uses 'id' as the user reference (not 'user_id'), we need to handle it differently
    IF has_id_column AND NOT has_user_id_column THEN
        -- The profiles table uses 'id' as the primary key that references auth.users
        -- This is the current structure, so we work with it
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'email') THEN
            ALTER TABLE profiles ADD COLUMN email TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
            ALTER TABLE profiles ADD COLUMN full_name TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
            ALTER TABLE profiles ADD COLUMN display_name TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
            ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'bio') THEN
            ALTER TABLE profiles ADD COLUMN bio TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'location') THEN
            ALTER TABLE profiles ADD COLUMN location TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'website') THEN
            ALTER TABLE profiles ADD COLUMN website TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'street_address') THEN
            ALTER TABLE profiles ADD COLUMN street_address TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'city') THEN
            ALTER TABLE profiles ADD COLUMN city TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'state') THEN
            ALTER TABLE profiles ADD COLUMN state TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'postal_code') THEN
            ALTER TABLE profiles ADD COLUMN postal_code TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'country') THEN
            ALTER TABLE profiles ADD COLUMN country VARCHAR(2);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'phone_number') THEN
            ALTER TABLE profiles ADD COLUMN phone_number TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'currency') THEN
            ALTER TABLE profiles ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'language') THEN
            ALTER TABLE profiles ADD COLUMN language VARCHAR(5) DEFAULT 'en';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'social_links') THEN
            ALTER TABLE profiles ADD COLUMN social_links JSONB DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'preferences') THEN
            ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
            ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
            ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
    ELSIF has_user_id_column THEN
        -- The profiles table has a user_id column (different structure)
        -- Add missing columns for this structure too
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'street_address') THEN
            ALTER TABLE profiles ADD COLUMN street_address TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'city') THEN
            ALTER TABLE profiles ADD COLUMN city TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'state') THEN
            ALTER TABLE profiles ADD COLUMN state TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'postal_code') THEN
            ALTER TABLE profiles ADD COLUMN postal_code TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'country') THEN
            ALTER TABLE profiles ADD COLUMN country VARCHAR(2);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'phone_number') THEN
            ALTER TABLE profiles ADD COLUMN phone_number TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'profiles' AND column_name = 'currency') THEN
            ALTER TABLE profiles ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
        END IF;
    END IF;
END $$;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies with correct references
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create RLS policies that work with 'id' as the user reference
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT
    USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT
    WITH CHECK (
        -- Check if id column is the user reference
        CASE 
            WHEN EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'profiles' 
                        AND column_name = 'user_id' 
                        AND table_schema = 'public')
            THEN auth.uid() = user_id
            ELSE auth.uid() = id
        END
    );

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE
    USING (
        CASE 
            WHEN EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'profiles' 
                        AND column_name = 'user_id' 
                        AND table_schema = 'public')
            THEN auth.uid() = user_id
            ELSE auth.uid() = id
        END
    )
    WITH CHECK (
        CASE 
            WHEN EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'profiles' 
                        AND column_name = 'user_id' 
                        AND table_schema = 'public')
            THEN auth.uid() = user_id
            ELSE auth.uid() = id
        END
    );

-- Create or update the handle_new_user function to work with both structures
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    has_user_id_column BOOLEAN;
BEGIN
    -- Check if profiles has user_id column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) INTO has_user_id_column;
    
    IF has_user_id_column THEN
        -- Insert with user_id column
        INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
        VALUES (
            new.id,
            new.email,
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'avatar_url'
        )
        ON CONFLICT (user_id) DO UPDATE
        SET 
            email = EXCLUDED.email,
            full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
            avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
            updated_at = NOW();
    ELSE
        -- Insert with id as primary key
        INSERT INTO public.profiles (id, email, full_name, avatar_url)
        VALUES (
            new.id,
            new.email,
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'avatar_url'
        )
        ON CONFLICT (id) DO UPDATE
        SET 
            email = EXCLUDED.email,
            full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
            avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
            updated_at = NOW();
    END IF;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update trigger for updated_at
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

-- Ensure all users have profiles (works with both structures)
DO $$
DECLARE
    has_user_id_column BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) INTO has_user_id_column;
    
    IF has_user_id_column THEN
        -- Insert for user_id structure
        INSERT INTO profiles (user_id, email)
        SELECT id, email FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM profiles WHERE user_id IS NOT NULL)
        ON CONFLICT (user_id) DO NOTHING;
    ELSE
        -- Insert for id structure
        INSERT INTO profiles (id, email)
        SELECT id, email FROM auth.users
        WHERE id NOT IN (SELECT id FROM profiles)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;