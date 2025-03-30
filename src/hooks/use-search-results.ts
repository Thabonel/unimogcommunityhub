
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { PostWithUser } from '@/types/post';
import { supabase } from '@/integrations/supabase/client';

interface SearchResultsState {
  userResults: UserProfile[];
  postResults: PostWithUser[];
  isLoadingUsers: boolean;
  isLoadingPosts: boolean;
  error: Error | null;
}

export function useSearchResults(query: string) {
  const [state, setState] = useState<SearchResultsState>({
    userResults: [],
    postResults: [],
    isLoadingUsers: false,
    isLoadingPosts: false,
    error: null
  });

  useEffect(() => {
    if (!query || query.length < 2) {
      setState({
        userResults: [],
        postResults: [],
        isLoadingUsers: false,
        isLoadingPosts: false,
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

        setState(prev => ({ ...prev, userResults: users || [], isLoadingUsers: false }));
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
          .from('posts')
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

    searchUsers();
    searchPosts();
  }, [query]);

  return state;
}
