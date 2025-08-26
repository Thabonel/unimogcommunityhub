
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
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Tag } from 'lucide-react';
import { getExperimentVariant, trackExperimentConversion } from '@/services/analytics/activityTrackingService';
import { Link } from 'react-router-dom';

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
  const [profileLoading, setProfileLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const { trackFeatureUse } = useAnalytics();
  
  // A/B test for new feed layout
  const [feedVariant, setFeedVariant] = useState<string | null>(null);
  
  // Set up A/B test for UI variant
  useEffect(() => {
    // Get assigned variant for the feed layout experiment
    const variant = getExperimentVariant('feed_layout_experiment');
    setFeedVariant(variant);
  }, []);
  
  // Track feature usage
  useEffect(() => {
    trackFeatureUse('community_feed', { 
      filter: feedFilter, 
      tags: selectedTags.join(','),
      variant: feedVariant || 'control'
    });
  }, [feedFilter, selectedTags, feedVariant, trackFeatureUse]);

  // Fetch user profile with better retry logic
  useEffect(() => {
    let mounted = true;
    
    const fetchProfile = async () => {
      // Don't fetch if auth is still loading
      if (!user && authLoading) {
        console.log('Auth still loading, waiting for user...');
        return;
      }
      
      setProfileLoading(true);
      
      if (user && user.id) {
        try {
          console.log('Fetching profile for user:', user.id, user.email);
          const profile = await getUserProfile(user.id);
          
          if (mounted) {
            if (profile) {
              console.log('Profile fetched successfully:', profile.display_name || profile.full_name || 'No name yet');
              setUserProfile(profile);
            } else {
              console.warn('Profile returned null for user:', user.id, '- creating fallback');
              // Create fallback profile from auth user
              const fallbackProfile: UserProfile = {
                id: user.id,
                email: user.email || '',
                display_name: user.email?.split('@')[0] || 'User',
                full_name: user.email?.split('@')[0] || 'User',
                avatar_url: user.user_metadata?.avatar_url || null,
                bio: null,
                location: null,
                unimog_model: null,
                unimog_year: null,
                unimog_modifications: null,
                experience_level: 'beginner',
                online: false,
                banned_until: null,
                is_admin: false,
                street_address: null,
                city: null,
                state: null,
                postal_code: null,
                country: null,
                phone_number: null,
                currency: 'USD',
                vehicle_photo_url: null,
                use_vehicle_photo_as_profile: false,
                unimog_series: null,
                unimog_specs: null,
                unimog_features: null,
                unimog_wiki_data: null,
                preferred_terrain: null,
                mechanical_skills: null,
                certifications: null,
                emergency_contact: null,
                insurance_info: null,
                privacy_settings: null,
                notification_preferences: null,
                last_active_at: null,
                account_status: 'active',
                subscription_tier: 'free',
                subscription_expires_at: null,
                profile_completion_percentage: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUserProfile(fallbackProfile);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Create fallback profile on error
          if (mounted && user) {
            const fallbackProfile: UserProfile = {
              id: user.id,
              email: user.email || '',
              display_name: user.email?.split('@')[0] || 'User',
              full_name: user.email?.split('@')[0] || 'User',
              avatar_url: user.user_metadata?.avatar_url || null,
              bio: null,
              location: null,
              unimog_model: null,
              unimog_year: null,
              unimog_modifications: null,
              experience_level: 'beginner',
              online: false,
              banned_until: null,
              is_admin: false,
              street_address: null,
              city: null,
              state: null,
              postal_code: null,
              country: null,
              phone_number: null,
              currency: 'USD',
              vehicle_photo_url: null,
              use_vehicle_photo_as_profile: false,
              unimog_series: null,
              unimog_specs: null,
              unimog_features: null,
              unimog_wiki_data: null,
              preferred_terrain: null,
              mechanical_skills: null,
              certifications: null,
              emergency_contact: null,
              insurance_info: null,
              privacy_settings: null,
              notification_preferences: null,
              last_active_at: null,
              account_status: 'active',
              subscription_tier: 'free',
              subscription_expires_at: null,
              profile_completion_percentage: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setUserProfile(fallbackProfile);
          }
        } finally {
          if (mounted) {
            setProfileLoading(false);
          }
        }
      } else {
        console.log('No user available');
        if (mounted) {
          setProfileLoading(false);
          setUserProfile(null);
        }
      }
    };

    fetchProfile();
    
    return () => { 
      mounted = false; 
    };
  }, [user, authLoading]);

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
    
    // Track experiment conversion
    if (feedVariant) {
      trackExperimentConversion('feed_layout_experiment', 'filter_change', {
        filter_value: value
      });
    }
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
    
    // Track experiment conversion
    if (feedVariant) {
      trackExperimentConversion('feed_layout_experiment', 'tag_filter', {
        tag: tagId
      });
    }
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

  // Alternative layouts based on A/B test variant
  const renderVariantA = () => (
    <div className="space-y-6">
      {/* Create Post Card - Only render when profile is loaded */}
      {!profileLoading && (
        <CreatePost profile={userProfile} onPostCreated={handlePostCreated} />
      )}
      
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

  // Variant B - Alternative layout with sidebar
  const renderVariantB = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        {/* Create Post Card */}
        <CreatePost profile={userProfile} onPostCreated={handlePostCreated} />
        
        {/* Feed Filter Tabs */}
        <Tabs defaultValue="all" value={feedFilter} onValueChange={handleFilterChange}>
          <TabsList className="grid grid-cols-3 w-full md:w-1/2">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
      
      {/* Sidebar */}
      <div className="space-y-6">
        {/* Topic filters card */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-3">Filter by Topic</h3>
          <div className="space-y-2">
            {AVAILABLE_TAGS.map((tag) => (
              <div 
                key={tag.id}
                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                  selectedTags.includes(tag.id) ? 'bg-muted' : ''
                }`}
                onClick={() => toggleTag(tag.id)}
              >
                <div className="flex items-center justify-center mr-2">
                  {selectedTags.includes(tag.id) ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <div className="w-4 h-4 border rounded" />
                  )}
                </div>
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" className="w-full mt-3" onClick={clearTags}>
              Clear filters
            </Button>
          )}
        </div>
        
        {/* Community improvement card */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-2">Community Tools</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Help improve our community with feedback and insights.
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/feedback">
                Submit Feedback
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/community/improvement">
                View Community Health
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the appropriate layout based on experiment variant
  // Fix: Use correct variant mapping and default to variant A
  return (
    <>
      {feedVariant === 'variant_b' ? renderVariantB() : renderVariantA()}
    </>
  );
};

export default AnalyticsCommunityFeed;
