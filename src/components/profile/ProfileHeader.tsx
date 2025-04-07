
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useMemo } from 'react';

interface ProfileHeaderProps {
  userData: {
    name: string;
    unimogModel: string;
    avatarUrl: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
    location: string;
    website?: string;
    joinDate: string;
  };
  isEditing: boolean;
  onEditClick: () => void;
}

const ProfileHeader = ({ userData, isEditing, onEditClick }: ProfileHeaderProps) => {
  // Determine which photo to use as the profile picture
  const displayAvatarUrl = useMemo(() => {
    return (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl;
  }, [userData.useVehiclePhotoAsProfile, userData.vehiclePhotoUrl, userData.avatarUrl]);

  return (
    <div>
      <Avatar className="h-28 w-28 mb-4">
        <AvatarImage src={displayAvatarUrl} alt={userData.name} />
        <AvatarFallback className="bg-unimog-500 text-unimog-50 text-xl">
          {userData.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
      <p className="text-muted-foreground mb-4">{userData.unimogModel} Owner</p>
      
      <div className="w-full text-sm space-y-3 mb-6">
        <div>
          <span className="font-medium">Location:</span> {userData.location}
        </div>
        {userData.website && (
          <div>
            <span className="font-medium">Website:</span>{" "}
            <a href={`https://${userData.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {userData.website}
            </a>
          </div>
        )}
        <div>
          <span className="font-medium">Member since:</span>{" "}
          {new Date(userData.joinDate).toLocaleDateString()}
        </div>
      </div>
      
      {!isEditing && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onEditClick}
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
