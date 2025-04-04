
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createMasterUserProfile, isMasterUser } from './use-master-profile';
import { UserProfileData } from './types';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMaster, setIsMaster] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // User data state with default values
  const [userData, setUserData] = useState<UserProfileData>({
    name: '',
    email: '',
    avatarUrl: '',
    unimogModel: '',
    unimogSeries: null,
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
      console.log("useProfileData: Fetching profile for user:", user.email);
      
      // Check if the user is a master user
      const masterUser = isMasterUser(user);
      setIsMaster(masterUser);
      
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
        if (masterUser) {
          const defaultData = await createMasterUserProfile(user);
          setUserData(defaultData);
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
          unimogSeries: profile.unimog_series || null,
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

  // Effect for handling loading timeout
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

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setIsLoading(false); // Stop loading if no user
    }
  }, [user, fetchUserProfile]);

  return {
    userData,
    setUserData,
    isLoading,
    isMasterUser: isMaster,
    fetchUserProfile
  };
};
