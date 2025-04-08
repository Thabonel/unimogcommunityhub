
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BotpressIntegrationGuideProps {
  webhookUrl: string;
}

const BotpressIntegrationGuide: React.FC<BotpressIntegrationGuideProps> = ({ webhookUrl }) => {
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Steve Integration Guide
        </CardTitle>
        <CardDescription>
          Follow these steps to integrate Steve with the map visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">1. Set up a webhook in Botpress</h3>
          <p className="text-sm text-muted-foreground">
            Configure a webhook in your Botpress workflow to send trip data to this application
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">2. Use this webhook URL</h3>
          <div className="bg-muted p-2 rounded-md flex items-center justify-between">
            <code className="text-xs sm:text-sm font-mono truncate">{webhookUrl}</code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopyCode(webhookUrl)}
              className="ml-2 flex-shrink-0"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">3. Format your payload</h3>
          <p className="text-sm text-muted-foreground">
            The webhook expects JSON data in the following format:
          </p>
          <ScrollArea className="h-80 w-full rounded-md border">
            <pre className="p-4 text-xs font-mono">
{`{
  "type": "botpress-trip-data",
  "tripData": {
    "id": "trip-123",
    "title": "Mountain adventure",
    "description": "A beautiful mountain trail",
    "startLocation": "Stuttgart, Germany",
    "endLocation": "Munich, Germany",
    "startCoordinates": [9.1829, 48.7758],
    "endCoordinates": [11.5820, 48.1351],
    "locations": [
      {
        "name": "Stuttgart",
        "coordinates": [9.1829, 48.7758],
        "type": "start",
        "description": "Starting point"
      },
      {
        "name": "Scenic Viewpoint",
        "coordinates": [9.8, 48.9],
        "type": "poi",
        "description": "Beautiful mountain view"
      },
      {
        "name": "Munich",
        "coordinates": [11.5820, 48.1351],
        "type": "end",
        "description": "Final destination"
      }
    ],
    "routeCoordinates": [
      [9.1829, 48.7758],
      [9.5, 48.8],
      [9.8, 48.9],
      [10.2, 48.5],
      [11.0, 48.2],
      [11.5820, 48.1351]
    ]
  }
}`}
            </pre>
          </ScrollArea>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">4. Test with the sample data</h3>
          <p className="text-sm text-muted-foreground">
            You can use the "Test with Sample Data" button in the application to verify the integration works correctly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotpressIntegrationGuide;
