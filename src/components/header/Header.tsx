
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { MainNavigation } from './MainNavigation';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { LoginButton } from './LoginButton';
import { signInWithOAuth } from '@/utils/authUtils';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BookOpenCheck } from 'lucide-react';
import { checkIsAdmin } from '@/utils/adminUtils';
import { useState, useEffect } from 'react';

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
  const { user: authUser, signOut } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  
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

  // Check if user has admin rights
  useEffect(() => {
    const verifyAdmin = async () => {
      if (isLoggedIn && authUser) {
        const adminStatus = await checkIsAdmin(authUser.id);
        setIsAdmin(adminStatus);
      }
    };

    verifyAdmin();
  }, [isLoggedIn, authUser]);
  
  const handleLogin = async () => {
    try {
      // Use Facebook instead of Google for OAuth
      await signInWithOAuth('facebook');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Could not sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      if (isHomePage) {
        // If already on homepage, just refresh the state
        navigate('/', { replace: true });
      } else {
        // Otherwise navigate to homepage
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Function to handle navigation to admin dashboard
  const handleAdminClick = () => {
    navigate('/admin');
  };
  
  // Function to navigate to Learn About Unimogs page
  const handleLearnClick = () => {
    navigate('/learn-about-unimogs');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileMenu 
            isLoggedIn={isLoggedIn} 
            onLogout={handleLogout} 
            onLogin={handleLogin}
          />
          <Logo />
        </div>
        
        {/* Only show navigation when logged in AND not on homepage */}
        {isLoggedIn && !isHomePage && (
          <div className="hidden md:block">
            <MainNavigation isActive={isActive} />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Search form - only show when not on homepage */}
          {!isHomePage && (
            <SearchBar className="hidden sm:flex" />
          )}

          {/* Learn About Unimogs button - show only on homepage */}
          {isHomePage && (
            <Button 
              onClick={handleLearnClick}
              variant="outline"
              className="hidden md:flex items-center gap-2 text-unimog-700 hover:bg-unimog-50 dark:text-unimog-300"
            >
              <BookOpenCheck className="h-4 w-4" />
              Learn About Unimogs
            </Button>
          )}

          {/* Login button - show when not logged in */}
          {!isLoggedIn && (
            <LoginButton 
              variant={isHomePage ? "default" : "ghost"} 
              className={isHomePage ? "" : "text-unimog-700 dark:text-unimog-300"} 
              onClick={handleLogin}
            />
          )}

          {/* Admin Button - only show for admins on homepage */}
          {isLoggedIn && isAdmin && isHomePage && (
            <Button 
              onClick={handleAdminClick}
              variant="outline"
              className="flex items-center gap-2 bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </Button>
          )}
          
          {/* User menu - only show when logged in */}
          {isLoggedIn && user && (
            <UserMenu user={user} onLogout={handleLogout} isAdmin={isAdmin} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
