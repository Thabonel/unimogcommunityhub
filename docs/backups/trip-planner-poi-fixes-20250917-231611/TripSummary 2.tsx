
import { Clock, Compass, Flag, Navigation, Star, TrendingUp } from 'lucide-react';
import { Difficulty } from '@/hooks/use-trip-planning';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TripSummaryProps {
  title?: string;
  startLocation: string;
  endLocation: string;
  distance?: number;
  duration?: number;
  difficulty: Difficulty;
  terrainTypes: string[];
  elevationGain?: number;
}

const TripSummary = ({
  title,
  startLocation,
  endLocation,
  distance,
  duration,
  difficulty,
  terrainTypes,
  elevationGain,
}: TripSummaryProps) => {
  // Difficulty color mapping
  const difficultyColor = {
    beginner: 'bg-green-500',
    intermediate: 'bg-blue-500',
    advanced: 'bg-orange-500',
    expert: 'bg-red-500',
  };

  const difficultyLabel = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };

  return (
    <Card className="w-full">
      {title && (
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="mr-2 h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4 text-primary" /> Trip Info
              </h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Start:</span>
                  <span className="font-medium text-foreground">{startLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>End:</span>
                  <span className="font-medium text-foreground">{endLocation}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" /> Difficulty
              </h3>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${difficultyColor[difficulty]}`}></div>
                  <span className="text-sm font-medium">{difficultyLabel[difficulty]}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" /> Terrain
              </h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {terrainTypes.map((terrain, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {typeof terrain === 'string' ? terrain.charAt(0).toUpperCase() + terrain.slice(1) : terrain}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {distance !== undefined && (
            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Navigation className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Distance</span>
              </div>
              <span className="text-lg font-semibold">{distance} km</span>
            </div>
          )}

          {duration !== undefined && (
            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <span className="text-lg font-semibold">
                {duration} {duration === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}

          {elevationGain !== undefined && (
            <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Elevation Gain</span>
              </div>
              <span className="text-lg font-semibold">{elevationGain} m</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripSummary;
