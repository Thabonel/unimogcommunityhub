
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Eye, EyeOff } from 'lucide-react';
import ProfileBasicInfoFields from './ProfileBasicInfoFields';
import ProfilePhotoFields from './ProfilePhotoFields';
import ProfilePreview from './ProfilePreview';

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
  const [formData, setFormData] = useState({
    ...initialData,
    useVehiclePhotoAsProfile: initialData.useVehiclePhotoAsProfile || false // Ensure it always has a boolean value
  });
  
  const [showPreview, setShowPreview] = useState(false);
  
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

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  // Create a preview data object that matches the ProfilePreview component's expected props
  const previewData = {
    name: formData.name,
    unimogModel: formData.unimogModel,
    about: formData.about,
    location: formData.location,
    website: formData.website,
    avatarUrl: formData.avatarUrl,
    vehiclePhotoUrl: formData.vehiclePhotoUrl,
    useVehiclePhotoAsProfile: formData.useVehiclePhotoAsProfile || false // Ensure it's always a boolean
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Profile</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={togglePreview}
          className="gap-1"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Hide Preview</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Show Preview</span>
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {showPreview ? (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Profile Preview</h3>
            <ProfilePreview previewData={previewData} />
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={togglePreview}
              >
                Back to Editing
              </Button>
            </div>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
