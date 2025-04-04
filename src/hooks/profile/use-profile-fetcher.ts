
import { useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/toast';
import { UserProfileData } from './types';
import { createMasterUserProfile, isMasterUser } from './use-master-profile';
import { setupLoadingTimeout, clearLoadingTimeout, mapProfileToUserData } from './profile-data-utils';

export interface ProfileFetcherOptions {
  maxAttempts?: number;
  timeoutMs?: number;
}

export interface ProfileFetcherResult {
  fetchUserProfile: (setIsLoading: (loading: boolean) => void, 
                    setUserData: (data: UserProfileData) => void,
                    setIsMaster: (isMaster: boolean) => void,
                    setError: (error: string | null) => void,
                    setLoadingTimeout: (timeout: boolean) => void) => Promise<void>;
  fetchInProgress: React.RefObject<boolean>;
  fetchAttempts: React.RefObject<number>;
}

export const useProfileFetcher = (
  user: any,
  options: ProfileFetcherOptions = {}
): ProfileFetcherResult => {
  const { toast } = useToast();
  const fetchInProgress = useRef(false);
  const fetchAttempts = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const maxAttempts = options.maxAttempts || 3;
  const timeoutMs = options.timeoutMs || 5000;

  // Fetch user profile data from Supabase - memoized to prevent multiple calls
  const fetchUserProfile = useCallback(async (
    setIsLoading: (loading: boolean) => void,
    setUserData: (data: UserProfileData) => void,
    setIsMaster: (isMaster: boolean) => void,
    setError: (error: string | null) => void,
    setLoadingTimeout: (timeout: boolean) => void
  ) => {
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
        try {
          const masterProfile = await createMasterUserProfile(user);
          console.log("Master profile created successfully:", masterProfile);
          setUserData(masterProfile);
          setIsLoading(false);
          fetchInProgress.current = false;
          return;
        } catch (masterError) {
          console.error("Error creating master profile:", masterError);
          // Fall through to regular profile logic as a fallback
        }
      }
      
      // Add a timeout to prevent infinite loading
      setupLoadingTimeout(timeoutMs, timeoutRef, setLoadingTimeout);
      
      // Fetch the user profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      clearLoadingTimeout(timeoutRef);
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      if (profile) {
        console.log("Profile data loaded:", profile);
        setUserData(mapProfileToUserData(profile, user.email));
      } else {
        // If no profile found, create minimal default data
        console.log("No profile found, using minimal default data");
        setUserData(prevData => ({
          ...prevData,
          name: user.email?.split('@')[0] || 'User',
          email: user.email || '',
          joinDate: new Date().toISOString().split('T')[0]
        }));
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      // Only set the error message and show toast on the final attempt
      if (fetchAttempts.current >= maxAttempts) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching profile';
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } else {
        // Retry after a short delay
        setTimeout(() => {
          fetchInProgress.current = false;
          fetchUserProfile(setIsLoading, setUserData, setIsMaster, setError, setLoadingTimeout);
        }, 1000);
      }
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [user, toast, maxAttempts, timeoutMs]);

  return {
    fetchUserProfile,
    fetchInProgress,
    fetchAttempts
  };
};
