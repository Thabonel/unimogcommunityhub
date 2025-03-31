import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';

export const useAccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Add state variables for the user profile data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if 2FA is enabled (this would be fetched from a real backend)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // This would be fetched from a real backend
  const [emailVerified, setEmailVerified] = useState(false);

  // Initialize form fields from user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoadingProfile(true);
        
        // Fetch the full user profile from the database
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Set the user profile
        setUserProfile(data);
        
        // Set form field values from the profile
        setFullName(data.full_name || '');
        setDisplayName(data.display_name || '');
        setLocation(data.location || '');
        
        // Check if email is verified
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (!userError && userData.user) {
          setEmailVerified(
            userData.user.email_confirmed_at !== null || 
            userData.user.app_metadata?.provider !== 'email'
          );
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "Could not load your profile. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdatingProfile(true);
    
    try {
      // Update Supabase profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          display_name: displayName,
          location: location,
        })
        .eq('id', user?.id);
      
      if (profileError) throw profileError;
      
      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          display_name: displayName,
          location: location,
        }
      });
      
      if (authError) throw authError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      // Update local profile state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          full_name: fullName,
          display_name: displayName,
          location: location,
        });
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    isChangingPassword,
    setIsChangingPassword,
    fullName,
    setFullName,
    displayName,
    setDisplayName,
    location,
    setLocation,
    isUpdatingProfile,
    setIsUpdatingProfile,
    twoFactorEnabled,
    emailVerified,
    user,
    handleProfileUpdate,
    userProfile,
    isLoadingProfile
  };
};
