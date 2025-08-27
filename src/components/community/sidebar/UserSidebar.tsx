
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { useAnalytics } from '@/hooks/use-analytics';

const UserSidebar = () => {
  const { user } = useAuth();
  const { userData } = useProfile();
  const { trackFeatureUse } = useAnalytics();
  
  // Use consistent data from useProfile hook
  const displayName = userData?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = (userData?.useVehiclePhotoAsProfile && userData?.vehiclePhotoUrl) 
    ? userData?.vehiclePhotoUrl 
    : userData?.avatarUrl;

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
              src={avatarUrl || undefined} 
              alt={displayName} 
            />
            <AvatarFallback>
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {displayName}
            </p>
            {userData?.unimogModel && (
              <p className="text-sm text-muted-foreground">{userData.unimogModel} Owner</p>
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
