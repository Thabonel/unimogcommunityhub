
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostItem from './PostItem';
import CreatePost from './CreatePost';
import { getPosts } from '@/services/postService';
import { PostWithUser } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userProfileService';
import { UserProfile } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const CommunityFeed = () => {
  const [feedFilter, setFeedFilter] = useState('all');
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
      if (refresh) {
        setPosts(fetchedPosts);
      } else {
        setPosts(prev => [...prev, ...fetchedPosts]);
      }
      setHasMore(fetchedPosts.length === 10);
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
  }, []);

  // Set up realtime subscription for new posts
  useEffect(() => {
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' }, 
        (payload) => {
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

  return (
    <div className="space-y-6">
      {/* Create Post Card */}
      <CreatePost profile={userProfile} onPostCreated={handlePostCreated} />
      
      {/* Feed Filter Tabs */}
      <Tabs defaultValue="all" value={feedFilter} onValueChange={handleFilterChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Posts List */}
      <div className="space-y-6">
        {isLoading && page === 0 ? (
          // Skeleton loading for initial load
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-6 space-y-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-4/5 bg-muted rounded"></div>
              </div>
              <div className="h-40 bg-muted rounded-md"></div>
              <div className="flex justify-between">
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map(post => <PostItem key={post.id} post={post} />)
        ) : (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to post in the community!</p>
          </div>
        )}
        
        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button onClick={handleLoadMore} variant="outline" disabled={isLoading}>
              {isLoading && page > 0 ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-primary rounded-full"></span>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
