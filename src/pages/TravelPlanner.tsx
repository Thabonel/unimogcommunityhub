
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SteveTravelPlanner from '@/components/chatbot/SteveTravelPlanner';
import WebhookReceiver from '@/components/webhook/WebhookReceiver';
import BotpressInstructions from '@/components/webhook/BotpressInstructions';
import TripMap from '@/components/trips/TripMap';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Settings, Plus, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MapErrorBoundary from '@/components/map/MapErrorBoundary';
import { toast } from 'sonner';

const TravelPlanner = () => {
  const { tripData, getWebhookUrl } = useTripWebhook();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleTripReceived = (newTripData: TripData) => {
    // Automatically switch to the map tab when new trip data is received
    setActiveTab("map");
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleCreateTrip = () => {
    // This would be implemented later to create a new trip
    toast.success("Trip creation functionality will be implemented soon.");
  };

  return (
    <Layout>
      <div className="container py-8 mx-auto">
        <WebhookReceiver onTripReceived={handleTripReceived} />
        
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center space-x-1"
            >
              <span>Back to Dashboard</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex items-center space-x-1"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              {showInstructions ? "Hide Developer Instructions" : "Show Developer Instructions"}
              {showInstructions ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
            
            <Button 
              variant="default" 
              className="bg-primary flex items-center space-x-1"
              onClick={handleCreateTrip}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>New Trip</span>
            </Button>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/webhook-setup">
              <Settings className="h-4 w-4 mr-1" />
              Configure Webhook
            </Link>
          </Button>
        </div>
        
        {showInstructions && (
          <div className="mt-4 mb-6">
            <BotpressInstructions webhookUrl={getWebhookUrl()} />
          </div>
        )}
        
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
                  <MapErrorBoundary>
                    <TripMap 
                      startLocation={tripData?.startLocation}
                      endLocation={tripData?.endLocation}
                      waypoints={tripData?.waypoints}
                    />
                  </MapErrorBoundary>
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
