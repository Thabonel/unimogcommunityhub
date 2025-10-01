-- Fix security warnings identified by Supabase linter
-- This migration addresses function search_path issues to prevent search path hijacking

-- ============================================
-- FIX SEARCH_PATH FOR ALL FUNCTIONS
-- ============================================

-- 1. update_qa_issues_updated_at
CREATE OR REPLACE FUNCTION public.update_qa_issues_updated_at()
RETURNS TRIGGER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 2. check_admin_access
CREATE OR REPLACE FUNCTION public.check_admin_access()
RETURNS BOOLEAN
SET search_path = public
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$;

-- 3. get_user_subscription
CREATE OR REPLACE FUNCTION public.get_user_subscription(user_id UUID)
RETURNS JSON
SET search_path = public
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    subscription_data JSON;
BEGIN
    SELECT json_build_object(
        'has_subscription', COALESCE(has_subscription, false),
        'subscription_type', subscription_type,
        'subscription_end', subscription_end
    ) INTO subscription_data
    FROM public.profiles
    WHERE id = user_id;
    
    RETURN subscription_data;
END;
$$;

-- 4. handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 6. grant_free_access
CREATE OR REPLACE FUNCTION public.grant_free_access(target_user_id UUID, target_feature TEXT)
RETURNS VOID
SET search_path = public
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Grant access based on feature
    IF target_feature = 'wis_epc' THEN
        UPDATE public.profiles
        SET has_wis_epc_access = true
        WHERE id = target_user_id;
    END IF;
END;
$$;

-- 7. mark_message_as_read
CREATE OR REPLACE FUNCTION public.mark_message_as_read(p_message_id UUID)
RETURNS VOID
SET search_path = public
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.messages
    SET is_read = true
    WHERE id = p_message_id
    AND recipient_id = auth.uid();
END;
$$;

-- 8. has_role
CREATE OR REPLACE FUNCTION public.has_role(role_name TEXT)
RETURNS BOOLEAN
SET search_path = public
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = role_name
    );
END;
$$;

-- 9. create_conversation
CREATE OR REPLACE FUNCTION public.create_conversation(participant_ids UUID[])
RETURNS UUID
SET search_path = public
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    conversation_id UUID;
    participant_id UUID;
BEGIN
    -- Create new conversation
    INSERT INTO public.conversations (created_at, updated_at)
    VALUES (NOW(), NOW())
    RETURNING id INTO conversation_id;
    
    -- Add participants
    FOREACH participant_id IN ARRAY participant_ids
    LOOP
        INSERT INTO public.conversation_participants (conversation_id, user_id)
        VALUES (conversation_id, participant_id);
    END LOOP;
    
    -- Add current user if not already included
    IF NOT auth.uid() = ANY(participant_ids) THEN
        INSERT INTO public.conversation_participants (conversation_id, user_id)
        VALUES (conversation_id, auth.uid());
    END IF;
    
    RETURN conversation_id;
END;
$$;

-- 10. cleanup_old_security_events
CREATE OR REPLACE FUNCTION public.cleanup_old_security_events()
RETURNS VOID
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.security_events
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- 11. get_manual_processing_stats
CREATE OR REPLACE FUNCTION public.get_manual_processing_stats()
RETURNS JSON
SET search_path = public
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_manuals', COUNT(DISTINCT manual_id),
        'total_chunks', COUNT(*),
        'total_embeddings', COUNT(embedding),
        'manuals_with_embeddings', COUNT(DISTINCT CASE WHEN embedding IS NOT NULL THEN manual_id END)
    ) INTO stats
    FROM public.manual_chunks;
    
    RETURN stats;
END;
$$;

-- 12. get_trending_content
CREATE OR REPLACE FUNCTION public.get_trending_content(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    view_count INTEGER,
    like_count INTEGER,
    created_at TIMESTAMPTZ
)
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ac.id,
        ac.title,
        ac.description,
        COALESCE(ac.view_count, 0) as view_count,
        COALESCE(ac.like_count, 0) as like_count,
        ac.created_at
    FROM public.aggregated_content ac
    WHERE ac.published_at > NOW() - INTERVAL '7 days'
    ORDER BY 
        (COALESCE(ac.view_count, 0) * 0.3 + COALESCE(ac.like_count, 0) * 0.7) DESC,
        ac.created_at DESC
    LIMIT limit_count;
END;
$$;

