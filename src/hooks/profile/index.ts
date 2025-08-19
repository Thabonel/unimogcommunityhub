
import { useState } from 'react';
import { useProfileData } from './use-profile-data';
import { useProfileEdit } from './use-profile-edit';
import { UserProfileData } from './types';

export const useProfile = () => {
  const {
    userData,
    setUserData,
    isLoading,
    isMasterUser,
    fetchUserProfile,
    error
  } = useProfileData();

  const {
    isEditing,
    isSaving,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate
  } = useProfileEdit(
    userData,
    setUserData,
    isMasterUser,
    fetchUserProfile
  );

  return {
    userData,
    isLoading,
    isEditing,
    isSaving,
    isMasterUser,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate,
    error,
    fetchUserProfile
  };
};

export type { UserProfileData };
