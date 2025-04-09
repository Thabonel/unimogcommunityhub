
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
  className?: string;
}

/**
 * Component that handles receiving webhook data for trip planning
 * Can be hidden in the UI but still processes webhook events
 */
const WebhookReceiver: React.FC<WebhookReceiverProps> = ({ 
  onTripReceived,
  className = ""
}) => {
  const { getWebhookUrl, processTripData } = useTripWebhook();
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
            // Create a safely cloneable confirmation object
            const safeConfirmation = {
              type: 'trip-data-received',
              success: true,
              timestamp: Date.now()
            };
            
            // Use try/catch to handle any postMessage errors
            try {
              (event.source as Window).postMessage(safeConfirmation, '*');
            } catch (postError) {
              console.error('Error sending postMessage confirmation:', postError);
            }
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

  // Only render content if the className is not empty
  if (!className) {
    return null;
  }

  return (
    <Card className={className}>
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
      </CardContent>
    </Card>
  );
};

export default WebhookReceiver;
