
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from './types';
import { createMinimalUserData } from './profile-data-utils';
import { useProfileFetcher } from './use-profile-fetcher';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMaster, setIsMaster] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);
  const userEmailRef = useRef<string | undefined>(undefined);
  
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
    useVehiclePhotoAsProfile: false,
    coordinates: {
      latitude: 40.0,
      longitude: -99.5
    }
  });

  // Initialize the profile fetcher with configuration - reduced attempts to prevent loops
  const { fetchUserProfile: fetchProfile, fetchAttempts } = useProfileFetcher(user, {
    maxAttempts: 1, // Only try once to prevent memory issues
    timeoutMs: 3000 // Shorter timeout
  });

  // Create a wrapper around the fetcher for easier use
  const fetchUserProfile = async () => {
    // Reset fetch attempts when manually fetching
    fetchAttempts.current = 0;
    return fetchProfile(
      setIsLoading,
      setUserData,
      setIsMaster,
      setError,
      setLoadingTimeout
    );
  };
  
  // Effect for handling loading timeout
  useEffect(() => {
    if (loadingTimeout && isLoading && user) {
      console.log("Loading timeout reached, using default profile data");
      setIsLoading(false);
      
      // Create minimal default data if loading times out
      setUserData(prevData => createMinimalUserData(prevData, user.email));
      
      // Show the timeout toast only once
      toast({
        title: "Profile partially loaded",
        description: "Some profile information could not be loaded completely",
        variant: "warning",
      });
    }
  }, [loadingTimeout, isLoading, user, toast]);

  // Load profile when user changes - THIS IS THE FIXED EFFECT TO PREVENT INFINITE LOOP
  useEffect(() => {
    // Skip if no user or if fetch is already in progress
    if (!user) {
      setIsLoading(false); // Stop loading if no user
      initialLoadDone.current = false; // Reset for next time
      userEmailRef.current = undefined; // Reset the email ref
      return;
    }
    
    // Only fetch profile if the user email has changed or initial load hasn't been done
    if (!initialLoadDone.current || userEmailRef.current !== user.email) {
      console.log("User changed, loading profile for:", user.email);
      // Update the email ref to the current user's email
      userEmailRef.current = user.email;
      // Mark that we've done the initial load
      initialLoadDone.current = true;
      // Reset fetch attempts when user changes
      fetchAttempts.current = 0;
      
      fetchProfile(
        setIsLoading,
        setUserData,
        setIsMaster,
        setError,
        setLoadingTimeout
      );
    }
  }, [user]); // Only depend on user - fetchProfile doesn't need to be here

  return {
    userData,
    setUserData,
    isLoading,
    isMasterUser: isMaster,
    fetchUserProfile,
    error
  };
};
