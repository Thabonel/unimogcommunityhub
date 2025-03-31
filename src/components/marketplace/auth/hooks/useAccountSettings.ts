
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
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
        // In a real implementation, fetch the user profile from the database
        // For now, we'll use the user metadata
        setFullName(user.user_metadata?.full_name || '');
        setDisplayName(user.user_metadata?.display_name || '');
        setLocation(user.user_metadata?.location || '');
        
        // Check if email is verified
        const { data, error } = await supabase.auth.getUser();
        if (!error && data.user) {
          setEmailVerified(
            data.user.email_confirmed_at !== null || 
            data.user.app_metadata?.provider !== 'email'
          );
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdatingProfile(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          display_name: displayName,
          location: location,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
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
  };
};
