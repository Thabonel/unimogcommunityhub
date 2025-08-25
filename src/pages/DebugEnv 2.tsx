import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const DebugEnv = () => {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [connectionError, setConnectionError] = useState<string>('');
  const [profilesTest, setProfilesTest] = useState<'testing' | 'success' | 'error'>('testing');
  const [profilesError, setProfilesError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    // Test Supabase connection
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setConnectionStatus('error');
        setConnectionError(error.message);
      } else {
        setConnectionStatus('success');
      }
    } catch (err: any) {
      setConnectionStatus('error');
      setConnectionError(err.message || 'Unknown error');
    }

    // Test database access
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        setProfilesTest('error');
        setProfilesError(error.message);
      } else {
        setProfilesTest('success');
      }
    } catch (err: any) {
      setProfilesTest('error');
      setProfilesError(err.message || 'Unknown error');
    }
  };

  const getEnvVar = (key: string) => {
    const value = import.meta.env[key];
    if (!value) return { value: 'NOT SET', status: 'error' };
    if (value.includes('YOUR_') || value.includes('your_')) return { value: 'PLACEHOLDER', status: 'warning' };
    
    // Mask the value for security
    const masked = value.length > 20 
      ? value.substring(0, 15) + '...' + value.substring(value.length - 5)
      : value;
    return { value: masked, status: 'success' };
  };

  const envVars = [
    { key: 'VITE_SUPABASE_URL', label: 'Supabase URL', required: true },
    { key: 'VITE_SUPABASE_ANON_KEY', label: 'Supabase Anon Key', required: true },
    { key: 'VITE_MAPBOX_ACCESS_TOKEN', label: 'Mapbox Token', required: true },
    { key: 'VITE_OPENAI_API_KEY', label: 'OpenAI API Key', required: false },
    { key: 'VITE_SUPABASE_PROJECT_ID', label: 'Supabase Project ID', required: false },
  ];

  return (
    <Layout isLoggedIn={!!user}>
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin: Environment Variables Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This page helps diagnose environment variable issues. Remove this page before production deployment.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-3">Environment Variables:</h3>
              {envVars.map(({ key, label, required }) => {
                const { value, status } = getEnvVar(key);
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-100 rounded">
                    <div className="flex items-center gap-2">
                      {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {status === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                      {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                      <span className="font-medium">{label}</span>
                      {required && <span className="text-xs text-red-500">*required</span>}
                    </div>
                    <code className={`text-sm ${
                      status === 'success' ? 'text-green-700' :
                      status === 'warning' ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {value}
                    </code>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 mt-6">
              <h3 className="font-semibold text-lg mb-3">Connection Tests:</h3>
              
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                <div className="flex items-center gap-2">
                  {connectionStatus === 'testing' && <AlertCircle className="h-5 w-5 text-gray-500 animate-pulse" />}
                  {connectionStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {connectionStatus === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                  <span className="font-medium">Supabase Auth Connection</span>
                </div>
                <span className={`text-sm ${
                  connectionStatus === 'success' ? 'text-green-700' :
                  connectionStatus === 'error' ? 'text-red-700' :
                  'text-gray-500'
                }`}>
                  {connectionStatus === 'testing' ? 'Testing...' :
                   connectionStatus === 'success' ? 'Connected' :
                   connectionError}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                <div className="flex items-center gap-2">
                  {profilesTest === 'testing' && <AlertCircle className="h-5 w-5 text-gray-500 animate-pulse" />}
                  {profilesTest === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {profilesTest === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                  <span className="font-medium">Database Access (profiles table)</span>
                </div>
                <span className={`text-sm ${
                  profilesTest === 'success' ? 'text-green-700' :
                  profilesTest === 'error' ? 'text-red-700' :
                  'text-gray-500'
                }`}>
                  {profilesTest === 'testing' ? 'Testing...' :
                   profilesTest === 'success' ? 'Accessible' :
                   profilesError}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">Debugging Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Check if all required variables show green checkmarks</li>
                <li>If "NOT SET", add the variable in Netlify dashboard</li>
                <li>If "PLACEHOLDER", update with actual values</li>
                <li>After updating, trigger a new deploy in Netlify</li>
                <li>Clear browser cache and try again</li>
              </ol>
            </div>

            <Button onClick={() => window.location.reload()} className="mt-4">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
};

export default DebugEnv;