import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Heart, Eye, Flame, ArrowRight } from 'lucide-react';
import { VehicleShowcaseInfo } from '@/hooks/vehicle-maintenance/types';
import { useVehicleShowcase } from '@/hooks/use-vehicle-showcase';
import { getCountryFlag } from '@/utils/countryUtils';

interface HotVehiclesSectionProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

const HotVehiclesSection = ({ 
  limit = 6, 
  showHeader = true, 
  className = '' 
}: HotVehiclesSectionProps) => {
  const [hotVehicles, setHotVehicles] = useState<VehicleShowcaseInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getTrendingVehicles } = useVehicleShowcase();

  useEffect(() => {
    loadHotVehicles();
  }, []);

  const loadHotVehicles = async () => {
    setIsLoading(true);
    try {
      const vehicles = await getTrendingVehicles(limit);
      setHotVehicles(vehicles);
    } catch (error) {
      console.error('Error loading hot vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHotnessBadge = (vehicle: VehicleShowcaseInfo) => {
    if (vehicle.trending_score > 100) {
      return (
        <Badge className="bg-red-500 text-white animate-pulse">
          <Flame className="w-3 h-3 mr-1" />
          🔥 Hot
        </Badge>
      );
    }
    if (vehicle.trending_score > 50) {
      return (
        <Badge className="bg-orange-500 text-white">
          <TrendingUp className="w-3 h-3 mr-1" />
          Trending
        </Badge>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              Hot Vehicles Right Now
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                <CardContent className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hotVehicles.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            🔥 Hot Vehicles Right Now
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/community/members?sort=trending">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The most engaging Unimogs from the past 7 days
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotVehicles.map((vehicle, index) => (
            <Link
              key={vehicle.id}
              to={`/community/members/${vehicle.user_id}/vehicle/${vehicle.id}`}
              className="group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                {/* Trending Rank */}
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-black/70 text-white">
                    #{index + 1}
                  </Badge>
                </div>

                {/* Country Flag */}
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-white/90 text-black">
                    {getCountryFlag(vehicle.country_code)}
                  </Badge>
                </div>

                {/* Hotness Badge */}
                <div className="absolute bottom-2 left-2 z-10">
                  {getHotnessBadge(vehicle)}
                </div>

                {/* Vehicle Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={vehicle.photos?.[0] || vehicle.thumbnail_url || '/placeholder.svg'}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-3 space-y-2">
                  <div>
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.model} • {vehicle.year}
                    </p>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {vehicle.total_likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {vehicle.total_views}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Score: {Math.round(vehicle.trending_score)}
                    </Badge>
                  </div>

                  {/* Owner */}
                  <p className="text-xs text-muted-foreground">
                    by {vehicle.owner_name}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Want to see your vehicle here? Get more likes and engagement!
          </p>
          <Button asChild>
            <Link to="/community/members">
              Explore All Vehicles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotVehiclesSection;