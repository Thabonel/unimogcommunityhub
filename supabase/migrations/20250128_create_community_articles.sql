-- Create community_articles table for user-submitted content
CREATE TABLE IF NOT EXISTS public.community_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reading_time INTEGER DEFAULT 5,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_community_articles_author_id ON public.community_articles(author_id);
CREATE INDEX idx_community_articles_category ON public.community_articles(category);
CREATE INDEX idx_community_articles_published_at ON public.community_articles(published_at DESC);
CREATE INDEX idx_community_articles_is_published ON public.community_articles(is_published);
CREATE INDEX idx_community_articles_is_featured ON public.community_articles(is_featured);

-- Enable Row Level Security
ALTER TABLE public.community_articles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to view published articles
CREATE POLICY "Anyone can view published articles" 
    ON public.community_articles
    FOR SELECT
    USING (is_published = true);

-- Allow authenticated users to create articles
CREATE POLICY "Authenticated users can create articles" 
    ON public.community_articles
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Allow authors to update their own articles
CREATE POLICY "Authors can update their own articles" 
    ON public.community_articles
    FOR UPDATE
    USING (auth.uid() = author_id);

-- Allow authors to delete their own articles
CREATE POLICY "Authors can delete their own articles" 
    ON public.community_articles
    FOR DELETE
    USING (auth.uid() = author_id);

-- Create article_likes table for tracking likes
CREATE TABLE IF NOT EXISTS public.article_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES public.community_articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, user_id)
);

-- Create indexes for article_likes
CREATE INDEX idx_article_likes_article_id ON public.article_likes(article_id);
CREATE INDEX idx_article_likes_user_id ON public.article_likes(user_id);

-- Enable RLS on article_likes
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Policies for article_likes
CREATE POLICY "Anyone can view article likes" 
    ON public.article_likes
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can like articles" 
    ON public.article_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" 
    ON public.article_likes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create article_views table for tracking views
CREATE TABLE IF NOT EXISTS public.article_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES public.community_articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for article_views
CREATE INDEX idx_article_views_article_id ON public.article_views(article_id);
CREATE INDEX idx_article_views_user_id ON public.article_views(user_id);
CREATE INDEX idx_article_views_viewed_at ON public.article_views(viewed_at DESC);

-- Enable RLS on article_views
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Policy for article_views (anyone can create views for tracking)
CREATE POLICY "Anyone can create article views" 
    ON public.article_views
    FOR INSERT
    WITH CHECK (true);

-- Function to update article view count
CREATE OR REPLACE FUNCTION update_article_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.community_articles
    SET views = views + 1
    WHERE id = NEW.article_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update view count when a view is recorded
CREATE TRIGGER update_article_views_trigger
AFTER INSERT ON public.article_views
FOR EACH ROW
EXECUTE FUNCTION update_article_view_count();

-- Function to update article like count
CREATE OR REPLACE FUNCTION update_article_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.community_articles
        SET likes = likes + 1
        WHERE id = NEW.article_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.community_articles
        SET likes = likes - 1
        WHERE id = OLD.article_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update like count
CREATE TRIGGER update_article_likes_trigger
AFTER INSERT OR DELETE ON public.article_likes
FOR EACH ROW
EXECUTE FUNCTION update_article_like_count();

-- Insert some sample articles for testing
INSERT INTO public.community_articles (
    title, 
    content, 
    excerpt, 
    author_id, 
    author_name, 
    category, 
    reading_time,
    cover_image
) VALUES 
    (
        'Essential Unimog Maintenance Tips',
        'Regular maintenance is crucial for keeping your Unimog in top condition. Here are some essential tips every owner should know...',
        'Learn the key maintenance practices to keep your Unimog running smoothly for years to come.',
        (SELECT id FROM auth.users LIMIT 1),
        'Admin',
        'maintenance',
        5,
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7'
    ),
    (
        'Off-Road Adventures in the Australian Outback',
        'Last month, I took my 1980 Unimog 416 on an incredible journey through the Australian Outback...',
        'An epic adventure story from the red heart of Australia.',
        (SELECT id FROM auth.users LIMIT 1),
        'Admin',
        'adventures',
        8,
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'
    ),
    (
        'DIY Portal Axle Rebuild Guide',
        'A comprehensive guide to rebuilding your Unimog portal axles at home with basic tools...',
        'Step-by-step instructions for portal axle maintenance and rebuild.',
        (SELECT id FROM auth.users LIMIT 1),
        'Admin',
        'repair',
        12,
        'https://images.unsplash.com/photo-1487754180451-c456f719a1fc'
    ),
    (
        'Choosing the Right Tyres for Your Unimog',
        'Tyre selection can make or break your off-road experience. Here''s what you need to know...',
        'A complete guide to selecting the perfect tyres for your Unimog and driving conditions.',
        (SELECT id FROM auth.users LIMIT 1),
        'Admin',
        'tyres',
        6,
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64'
    ),
    (
        'Top 10 Unimog Modifications for Overlanding',
        'Transform your Unimog into the ultimate overlanding vehicle with these proven modifications...',
        'Essential modifications to enhance your Unimog''s overlanding capabilities.',
        (SELECT id FROM auth.users LIMIT 1),
        'Admin',
        'modifications',
        10,
        'https://images.unsplash.com/photo-1502877338535-766e1452684a'
    );

-- Grant permissions
GRANT ALL ON public.community_articles TO authenticated;
GRANT ALL ON public.article_likes TO authenticated;
GRANT ALL ON public.article_views TO authenticated;
GRANT SELECT ON public.community_articles TO anon;
GRANT INSERT ON public.article_views TO anon;