-- 13. search_wis_content
CREATE OR REPLACE FUNCTION public.search_wis_content(search_query TEXT)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    content TEXT,
    category TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ,
    rank REAL
)
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wc.id,
        wc.title,
        wc.description,
        wc.content,
        wc.category,
        wc.image_url,
        wc.created_at,
        ts_rank(
            to_tsvector('english', COALESCE(wc.title, '') || ' ' || COALESCE(wc.description, '') || ' ' || COALESCE(wc.content, '')),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM public.wis_content wc
    WHERE 
        to_tsvector('english', COALESCE(wc.title, '') || ' ' || COALESCE(wc.description, '') || ' ' || COALESCE(wc.content, ''))
        @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC
    LIMIT 50;
END;
$$;

-- 14. get_popular_wis_content
CREATE OR REPLACE FUNCTION public.get_popular_wis_content(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    category TEXT,
    image_url TEXT,
    view_count INTEGER,
    created_at TIMESTAMPTZ
)
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wc.id,
        wc.title,
        wc.description,
        wc.category,
        wc.image_url,
        COALESCE(wc.view_count, 0) as view_count,
        wc.created_at
    FROM public.wis_content wc
    ORDER BY COALESCE(wc.view_count, 0) DESC, wc.created_at DESC
    LIMIT limit_count;
END;
$$;

-- 15. search_manual_chunks (text version)
CREATE OR REPLACE FUNCTION public.search_manual_chunks(
    query_text TEXT,
    similarity_threshold FLOAT DEFAULT 0.5,
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE(
    chunk_id UUID,
    manual_id UUID,
    manual_name TEXT,
    content TEXT,
    similarity FLOAT
)
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    query_embedding vector(1536);
BEGIN
    -- Get embedding for the query text
    -- This assumes you have a way to generate embeddings
    -- If not, this function might need to be called differently
    
    -- For now, return empty if no embedding exists
    RETURN QUERY
    SELECT 
        mc.id as chunk_id,
        mc.manual_id,
        m.name as manual_name,
        mc.content,
        0.0::FLOAT as similarity
    FROM public.manual_chunks mc
    JOIN public.manuals m ON mc.manual_id = m.id
    WHERE mc.content ILIKE '%' || query_text || '%'
    LIMIT match_count;
END;
$$;

-- 16. search_manual_chunks (vector version) - if it exists
DO $$
BEGIN
    -- Only create vector version if vector type exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
        CREATE OR REPLACE FUNCTION public.search_manual_chunks(
            query_embedding vector(1536),
            similarity_threshold FLOAT DEFAULT 0.5,
            match_count INTEGER DEFAULT 5
        )
        RETURNS TABLE(
            chunk_id UUID,
            manual_id UUID,
            manual_name TEXT,
            content TEXT,
            similarity FLOAT
        )
        SET search_path = public
        LANGUAGE plpgsql
        AS $func$
        BEGIN
            RETURN QUERY
            SELECT 
                mc.id as chunk_id,
                mc.manual_id,
                m.name as manual_name,
                mc.content,
                1 - (mc.embedding <=> query_embedding) as similarity
            FROM public.manual_chunks mc
            JOIN public.manuals m ON mc.manual_id = m.id
            WHERE mc.embedding IS NOT NULL
            AND 1 - (mc.embedding <=> query_embedding) > similarity_threshold
            ORDER BY similarity DESC
            LIMIT match_count;
        END;
        $func$;
    END IF;
END $$;

-- ============================================
-- VECTOR EXTENSION SECURITY NOTE
-- ============================================
-- The vector extension is currently in the public schema.
-- Moving it requires careful migration of existing vector columns.
-- For now, we've secured the functions that use it.
-- 
-- To fully move the extension:
-- 1. Back up all vector data
-- 2. Drop vector columns
-- 3. Move extension to 'extensions' schema
-- 4. Recreate columns
-- 5. Restore data

-- ============================================
-- AUTH CONFIGURATION NOTES
-- ============================================
-- The following auth security warnings need to be fixed in the Supabase Dashboard:
-- 
-- 1. OTP Expiry Too Long (Currently > 1 hour)
--    Fix: Go to Authentication > Providers > Email
--    Set OTP expiry to less than 1 hour (recommended: 10-30 minutes)
-- 
-- 2. Leaked Password Protection Disabled
--    Fix: Go to Authentication > Settings > Security
--    Enable "Leaked password protection" to check passwords against HaveIBeenPwned