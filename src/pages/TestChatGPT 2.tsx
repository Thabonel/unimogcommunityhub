import React from 'react';
import Layout from '@/components/Layout';
import { EnhancedBarryChat } from '@/components/knowledge/EnhancedBarryChat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { OPENAI_CONFIG } from '@/config/env';
import { useUserLocation } from '@/hooks/use-user-location';

const TestChatGPT = () => {
  const { location } = useUserLocation();
  const isConfigured = !!OPENAI_CONFIG.apiKey;
  const keyPreview = isConfigured 
    ? `${OPENAI_CONFIG.apiKey.substring(0, 7)}...${OPENAI_CONFIG.apiKey.substring(OPENAI_CONFIG.apiKey.length - 4)}`
    : 'Not configured';

  return (
    <Layout>
      <div className="container py-8 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">ChatGPT Integration Test</h1>
        
        <div className="grid gap-6 mb-8">
          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Status</CardTitle>
              <CardDescription>
                Verify that the ChatGPT integration is properly configured
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {isConfigured ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">OpenAI API Key</p>
                  <p className="text-sm text-muted-foreground font-mono">{keyPreview}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Model</p>
                  <p className="text-sm text-muted-foreground">{OPENAI_CONFIG.model}</p>
                </div>
              </div>

              {!isConfigured && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    To configure ChatGPT:
                    <ol className="list-decimal ml-5 mt-2">
                      <li>Copy <code className="text-sm bg-muted px-1 py-0.5 rounded">.env.example</code> to <code className="text-sm bg-muted px-1 py-0.5 rounded">.env</code></li>
                      <li>Add your OpenAI API key to <code className="text-sm bg-muted px-1 py-0.5 rounded">VITE_OPENAI_API_KEY</code></li>
                      <li>Restart the development server</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Test Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Barry AI Mechanic</CardTitle>
              <CardDescription>
                Use the chat below to test the ChatGPT integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="font-medium">Try asking Barry:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>"What tools do I need for portal maintenance?"</li>
                  <li>"How do I diagnose a hydraulic leak?"</li>
                  <li>"What's the correct tire pressure for rock crawling?"</li>
                  <li>"Explain the Unimog's torque tube system"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barry Chat Component */}
        <Card>
          <CardHeader>
            <CardTitle>Barry Chat Test (Enhanced Version)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EnhancedBarryChat className="h-[500px]" location={location} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestChatGPT;