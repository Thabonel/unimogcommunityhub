
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/toast';
import { useAuth } from '@/contexts/AuthContext';
import { createMasterUserProfile, isMasterUser } from './use-master-profile';
import { UserProfileData } from './types';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMaster, setIsMaster] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const fetchInProgress = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  
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
    // Skip if no user or fetch already in progress
    if (!user || fetchInProgress.current) return;
    
    try {
      fetchInProgress.current = true;
      setIsLoading(true);
      console.log("useProfileData: Fetching profile for user:", user.email);
      
      // Check if the user is a master user
      const masterUser = isMasterUser(user);
      setIsMaster(masterUser);
      
      // If master user, directly create the profile without database query
      if (masterUser) {
        console.log("Master user detected, creating default profile");
        const masterProfile = await createMasterUserProfile(user);
        setUserData(masterProfile);
        setIsLoading(false);
        fetchInProgress.current = false;
        return;
      }
      
      // Add a timeout to prevent infinite loading
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000) as unknown as number;
      
      // Fetch the user profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (error) {
        console.error('Error fetching profile:', error);
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
      // Only show the toast once
      if (!loadingTimeout) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [user, toast, loadingTimeout]);

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
      
      // Show the timeout toast only once
      toast({
        title: "Profile partially loaded",
        description: "Some profile information could not be loaded completely",
        variant: "warning",
      });
    }
  }, [loadingTimeout, isLoading, user, toast]);

  // Load profile when user changes - with cleanup for the timeout
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setIsLoading(false); // Stop loading if no user
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [user, fetchUserProfile]);

  return {
    userData,
    setUserData,
    isLoading,
    isMasterUser: isMaster,
    fetchUserProfile
  };
};
