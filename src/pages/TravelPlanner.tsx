
import React from 'react';
import Layout from '@/components/Layout';
import SteveTravelPlanner from '@/components/chatbot/SteveTravelPlanner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const TravelPlanner = () => {
  return (
    <Layout>
      <div className="container py-8 mx-auto">
        <Card className="mb-6">
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
      </div>
    </Layout>
  );
};

export default TravelPlanner;
