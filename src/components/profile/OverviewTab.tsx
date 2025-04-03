
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkIsAdmin } from '@/utils/adminUtils';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function OverviewTab() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const adminStatus = await checkIsAdmin(user.id);
        setIsAdmin(adminStatus);
      }
    };

    verifyAdmin();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <CardDescription>
                View your recent posts, comments and reactions
              </CardDescription>
              <Link to="/profile?tab=activity">
                <Button className="mt-4" variant="outline">
                  View Activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Your Vehicles</h3>
              <CardDescription>
                Manage your Unimog vehicles and maintenance records
              </CardDescription>
              <Link to="/profile?tab=vehicles">
                <Button className="mt-4" variant="outline">
                  Manage Vehicles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isAdmin && (
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-purple-900 dark:text-purple-300 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Admin Access
                </h3>
                <CardDescription>
                  You have administrator privileges on this platform
                </CardDescription>
              </div>
              <Link to="/admin" className="mt-4 sm:mt-0">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OverviewTab;
