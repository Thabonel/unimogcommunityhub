
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
    fetchUserProfile
  } = useProfileData();

  const {
    isEditing,
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
    isMasterUser,
    handleEditClick,
    handleCancelEdit,
    handleProfileUpdate
  };
};

export type { UserProfileData };
