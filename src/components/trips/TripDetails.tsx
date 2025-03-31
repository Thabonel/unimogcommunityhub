
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { type TripPlan } from '@/hooks/use-trip-planning';
import TripDetailsHeader from './details/TripDetailsHeader';
import TripDetailsTabs from './details/TripDetailsTabs';
import TripDetailsFooter from './details/TripDetailsFooter';

interface TripDetailsProps {
  trip: TripPlan;
  onClose: () => void;
}

const TripDetails = ({ trip, onClose }: TripDetailsProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <TripDetailsHeader 
          title={trip.title} 
          difficulty={trip.difficulty} 
        />
      </CardHeader>
      
      <CardContent>
        <TripDetailsTabs trip={trip} />
      </CardContent>
      
      <CardFooter>
        <TripDetailsFooter onClose={onClose} />
      </CardFooter>
    </Card>
  );
};

export default TripDetails;
