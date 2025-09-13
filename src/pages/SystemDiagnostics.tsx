import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { testSupabaseConnection } from '@/utils/supabase-connection-test';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStatus } from '@/hooks/use-admin-status';
import Layout from '@/components/Layout';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: any;
}

export default function SystemDiagnostics() {
  const { user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminStatus(user);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  // Check environment variables (without exposing values)
  const checkEnvironmentVariables = (): DiagnosticResult[] => {
    const results: DiagnosticResult[] = [];
    
    // Check Supabase configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    
    results.push({
      name: 'Supabase URL',
      status: supabaseUrl ? 'success' : 'error',
      message: supabaseUrl 
        ? `Configured (${supabaseUrl.substring(0, 30)}...)`
        : 'Not configured',
      details: { hasValue: !!supabaseUrl }
    });
    
    results.push({
      name: 'Supabase Anon Key',
      status: supabaseAnonKey ? 'success' : 'error',
      message: supabaseAnonKey 
        ? `Configured (${supabaseAnonKey.substring(0, 20)}...)`
        : 'Not configured',
      details: { 
        hasValue: !!supabaseAnonKey,
        isJWT: supabaseAnonKey?.startsWith('eyJ')
      }
    });
    
    results.push({
      name: 'Supabase Project ID',
      status: supabaseProjectId ? 'success' : 'warning',
      message: supabaseProjectId 
        ? `Configured: ${supabaseProjectId}`
        : 'Optional - Not configured',
      details: { hasValue: !!supabaseProjectId }
    });
    
    // Check Mapbox
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    results.push({
      name: 'Mapbox Token',
      status: mapboxToken ? 'success' : 'warning',
      message: mapboxToken 
        ? `Configured (${mapboxToken.substring(0, 10)}...)`
        : 'Not configured - Maps will not work',
      details: { 
        hasValue: !!mapboxToken,
        isValid: mapboxToken?.startsWith('pk.')
      }
    });
    
    // Check OpenAI (should NOT be in client-side env)
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openaiKey) {
      results.push({
        name: 'OpenAI API Key',
        status: 'warning',
        message: 'Detected in client environment - Should be in Edge Functions only',
        details: { hasValue: true }
      });
    }
    
    return results;
  };

  // Test Supabase connection
  const testConnection = async (): Promise<DiagnosticResult[]> => {
    const results: DiagnosticResult[] = [];
    
    // Test basic connection
    const connectionTest = await testSupabaseConnection();
    results.push({
      name: 'Supabase Connection',
      status: connectionTest.success ? 'success' : 'error',
      message: connectionTest.message,
      details: connectionTest.details
    });
    
    // Test authentication
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      results.push({
        name: 'Authentication',
        status: error ? 'error' : session ? 'success' : 'warning',
        message: error 
          ? `Error: ${error.message}`
          : session 
            ? `Logged in as: ${session.user.email}`
            : 'Not logged in',
        details: { 
          hasSession: !!session,
          userId: session?.user?.id 
        }
      });
    } catch (error: any) {
      results.push({
        name: 'Authentication',
        status: 'error',
        message: `Failed: ${error.message}`,
        details: { error: error.message }
      });
    }
    
    // Test database access
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id')
        .limit(1);
      
      results.push({
        name: 'Database Access',
        status: error ? 'error' : 'success',
        message: error 
          ? `Error: ${error.message}`
          : 'Successfully accessed articles table',
        details: { 
          success: !error,
          error: error?.message 
        }
      });
    } catch (error: any) {
      results.push({
        name: 'Database Access',
        status: 'error',
        message: `Failed: ${error.message}`,
        details: { error: error.message }
      });
    }
    
    // Test storage access
    try {
      const { data, error } = await supabase
        .storage
        .from('article-images')
        .list('', { limit: 1 });
      
      results.push({
        name: 'Storage Access',
        status: error ? 'error' : 'success',
        message: error 
          ? `Error: ${error.message}`
          : 'Successfully accessed storage',
        details: { 
          success: !error,
          error: error?.message 
        }
      });
    } catch (error: any) {
      results.push({
        name: 'Storage Access',
        status: 'error',
        message: `Failed: ${error.message}`,
        details: { error: error.message }
      });
    }
    
    // Test Edge Functions (if logged in)
    if (user) {
      try {
        const { data, error } = await supabase.functions.invoke('chat-with-barry', {
          body: { messages: [{ role: 'user', content: 'test' }] }
        });
        
        results.push({
          name: 'Edge Functions',
          status: error ? 'error' : 'success',
          message: error 
            ? `Error: ${error.message}`
            : 'Successfully connected to Edge Functions',
          details: { 
            success: !error,
            error: error?.message 
          }
        });
      } catch (error: any) {
        results.push({
          name: 'Edge Functions',
          status: 'error',
          message: `Failed: ${error.message}`,
          details: { error: error.message }
        });
      }
    }
    
    return results;
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);
    
    // First check environment variables
    const envResults = checkEnvironmentVariables();
    setDiagnostics(envResults);
    
    // Then test connections
    const connectionResults = await testConnection();
    setDiagnostics([...envResults, ...connectionResults]);
    
    setLastRun(new Date());
    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run diagnostics on mount
    runDiagnostics();
  }, []);

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-4xl">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Access Denied: Admin privileges required to view system diagnostics.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-gray-500" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const variants: Record<DiagnosticResult['status'], 'default' | 'destructive' | 'secondary' | 'outline'> = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      loading: 'outline'
    };
    
    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const successCount = diagnostics.filter(d => d.status === 'success').length;
  const errorCount = diagnostics.filter(d => d.status === 'error').length;
  const warningCount = diagnostics.filter(d => d.status === 'warning').length;

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Diagnostics</CardTitle>
                <CardDescription>
                  Check system configuration and connectivity
                </CardDescription>
              </div>
              <Button 
                onClick={runDiagnostics} 
                disabled={isRunning}
                size="sm"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Diagnostics
                  </>
                )}
              </Button>
            </div>
            {lastRun && (
              <div className="text-sm text-muted-foreground mt-2">
                Last run: {lastRun.toLocaleTimeString()}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            {diagnostics.length > 0 && (
              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">{successCount} Passed</span>
                </div>
                {errorCount > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">{errorCount} Failed</span>
                  </div>
                )}
                {warningCount > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">{warningCount} Warnings</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Diagnostic Results */}
            <div className="space-y-3">
              {diagnostics.map((diagnostic, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {getStatusIcon(diagnostic.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{diagnostic.name}</span>
                      {getStatusBadge(diagnostic.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {diagnostic.message}
                    </div>
                    {diagnostic.details && import.meta.env.DEV && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">
                          Debug Info
                        </summary>
                        <pre className="text-xs mt-1 p-2 bg-gray-50 rounded overflow-auto">
                          {JSON.stringify(diagnostic.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Help Section */}
            {errorCount > 0 && (
              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Troubleshooting Steps:</div>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Ensure all environment variables are set in Netlify</li>
                    <li>Check that Supabase project is active and not paused</li>
                    <li>Verify API keys are correct and not expired</li>
                    <li>Check browser console for additional errors</li>
                    <li>Try clearing browser cache and cookies</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}