import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  User,
  Database
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { makeYourselfAdmin, checkIsAdmin } from '@/utils/adminUtils';

export function MakeAdminButton() {
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const checkCurrentStatus = async () => {
    setCheckingAdmin(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Not authenticated');
      }

      setUserInfo(user);

      // Check if user is admin
      const adminStatus = await checkIsAdmin(user.id);
      setIsAdmin(adminStatus);

      // Also check user_roles table directly
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (!rolesError) {
        console.log('Current user roles:', roles);
      }

      toast({
        title: adminStatus ? 'Admin access confirmed' : 'No admin access',
        description: adminStatus 
          ? 'You have admin privileges' 
          : 'You do not have admin privileges',
        variant: adminStatus ? 'default' : 'destructive'
      });

    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: 'Error checking status',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleMakeAdmin = async () => {
    setLoading(true);
    try {
      const success = await makeYourselfAdmin();
      
      if (success) {
        setIsAdmin(true);
        toast({
          title: 'Success!',
          description: 'You now have admin privileges. Refresh the page to access admin features.',
        });
      } else {
        throw new Error('Failed to grant admin privileges');
      }
    } catch (error) {
      console.error('Error making admin:', error);
      toast({
        title: 'Failed to grant admin privileges',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDatabaseUpdate = () => {
    const sqlScript = `
-- Run this in your Supabase SQL Editor to make yourself admin
-- Replace 'your-email@example.com' with your actual email address

DO $$
DECLARE
  user_id_var UUID;
BEGIN
  -- Get your user ID based on email
  SELECT id INTO user_id_var 
  FROM auth.users 
  WHERE email = '${userInfo?.email || 'your-email@example.com'}'
  LIMIT 1;
  
  IF user_id_var IS NOT NULL THEN
    -- Create user_roles table if it doesn't exist
    CREATE TABLE IF NOT EXISTS user_roles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, role)
    );
    
    -- Enable RLS if not already enabled
    ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
    
    -- Insert admin role (ON CONFLICT DO NOTHING prevents duplicates)
    INSERT INTO user_roles (user_id, role)
    VALUES (user_id_var, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role granted to user: % (email: %)', user_id_var, '${userInfo?.email}';
  ELSE
    RAISE NOTICE 'User not found with email: ${userInfo?.email}';
  END IF;
END $$;
    `;

    // Copy to clipboard
    navigator.clipboard.writeText(sqlScript).then(() => {
      toast({
        title: 'SQL Script Copied',
        description: 'The SQL script has been copied to your clipboard. Run it in Supabase SQL Editor.',
      });
    }).catch(() => {
      // Fallback - show the script in a popup
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Admin Setup SQL Script</title></head>
            <body>
              <h2>Run this in your Supabase SQL Editor:</h2>
              <pre style="background: #f5f5f5; padding: 15px; border: 1px solid #ddd; overflow-x: auto;">${sqlScript}</pre>
              <p><strong>Instructions:</strong></p>
              <ol>
                <li>Go to your Supabase Dashboard</li>
                <li>Navigate to SQL Editor</li>
                <li>Copy and paste the above script</li>
                <li>Click "RUN"</li>
                <li>Refresh this page and check admin status</li>
              </ol>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    });
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Access Setup
          </CardTitle>
          <CardDescription>
            Check your current admin status or grant yourself admin privileges to access 
            the manual processing features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Info */}
          {userInfo && (
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div><strong>Email:</strong> {userInfo.email}</div>
                  <div><strong>User ID:</strong> {userInfo.id}</div>
                  <div>
                    <strong>Admin Status:</strong> 
                    {isAdmin === null ? (
                      <span className="text-gray-500"> Not checked</span>
                    ) : isAdmin ? (
                      <span className="text-green-600 font-medium"> ✅ Admin</span>
                    ) : (
                      <span className="text-red-600 font-medium"> ❌ Not Admin</span>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={checkCurrentStatus}
              disabled={checkingAdmin}
              variant="outline"
            >
              {checkingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Check Admin Status
                </>
              )}
            </Button>

            {isAdmin === false && (
              <Button
                onClick={handleMakeAdmin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Granting Access...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Make Me Admin
                  </>
                )}
              </Button>
            )}

            {userInfo && (
              <Button
                onClick={handleDirectDatabaseUpdate}
                variant="secondary"
              >
                <Database className="mr-2 h-4 w-4" />
                Get SQL Script
              </Button>
            )}
          </div>

          {/* Success Message */}
          {isAdmin === true && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ✅ You have admin privileges! You can now access:
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Manual Processing at <code>/admin/manual-processing</code></li>
                  <li>Admin Dashboard at <code>/admin</code></li>
                  <li>All admin-only features</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>If the "Make Me Admin" button doesn't work:</strong>
              <ol className="mt-2 list-decimal list-inside space-y-1">
                <li>Click "Get SQL Script" to copy the database script</li>
                <li>Go to your Supabase Dashboard → SQL Editor</li>
                <li>Paste and run the script</li>
                <li>Come back and click "Check Admin Status"</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}