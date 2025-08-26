-- Fix profile display names for existing users
-- This migration ensures all users have proper display_name and full_name fields

-- 1. Update existing profiles to set display_name and full_name where they are null
UPDATE profiles
SET 
    display_name = COALESCE(
        display_name, 
        full_name, 
        SPLIT_PART(email, '@', 1)
    ),
    full_name = COALESCE(
        full_name, 
        display_name, 
        SPLIT_PART(email, '@', 1)
    ),
    updated_at = NOW()
WHERE display_name IS NULL OR full_name IS NULL;

-- 2. Update the handle_new_user function to properly set both display_name and full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Extract username from email for fallback
    DECLARE
        email_username TEXT;
    BEGIN
        email_username := SPLIT_PART(new.email, '@', 1);
        
        INSERT INTO public.profiles (id, email, full_name, display_name, avatar_url, created_at)
        VALUES (
            new.id,
            new.email,
            COALESCE(new.raw_user_meta_data->>'full_name', email_username),
            COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', email_username),
            new.raw_user_meta_data->>'avatar_url',
            NOW()
        )
        ON CONFLICT (id) DO UPDATE
        SET 
            email = COALESCE(EXCLUDED.email, profiles.email),
            full_name = COALESCE(EXCLUDED.full_name, profiles.full_name, email_username),
            display_name = COALESCE(EXCLUDED.display_name, profiles.display_name, EXCLUDED.full_name, email_username),
            avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
            updated_at = NOW();
        
        RETURN new;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add a check constraint to ensure at least one name field is populated (optional but recommended)
-- This is commented out by default to avoid breaking existing code
-- Uncomment if you want to enforce this at the database level
-- ALTER TABLE profiles 
-- ADD CONSTRAINT check_has_name 
-- CHECK (display_name IS NOT NULL OR full_name IS NOT NULL);

-- 4. Create an index on display_name for better search performance
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);

-- 5. Update the user_details view (if it exists) to ensure it returns proper names
-- Check if the view exists first
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'user_details') THEN
        DROP VIEW IF EXISTS user_details;
        
        CREATE VIEW user_details AS
        SELECT 
            id,
            email,
            COALESCE(display_name, full_name, SPLIT_PART(email, '@', 1)) as display_name,
            COALESCE(full_name, display_name, SPLIT_PART(email, '@', 1)) as full_name,
            avatar_url,
            bio,
            location,
            unimog_model,
            unimog_year,
            unimog_modifications,
            experience_level,
            online,
            banned_until,
            is_admin,
            street_address,
            city,
            state,
            postal_code,
            country,
            phone_number,
            currency,
            vehicle_photo_url,
            use_vehicle_photo_as_profile,
            unimog_series,
            unimog_specs,
            unimog_features,
            unimog_wiki_data,
            preferred_terrain,
            mechanical_skills,
            certifications,
            emergency_contact,
            insurance_info,
            privacy_settings,
            notification_preferences,
            last_active_at,
            account_status,
            subscription_tier,
            subscription_expires_at,
            profile_completion_percentage,
            created_at,
            updated_at
        FROM profiles;
        
        -- Grant permissions on the view
        GRANT SELECT ON user_details TO authenticated;
    END IF;
END $$;

-- 6. Log the migration completion
SELECT 'Profile display names migration completed successfully' as status,
       COUNT(*) as profiles_updated
FROM profiles
WHERE display_name IS NOT NULL AND full_name IS NOT NULL;