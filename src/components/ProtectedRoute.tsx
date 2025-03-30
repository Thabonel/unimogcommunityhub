
import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { checkIsAdmin } from '@/utils/adminUtils';
import { Loader2 } from 'lucide-react';
import AdminSetup from './admin/AdminSetup';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(requireAdmin);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (requireAdmin && user) {
        try {
          const adminStatus = await checkIsAdmin(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      }
    };

    verifyAdminStatus();
  }, [user, requireAdmin]);

  // Show loading while checking auth state
  if (loading || (requireAdmin && isCheckingAdmin)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your session.</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show admin setup page if admin access is required but user doesn't have admin role
  if (requireAdmin && isAdmin === false) {
    return <AdminSetup />;
  }

  // Render children if all conditions are met
  return <>{children}</>;
};

export default ProtectedRoute;
