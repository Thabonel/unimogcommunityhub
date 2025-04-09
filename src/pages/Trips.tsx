
import React from 'react';
import Layout from '@/components/Layout';
import SteveTravelPlanner from '@/components/chatbot/SteveTravelPlanner';
import { useTripWebhook } from '@/hooks/use-trip-webhook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin } from 'lucide-react';
import TripMap from '@/components/map/TripMap';
import WebhookReceiver from '@/components/webhook/WebhookReceiver';

const Trips = () => {
  const { tripData, getWebhookUrl } = useTripWebhook();
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Trips</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Manage your Unimog adventures and plan new trips
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Steve Integration */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with Steve
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px]">
                  <SteveTravelPlanner height="100%" position="relative" />
                </div>
              </CardContent>
            </Card>
            
            {/* Map Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Trip Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TripMap tripData={tripData} height="500px" />
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => window.location.href = '/travel-planner'}>
              Go to Travel Planner
            </Button>
          </div>
        </div>
      </div>
      
      {/* Hidden component to handle webhook data */}
      <WebhookReceiver />
    </Layout>
  );
};

export default Trips;
