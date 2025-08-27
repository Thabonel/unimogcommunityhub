import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';

/**
 * Production-ready hooks for fetching real dashboard data
 * Replaces mock data with actual database queries
 */

// Fetch recent user activity
export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch from multiple sources and combine
      const [posts, listings, articles] = await Promise.all([
        // Recent forum posts
        supabase
          .from('posts')
          .select('id, title, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3),
        
        // Recent marketplace listings
        supabase
          .from('marketplace_listings')
          .select('id, title, created_at')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2),
        
        // Recent knowledge contributions
        supabase
          .from('articles')
          .select('id, title, created_at')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2)
      ]);

      // Combine and format
      const activities = [
        ...(posts.data || []).map(p => ({
          type: 'forum' as const,
          title: `Posted: ${p.title}`,
          time: getRelativeTime(p.created_at)
        })),
        ...(listings.data || []).map(l => ({
          type: 'marketplace' as const,
          title: `Listed: ${l.title}`,
          time: getRelativeTime(l.created_at)
        })),
        ...(articles.data || []).map(a => ({
          type: 'knowledge' as const,
          title: `Contributed: ${a.title}`,
          time: getRelativeTime(a.created_at)
        }))
      ];

      // Sort by time and return top 5
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch upcoming trips
export const useUpcomingTrips = () => {
  return useQuery({
    queryKey: ['upcomingTrips'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('trips')
        .select(`
          id,
          title,
          start_date,
          end_date,
          difficulty,
          trip_participants!inner(user_id)
        `)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);

      if (error) throw error;

      return (data || []).map(trip => ({
        id: trip.id,
        title: trip.title,
        date: formatDateRange(trip.start_date, trip.end_date),
        difficulty: trip.difficulty || 'Moderate',
        participants: trip.trip_participants?.length || 0
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch recommended marketplace items
export const useRecommendedItems = () => {
  return useQuery({
    queryKey: ['recommendedItems'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get user's vehicle model from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('unimog_model')
        .eq('id', user.id)
        .single();

      // Fetch items compatible with user's vehicle
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('id, title, price, seller_id, profiles!seller_id(name)')
        .eq('status', 'active')
        .or(profile?.unimog_model ? `compatible_models.cs.{${profile.unimog_model}}` : 'id.neq.0')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        type: 'part' as const,
        title: item.title,
        price: formatPrice(item.price),
        seller: item.profiles?.name || 'Unknown Seller'
      }));
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Fetch unread messages count
export const useUnreadMessages = () => {
  return useQuery({
    queryKey: ['unreadMessages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    },
    staleTime: 30 * 1000, // 30 seconds - refresh frequently
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
};

// Fetch recent messages preview
export const useRecentMessages = () => {
  return useQuery({
    queryKey: ['recentMessages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          profiles!sender_id(name)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      return (data || []).map(msg => ({
        id: msg.id,
        senderName: msg.profiles?.name || 'Unknown',
        preview: msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : ''),
        time: getRelativeTime(msg.created_at)
      }));
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

// Utility functions
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

const formatDateRange = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString('en-US', options);
  }
  
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', options)}`;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};