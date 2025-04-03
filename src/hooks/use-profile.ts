
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMasterUser, setIsMasterUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    unimogModel: '',
    about: '',
    location: '',
    website: '',
    joinDate: '',
    vehiclePhotoUrl: '',
    useVehiclePhotoAsProfile: false
  });
  
  // Fetch user profile data from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Check if the user is a master user (email is master@development.com)
        setIsMasterUser(user.email === 'master@development.com');
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (profile) {
          setUserData({
            name: profile.full_name || profile.display_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatarUrl: profile.avatar_url || '',
            unimogModel: profile.unimog_model || '',
            about: profile.bio || '',
            location: profile.location || '',
            website: '', // Add this field to profiles table if needed
            joinDate: new Date(profile.created_at).toISOString().split('T')[0],
            vehiclePhotoUrl: profile.vehicle_photo_url || '',
            useVehiclePhotoAsProfile: profile.use_vehicle_photo_as_profile || false
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);
  
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
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          bio: formData.about,
          location: formData.location,
          unimog_model: formData.unimogModel,
          avatar_url: formData.avatarUrl,
          vehicle_photo_url: formData.vehiclePhotoUrl,
          use_vehicle_photo_as_profile: formData.useVehiclePhotoAsProfile
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUserData(formData);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
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
    userData,
    isLoading,
    isEditing,
    isMasterUser,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate
  };
};
