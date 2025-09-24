
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { PostWithUser } from '@/types/post';
import { supabase } from '@/lib/supabase-client';
import { useDebounce } from '@/hooks/use-debounce';

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

  // Debounce the query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
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

    // Comprehensive search for modal using Promise.allSettled for parallel execution
    const searchAll = async () => {
      setState(prev => ({ ...prev, isLoadingAll: true, error: null }));

      try {
        console.log('Searching for:', debouncedQuery);

        // Execute all searches in parallel using Promise.allSettled for error resilience
        const searchPromises = [
          // Search users
          supabase
            .from('user_details')
            .select('id, display_name, full_name, location, unimog_model, bio')
            .or(`display_name.ilike.%${debouncedQuery}%,full_name.ilike.%${debouncedQuery}%,location.ilike.%${debouncedQuery}%,unimog_model.ilike.%${debouncedQuery}%,bio.ilike.%${debouncedQuery}%`)
            .limit(3),

          // Search posts
          supabase
            .from('community_posts')
            .select('id, content, user_id, created_at')
            .ilike('content', `%${debouncedQuery}%`)
            .limit(3),

          // Search manuals
          supabase
            .from('manual_chunks')
            .select('id, manual_title, section_title, content, page_number')
            .or(`manual_title.ilike.%${debouncedQuery}%,section_title.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`)
            .limit(3),

          // Search marketplace
          supabase
            .from('marketplace_listings')
            .select('id, title, description, price, category')
            .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
            .limit(3),

          // Search trips/routes
          supabase
            .from('gpx_tracks')
            .select('id, name, description, distance, difficulty')
            .or(`name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
            .limit(3),
        ];

        const results = await Promise.allSettled(searchPromises);
        const allResults: SearchResult[] = [];

        // Process users
        if (results[0].status === 'fulfilled' && results[0].value.data) {
          console.log('Users found:', results[0].value.data.length);
          results[0].value.data.forEach((user: any) => {
            const displayName = user.display_name || user.full_name || 'User';
            allResults.push({
              id: user.id,
              type: 'user',
              title: displayName,
              subtitle: user.location || user.unimog_model || 'Community Member',
              snippet: user.bio || 'Unimog enthusiast',
              url: `/profile/${user.id}`,
              icon: '👤'
            });
          });
        } else if (results[0].status === 'rejected') {
          console.error('User search failed:', results[0].reason);
        }

        // Process posts
        if (results[1].status === 'fulfilled' && results[1].value.data) {
          console.log('Posts found:', results[1].value.data.length);
          results[1].value.data.forEach((post: any) => {
            allResults.push({
              id: post.id,
              type: 'post',
              title: 'Community Post',
              subtitle: `Posted ${new Date(post.created_at).toLocaleDateString()}`,
              snippet: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
              url: `/community?post=${post.id}`,
              icon: '💬'
            });
          });
        } else if (results[1].status === 'rejected') {
          console.error('Posts search failed:', results[1].reason);
        }

        // Process manuals
        if (results[2].status === 'fulfilled' && results[2].value.data) {
          console.log('Manuals found:', results[2].value.data.length);
          results[2].value.data.forEach((manual: any) => {
            allResults.push({
              id: manual.id,
              type: 'manual',
              title: manual.manual_title || 'Technical Manual',
              subtitle: manual.section_title || `Page ${manual.page_number}`,
              snippet: manual.content.substring(0, 100) + (manual.content.length > 100 ? '...' : ''),
              url: `/knowledge/manuals?chunk=${manual.id}`,
              icon: '📖'
            });
          });
        } else if (results[2].status === 'rejected') {
          console.error('Manuals search failed:', results[2].reason);
        }

        // Process marketplace
        if (results[3].status === 'fulfilled' && results[3].value.data) {
          console.log('Marketplace found:', results[3].value.data.length);
          results[3].value.data.forEach((listing: any) => {
            allResults.push({
              id: listing.id,
              type: 'marketplace',
              title: listing.title,
              subtitle: `$${listing.price} • ${listing.category}`,
              snippet: listing.description?.substring(0, 100) + (listing.description?.length > 100 ? '...' : '') || 'No description',
              url: `/marketplace/listing/${listing.id}`,
              icon: '🛒'
            });
          });
        } else if (results[3].status === 'rejected') {
          console.error('Marketplace search failed:', results[3].reason);
        }

        // Process trips/routes
        if (results[4].status === 'fulfilled' && results[4].value.data) {
          console.log('Trips found:', results[4].value.data.length);
          results[4].value.data.forEach((track: any) => {
            allResults.push({
              id: track.id,
              type: 'trip',
              title: track.name,
              subtitle: `${track.distance}km • ${track.difficulty}`,
              snippet: track.description?.substring(0, 100) + (track.description?.length > 100 ? '...' : '') || 'No description',
              url: `/trips?track=${track.id}`,
              icon: '🗺️'
            });
          });
        } else if (results[4].status === 'rejected') {
          console.error('Trips search failed:', results[4].reason);
        }

        // Sort results by relevance (exact matches first)
        allResults.sort((a, b) => {
          const queryLower = debouncedQuery.toLowerCase();
          const aExact = a.title.toLowerCase().includes(queryLower) ? 0 : 1;
          const bExact = b.title.toLowerCase().includes(queryLower) ? 0 : 1;
          return aExact - bExact;
        });

        console.log('Total results found:', allResults.length);

        setState(prev => ({
          ...prev,
          allResults,
          isLoadingAll: false
        }));

      } catch (error) {
        console.error('Error in searchAll:', error);
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
  }, [debouncedQuery]);

  return state;
}
