
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStatus } from '@/hooks/use-admin-status';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { MainNavigation } from './MainNavigation';
import { SearchBar } from './SearchBar';
import { HeaderAuthActions } from './HeaderAuthActions';
import { AdminButton } from './AdminButton';
import { LearnButton } from './LearnButton';

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
          return Promise.resolve({ success: true });
        }
      };
    }
  })();

  const { user: authUser, signOut } = authContext;
  
  // Use the authenticated user state instead of props if available
  const isLoggedIn = authUser !== null || propIsLoggedIn;
  const user = authUser ? {
    name: propUser?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    avatarUrl: propUser?.avatarUrl || authUser.user_metadata?.avatar_url,
    unimogModel: propUser?.unimogModel,
    vehiclePhotoUrl: propUser?.vehiclePhotoUrl,
    useVehiclePhotoAsProfile: propUser?.useVehiclePhotoAsProfile,
    email: authUser.email
  } : propUser;

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Use the admin status hook to check if the user is an admin
  const { isAdmin } = useAdminStatus(authUser);
  
  // Function to handle navigation to admin dashboard
  const handleAdminClick = () => {
    navigate('/admin');
  };

  // Create a wrapped signOut function that returns void for compatibility
  const handleSignOut = async () => {
    await signOut();
    return;
  };

  // Determine if admin features should be visible
  // For special case, also check if the user's email is master@development.com
  const isMasterAdmin = authUser?.email === 'master@development.com';
  const showAdminButton = isLoggedIn && isHomePage && (isAdmin || process.env.NODE_ENV === 'development');
  const hasAdminAccess = isAdmin || process.env.NODE_ENV === 'development' || isMasterAdmin;

  return (
    <header className="sticky top-0 z-50 w-full bg-military-green shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileMenu 
            isLoggedIn={isLoggedIn} 
            onLogout={handleSignOut} 
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
            isAdmin={hasAdminAccess}
            signOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
