import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface CommunityRecommendation {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  is_published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  views_count: number;
  saves_count: number;
  author?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface UseRecommendationsOptions {
  category?: string;
  limit?: number;
  published_only?: boolean;
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<CommunityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    category,
    limit,
    published_only = true
  } = options;

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('community_recommendations')
        .select(`
          id,
          title,
          description,
          content,
          category,
          is_published,
          author_id,
          created_at,
          updated_at,
          likes_count,
          views_count,
          saves_count,
          profiles:author_id (
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by category if specified
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Filter by published status
      if (published_only) {
        query = query.eq('is_published', true);
      }

      // Apply limit if specified
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our interface
      const transformedData: CommunityRecommendation[] = data.map((item: any) => ({
        ...item,
        author: item.profiles ? {
          name: item.profiles.name,
          avatarUrl: item.profiles.avatar_url
        } : undefined
      }));

      setRecommendations(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recommendations';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new recommendation
  const createRecommendation = async (recommendation: Omit<CommunityRecommendation, 'id' | 'created_at' | 'updated_at' | 'author_id' | 'likes_count' | 'views_count' | 'saves_count'>) => {
    try {
      if (!user) {
        throw new Error('Must be authenticated to create recommendations');
      }

      const { data, error: createError } = await supabase
        .from('community_recommendations')
        .insert([{
          ...recommendation,
          author_id: user.id
        }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Refresh the recommendations list
      await fetchRecommendations();

      toast({
        title: "Success",
        description: "Recommendation created successfully"
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create recommendation';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update an existing recommendation
  const updateRecommendation = async (id: string, updates: Partial<CommunityRecommendation>) => {
    try {
      if (!user) {
        throw new Error('Must be authenticated to update recommendations');
      }

      const { data, error: updateError } = await supabase
        .from('community_recommendations')
        .update(updates)
        .eq('id', id)
        .eq('author_id', user.id) // Ensure user can only update their own recommendations
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state optimistically
      setRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, ...updates } : rec)
      );

      toast({
        title: "Success",
        description: "Recommendation updated successfully"
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update recommendation';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Delete a recommendation
  const deleteRecommendation = async (id: string) => {
    try {
      if (!user) {
        throw new Error('Must be authenticated to delete recommendations');
      }

      const { error: deleteError } = await supabase
        .from('community_recommendations')
        .delete()
        .eq('id', id)
        .eq('author_id', user.id); // Ensure user can only delete their own recommendations

      if (deleteError) {
        throw deleteError;
      }

      // Update local state optimistically
      setRecommendations(prev => prev.filter(rec => rec.id !== id));

      toast({
        title: "Success",
        description: "Recommendation deleted successfully"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete recommendation';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Increment view count
  const incrementViews = async (id: string) => {
    try {
      // Don't increment views for the author
      const recommendation = recommendations.find(r => r.id === id);
      if (recommendation && recommendation.author_id === user?.id) {
        return;
      }

      await supabase.rpc('increment_recommendation_views', { recommendation_id: id });

      // Update local state optimistically
      setRecommendations(prev =>
        prev.map(rec =>
          rec.id === id ? { ...rec, views_count: rec.views_count + 1 } : rec
        )
      );
    } catch (err) {
      // Silent fail for view increments
      console.warn('Failed to increment views:', err);
    }
  };

  // Toggle like
  const toggleLike = async (id: string) => {
    try {
      if (!user) {
        throw new Error('Must be authenticated to like recommendations');
      }

      const { data, error: toggleError } = await supabase.rpc('toggle_recommendation_like', {
        recommendation_id: id,
        user_id: user.id
      });

      if (toggleError) {
        throw toggleError;
      }

      // Update local state optimistically
      setRecommendations(prev =>
        prev.map(rec =>
          rec.id === id ? { 
            ...rec, 
            likes_count: data.liked ? rec.likes_count + 1 : rec.likes_count - 1 
          } : rec
        )
      );

      return data.liked;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle like';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Toggle save
  const toggleSave = async (id: string) => {
    try {
      if (!user) {
        throw new Error('Must be authenticated to save recommendations');
      }

      const { data, error: toggleError } = await supabase.rpc('toggle_recommendation_save', {
        recommendation_id: id,
        user_id: user.id
      });

      if (toggleError) {
        throw toggleError;
      }

      // Update local state optimistically
      setRecommendations(prev =>
        prev.map(rec =>
          rec.id === id ? { 
            ...rec, 
            saves_count: data.saved ? rec.saves_count + 1 : rec.saves_count - 1 
          } : rec
        )
      );

      return data.saved;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle save';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Fetch data on mount and when options change
  useEffect(() => {
    fetchRecommendations();
  }, [category, limit, published_only]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
    createRecommendation,
    updateRecommendation,
    deleteRecommendation,
    incrementViews,
    toggleLike,
    toggleSave
  };
}