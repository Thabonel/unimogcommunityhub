import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface QuickCheckinProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  onCheckinAdded?: () => void;
}

export function QuickCheckin({
  isOpen,
  onOpenChange,
  vehicleId,
  onCheckinAdded
}: QuickCheckinProps) {
  const { user } = useAuth();
  const [locationName, setLocationName] = useState('');
  const [activityType, setActivityType] = useState<string>('general');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const getCurrentLocation = async () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });

      // Try to get a readable location name using reverse geocoding
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&types=place,locality,neighborhood,address`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const placeName = data.features[0].place_name;
            setLocationName(placeName);
          }
        }
      } catch (geoError) {
        console.error('Reverse geocoding failed:', geoError);
        // Set coordinates as fallback
        setLocationName(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }

      toast.success('Location detected!');
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Failed to get current location. Please enter manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !vehicleId || !locationName.trim()) {
      toast.error('Please fill in the location name');
      return;
    }

    setIsSubmitting(true);
    try {
      const checkinData: any = {
        user_id: user.id,
        vehicle_id: vehicleId,
        location_name: locationName.trim(),
        activity_type: activityType,
        notes: notes.trim() || null
      };

      // Add coordinates if available
      if (currentLocation) {
        checkinData.coordinates = `POINT(${currentLocation.lng} ${currentLocation.lat})`;
      }

      const { error } = await supabase
        .from('location_checkins')
        .insert([checkinData]);

      if (error) {
        console.error('Error adding check-in:', error);
        toast.error('Failed to add check-in');
        return;
      }

      toast.success('Checked in successfully!');

      // Reset form
      setLocationName('');
      setActivityType('general');
      setNotes('');
      setCurrentLocation(null);

      onOpenChange(false);
      onCheckinAdded?.();
    } catch (error) {
      console.error('Error adding check-in:', error);
      toast.error('Failed to add check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'work': return '🏗️';
      case 'maintenance': return '🔧';
      case 'fuel': return '⛽';
      case 'rest': return '☕';
      case 'destination': return '🎯';
      default: return '📍';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Quick Check-in
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location with GPS button */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter location name"
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                title="Get current location"
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
              </Button>
            </div>
            {currentLocation && (
              <p className="text-xs text-muted-foreground">
                📍 GPS: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Activity Type */}
          <div>
            <Label htmlFor="activity">Activity Type</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  📍 General Location
                </SelectItem>
                <SelectItem value="work">
                  🏗️ Work Site
                </SelectItem>
                <SelectItem value="maintenance">
                  🔧 Maintenance/Service
                </SelectItem>
                <SelectItem value="fuel">
                  ⛽ Fuel Stop
                </SelectItem>
                <SelectItem value="rest">
                  ☕ Rest Stop
                </SelectItem>
                <SelectItem value="destination">
                  🎯 Destination Arrived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this location..."
              className="min-h-[60px]"
            />
          </div>

          {/* Info box */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-blue-800">
              💡 <strong>Quick tip:</strong> Use the GPS button to automatically detect your current location,
              or type in a location name manually.
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !locationName.trim()}
              className="flex-1"
            >
              {isSubmitting ? 'Checking In...' : 'Check In'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}