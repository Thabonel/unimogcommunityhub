
import React from 'react';
import Layout from '@/components/Layout';
import { useTripWebhook } from '@/hooks/use-trip-webhook';
import BotpressInstructions from '@/components/webhook/BotpressInstructions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const WebhookSetup = () => {
  const { getWebhookUrl } = useTripWebhook();
  
  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(getWebhookUrl());
    toast.success('Webhook URL copied to clipboard');
  };
  
  return (
    <Layout>
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/travel-planner">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Travel Planner
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Webhook Configuration</h1>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Your Webhook URL
                <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                Use this URL to connect your Botpress chatbot to your trip map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md font-mono text-sm break-all">
                {getWebhookUrl()}
              </div>
              <Button onClick={handleCopyWebhookUrl} className="mt-4">
                Copy Webhook URL
              </Button>
            </CardContent>
          </Card>
          
          <BotpressInstructions webhookUrl={getWebhookUrl()} />
        </div>
      </div>
    </Layout>
  );
};

export default WebhookSetup;
