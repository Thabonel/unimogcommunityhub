
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/userProfileService';
import { UserProfile } from '@/types/user';
import { useAnalytics } from '@/hooks/use-analytics';

const UserSidebar = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { trackFeatureUse } = useAnalytics();
  
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

  // Track navigation events
  const trackNavigation = (destination: string) => {
    trackFeatureUse('navigation', {
      from: 'community',
      to: destination
    });
  };

  return (
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
          <Link 
            to="/profile" 
            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
            onClick={() => trackNavigation('profile')}
          >
            <UserCircle size={20} />
            <span>My Profile</span>
          </Link>
          <Link 
            to="/messages" 
            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
            onClick={() => trackNavigation('messages')}
          >
            <MessageSquare size={20} />
            <span>Messages</span>
          </Link>
        </nav>
      </CardContent>
    </Card>
  );
};

export default UserSidebar;
