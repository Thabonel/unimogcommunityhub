
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from './types';

export const useProfileEdit = (
  userData: UserProfileData,
  setUserData: (data: UserProfileData) => void,
  isMasterUser: boolean,
  refreshProfile: () => Promise<void>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleProfileUpdate = async (formData: UserProfileData) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      console.log("Saving profile data:", formData);
      console.log("Is master user:", isMasterUser);
      console.log("Vehicle photo URL:", formData.vehiclePhotoUrl);
      console.log("Use vehicle photo as profile:", formData.useVehiclePhotoAsProfile);
      
      // For master users, we just update the local state without database operations
      if (isMasterUser) {
        console.log("Updating master user profile locally");
        // Update local state
        setUserData(formData);
        setIsEditing(false);
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved locally (master user).",
        });
        
        return;
      }
      
      // If email was changed and user is not master, update the email in auth
      if (!isMasterUser && formData.email !== userData.email) {
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
      
      // Update profile in Supabase for regular users
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
        vehicle_photo_url: formData.vehiclePhotoUrl || null,
        use_vehicle_photo_as_profile: formData.useVehiclePhotoAsProfile === true,
        website: formData.website,
        updated_at: new Date().toISOString()
      };
      
      console.log("Sending update to profiles table:", profileData);
      
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);
      
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      console.log("Profile updated successfully");
      
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
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    isEditing,
    isSaving,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate
  };
};
