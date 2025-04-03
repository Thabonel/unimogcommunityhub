
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfilePreviewProps {
  previewData: {
    name: string;
    unimogModel: string;
    about: string;
    location: string;
    website?: string;
    avatarUrl: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile: boolean;
  }
}

const ProfilePreview = ({ previewData }: ProfilePreviewProps) => {
  // Determine which avatar URL to use based on user preference
  const displayAvatarUrl = previewData.useVehiclePhotoAsProfile && previewData.vehiclePhotoUrl
    ? previewData.vehiclePhotoUrl
    : previewData.avatarUrl;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-28 w-28 mb-4">
            <AvatarImage src={displayAvatarUrl} alt={previewData.name} />
            <AvatarFallback className="bg-unimog-500 text-unimog-50 text-xl">
              {previewData.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold mb-1">{previewData.name}</h2>
          <p className="text-muted-foreground mb-4">{previewData.unimogModel} Owner</p>
          
          <div className="w-full text-sm space-y-3 mb-6">
            <div>
              <span className="font-medium">Location:</span> {previewData.location}
            </div>
            {previewData.website && (
              <div>
                <span className="font-medium">Website:</span>{" "}
                <span className="text-primary">
                  {previewData.website}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {previewData.about && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">About</h3>
            <p className="text-sm">{previewData.about}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePreview;
