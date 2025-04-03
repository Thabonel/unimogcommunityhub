
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserMenu } from './UserMenu';
import { LoginButton } from './LoginButton';
import { User } from '@supabase/supabase-js';

interface HeaderAuthActionsProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
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
      if (isHomePage) {
        navigate('/', { replace: true });
      } else {
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
  
  if (!isLoggedIn) {
    return (
      <LoginButton 
        variant={isHomePage ? "default" : "ghost"} 
        className={isHomePage ? "" : "text-unimog-700 dark:text-unimog-300"} 
        onClick={handleLogin}
      />
    );
  }
  
  if (user) {
    return <UserMenu user={user} onLogout={handleLogout} isAdmin={isAdmin} />;
  }
  
  return null;
};
