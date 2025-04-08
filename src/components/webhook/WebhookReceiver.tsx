
import React, { useEffect, useState } from 'react';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clipboard, CheckCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface WebhookReceiverProps {
  onTripReceived?: (tripData: TripData) => void;
}

const WebhookReceiver: React.FC<WebhookReceiverProps> = ({ onTripReceived }) => {
  const { getWebhookUrl, processTripData, endpointId } = useTripWebhook();
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState(false);
  
  const webhookUrl = getWebhookUrl();
  
  // Handle receiving message from Botpress through the window
  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      // Verify origin for security (in production you'd want to restrict this)
      // For demo purposes we're accepting all origins
      
      try {
        const data = event.data;
        
        // Make sure it's our expected format
        if (data && data.type === 'botpress-trip-data') {
          const tripData = data.tripData as TripData;
          processTripData(tripData);
          
          if (onTripReceived) {
            onTripReceived(tripData);
          }
          
          // Send confirmation back if possible
          if (event.source && 'postMessage' in event.source) {
            (event.source as Window).postMessage({ type: 'trip-data-received', success: true }, '*');
          }
        }
      } catch (err) {
        console.error('Error processing webhook message:', err);
      }
    }

    window.addEventListener('message', receiveMessage);
    return () => window.removeEventListener('message', receiveMessage);
  }, [processTripData, onTripReceived]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success('Webhook URL copied to clipboard');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestData = () => {
    setTestMode(true);
    
    // Sample test data
    const testData: TripData = {
      id: 'test-trip-123',
      title: 'Test Trip to Black Forest',
      description: 'A sample trip route to test the map integration',
      startLocation: 'Stuttgart, Germany',
      endLocation: 'Freiburg, Germany',
      startCoordinates: [9.1829, 48.7758],
      endCoordinates: [7.8522, 47.9990],
      locations: [
        {
          name: 'Stuttgart Starting Point',
          coordinates: [9.1829, 48.7758],
          type: 'start',
          description: 'Begin your journey here'
        },
        {
          name: 'Campsite Schwarzwald',
          coordinates: [8.4037, 48.5300],
          type: 'campsite',
          description: 'Beautiful campsite in the woods'
        },
        {
          name: 'Fuel Station',
          coordinates: [7.9500, 48.2800],
          type: 'fuel',
          description: '24 hour fuel service'
        },
        {
          name: 'Black Forest Waterfall',
          coordinates: [8.1000, 48.1500],
          type: 'poi',
          description: 'Amazing waterfall viewpoint'
        },
        {
          name: 'Freiburg Destination',
          coordinates: [7.8522, 47.9990],
          type: 'end',
          description: 'End of your journey'
        }
      ],
      routeCoordinates: [
        [9.1829, 48.7758],
        [8.9500, 48.6500],
        [8.7037, 48.5800],
        [8.4037, 48.5300],
        [8.2000, 48.3500],
        [7.9500, 48.2800],
        [8.1000, 48.1500],
        [7.9500, 48.0500],
        [7.8522, 47.9990]
      ]
    };
    
    // Process the test data
    processTripData(testData);
    
    // Reset test mode flag
    setTimeout(() => setTestMode(false), 1000);
  };
  
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clipboard className="mr-2 h-5 w-5" />
          Trip Webhook Connector
        </CardTitle>
        <CardDescription>
          Use this webhook URL to connect Steve (Botpress) with your map
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            value={webhookUrl}
            readOnly
            className="font-mono text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="flex-shrink-0"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>To connect your chatbot with the map:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Copy the webhook URL above</li>
            <li>Configure your Botpress chatbot to send trip data to this URL</li>
            <li>The map will automatically update when trip data is received</li>
          </ol>
        </div>
        
        <div className="mt-4">
          <Badge variant={testMode ? "default" : "outline"} className="mb-2">
            Test Mode
          </Badge>
          <p className="text-sm text-muted-foreground">
            Don't have Botpress configured yet? Use the button below to test with sample data.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="secondary" 
          onClick={handleTestData}
          disabled={testMode}
        >
          Test with Sample Data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhookReceiver;
