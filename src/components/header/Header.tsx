import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { signInWithOAuth } from '@/utils/authUtils';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { MainNavigation } from './MainNavigation';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { LoginButton } from './LoginButton';

interface HeaderProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
  };
}

const Header = ({ isLoggedIn: propIsLoggedIn, user: propUser }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();
  const { toast } = useToast();
  
  // Use the authenticated user state instead of props if available
  const isLoggedIn = authUser !== null || propIsLoggedIn;
  const user = authUser ? {
    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    avatarUrl: authUser.user_metadata?.avatar_url,
    unimogModel: propUser?.unimogModel
  } : propUser;

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  const handleLogin = async () => {
    try {
      await signInWithOAuth('google');
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
        
        {isLoggedIn && (
          <div className="hidden md:block">
            <MainNavigation isActive={isActive} />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Search form - only show on user pages (when logged in or not on homepage) */}
          {(!isHomePage || isLoggedIn) && (
            <SearchBar className="hidden sm:flex" />
          )}
          
          {isLoggedIn && user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <div className="flex items-center gap-2">
              {isHomePage ? (
                <LoginButton />
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-unimog-700 dark:text-unimog-300 flex items-center gap-2">
                      <LogIn size={18} />
                      <span className="font-medium">Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
