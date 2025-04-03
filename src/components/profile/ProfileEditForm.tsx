
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import ProfileBasicInfoFields from './ProfileBasicInfoFields';
import ProfilePhotoFields from './ProfilePhotoFields';

interface ProfileEditFormProps {
  initialData: {
    name: string;
    email: string;
    unimogModel: string;
    about: string;
    location: string;
    avatarUrl: string;
    website?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
  onCancel: () => void;
  onSubmit: (formData: any) => void;
  isMasterUser?: boolean;
}

const ProfileEditForm = ({ initialData, onCancel, onSubmit, isMasterUser = false }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState(initialData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAvatarChange = (url: string) => {
    setFormData({
      ...formData,
      avatarUrl: url
    });
  };
  
  const handleVehiclePhotoChange = (url: string) => {
    setFormData({
      ...formData,
      vehiclePhotoUrl: url
    });
  };
  
  const handleUseVehiclePhotoToggle = (checked: boolean) => {
    setFormData({
      ...formData,
      useVehiclePhotoAsProfile: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left column - Basic profile information */}
            <ProfileBasicInfoFields 
              formData={formData}
              isMasterUser={isMasterUser}
              onChange={handleInputChange}
            />
            
            {/* Right column - Photos and about */}
            <ProfilePhotoFields
              formData={formData}
              onAvatarChange={handleAvatarChange}
              onVehiclePhotoChange={handleVehiclePhotoChange}
              onUseVehiclePhotoToggle={handleUseVehiclePhotoToggle}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
