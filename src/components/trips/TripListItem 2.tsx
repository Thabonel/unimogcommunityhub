
import React, { useMemo, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Clock, ArrowRight } from "lucide-react";
import { TripCardProps } from "./TripCard";
import { cn } from "@/lib/utils";

interface TripListItemProps {
  trip: TripCardProps;
  isActive: boolean;
  onSelect: () => void;
}

const TripListItem = ({ trip, isActive, onSelect }: TripListItemProps) => {
  // Difficulty colors - memoized to prevent recreating object on each render
  const difficultyColor = useMemo(() => ({
    beginner: 'bg-green-500',
    intermediate: 'bg-blue-500',
    advanced: 'bg-orange-500',
    expert: 'bg-red-500',
  }), []);

  const cardClassName = useMemo(() => cn(
    "overflow-hidden cursor-pointer transition-all hover:shadow-md",
    isActive ? "ring-2 ring-primary" : ""
  ), [isActive]);

  const dateRange = useMemo(() => {
    return `${trip.startDate}${trip.endDate ? ` - ${trip.endDate}` : ''}`;
  }, [trip.startDate, trip.endDate]);

  const distanceText = useMemo(() => {
    const parts = [];
    if (trip.distance) parts.push(`${trip.distance} km`);
    if (trip.duration) parts.push(`${trip.duration} ${trip.duration === 1 ? 'day' : 'days'}`);
    return parts.join(' • ');
  }, [trip.distance, trip.duration]);

  const visibleTerrains = useMemo(() => trip.terrainTypes.slice(0, 2), [trip.terrainTypes]);
  const remainingTerrainsCount = useMemo(() => Math.max(0, trip.terrainTypes.length - 2), [trip.terrainTypes.length]);

  const handleSelect = useCallback(() => {
    onSelect();
  }, [onSelect]);

  return (
    <Card 
      className={cardClassName}
      onClick={handleSelect}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{trip.title}</h3>
          <div className={`h-2 w-2 rounded-full ${difficultyColor[trip.difficulty]}`}></div>
        </div>
        
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin size={12} className="mr-1" />
            <span>{trip.location}</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon size={12} className="mr-1" />
            <span>{dateRange}</span>
          </div>
          
          {(trip.distance || trip.duration) && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              <span>{distanceText}</span>
            </div>
          )}
          
          {trip.startLocation && trip.endLocation && (
            <div className="flex items-center justify-between text-xs mt-1 bg-muted/50 p-1 rounded">
              <div className="truncate max-w-[100px]">{trip.startLocation}</div>
              <ArrowRight size={10} className="mx-1 flex-shrink-0" />
              <div className="truncate max-w-[100px] text-right">{trip.endLocation}</div>
            </div>
          )}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {visibleTerrains.map((terrain, index) => (
            <Badge key={index} variant="outline" className="text-[10px] px-1 py-0">
              {terrain}
            </Badge>
          ))}
          {remainingTerrainsCount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              +{remainingTerrainsCount}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(TripListItem);
