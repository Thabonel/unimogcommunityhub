
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Code } from 'lucide-react';

interface BotpressInstructionsProps {
  webhookUrl: string;
}

const BotpressInstructions: React.FC<BotpressInstructionsProps> = ({ webhookUrl }) => {
  const exampleCode = `
// Example code to trigger a webhook from your chatbot
function triggerWebhook(tripData) {
  // Make sure your tripData follows the required format
  fetch("${webhookUrl}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tripData: tripData
    })
  })
  .then(response => response.json())
  .then(data => console.log("Webhook sent successfully:", data))
  .catch(error => console.error("Error sending webhook:", error));
}
`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Instructions</CardTitle>
        <CardDescription>
          How to connect your Botpress chatbot to this application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Code className="h-4 w-4" />
          <AlertTitle>Integration Guide</AlertTitle>
          <AlertDescription>
            Configure your Botpress chatbot to send trip information to the webhook URL shown below.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <h3 className="font-medium">Step 1: Configure the webhook in Botpress</h3>
          <p className="text-sm text-muted-foreground">
            In your Botpress studio, add a new "HTTP Request" card to your flow when you want to send trip data.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Step 2: Use the webhook URL</h3>
          <p className="text-sm text-muted-foreground">
            Set the URL to: <code className="bg-muted px-1 py-0.5 rounded">{webhookUrl}</code>
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Step 3: Format the data properly</h3>
          <p className="text-sm text-muted-foreground">
            Make sure to format your trip data according to the required schema:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
            {JSON.stringify({
              id: "trip-123",
              title: "Mountain Adventure",
              description: "A weekend trip through the mountains",
              startLocation: "Munich",
              endLocation: "Stuttgart",
              startCoordinates: [11.5819, 48.1351],
              endCoordinates: [9.1829, 48.7758],
              locations: [
                {
                  name: "Start: Munich",
                  coordinates: [11.5819, 48.1351],
                  type: "start",
                  description: "Starting point"
                },
                {
                  name: "Campsite: Black Forest",
                  coordinates: [10.3333, 48.5000],
                  type: "campsite",
                  description: "Overnight stop"
                },
                {
                  name: "End: Stuttgart",
                  coordinates: [9.1829, 48.7758],
                  type: "end",
                  description: "Final destination"
                }
              ]
            }, null, 2)}
          </pre>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Example Code</h3>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
            {exampleCode}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotpressInstructions;
