
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clipboard, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BotpressInstructionsProps {
  webhookUrl: string;
}

const BotpressInstructions: React.FC<BotpressInstructionsProps> = ({ webhookUrl }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('javascript');
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 3000);
  };
  
  // JavaScript code example
  const javascriptCode = `// Function to send trip data to your app
function sendTripDataToApp(tripData) {
  // Option 1: Send via postMessage (if in iframe)
  window.parent.postMessage({
    type: 'botpress-trip-data',
    tripData: tripData
  }, '*');
  
  // Option 2: Send via webhook
  fetch('${webhookUrl}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tripData)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
}

// Example trip data structure
const tripData = {
  id: 'trip-123',
  title: 'Black Forest Adventure',
  description: 'A scenic trip through the Black Forest',
  startLocation: 'Stuttgart',
  endLocation: 'Freiburg',
  startCoordinates: [9.1829, 48.7758],
  endCoordinates: [7.8522, 47.9990],
  locations: [
    {
      name: 'Stuttgart',
      coordinates: [9.1829, 48.7758],
      type: 'start',
      description: 'Starting point'
    },
    {
      name: 'Black Forest Campsite',
      coordinates: [8.4037, 48.5300],
      type: 'campsite',
      description: 'Beautiful campsite in the woods'
    },
    {
      name: 'Freiburg',
      coordinates: [7.8522, 47.9990],
      type: 'end',
      description: 'Final destination'
    }
  ]
};

// Call this function when you want to send the trip data
sendTripDataToApp(tripData);`;

  // Python code example
  const pythonCode = `# Assuming this is used in a Botpress action in a code node
import requests
import json

# Function to send trip data to your app
def send_trip_data_to_app(trip_data):
    webhook_url = "${webhookUrl}"
    
    try:
        response = requests.post(
            webhook_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(trip_data)
        )
        response.raise_for_status()
        print("Trip data sent successfully:", response.json())
        return True
    except Exception as e:
        print("Error sending trip data:", str(e))
        return False

# Example trip data structure
trip_data = {
    "id": "trip-123",
    "title": "Black Forest Adventure",
    "description": "A scenic trip through the Black Forest",
    "startLocation": "Stuttgart",
    "endLocation": "Freiburg",
    "startCoordinates": [9.1829, 48.7758],
    "endCoordinates": [7.8522, 47.9990],
    "locations": [
        {
            "name": "Stuttgart",
            "coordinates": [9.1829, 48.7758],
            "type": "start",
            "description": "Starting point"
        },
        {
            "name": "Black Forest Campsite",
            "coordinates": [8.4037, 48.5300],
            "type": "campsite",
            "description": "Beautiful campsite in the woods"
        },
        {
            "name": "Freiburg",
            "coordinates": [7.8522, 47.9990],
            "type": "end",
            "description": "Final destination"
        }
    ]
}

# Call this function when you want to send the trip data
send_trip_data_to_app(trip_data)`;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Botpress Integration Instructions</CardTitle>
        <CardDescription>
          Follow these steps to connect Steve (your Botpress chatbot) with the map interface
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">1. In your Botpress Studio</h3>
          <p className="text-sm text-muted-foreground">
            Add a Code Action in your Botpress workflow where you want to send trip data
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">2. Use one of the code examples below</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="javascript" className="mt-2">
              <div className="relative">
                <pre className="p-4 rounded-md bg-muted text-xs overflow-x-auto">
                  <code className="language-javascript">{javascriptCode}</code>
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(javascriptCode)}
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="python" className="mt-2">
              <div className="relative">
                <pre className="p-4 rounded-md bg-muted text-xs overflow-x-auto">
                  <code className="language-python">{pythonCode}</code>
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(pythonCode)}
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">3. Test your integration</h3>
          <p className="text-sm text-muted-foreground">
            After implementing the code, test by creating a trip in Botpress. The data should appear on your map.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => window.open('https://botpress.com/docs', '_blank')}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Botpress Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BotpressInstructions;
