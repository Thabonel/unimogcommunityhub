
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMasterUser, setIsMasterUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    unimogModel: '',
    unimogSeries: '',
    unimogSpecs: null,
    unimogFeatures: null,
    about: '',
    location: '',
    website: '',
    joinDate: '',
    vehiclePhotoUrl: '',
    useVehiclePhotoAsProfile: false
  });
  
  // Fetch user profile data from Supabase - memoized to prevent multiple calls
  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log("useProfile: Fetching profile for user:", user.email);
      
      // Check if the user is a master user (email is master@development.com)
      const isMaster = user.email === 'master@development.com';
      setIsMasterUser(isMaster);
      
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000);
      
      // Fetch the user profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // If it's the master user and we couldn't find a profile, create default data
        if (isMaster) {
          console.log("Creating default profile data for master user");
          const defaultData = {
            name: 'Development Master',
            email: user.email || 'master@development.com',
            avatarUrl: '',
            unimogModel: 'U1700L (Development)',
            unimogSeries: 'Development Series',
            unimogSpecs: null,
            unimogFeatures: null,
            about: 'This is the development master account for testing purposes.',
            location: 'Development Environment',
            website: '',
            joinDate: new Date().toISOString().split('T')[0],
            vehiclePhotoUrl: '',
            useVehiclePhotoAsProfile: false
          };
          
          setUserData(defaultData);
          
          // Create a profile for the master user
          try {
            await supabase.from('profiles').upsert({
              id: user.id,
              full_name: 'Development Master',
              display_name: 'Development Master',
              bio: 'Development account for testing',
              location: 'Development Environment',
              unimog_model: 'U1700L (Development)',
              unimog_series: 'Development Series',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              email: user.email
            });
            console.log("Created profile for master user");
          } catch (err) {
            console.error("Error creating profile for master user:", err);
          }
          
          setIsLoading(false);
          return;
        }
        
        throw error;
      }
      
      if (profile) {
        console.log("Profile data loaded:", profile);
        setUserData({
          name: profile.full_name || profile.display_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatarUrl: profile.avatar_url || '',
          unimogModel: profile.unimog_model || '',
          unimogSeries: profile.unimog_series || '',
          unimogSpecs: profile.unimog_specs || null,
          unimogFeatures: profile.unimog_features || null,
          about: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '', 
          joinDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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
  }, [user, toast]);

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setIsLoading(false); // Stop loading if no user
    }
  }, [user, fetchUserProfile]);

  // If loading timeout is reached, provide default data
  useEffect(() => {
    if (loadingTimeout && isLoading && user) {
      console.log("Loading timeout reached, using default profile data");
      setIsLoading(false);
      
      // Create minimal default data if loading times out
      setUserData(prevData => ({
        ...prevData,
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
        joinDate: new Date().toISOString().split('T')[0]
      }));
      
      toast({
        title: "Profile partially loaded",
        description: "Some profile information could not be loaded completely",
        variant: "warning",
      });
    }
  }, [loadingTimeout, isLoading, user, toast]);
  
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
      await fetchUserProfile();
      
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
