/**
 * Authentication Diagnostic Panel Component
 * Provides UI for diagnosing and fixing "Invalid API key" errors
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Download,
  Wrench,
  Info
} from 'lucide-react';
import AuthDiagnostic, { DiagnosticResult } from '@/utils/auth-diagnostic';
import { toast } from '@/hooks/use-toast';

export const AuthDiagnosticPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const result = await AuthDiagnostic.runDiagnostics();
      setDiagnostic(result);
      
      if (result.status === 'healthy') {
        toast({
          title: "Authentication Healthy",
          description: "All authentication checks passed successfully",
        });
      } else if (result.status === 'warning') {
        toast({
          title: "Minor Issues Detected",
          description: "Some warnings found but authentication should work",
          variant: "default"
        });
      } else {
        toast({
          title: "Authentication Issues Found",
          description: "Critical errors detected. See recommendations below.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Diagnostic failed:', error);
      toast({
        title: "Diagnostic Failed",
        description: "Could not complete authentication diagnostics",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const attemptRecovery = async () => {
    setIsRecovering(true);
    try {
      const success = await AuthDiagnostic.attemptAutoRecovery();
      if (success) {
        toast({
          title: "Recovery Successful",
          description: "Authentication issues have been resolved. Please refresh the page.",
        });
        // Re-run diagnostics to show updated status
        await runDiagnostics();
      } else {
        toast({
          title: "Manual Intervention Required",
          description: "Automatic recovery was not successful. Please follow the recommendations.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Recovery failed:', error);
      toast({
        title: "Recovery Failed",
        description: "Could not automatically recover. Please try manual steps.",
        variant: "destructive"
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const downloadReport = async () => {
    try {
      const report = await AuthDiagnostic.generateReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `auth-diagnostic-${new Date().toISOString()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report Downloaded",
        description: "Diagnostic report saved to your downloads folder",
      });
    } catch (error) {
      console.error('Report generation failed:', error);
      toast({
        title: "Download Failed",
        description: "Could not generate diagnostic report",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error' | null) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'error' | null) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Authentication Diagnostics</CardTitle>
            {diagnostic && getStatusBadge(diagnostic.status)}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={downloadReport}
              disabled={!diagnostic}
            >
              <Download className="h-4 w-4 mr-1" />
              Report
            </Button>
            <Button
              size="sm"
              onClick={runDiagnostics}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Run Diagnostics
                </>
              )}
            </Button>
          </div>
        </div>
        <CardDescription>
          Diagnose and fix "Invalid API key" authentication errors
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!diagnostic && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Ready to Diagnose</AlertTitle>
            <AlertDescription>
              Click "Run Diagnostics" to check your authentication configuration and identify any issues.
            </AlertDescription>
          </Alert>
        )}

        {diagnostic && (
          <>
            {/* Check Results */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold mb-2">System Checks</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(diagnostic.checks).map(([check, passed]) => (
                  <div key={check} className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                    {passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm capitalize">
                      {check.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Errors */}
            {diagnostic.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Errors Found</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {diagnostic.errors.map((error, idx) => (
                      <li key={idx} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {diagnostic.warnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Warnings</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {diagnostic.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-yellow-700">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Recommendations */}
            {diagnostic.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Recommended Actions</h3>
                <div className="space-y-2">
                  {diagnostic.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-md bg-blue-50 border border-blue-200">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm text-blue-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recovery Button */}
            {diagnostic.status === 'error' && (
              <div className="pt-4">
                <Button
                  onClick={attemptRecovery}
                  disabled={isRecovering}
                  className="w-full"
                  variant="default"
                >
                  {isRecovering ? (
                    <>
                      <Wrench className="h-4 w-4 mr-2 animate-spin" />
                      Attempting Recovery...
                    </>
                  ) : (
                    <>
                      <Wrench className="h-4 w-4 mr-2" />
                      Attempt Automatic Recovery
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-semibold mb-2">If Issues Persist:</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Clear your browser cache and cookies</li>
            <li>Check Netlify environment variables are set correctly</li>
            <li>Verify Supabase API keys haven't been rotated</li>
            <li>Try accessing the site in an incognito window</li>
            <li>Contact support with the downloaded diagnostic report</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDiagnosticPanel;