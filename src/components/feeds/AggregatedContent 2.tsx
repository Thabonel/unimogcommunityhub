import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, Heart, Bookmark, ExternalLink, MapPin, 
  Mountain, Clock, Calendar, User, Tag, ChevronRight 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  feed_id: string;
  feed_name: string;
  title: string;
  description: string;
  summary: string;
  author: string;
  published_at: string;
  url: string;
  category: string;
  tags: string[];
  difficulty_level: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_km: number | null;
  elevation_gain_m: number | null;
  featured_image_url: string | null;
  view_count: number;
  like_count: number;
  save_count: number;
  is_liked: boolean;
  is_saved: boolean;
}

interface FeedCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export function AggregatedContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadContent();
  }, [selectedCategory, savedOnly]);

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('feed_categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async function loadContent() {
    setLoading(true);
    try {
      let query = supabase.rpc('get_aggregated_content', {
        p_category: selectedCategory === 'all' ? null : selectedCategory,
        p_limit: 50,
        p_offset: 0,
      });

      if (savedOnly) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = supabase
            .from('aggregated_content')
            .select(`
              *,
              rss_feeds!inner(name),
              user_saved_content!inner(user_id),
              content_likes(user_id)
            `)
            .eq('user_saved_content.user_id', user.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform data if needed
      const transformedData = savedOnly ? data?.map(item => ({
        ...item,
        feed_name: item.rss_feeds?.name || '',
        is_saved: true,
        is_liked: item.content_likes?.some((like: any) => like.user_id === user?.id) || false,
      })) : data;

      setContent(transformedData || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function toggleLike(contentId: string) {
    try {
      const { data, error } = await supabase.rpc('toggle_content_like', {
        p_content_id: contentId,
      });

      if (error) throw error;
      loadContent(); // Reload to update counts
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive',
      });
    }
  }

  async function toggleSave(contentId: string) {
    try {
      const { data, error } = await supabase.rpc('toggle_content_save', {
        p_content_id: contentId,
      });

      if (error) throw error;
      loadContent(); // Reload to update counts
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: 'Error',
        description: 'Failed to update save',
        variant: 'destructive',
      });
    }
  }

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'difficult': return 'text-orange-600 bg-orange-50';
      case 'extreme': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Trail Reports & Content</h2>
        <p className="text-muted-foreground">
          Aggregated content from RSS feeds and community sources
        </p>
      </div>

      <Tabs value={savedOnly ? 'saved' : selectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-auto">
          <TabsTrigger 
            value="all" 
            onClick={() => { setSelectedCategory('all'); setSavedOnly(false); }}
          >
            All
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.name}
              onClick={() => { setSelectedCategory(cat.name); setSavedOnly(false); }}
            >
              {cat.name}
            </TabsTrigger>
          ))}
          <TabsTrigger 
            value="saved" 
            onClick={() => setSavedOnly(true)}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value={savedOnly ? 'saved' : selectedCategory} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.featured_image_url && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.featured_image_url}
                      alt={item.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {item.summary || item.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    {/* Location and trail info */}
                    <div className="flex flex-wrap gap-2">
                      {item.location_name && (
                        <Badge variant="secondary" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.location_name}
                        </Badge>
                      )}
                      
                      {item.difficulty_level && (
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs", getDifficultyColor(item.difficulty_level))}
                        >
                          {item.difficulty_level}
                        </Badge>
                      )}
                      
                      {item.distance_km && (
                        <Badge variant="secondary" className="text-xs">
                          {item.distance_km.toFixed(1)} km
                        </Badge>
                      )}
                      
                      {item.elevation_gain_m && (
                        <Badge variant="secondary" className="text-xs">
                          <Mountain className="h-3 w-3 mr-1" />
                          {Math.round(item.elevation_gain_m)}m
                        </Badge>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className={cn("h-4 w-4", item.is_liked && "fill-red-500 text-red-500")} />
                        {item.like_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className={cn("h-4 w-4", item.is_saved && "fill-yellow-500 text-yellow-500")} />
                        {item.save_count}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleLike(item.id)}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", item.is_liked && "fill-current")} />
                      {item.is_liked ? 'Liked' : 'Like'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleSave(item.id)}
                    >
                      <Bookmark className={cn("h-4 w-4 mr-2", item.is_saved && "fill-current")} />
                      {item.is_saved ? 'Saved' : 'Save'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {content.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No content found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}