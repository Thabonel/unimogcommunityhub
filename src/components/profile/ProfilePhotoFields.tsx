
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'react';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { Move } from 'lucide-react';
import PhotoPositioner from './PhotoPositioner';

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
  const [showProfilePositioner, setShowProfilePositioner] = useState(false);
  const [showVehiclePositioner, setShowVehiclePositioner] = useState(false);
  
  logger.debug("ProfilePhotoFields render", {
    component: 'ProfilePhotoFields',
    avatarUrl: formData.avatarUrl,
    vehiclePhotoUrl: formData.vehiclePhotoUrl,
    useVehiclePhotoAsProfile: formData.useVehiclePhotoAsProfile,
    showProfileButton: !!formData.avatarUrl,
    showVehicleButton: !!formData.vehiclePhotoUrl
  });
  
  // Buckets already exist in Supabase, no need to create them
  
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
        <div className="space-y-2">
          <PhotoUpload
            initialImageUrl={formData.avatarUrl}
            onImageUploaded={onAvatarChange}
            type="profile"
            size="lg"
          />
          {formData.avatarUrl && formData.avatarUrl.trim() !== '' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowProfilePositioner(true)}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Position Photo
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Vehicle Photo</Label>
        <div className="space-y-2">
          <PhotoUpload
            initialImageUrl={formData.vehiclePhotoUrl}
            onImageUploaded={onVehiclePhotoChange}
            type="vehicle"
            size="lg"
          />
          {formData.vehiclePhotoUrl && formData.vehiclePhotoUrl.trim() !== '' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowVehiclePositioner(true)}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Position Photo
            </Button>
          )}
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex items-center space-x-3">
          <Switch
            id="use-vehicle-photo"
            checked={useVehiclePhotoAsProfile}
            onCheckedChange={onUseVehiclePhotoToggle}
            disabled={isToggleDisabled}
          />
          <div className="flex-1">
            <Label 
              htmlFor="use-vehicle-photo" 
              className={`cursor-pointer ${isToggleDisabled ? "text-muted-foreground" : ""}`}
            >
              Use vehicle photo as profile picture
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {useVehiclePhotoAsProfile ? (
                <span className="text-green-600 font-medium">✓ ON - Vehicle photo is your profile picture</span>
              ) : (
                <span className="text-gray-500">OFF - Using separate profile photo</span>
              )}
            </p>
          </div>
        </div>
        {isToggleDisabled && (
          <p className="text-sm text-amber-600 mt-2 bg-amber-50 p-2 rounded">
            ⚠️ Upload a vehicle photo first to enable this option
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
      
      {/* Photo Positioners */}
      {formData.avatarUrl && formData.avatarUrl.trim() !== '' && (
        <PhotoPositioner
          imageUrl={formData.avatarUrl}
          isOpen={showProfilePositioner}
          onClose={() => setShowProfilePositioner(false)}
          onSave={onAvatarChange}
        />
      )}
      
      {formData.vehiclePhotoUrl && formData.vehiclePhotoUrl.trim() !== '' && (
        <PhotoPositioner
          imageUrl={formData.vehiclePhotoUrl}
          isOpen={showVehiclePositioner}
          onClose={() => setShowVehiclePositioner(false)}
          onSave={onVehiclePhotoChange}
        />
      )}
    </div>
  );
};

export default ProfilePhotoFields;
