
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, MapPin, Ruler } from 'lucide-react';
import { format } from 'date-fns';

export interface TripCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string; 
  distance: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  terrainTypes: string[];
  organizerId: string;
  organizerName: string;
  imageUrl: string;
  isUpcoming: boolean;
  participantCount: number;
}

const TripCard: React.FC<{ trip: TripCardProps; onClick: () => void }> = ({ trip, onClick }) => {
  const getDifficultyColor = () => {
    switch (trip.difficulty) {
      case 'beginner': return 'bg-green-500 hover:bg-green-600';
      case 'intermediate': return 'bg-blue-500 hover:bg-blue-600';
      case 'advanced': return 'bg-orange-500 hover:bg-orange-600';
      case 'expert': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img 
          src={trip.imageUrl} 
          alt={trip.title} 
          className="w-full h-full object-cover"
        />
        {trip.isUpcoming && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-blue-500 text-white">Upcoming</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{trip.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-1">{trip.description}</p>
          </div>
          <Badge className={`${getDifficultyColor()} capitalize`}>
            {trip.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">{trip.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Ruler className="h-4 w-4 mr-1" />
          <span>{trip.distance.toFixed(1)} km</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-2 bg-muted/30 flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          <span>{trip.participantCount} participant{trip.participantCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Organized by {trip.organizerName}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
