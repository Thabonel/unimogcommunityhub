import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testSupabaseConnection, ConnectionTestResult } from '@/utils/supabase-connection-test';
import { AlertCircle, CheckCircle, Database, Loader2 } from 'lucide-react';

export const SupabaseConnectionTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ConnectionTestResult[]>([]);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTest = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const testResults = await testSupabaseConnection();
      setResults(testResults);
      setLastRun(new Date());
    } catch (error) {
      console.error('Test execution error:', error);
      setResults([{
        test: 'Test Execution',
        success: false,
        message: 'Failed to execute connection tests'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Test
        </CardTitle>
        <CardDescription>
          Test read/write access to Supabase database and services
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runTest} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Connection Test'
            )}
          </Button>
          
          {lastRun && (
            <div className="text-sm text-muted-foreground">
              Last run: {lastRun.toLocaleString()}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Test Results:</span>
              <Badge variant={successCount === totalCount ? "default" : "destructive"}>
                {successCount}/{totalCount} passed
              </Badge>
            </div>

            <div className="grid gap-3">
              {results.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{result.test}</h4>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "PASS" : "FAIL"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {result.message}
                      </p>
                      
                      {result.details && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {successCount < totalCount && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Issues Detected</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Some tests failed. This may indicate missing database tables, 
                  insufficient permissions, or configuration issues.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};