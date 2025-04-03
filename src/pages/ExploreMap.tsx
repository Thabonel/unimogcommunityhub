
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import SimpleMap from '@/components/SimpleMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Map } from 'lucide-react';

const ExploreMap = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Map className="h-8 w-8 text-primary" />
              Unimog Explorer
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover and plan your off-road adventures with our interactive map
            </p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Compass className="mr-2 h-4 w-4" /> Plan New Route
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Popular Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 hover:bg-accent rounded cursor-pointer">Alpine Loop, Colorado</li>
                <li className="p-2 hover:bg-accent rounded cursor-pointer">Moab, Utah</li>
                <li className="p-2 hover:bg-accent rounded cursor-pointer">Black Bear Pass, Colorado</li>
                <li className="p-2 hover:bg-accent rounded cursor-pointer">Rubicon Trail, California</li>
                <li className="p-2 hover:bg-accent rounded cursor-pointer">White Rim Trail, Utah</li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="md:col-span-3">
            <SimpleMap height="600px" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreMap;
