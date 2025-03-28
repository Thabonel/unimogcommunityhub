
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, BarChart } from 'lucide-react';

interface TripCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location: string;
  startDate: string;
  endDate?: string;
  organizerId: string;
  organizerName: string;
  participantCount: number;
  maxParticipants?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  terrainTypes: string[];
  distance?: number;
  duration?: number;
  isUpcoming: boolean;
}

const TripCard = ({
  id,
  title,
  description,
  imageUrl,
  location,
  startDate,
  endDate,
  organizerName,
  participantCount,
  maxParticipants,
  difficulty,
  terrainTypes,
  distance,
  duration,
  isUpcoming,
}: TripCardProps) => {
  // Difficulty colors
  const difficultyColor = {
    beginner: 'bg-green-500',
    intermediate: 'bg-blue-500',
    advanced: 'bg-orange-500',
    expert: 'bg-red-500',
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link to={`/trips/${id}`}>
        <div className="aspect-video bg-muted relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <MapPin className="h-12 w-12" />
            </div>
          )}
          {isUpcoming && (
            <Badge className="absolute top-2 right-2 bg-primary">
              Upcoming
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className={`h-3 w-3 rounded-full mr-2 ${difficultyColor[difficulty]}`}></div>
          <span className="text-xs font-medium">
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
          </span>
        </div>
        
        <Link to={`/trips/${id}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors">{title}</h3>
        </Link>
        
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={14} className="mr-2" />
            <span>{startDate}{endDate ? ` - ${endDate}` : ''}</span>
          </div>
          {(distance || duration) && (
            <div className="flex items-center text-sm text-muted-foreground">
              <BarChart size={14} className="mr-2" />
              <span>
                {distance && `${distance} km`}
                {distance && duration && ' • '}
                {duration && `${duration} ${duration === 1 ? 'day' : 'days'}`}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {terrainTypes.map((terrain, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {terrain}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t flex justify-between items-center">
        <div className="text-sm">
          <span>Organized by </span>
          <Link to={`/profile/${organizerName}`} className="text-primary hover:underline">
            {organizerName}
          </Link>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <User size={14} className="mr-1" />
          <span>
            {participantCount}{maxParticipants ? `/${maxParticipants}` : ''}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
