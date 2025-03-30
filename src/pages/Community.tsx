
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, MessageSquare, Search, Bell, UserPlus, 
  UserCircle, RefreshCw
} from 'lucide-react';
import AnalyticsCommunityFeed from '@/components/community/AnalyticsCommunityFeed';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userProfileService';
import { useUserPresence } from '@/hooks/use-user-presence';
import { UserProfile } from '@/types/user';
import { useAnalytics } from '@/hooks/use-analytics';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';

const Community = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { trackFeatureUse } = useAnalytics();
  
  // Use the presence hook to track user's online status
  useUserPresence();
  
  // Fetch the user's profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
        }
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleRefresh = () => {
    // Track refresh action
    trackFeatureUse('page_refresh', {
      page: 'community'
    });
    
    setIsRefreshing(true);
    // The feed component will handle its own refresh
    // Just need to simulate the refresh state
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Track navigation events
  const trackNavigation = (destination: string) => {
    trackFeatureUse('navigation', {
      from: 'community',
      to: destination
    });
  };

  return (
    <Layout isLoggedIn={!!user} user={profile ? {
      name: profile.display_name || profile.full_name || profile.email.split('@')[0],
      avatarUrl: profile.avatar_url || undefined,
      unimogModel: profile.unimog_model || undefined
    } : undefined}>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Community
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Connect with other Unimog enthusiasts from around the world.
            </p>
          </div>
          <div className="flex gap-2">
            <FeedbackButton />
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span>Refresh</span>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => trackNavigation('messages')}
            >
              <RouterLink to="/messages">
                <MessageSquare size={16} />
                <span>Messages</span>
              </RouterLink>
            </Button>
            <Button 
              className="bg-primary flex items-center gap-2"
              onClick={() => trackFeatureUse('find_members', { action: 'click' })}
            >
              <UserPlus size={16} />
              <span>Find Members</span>
            </Button>
          </div>
        </div>
        
        {/* Community Platform Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={profile?.avatar_url || undefined} 
                      alt={profile?.display_name || profile?.full_name || "User"} 
                    />
                    <AvatarFallback>
                      {profile?.display_name?.substring(0, 2).toUpperCase() || 
                       profile?.full_name?.substring(0, 2).toUpperCase() || 
                       profile?.email?.substring(0, 2).toUpperCase() || 
                       "UN"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {profile?.display_name || profile?.full_name || profile?.email?.split('@')[0] || "User"}
                    </p>
                    {profile?.unimog_model && (
                      <p className="text-sm text-muted-foreground">{profile.unimog_model} Owner</p>
                    )}
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <RouterLink 
                    to="/profile" 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
                    onClick={() => trackNavigation('profile')}
                  >
                    <UserCircle size={20} />
                    <span>My Profile</span>
                  </RouterLink>
                  <RouterLink 
                    to="/messages" 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
                    onClick={() => trackNavigation('messages')}
                  >
                    <MessageSquare size={20} />
                    <span>Messages</span>
                  </RouterLink>
                  <RouterLink 
                    to="/notifications" 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
                    onClick={() => trackNavigation('notifications')}
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                    <Badge className="ml-auto bg-primary px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">3</Badge>
                  </RouterLink>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Use our analytics-enhanced feed */}
            <AnalyticsCommunityFeed />
          </div>
          
          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Find Members</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search people..." 
                    className="pl-8" 
                    onChange={() => trackFeatureUse('search', { type: 'member_search' })}
                  />
                </div>
                <h4 className="text-sm font-medium mb-2">Suggested Connections</h4>
                <div className="space-y-3">
                  {['Alex Weber', 'Sarah Johnson', 'Mike Thompson'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{name}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => trackFeatureUse('connection_request', { user: name })}
                      >
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
