
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { LearnButton } from './LearnButton';
import { AdminButton } from './AdminButton';
import { HeaderAuthActions } from './HeaderAuthActions';

interface HeaderActionsProps {
  isLoggedIn: boolean;
  isHomePage: boolean;
  isAdmin: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
    email?: string;
  };
  onAdminClick: () => void;
  onSignOut: () => Promise<void>;
}

export const HeaderActions = ({ 
  isLoggedIn, 
  isHomePage, 
  isAdmin,
  user,
  onAdminClick,
  onSignOut
}: HeaderActionsProps) => {
  const showAdminButton = isLoggedIn && isHomePage && isAdmin;
  
  return (
    <div className="flex items-center gap-2">
      {/* Search form - only show when not on homepage */}
      {!isHomePage && <SearchBar className="hidden sm:flex" />}

      {/* Learn About Unimogs button - show only on homepage */}
      {isHomePage && <LearnButton />}

      {/* Admin Button - show for admins or in development mode */}
      {showAdminButton && <AdminButton onClick={onAdminClick} />}
      
      {/* Auth actions (login button or user menu) */}
      <HeaderAuthActions 
        isLoggedIn={isLoggedIn}
        user={user}
        isHomePage={isHomePage}
        isAdmin={isAdmin}
        signOut={onSignOut}
      />
    </div>
  );
};
