
import { useState, useEffect } from 'react';
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

  // Initialize the profile fetcher with configuration
  const { fetchUserProfile: fetchProfile, fetchAttempts } = useProfileFetcher(user, {
    maxAttempts: 3,
    timeoutMs: 5000
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

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      console.log("User changed, loading profile for:", user.email);
      // Reset fetch attempts when user changes
      fetchAttempts.current = 0;
      fetchProfile(
        setIsLoading,
        setUserData,
        setIsMaster,
        setError,
        setLoadingTimeout
      );
    } else {
      setIsLoading(false); // Stop loading if no user
    }
  }, [user, fetchProfile]);

  return {
    userData,
    setUserData,
    isLoading,
    isMasterUser: isMaster,
    fetchUserProfile,
    error
  };
};
