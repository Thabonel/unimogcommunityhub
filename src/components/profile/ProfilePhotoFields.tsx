
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { Textarea } from '@/components/ui/textarea';
import { useMemo } from 'react';

interface ProfilePhotoFieldsProps {
  formData: {
    avatarUrl: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
    about: string;
  };
  onAvatarChange: (url: string) => void;
  onVehiclePhotoChange: (url: string) => void;
  onUseVehiclePhotoToggle: (checked: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfilePhotoFields = ({ 
  formData, 
  onAvatarChange, 
  onVehiclePhotoChange, 
  onUseVehiclePhotoToggle,
  onChange 
}: ProfilePhotoFieldsProps) => {
  console.log("ProfilePhotoFields render:", {
    vehiclePhotoUrl: formData.vehiclePhotoUrl,
    useVehiclePhotoAsProfile: formData.useVehiclePhotoAsProfile
  });
  
  // Make sure to handle undefined values by converting them to a boolean
  const useVehiclePhotoAsProfile = formData.useVehiclePhotoAsProfile === true;
  
  // Check if vehicle photo toggle should be disabled
  const isToggleDisabled = useMemo(() => {
    return !formData.vehiclePhotoUrl || formData.vehiclePhotoUrl.trim() === '';
  }, [formData.vehiclePhotoUrl]);
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Profile Photo</Label>
        <PhotoUpload
          initialImageUrl={formData.avatarUrl}
          onImageUploaded={onAvatarChange}
          type="profile"
          size="lg"
        />
      </div>
      
      <div>
        <Label className="mb-2 block">Vehicle Photo</Label>
        <PhotoUpload
          initialImageUrl={formData.vehiclePhotoUrl}
          onImageUploaded={onVehiclePhotoChange}
          type="vehicle"
          size="lg"
        />
      </div>
      
      <div className="pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="use-vehicle-photo"
            checked={useVehiclePhotoAsProfile}
            onCheckedChange={onUseVehiclePhotoToggle}
            disabled={isToggleDisabled}
          />
          <Label 
            htmlFor="use-vehicle-photo" 
            className={isToggleDisabled ? "text-muted-foreground" : ""}
          >
            Use vehicle photo as profile picture
          </Label>
        </div>
        {isToggleDisabled && (
          <p className="text-sm text-muted-foreground mt-1">
            Upload a vehicle photo first to enable this option
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Textarea 
          id="about" 
          name="about" 
          rows={4} 
          value={formData.about} 
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoFields;
