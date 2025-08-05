import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WebhookReceiver from '@/components/webhook/WebhookReceiver';
import TripMap from '@/components/trips/TripMap';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Settings, Plus, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MapErrorBoundary from '@/components/map/MapErrorBoundary';
import { toast } from 'sonner';

const TravelPlanner = () => {
  const { tripData, getWebhookUrl } = useTripWebhook();
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleTripReceived = (newTripData: TripData) => {
    // Trip data received
    toast.success("Trip data received!");
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
        
        {/* Map View */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Trip Map</CardTitle>
            <CardDescription>
              {tripData 
                ? `Viewing: ${tripData.title} - ${tripData.startLocation} to ${tripData.endLocation}`
                : "No trip planned yet. Use the map to plan your adventure!"}
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
      </div>
    </Layout>
  );
};

export default TravelPlanner;