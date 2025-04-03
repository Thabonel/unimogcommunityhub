
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { MainNavigation } from './MainNavigation';
import { SearchBar } from './SearchBar';
import { HeaderAuthActions } from './HeaderAuthActions';
import { AdminButton } from './AdminButton';
import { LearnButton } from './LearnButton';
import { useAdminStatus } from '@/hooks/use-admin-status';

interface HeaderProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
}

const Header = ({ isLoggedIn: propIsLoggedIn, user: propUser }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get auth context safely with fallback to props
  const authContext = (() => {
    try {
      return useAuth();
    } catch (error) {
      console.log("Auth context not available, using props");
      return { 
        user: null, 
        loading: false,
        signOut: async () => { 
          console.log("Mock signOut"); 
          // Return a resolved promise to match the expected Promise<void> type
          return Promise.resolve();
        }
      };
    }
  })();

  const { user: authUser, signOut } = authContext;
  
  // Use the authenticated user state instead of props if available
  const isLoggedIn = authUser !== null || propIsLoggedIn;
  const user = authUser ? {
    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    avatarUrl: authUser.user_metadata?.avatar_url,
    unimogModel: propUser?.unimogModel,
    vehiclePhotoUrl: propUser?.vehiclePhotoUrl,
    useVehiclePhotoAsProfile: propUser?.useVehiclePhotoAsProfile
  } : propUser;

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Check if user has admin rights using our new hook
  // In development mode, we'll consider all authenticated users as admins
  const { isAdmin } = useAdminStatus(authUser);
  
  // For development purposes, make admin button always visible on homepage
  const showAdminButton = isLoggedIn && isHomePage && (isAdmin || process.env.NODE_ENV === 'development');
  
  // Function to handle navigation to admin dashboard
  const handleAdminClick = () => {
    console.log("Admin button clicked, attempting to navigate to /admin");
    navigate('/admin');
    console.log("Navigation function called");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileMenu 
            isLoggedIn={isLoggedIn} 
            onLogout={signOut} 
            onLogin={() => Promise.resolve(navigate('/login'))}
          />
          <Logo />
        </div>
        
        {/* Only show navigation when logged in AND not on homepage */}
        {isLoggedIn && !isHomePage && (
          <div className="hidden md:block">
            <MainNavigation isActive={(path) => location.pathname === path || location.pathname.startsWith(`${path}/`)} />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Search form - only show when not on homepage */}
          {!isHomePage && <SearchBar className="hidden sm:flex" />}

          {/* Learn About Unimogs button - show only on homepage */}
          {isHomePage && <LearnButton />}

          {/* Admin Button - show for admins or in development mode */}
          {showAdminButton && <AdminButton onClick={handleAdminClick} />}
          
          {/* Auth actions (login button or user menu) */}
          <HeaderAuthActions 
            isLoggedIn={isLoggedIn}
            user={user}
            isHomePage={isHomePage}
            isAdmin={isAdmin}
            signOut={signOut}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
