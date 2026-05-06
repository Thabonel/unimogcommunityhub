import Layout from '@/components/Layout';
import { EnhancedBarryChat } from '@/components/knowledge/EnhancedBarryChat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserLocation } from '@/hooks/use-user-location';

const TestChatGPT = () => {
  const { location } = useUserLocation();

  return (
    <Layout>
      <div className="container py-8 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Barry AI Test</h1>

        <div className="grid gap-6 mb-8">
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