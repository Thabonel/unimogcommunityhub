
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
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const fetchAttempts = useRef(0);
  const maxAttempts = 3;
  
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
    // Skip if no user or fetch already in progress or max attempts reached
    if (!user || fetchInProgress.current) return;
    
    if (fetchAttempts.current >= maxAttempts) {
      setIsLoading(false);
      setError(`Failed to load profile after ${maxAttempts} attempts`);
      return;
    }
    
    fetchAttempts.current += 1;
    
    try {
      console.log(`Profile fetch attempt ${fetchAttempts.current} for user:`, user.email);
      fetchInProgress.current = true;
      setIsLoading(true);
      setError(null);
      
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
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      // Only set the error message and show toast on the final attempt
      if (fetchAttempts.current >= maxAttempts) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching profile';
        setError(errorMessage);
        
        if (!loadingTimeout) {
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        }
      } else {
        // Retry after a short delay
        setTimeout(() => {
          fetchInProgress.current = false;
          fetchUserProfile();
        }, 1000);
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
      // Reset fetch attempts when user changes
      fetchAttempts.current = 0;
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
    fetchUserProfile,
    error
  };
};
