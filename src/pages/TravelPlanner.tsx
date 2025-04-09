
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SteveTravelPlanner from '@/components/chatbot/SteveTravelPlanner';
import WebhookReceiver from '@/components/webhook/WebhookReceiver';
import BotpressInstructions from '@/components/webhook/BotpressInstructions';
import TripMap from '@/components/map/TripMap';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TravelPlanner = () => {
  const { tripData, getWebhookUrl } = useTripWebhook();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const handleTripReceived = (newTripData: TripData) => {
    // Automatically switch to the map tab when new trip data is received
    setActiveTab("map");
  };

  return (
    <Layout>
      <div className="container py-8 mx-auto">
        <WebhookReceiver onTripReceived={handleTripReceived} />
        
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full flex items-center justify-between"
          >
            {showInstructions ? "Hide Developer Instructions" : "Show Developer Instructions"}
            {showInstructions ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
          
          {showInstructions && (
            <div className="mt-4">
              <BotpressInstructions webhookUrl={getWebhookUrl()} />
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Talk to Steve</TabsTrigger>
            <TabsTrigger value="map">View Trip Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Steve - Your Travel Planner</CardTitle>
                <CardDescription>
                  Chat with Steve to get personalized travel recommendations and trip planning assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <SteveTravelPlanner position="relative" height="100%" width="100%" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Trip Map</CardTitle>
                <CardDescription>
                  {tripData 
                    ? `Viewing: ${tripData.title} - ${tripData.startLocation} to ${tripData.endLocation}`
                    : "No trip planned yet. Chat with Steve to plan your adventure!"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <TripMap 
                    tripData={tripData} 
                    height="100%" 
                    width="100%" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TravelPlanner;
