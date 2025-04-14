
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderActions } from './HeaderActions';
import { useHeaderAuth } from '@/hooks/use-header-auth';

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
  
  // Use our custom hook to handle auth logic
  const { isLoggedIn, user, handleSignOut } = useHeaderAuth({
    isLoggedInProp: propIsLoggedIn,
    userProp: propUser
  });

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // For development purposes, make admin button always visible on homepage for logged in users
  const isAdmin = process.env.NODE_ENV === 'development' && isLoggedIn;
  
  // Function to handle navigation to admin dashboard
  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-military-green shadow-md border-b border-white/10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileMenu 
            isLoggedIn={isLoggedIn} 
            onLogout={handleSignOut} 
            onLogin={() => Promise.resolve(navigate('/login'))}
          />
          <Logo />
        </div>
        
        {/* Modern dropdown navigation for logged in users */}
        <HeaderNavigation 
          isLoggedIn={isLoggedIn}
          isHomePage={isHomePage}
        />
        
        <HeaderActions
          isLoggedIn={isLoggedIn}
          isHomePage={isHomePage}
          isAdmin={isAdmin}
          user={user}
          onAdminClick={handleAdminClick}
          onSignOut={handleSignOut}
        />
      </div>
    </header>
  );
};

export default Header;
