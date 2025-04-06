
import { Button } from '@/components/ui/button';
import ProfilePreview from '../ProfilePreview';

interface ProfilePreviewWrapperProps {
  previewData: {
    name: string;
    unimogModel: string | null;
    about: string;
    location: string;
    website?: string;
    avatarUrl: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile: boolean; // This is required, not optional
  };
  onBackToEditing: () => void;
}

const ProfilePreviewWrapper = ({ previewData, onBackToEditing }: ProfilePreviewWrapperProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Profile Preview</h3>
      <ProfilePreview previewData={previewData} />
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBackToEditing}
        >
          Back to Editing
        </Button>
      </div>
    </div>
  );
};

export default ProfilePreviewWrapper;
