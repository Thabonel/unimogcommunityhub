
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

interface HeaderAuthProps {
  isLoggedInProp?: boolean;
  userProp?: {
    name: string;
    avatarUrl?: string;
    unimogModel?: string;
    vehiclePhotoUrl?: string;
    useVehiclePhotoAsProfile?: boolean;
  };
}

export function useHeaderAuth({ isLoggedInProp, userProp }: HeaderAuthProps = {}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get auth context safely with fallback to props
  const authContext = (() => {
    try {
      return useAuthContext();
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
  const isLoggedIn = authUser !== null || isLoggedInProp;
  const user = authUser ? {
    name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    avatarUrl: authUser.user_metadata?.avatar_url,
    unimogModel: userProp?.unimogModel,
    vehiclePhotoUrl: userProp?.vehiclePhotoUrl,
    useVehiclePhotoAsProfile: userProp?.useVehiclePhotoAsProfile,
    email: authUser.email
  } : userProp;

  // Create a wrapped signOut function that returns void for compatibility
  const handleSignOut = async () => {
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

  return {
    isLoggedIn,
    user,
    handleSignOut
  };
}
