
import { useProfileData } from './use-profile-data';
import { useProfileEdit } from './use-profile-edit';
import { ProfileHookResult } from './types';

export const useProfile = (): ProfileHookResult => {
  const {
    userData,
    setUserData,
    isLoading,
    isMasterUser,
    fetchUserProfile
  } = useProfileData();
  
  const {
    isEditing,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate
  } = useProfileEdit(userData, setUserData, isMasterUser, fetchUserProfile);
  
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

export * from './types';
