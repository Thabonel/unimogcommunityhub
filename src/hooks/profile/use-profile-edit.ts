
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileEdit = (
  userData: any,
  setUserData: (data: any) => void,
  isMasterUser: boolean,
  refreshProfile: () => Promise<void>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleProfileUpdate = async (formData: any) => {
    if (!user) return;
    
    try {
      // If email was changed and user is master, update the email in auth
      if (isMasterUser && formData.email !== userData.email) {
        // Update email in Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
          email: formData.email
        });
        
        if (authError) throw authError;
        
        toast({
          title: "Email updated",
          description: "You will receive a confirmation email at your new address",
        });
      }
      
      // Update profile in Supabase
      const profileData = {
        id: user.id,
        full_name: formData.name,
        display_name: formData.name,
        bio: formData.about,
        location: formData.location,
        unimog_model: formData.unimogModel,
        unimog_series: formData.unimogSeries,
        unimog_specs: formData.unimogSpecs,
        unimog_features: formData.unimogFeatures,
        avatar_url: formData.avatarUrl,
        vehicle_photo_url: formData.vehiclePhotoUrl,
        use_vehicle_photo_as_profile: formData.useVehiclePhotoAsProfile,
        website: formData.website,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);
      
      if (error) throw error;
      
      // Update local state
      setUserData(formData);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      
      // Refresh the profile data
      await refreshProfile();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };
  
  return {
    isEditing,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate
  };
};
