
import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AdminSetup from './admin/AdminSetup';
import { useToast } from '@/hooks/use-toast';
import { useAdminStatus } from '@/hooks/use-admin-status';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();  // Using isLoading instead of loading
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isLoading: isCheckingAdmin, error } = useAdminStatus(user);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Show error toast if admin check fails
  useEffect(() => {
    if (error && requireAdmin) {
      toast({
        title: "Admin verification error",
        description: "Failed to verify admin privileges. Using fallback mode.",
        variant: "destructive",
      });
    }
  }, [error, requireAdmin, toast]);

  // Add timeout safety - if auth check takes longer than 10s, show error
  useEffect(() => {
    if (isLoading || (requireAdmin && isCheckingAdmin)) {
      const timeout = setTimeout(() => {
        setHasTimedOut(true);
        console.error('ProtectedRoute: Auth check timed out after 10 seconds');
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isLoading, isCheckingAdmin, requireAdmin]);

  // Show loading while checking auth state
  if ((isLoading || (requireAdmin && isCheckingAdmin)) && !hasTimedOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we verify your session.
          </p>
          {requireAdmin && (
            <p className="text-muted-foreground mt-2">Checking admin privileges...</p>
          )}
        </div>
      </div>
    );
  }

  // Show timeout error with manual refresh option
  if (hasTimedOut) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Session Timeout</h2>
          <p className="text-muted-foreground mb-6">
            We're having trouble verifying your session. This might be due to a slow network connection.
          </p>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              Refresh Page
            </Button>
            <Button onClick={() => window.location.href = '/login'} variant="outline" className="w-full">
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access based on actual database status

  // For all environments, allow admin access if isAdmin is true
  const hasAdminAccess = requireAdmin ? isAdmin : true;

  // Show admin setup page if admin access is required but user doesn't have admin role
  if (requireAdmin && !hasAdminAccess) {
    console.log("ProtectedRoute: User does not have admin role, showing AdminSetup");
    return <AdminSetup />;
  }

  // Render children if all conditions are met
  console.log("ProtectedRoute: All conditions met, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
