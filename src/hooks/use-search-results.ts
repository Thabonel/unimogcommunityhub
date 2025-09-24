
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { PostWithUser } from '@/types/post';
import { supabase } from '@/lib/supabase-client';

// Define result types for the modal search
export interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'manual' | 'marketplace' | 'trip';
  title: string;
  subtitle?: string;
  snippet?: string;
  url: string;
  icon: string;
}

interface SearchResultsState {
  userResults: UserProfile[];
  postResults: PostWithUser[];
  allResults: SearchResult[];
  isLoadingUsers: boolean;
  isLoadingPosts: boolean;
  isLoadingAll: boolean;
  error: Error | null;
}

export function useSearchResults(query: string) {
  const [state, setState] = useState<SearchResultsState>({
    userResults: [],
    postResults: [],
    allResults: [],
    isLoadingUsers: false,
    isLoadingPosts: false,
    isLoadingAll: false,
    error: null
  });

  useEffect(() => {
    if (!query || query.length < 2) {
      setState({
        userResults: [],
        postResults: [],
        allResults: [],
        isLoadingUsers: false,
        isLoadingPosts: false,
        isLoadingAll: false,
        error: null
      });
      return;
    }

    const searchUsers = async () => {
      setState(prev => ({ ...prev, isLoadingUsers: true }));
      
      try {
        // Search users by name, location, or Unimog details
        const { data: users, error } = await supabase
          .from('user_details')
          .select('*')
          .or(`
            display_name.ilike.%${query}%,
            full_name.ilike.%${query}%,
            location.ilike.%${query}%,
            unimog_model.ilike.%${query}%,
            unimog_modifications.ilike.%${query}%,
            bio.ilike.%${query}%
          `)
          .order('display_name', { ascending: true })
          .limit(20);

        if (error) throw error;

        // Cast the data to ensure it matches the UserProfile interface
        setState(prev => ({ 
          ...prev, 
          userResults: users as UserProfile[] || [], 
          isLoadingUsers: false 
        }));
        
      } catch (error) {
        console.error('Error searching users:', error);
        setState(prev => ({ 
          ...prev, 
          isLoadingUsers: false, 
          error: error instanceof Error ? error : new Error('Unknown error') 
        }));
      }
    };

    const searchPosts = async () => {
      setState(prev => ({ ...prev, isLoadingPosts: true }));
      
      try {
        // First, search posts by content
        const { data: posts, error: postsError } = await supabase
          .from('community_posts')
          .select('*')
          .ilike('content', `%${query}%`)
          .order('created_at', { ascending: false })
          .limit(20);

        if (postsError) throw postsError;
        
        if (!posts || posts.length === 0) {
          setState(prev => ({ ...prev, postResults: [], isLoadingPosts: false }));
          return;
        }

        // Next, get user profiles for these posts
        const userIds = posts.map(post => post.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('user_details')
          .select('id, avatar_url, full_name, display_name, unimog_model, location, online')
          .in('id', userIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Continue with partial data
        }

        // Create a map of profiles for easy lookup
        const profileMap: Record<string, any> = {};
        if (profiles) {
          profiles.forEach(profile => {
            profileMap[profile.id] = profile;
          });
        }
        
        // Format the results to match PostWithUser structure
        const formattedPosts: PostWithUser[] = posts.map(post => {
          const userProfile = profileMap[post.user_id] || {
            id: post.user_id,
            avatar_url: null,
            full_name: null,
            display_name: null,
            unimog_model: null,
            location: null,
            online: false
          };
          
          return {
            ...post,
            profile: {
              id: userProfile.id,
              avatar_url: userProfile.avatar_url,
              full_name: userProfile.full_name,
              display_name: userProfile.display_name,
              unimog_model: userProfile.unimog_model,
              location: userProfile.location,
              online: userProfile.online || false
            },
            likes_count: 0, // These will be populated in a production app
            comments_count: 0,
            shares_count: 0,
            liked_by_user: false,
            shared_by_user: false
          };
        });

        setState(prev => ({ ...prev, postResults: formattedPosts, isLoadingPosts: false }));
      } catch (error) {
        console.error('Error searching posts:', error);
        setState(prev => ({ 
          ...prev, 
          isLoadingPosts: false, 
          error: error instanceof Error ? error : new Error('Unknown error') 
        }));
      }
    };

    // Comprehensive search for modal
    const searchAll = async () => {
      setState(prev => ({ ...prev, isLoadingAll: true }));

      try {
        const allResults: SearchResult[] = [];

        // Search users
        const { data: users } = await supabase
          .from('user_details')
          .select('id, display_name, full_name, location, unimog_model, bio')
          .or(`
            display_name.ilike.%${query}%,
            full_name.ilike.%${query}%,
            location.ilike.%${query}%,
            unimog_model.ilike.%${query}%,
            bio.ilike.%${query}%
          `)
          .limit(5);

        if (users) {
          users.forEach(user => {
            const displayName = user.display_name || user.full_name || 'User';
            allResults.push({
              id: user.id,
              type: 'user',
              title: displayName,
              subtitle: user.location || user.unimog_model,
              snippet: user.bio,
              url: `/profile/${user.id}`,
              icon: '👤'
            });
          });
        }

        // Search posts
        const { data: posts } = await supabase
          .from('community_posts')
          .select('id, content, user_id, created_at')
          .ilike('content', `%${query}%`)
          .limit(5);

        if (posts) {
          posts.forEach(post => {
            allResults.push({
              id: post.id,
              type: 'post',
              title: 'Community Post',
              subtitle: `Posted ${new Date(post.created_at).toLocaleDateString()}`,
              snippet: post.content.substring(0, 100) + '...',
              url: `/community?post=${post.id}`,
              icon: '💬'
            });
          });
        }

        // Search manuals
        const { data: manuals } = await supabase
          .from('manual_chunks')
          .select('id, title, content, page_number')
          .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
          .limit(5);

        if (manuals) {
          manuals.forEach(manual => {
            allResults.push({
              id: manual.id,
              type: 'manual',
              title: manual.title || 'Technical Manual',
              subtitle: `Page ${manual.page_number}`,
              snippet: manual.content.substring(0, 100) + '...',
              url: `/knowledge/manuals?chunk=${manual.id}`,
              icon: '📖'
            });
          });
        }

        // Search marketplace
        const { data: listings } = await supabase
          .from('marketplace_listings')
          .select('id, title, description, price, category')
          .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
          .limit(5);

        if (listings) {
          listings.forEach(listing => {
            allResults.push({
              id: listing.id,
              type: 'marketplace',
              title: listing.title,
              subtitle: `$${listing.price} • ${listing.category}`,
              snippet: listing.description?.substring(0, 100) + '...',
              url: `/marketplace/listing/${listing.id}`,
              icon: '🛒'
            });
          });
        }

        // Search trips/routes
        const { data: tracks } = await supabase
          .from('gpx_tracks')
          .select('id, name, description, distance, difficulty')
          .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
          .limit(5);

        if (tracks) {
          tracks.forEach(track => {
            allResults.push({
              id: track.id,
              type: 'trip',
              title: track.name,
              subtitle: `${track.distance}km • ${track.difficulty}`,
              snippet: track.description?.substring(0, 100) + '...',
              url: `/trips?track=${track.id}`,
              icon: '🗺️'
            });
          });
        }

        // Sort results by relevance (exact matches first)
        allResults.sort((a, b) => {
          const aExact = a.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
          const bExact = b.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
          return aExact - bExact;
        });

        setState(prev => ({
          ...prev,
          allResults: allResults.slice(0, 10), // Limit to 10 results
          isLoadingAll: false
        }));

      } catch (error) {
        console.error('Error searching all content:', error);
        setState(prev => ({
          ...prev,
          isLoadingAll: false,
          error: error instanceof Error ? error : new Error('Search failed')
        }));
      }
    };

    searchUsers();
    searchPosts();
    searchAll();
  }, [query]);

  return state;
}
