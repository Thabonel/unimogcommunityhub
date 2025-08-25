-- Vehicle Social Engagement Features Migration
-- Creates tables for likes, comments, views, and achievements

-- Vehicle Likes Table
CREATE TABLE IF NOT EXISTS vehicle_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vehicle_id, user_id)
);

-- Vehicle Comments Table  
CREATE TABLE IF NOT EXISTS vehicle_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Views Table (for analytics)
CREATE TABLE IF NOT EXISTS vehicle_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievement Badges Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_type VARCHAR(100) NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_likes_vehicle_id ON vehicle_likes(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_likes_user_id ON vehicle_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_comments_vehicle_id ON vehicle_comments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_comments_user_id ON vehicle_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_views_vehicle_id ON vehicle_views(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_views_created_at ON vehicle_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_badge_type ON user_achievements(badge_type);

-- RLS Policies
ALTER TABLE vehicle_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Vehicle Likes Policies
CREATE POLICY "Users can view all likes" ON vehicle_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own likes" ON vehicle_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON vehicle_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Vehicle Comments Policies
CREATE POLICY "Users can view comments on showcase vehicles" ON vehicle_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_comments.vehicle_id 
            AND vehicles.is_showcase = true
        )
    );

CREATE POLICY "Users can insert comments on showcase vehicles" ON vehicle_comments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM vehicles 
            WHERE vehicles.id = vehicle_comments.vehicle_id 
            AND vehicles.is_showcase = true
        )
    );

CREATE POLICY "Users can update own comments" ON vehicle_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON vehicle_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Vehicle Views Policies (read-only for users)
CREATE POLICY "Users can view vehicle view counts" ON vehicle_views
    FOR SELECT USING (true);

CREATE POLICY "System can insert views" ON vehicle_views
    FOR INSERT WITH CHECK (true);

-- User Achievements Policies
CREATE POLICY "Users can view all achievements" ON user_achievements
    FOR SELECT USING (true);

CREATE POLICY "System can insert achievements" ON user_achievements
    FOR INSERT WITH CHECK (true);

-- Functions for calculating engagement metrics

-- Function to update vehicle likes count
CREATE OR REPLACE FUNCTION update_vehicle_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE vehicles 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.vehicle_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE vehicles 
        SET likes_count = GREATEST(likes_count - 1, 0) 
        WHERE id = OLD.vehicle_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update vehicle views count
CREATE OR REPLACE FUNCTION update_vehicle_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vehicles 
    SET views_count = views_count + 1 
    WHERE id = NEW.vehicle_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_vehicle_likes_count
    AFTER INSERT OR DELETE ON vehicle_likes
    FOR EACH ROW EXECUTE FUNCTION update_vehicle_likes_count();

CREATE TRIGGER trigger_update_vehicle_views_count
    AFTER INSERT ON vehicle_views
    FOR EACH ROW EXECUTE FUNCTION update_vehicle_views_count();

-- Function to calculate trending score
CREATE OR REPLACE FUNCTION calculate_trending_score(vehicle_row vehicles)
RETURNS FLOAT AS $$
DECLARE
    likes_weight FLOAT := 2.0;
    views_weight FLOAT := 0.1;
    comments_weight FLOAT := 5.0;
    recency_weight FLOAT := 1.0;
    days_old FLOAT;
    comment_count INTEGER;
    trending_score FLOAT;
BEGIN
    -- Calculate days since creation
    days_old := EXTRACT(EPOCH FROM (NOW() - vehicle_row.created_at)) / 86400.0;
    
    -- Get comment count
    SELECT COUNT(*) INTO comment_count 
    FROM vehicle_comments 
    WHERE vehicle_id = vehicle_row.id;
    
    -- Calculate trending score with recency boost
    trending_score := (
        (COALESCE(vehicle_row.likes_count, 0) * likes_weight) + 
        (COALESCE(vehicle_row.views_count, 0) * views_weight) + 
        (comment_count * comments_weight)
    ) / (1 + days_old * 0.1); -- Decay factor
    
    RETURN trending_score;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements_for_user(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    vehicle_count INTEGER;
    total_likes INTEGER;
    total_photos INTEGER;
BEGIN
    -- Count user's showcase vehicles
    SELECT COUNT(*) INTO vehicle_count 
    FROM vehicles 
    WHERE user_id = user_uuid AND is_showcase = true;
    
    -- Count total likes received
    SELECT COALESCE(SUM(likes_count), 0) INTO total_likes
    FROM vehicles 
    WHERE user_id = user_uuid;
    
    -- Count total photos uploaded
    SELECT COALESCE(SUM(array_length(photos, 1)), 0) INTO total_photos
    FROM vehicles 
    WHERE user_id = user_uuid AND photos IS NOT NULL;
    
    -- Award "First Showcase" badge
    IF vehicle_count >= 1 THEN
        INSERT INTO user_achievements (user_id, badge_type, badge_name, description, icon)
        VALUES (user_uuid, 'first_showcase', 'First Showcase', 'Posted your first vehicle to the showcase', '🏆')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Award "Photo Master" badge  
    IF total_photos >= 10 THEN
        INSERT INTO user_achievements (user_id, badge_type, badge_name, description, icon)
        VALUES (user_uuid, 'photo_master', 'Photo Master', 'Uploaded 10+ photos across your vehicles', '📸')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Award "Community Favorite" badge
    IF total_likes >= 50 THEN
        INSERT INTO user_achievements (user_id, badge_type, badge_name, description, icon)
        VALUES (user_uuid, 'community_favorite', 'Community Favorite', 'Received 50+ likes on your vehicles', '❤️')
        ON CONFLICT DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;