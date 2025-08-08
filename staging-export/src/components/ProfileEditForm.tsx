
import { useState, useEffect } from 'react';
import ProfileBasicInfoFields from './profile/ProfileBasicInfoFields';
import ProfilePhotoFields from './profile/ProfilePhotoFields';
import ProfileFormLayout from './profile/form/ProfileFormLayout';
import ProfilePreviewWrapper from './profile/form/ProfilePreviewWrapper';
import ProfileFormActions from './profile/form/ProfileFormActions';
import { ensureStorageBuckets } from '@/lib/supabase';

interface ProfileEditFormProps {
  initialData: {
    name: string;
    email: string;
    unimogModel: string | null;
    unimogSeries?: string | null;
    unimogSpecs?: Record<string, any> | null;
    unimogFeatures?: string[] | null;
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
  isSaving?: boolean;
}

const ProfileEditForm = ({ 
  initialData, 
  onCancel, 
  onSubmit, 
  isMasterUser = false,
  isSaving = false
}: ProfileEditFormProps) => {
  const [formData, setFormData] = useState({
    ...initialData,
    unimogSeries: initialData.unimogSeries || null,
    unimogSpecs: initialData.unimogSpecs || null,
    unimogFeatures: initialData.unimogFeatures || null,
    // Explicitly convert to boolean
    useVehiclePhotoAsProfile: initialData.useVehiclePhotoAsProfile === true,
    // Ensure empty string for undefined values
    vehiclePhotoUrl: initialData.vehiclePhotoUrl || ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  
  // Ensure storage buckets exist when component mounts
  useEffect(() => {
    console.log("ProfileEditForm mounted, ensuring storage buckets exist");
    // Call the function to ensure buckets exist and add a 1s delay for potential race conditions
    setTimeout(() => {
      ensureStorageBuckets().catch(console.error);
    }, 1000);
  }, []);
  
  console.log("ProfileEditForm initialized with:", {
    initialVehiclePhoto: initialData.vehiclePhotoUrl,
    initialUseAsProfile: initialData.useVehiclePhotoAsProfile,
    formVehiclePhoto: formData.vehiclePhotoUrl,
    formUseAsProfile: formData.useVehiclePhotoAsProfile
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleUnimogModelChange = (
    model: string, 
    series: string, 
    specs: Record<string, any>, 
    features: string[]
  ) => {
    setFormData({
      ...formData,
      unimogModel: model,
      unimogSeries: series,
      unimogSpecs: specs,
      unimogFeatures: features
    });
  };
  
  const handleAvatarChange = (url: string) => {
    setFormData({
      ...formData,
      avatarUrl: url
    });
  };
  
  const handleVehiclePhotoChange = (url: string) => {
    console.log("Vehicle photo changed to:", url);
    // When vehicle photo is removed, also disable using it as profile
    const newState = {
      ...formData,
      vehiclePhotoUrl: url,
    };
    
    // If vehicle photo is removed or empty, disable using it as profile
    if (!url || url.trim() === '') {
      newState.useVehiclePhotoAsProfile = false;
    }
    
    setFormData(newState);
  };
  
  const handleUseVehiclePhotoToggle = (checked: boolean) => {
    console.log("Use vehicle photo as profile toggled:", checked);
    setFormData({
      ...formData,
      useVehiclePhotoAsProfile: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
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
    useVehiclePhotoAsProfile: formData.useVehiclePhotoAsProfile
  };
  
  return (
    <ProfileFormLayout
      showPreview={showPreview}
      onTogglePreview={togglePreview}
    >
      {showPreview ? (
        <ProfilePreviewWrapper 
          previewData={previewData} 
          onBackToEditing={togglePreview}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left column - Basic profile information */}
            <ProfileBasicInfoFields 
              formData={formData}
              isMasterUser={isMasterUser}
              onChange={handleInputChange}
              onModelChange={handleUnimogModelChange}
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
          
          <ProfileFormActions 
            onCancel={onCancel}
            isSaving={isSaving}
          />
        </form>
      )}
    </ProfileFormLayout>
  );
};

export default ProfileEditForm;
