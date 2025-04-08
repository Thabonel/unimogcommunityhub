
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import WebhookReceiver from '@/components/webhook/WebhookReceiver';
import BotpressIntegrationGuide from '@/components/webhook/BotpressIntegrationGuide';
import TripMap from '@/components/map/TripMap';
import BotpressChat from '@/components/chatbot/BotpressChat';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Map, MessageCircle, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const TravelPlanner = () => {
  const { tripData, getWebhookUrl, processTripData } = useTripWebhook();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [showDeveloperPanel, setShowDeveloperPanel] = useState<boolean>(false);
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  
  // The Botpress config URL
  const STEVE_CONFIG_URL = "https://files.bpcontent.cloud/2025/04/08/02/20250408023207-JFBWGDMP.json";

  // Show the map when trip data is received
  useEffect(() => {
    if (tripData) {
      setMapVisible(true);
      
      // Automatically switch to the map tab when new trip data is received
      setActiveTab("map");
    }
  }, [tripData]);

  const handleTripReceived = (newTripData: TripData) => {
    // Switch to the map tab when new trip data is received
    setActiveTab("map");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col gap-6">
          {/* Hidden webhook receiver component */}
          <div className="hidden">
            <WebhookReceiver onTripReceived={handleTripReceived} />
          </div>
          
          {/* Page Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Plan Your Unimog Adventure</h1>
            <p className="text-muted-foreground">
              Chat with Steve, your personal travel planner, to create the perfect off-road journey
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Chat Column */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Chat with Steve</CardTitle>
                </div>
                <CardDescription>
                  Tell Steve where you want to go and he'll plan your adventure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <BotpressChat 
                    configUrl={STEVE_CONFIG_URL}
                    height="100%"
                    width="100%"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Map Column */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Adventure Map</CardTitle>
                </div>
                <CardDescription>
                  {tripData 
                    ? `${tripData.title}: ${tripData.startLocation} to ${tripData.endLocation}`
                    : "Steve will visualize your trip here after you chat with him"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 relative">
                {!mapVisible && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 backdrop-blur-sm z-10 p-6 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Trip Planned Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Chat with Steve to plan your Unimog adventure, and your route will appear here
                    </p>
                    <Button onClick={() => setActiveTab("chat")}>
                      Start Planning
                    </Button>
                  </div>
                )}
                <div className="h-[600px]">
                  <TripMap 
                    tripData={tripData} 
                    height="100%" 
                    width="100%" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Developer Panel Toggle */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeveloperPanel(!showDeveloperPanel)}
              className="w-full flex items-center justify-between"
            >
              {showDeveloperPanel ? "Hide Developer Panel" : "Show Developer Panel"}
              {showDeveloperPanel ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>
          
          {/* Developer Panel */}
          {showDeveloperPanel && (
            <div className="border rounded-lg p-6">
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">Developer Tools</Badge>
                <h2 className="text-xl font-bold">Webhook Integration</h2>
                <p className="text-muted-foreground">
                  Configure Steve (Botpress) to send trip data to the map
                </p>
              </div>
              
              <BotpressIntegrationGuide webhookUrl={getWebhookUrl()} />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Test the Integration</h3>
                <Button 
                  variant="secondary" 
                  onClick={() => {
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
                    
                    processTripData(testData);
                  }}
                >
                  Test with Sample Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TravelPlanner;
