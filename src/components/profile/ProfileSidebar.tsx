import { useSubscription } from '@/hooks/use-subscription';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo } from 'react';

export interface ProfileSidebarProps {
  userData: {
    avatarUrl?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
    name?: string;
    email: string;
  };
  isEditing?: boolean;
  onEditClick?: () => void;
}
const ProfileSidebar = ({
  userData,
  isEditing,
  onEditClick
}: ProfileSidebarProps) => {
  const {
    hasActiveSubscription,
    getSubscriptionLevel
  } = useSubscription();
  const {
    user
  } = useAuth();
  const subscriptionLevel = getSubscriptionLevel();
  const isAdmin = user?.app_metadata?.roles?.includes('admin');
  
  // Determine which photo to use as the profile picture
  const displayAvatarUrl = useMemo(() => {
    const useVehiclePhoto = userData.useVehiclePhotoAsProfile === true;
    const hasVehiclePhoto = userData.vehiclePhotoUrl && userData.vehiclePhotoUrl.trim() !== '';
    
    console.log('ProfileSidebar avatar logic:', {
      avatarUrl: userData.avatarUrl,
      vehiclePhotoUrl: userData.vehiclePhotoUrl,
      useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile,
      useVehiclePhoto,
      hasVehiclePhoto,
      willDisplay: (useVehiclePhoto && hasVehiclePhoto) ? userData.vehiclePhotoUrl : userData.avatarUrl
    });
    
    return (useVehiclePhoto && hasVehiclePhoto) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl;
  }, [userData.useVehiclePhotoAsProfile, userData.vehiclePhotoUrl, userData.avatarUrl]);
  
  return <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={displayAvatarUrl} alt={userData.name || 'User'} />
          <AvatarFallback className="bg-unimog-500 text-unimog-50">
            {(userData.name || userData.email || 'U').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{userData.name || 'No Name'}</h3>
          <p className="text-sm text-muted-foreground">{userData.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Subscription</h4>
        {hasActiveSubscription() ? <Badge variant="secondary">
            {subscriptionLevel === 'lifetime' ? 'Lifetime' : 'Premium'}
          </Badge> : <Badge variant="outline">Free</Badge>}
      </div>
      
      {isAdmin && <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Admin</h4>
          <Badge variant="destructive">Administrator</Badge>
        </div>}

      {isEditing ? <p className="text-sm text-[#fefefe]">Editing profile...</p> : <button onClick={onEditClick} className="text-sm text-primary hover:underline">
          Edit Profile
        </button>}
    </div>;
};
export default ProfileSidebar;