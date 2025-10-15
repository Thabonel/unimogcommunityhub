// EventFilters - Filter controls for event calendar view
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { EventType, EventFilters as EventFiltersType } from '@/services/events';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
  hasLocation?: boolean;
}

const EVENT_TYPE_OPTIONS: Array<{ value: EventType; label: string }> = [
  { value: 'trip', label: 'Trip' },
  { value: 'working_bee', label: 'Working Bee' },
  { value: 'social', label: 'Social' },
  { value: 'emergency_help', label: 'Emergency Help' },
  { value: 'meetup', label: 'Meetup' },
];

export function EventFilters({ filters, onFiltersChange, hasLocation = false }: EventFiltersProps) {
  const [radiusKm, setRadiusKm] = useState(filters.radiusKm || 50);

  const handleEventTypeChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, event_type: undefined });
    } else {
      onFiltersChange({ ...filters, event_type: value as EventType });
    }
  };

  const handleMyEventsChange = (checked: boolean) => {
    onFiltersChange({ ...filters, user_events_only: checked });
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadiusKm(newRadius);
    onFiltersChange({ ...filters, radiusKm: newRadius });
  };

  const handleUpcomingOnlyChange = (checked: boolean) => {
    onFiltersChange({ ...filters, upcoming_only: checked });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* Event Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="event-type">Event Type</Label>
          <Select
            value={filters.event_type || 'all'}
            onValueChange={handleEventTypeChange}
          >
            <SelectTrigger id="event-type">
              <SelectValue placeholder="All event types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {EVENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Radius Filter */}
        {hasLocation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nearby Events
              </Label>
              <span className="text-sm text-muted-foreground">{radiusKm} km</span>
            </div>
            <Slider
              value={[radiusKm]}
              onValueChange={handleRadiusChange}
              min={10}
              max={500}
              step={10}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Show events within {radiusKm} km of your location
            </p>
          </div>
        )}

        {/* My Events Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="my-events"
            checked={filters.user_events_only || false}
            onCheckedChange={handleMyEventsChange}
          />
          <Label
            htmlFor="my-events"
            className="text-sm font-normal cursor-pointer"
          >
            Show only my events
          </Label>
        </div>

        {/* Upcoming Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="upcoming-only"
            checked={filters.upcoming_only !== false}
            onCheckedChange={handleUpcomingOnlyChange}
          />
          <Label
            htmlFor="upcoming-only"
            className="text-sm font-normal cursor-pointer"
          >
            Show only upcoming events
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
