
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TripSummary from '../TripSummary';
import TripMap from '../TripMap';
import TerrainTabContent from './TerrainTabContent';
import WeatherTabContent from './WeatherTabContent';
import { type TripPlan } from '@/hooks/use-trip-planning';

interface TripDetailsTabsProps {
  trip: TripPlan;
}

const TripDetailsTabs = ({ trip }: TripDetailsTabsProps) => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <Tabs defaultValue="details" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="terrain">Terrain</TabsTrigger>
        <TabsTrigger value="weather">Weather</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4 pt-4">
        <TripSummary 
          startLocation={trip.startLocation}
          endLocation={trip.endLocation}
          distance={trip.distance}
          duration={trip.duration}
          difficulty={trip.difficulty}
          terrainTypes={trip.terrainTypes}
        />
        
        <div className="mt-4">
          <TripMap 
            startLocation={trip.startLocation} 
            endLocation={trip.endLocation}
            waypoints={trip.waypoints} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="terrain" className="pt-4">
        <TerrainTabContent terrainTypes={trip.terrainTypes} />
      </TabsContent>
      
      <TabsContent value="weather" className="pt-4">
        <WeatherTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default TripDetailsTabs;
