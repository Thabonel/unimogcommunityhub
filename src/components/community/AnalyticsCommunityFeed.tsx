import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedPostItem from './EnhancedPostItem';
import CreatePost from './CreatePost';
import { getPosts } from '@/services/post';
import { PostWithUser } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userProfileService';
import { UserProfile } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Available post topics/tags
const AVAILABLE_TAGS = [
  { id: 'repair', label: 'Repair' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'modifications', label: 'Modifications' },
  { id: 'adventure', label: 'Adventures' },
  { id: 'offroad', label: 'Offroad' },
  { id: 'tools', label: 'Tools' },
  { id: 'help', label: 'Help' },
  { id: 'marketplace', label: 'Marketplace' },
];

const AnalyticsCommunityFeed = () => {
  const [feedFilter, setFeedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const { trackFeatureUse } = useAnalytics();
  
  // Track feature usage
  useEffect(() => {
    trackFeatureUse('community_feed', { 
      filter: feedFilter, 
      tags: selectedTags.join(',')
    });
  }, [feedFilter, selectedTags, trackFeatureUse]);

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
    const startTime = Date.now();
    
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
      
      // Track API performance
      const duration = Date.now() - startTime;
      trackFeatureUse('api_performance', {
        endpoint: 'getPosts',
        duration,
        page: pageNum,
        filter: feedFilter,
        success: true
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Track error
      trackFeatureUse('api_error', {
        endpoint: 'getPosts',
        duration: Date.now() - startTime,
        error: String(error)
      });
      
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
    // Track load more action
    trackFeatureUse('pagination', {
      action: 'load_more',
      current_page: page,
      next_page: page + 1
    });
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handlePostCreated = () => {
    // Track post creation success
    trackFeatureUse('post_creation', {
      action: 'success'
    });
    
    fetchPosts(0, true);
  };

  const handleFilterChange = (value: string) => {
    // Track filter change
    trackFeatureUse('filter_change', {
      from: feedFilter,
      to: value
    });
    
    setFeedFilter(value);
    setPage(0);
    fetchPosts(0, true);
  };
  
  const toggleTag = (tagId: string) => {
    // Track tag toggle
    trackFeatureUse('tag_filter', {
      tag: tagId,
      action: selectedTags.includes(tagId) ? 'remove' : 'add'
    });
    
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
    setPage(0);
  };
  
  const clearTags = () => {
    // Track clear tags
    trackFeatureUse('tag_filter', {
      action: 'clear_all',
      previous_tags: selectedTags.join(',')
    });
    
    setSelectedTags([]);
    setPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Create Post Card */}
      <CreatePost profile={userProfile} onPostCreated={handlePostCreated} />
      
      {/* Feed Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs defaultValue="all" value={feedFilter} onValueChange={handleFilterChange} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Filter by Topic
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <p className="text-sm font-medium">Select topics</p>
                <div className="space-y-1">
                  {AVAILABLE_TAGS.map((tag) => (
                    <Button
                      key={tag.id}
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {selectedTags.includes(tag.id) && <Check className="mr-2 h-4 w-4" />}
                      <span className={selectedTags.includes(tag.id) ? "font-medium" : ""}>
                        {tag.label}
                      </span>
                    </Button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={clearTags}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Active Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tagId => {
            const tag = AVAILABLE_TAGS.find(t => t.id === tagId);
            return (
              <Badge key={tagId} variant="secondary" className="px-3 py-1">
                {tag?.label || tagId}
                <button 
                  className="ml-1 text-xs"
                  onClick={() => toggleTag(tagId)}
                >
                  ×
                </button>
              </Badge>
            );
          })}
          <Button variant="ghost" size="sm" onClick={clearTags}>
            Clear all
          </Button>
        </div>
      )}
      
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
          posts.map(post => <EnhancedPostItem key={post.id} post={post} />)
        ) : (
          
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              {selectedTags.length > 0 
                ? "No posts match your selected filters. Try different topics or clear filters."
                : "Be the first to post in the community!"}
            </p>
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

export default AnalyticsCommunityFeed;
