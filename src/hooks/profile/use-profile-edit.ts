
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
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
  
  // Buckets already exist in Supabase, no need to create them
  
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
      // Modify the profile data to exclude fields that don't exist in the profiles table
      const profileData = {
        id: user.id,
        full_name: formData.name,
        display_name: formData.name,
        bio: formData.about,
        location: formData.location,
        unimog_model: formData.unimogModel,
        avatar_url: formData.avatarUrl,
        // Always save vehicle_photo_url as null if empty/undefined
        vehicle_photo_url: formData.vehiclePhotoUrl && formData.vehiclePhotoUrl.trim() !== '' 
          ? formData.vehiclePhotoUrl 
          : null,
        // Explicitly convert to boolean to ensure consistent data storage
        use_vehicle_photo_as_profile: formData.useVehiclePhotoAsProfile === true,
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
      
      // Update local state with the correct avatar URL logic
      const updatedData = {
        ...formData,
        // Ensure the avatar URL respects the vehicle photo preference
        avatarUrl: (formData.useVehiclePhotoAsProfile && formData.vehiclePhotoUrl) 
          ? formData.vehiclePhotoUrl 
          : formData.avatarUrl
      };
      
      setUserData(updatedData);
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
