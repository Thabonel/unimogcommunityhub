
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserMenu } from './UserMenu';
import { LoginButton } from './LoginButton';

interface HeaderAuthActionsProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
    email?: string;
  };
  isHomePage: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

export const HeaderAuthActions = ({ 
  isLoggedIn, 
  user, 
  isHomePage, 
  isAdmin,
  signOut 
}: HeaderAuthActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Ensure we have a valid user name from the authenticated user
  const safeUser = user ? {
    ...user,
    // Use email prefix if name is not available or is "Alex Johnson" for test accounts
    name: (!user.name || (user.name === "Alex Johnson" && user.email && !user.email.includes("alex"))) 
      ? (user.email?.split('@')[0] || 'User') 
      : user.name
  } : undefined;
  
  const handleLogin = async () => {
    try {
      navigate('/login');
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
      // Force navigate to login page regardless of current page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!isLoggedIn) {
    return (
      <LoginButton 
        variant={isHomePage ? "default" : "ghost"} 
        className={isHomePage ? "" : "text-unimog-700 dark:text-unimog-300"} 
        onClick={handleLogin}
      />
    );
  }
  
  if (safeUser) {
    return <UserMenu user={safeUser} onLogout={handleLogout} isAdmin={isAdmin} />;
  }
  
  return null;
};
