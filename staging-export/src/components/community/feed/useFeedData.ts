
import { useState, useEffect } from 'react';
import { getPosts } from '@/services/post';
import { PostWithUser } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userProfileService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';

export const useFeedData = () => {
  const [feedFilter, setFeedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch posts
  const fetchPosts = async (pageNum = 0, refresh = false) => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getPosts(10, pageNum);
      
      // Filter posts by selected tags if any are selected
      const filteredPosts = selectedTags.length > 0
        ? fetchedPosts.filter(post => {
            // In a real app, posts would have tags. Since our current posts don't,
            // we're simulating tag filtering by checking if any selected tag appears in the content
            if (!post.content) return false;
            return selectedTags.some(tag => 
              post.content.toLowerCase().includes(tag.toLowerCase())
            );
          })
        : fetchedPosts;
      
      if (refresh) {
        setPosts(filteredPosts || []);
      } else {
        setPosts(prev => [...prev, ...(filteredPosts || [])]);
      }
      
      setHasMore((fetchedPosts || []).length === 10);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Could not load posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts(0, true);
  }, [selectedTags]); // Re-fetch when tags change

  // Set up realtime subscription for new posts
  useEffect(() => {
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' }, 
        () => {
          fetchPosts(0, true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handlePostCreated = () => {
    fetchPosts(0, true);
  };

  const handleFilterChange = (value: string) => {
    setFeedFilter(value);
    setPage(0);
    fetchPosts(0, true);
  };
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
    setPage(0);
  };
  
  const clearTags = () => {
    setSelectedTags([]);
    setPage(0);
  };

  return {
    feedFilter,
    selectedTags,
    posts,
    isLoading,
    page,
    hasMore,
    userProfile,
    handleLoadMore,
    handlePostCreated,
    handleFilterChange,
    toggleTag,
    clearTags
  };
};
