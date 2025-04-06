
import { useState, useEffect } from 'react';
import { Trip } from '@/types/trip';
import { 
  fetchTrips, 
  fetchTripById, 
  createTrip, 
  updateTrip, 
  deleteTrip 
} from '@/services/tripService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch all trips
  const loadTrips = async () => {
    if (!user) {
      // If not logged in, don't attempt to fetch
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single trip by id
  const loadTrip = async (tripId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTripById(tripId);
      if (data) {
        setSelectedTrip(data);
        return data;
      }
      return null;
    } catch (err) {
      setError('Failed to load trip details');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create new trip
  const addTrip = async (tripData: Partial<Trip>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a trip",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    try {
      const newTrip = await createTrip(tripData);
      if (newTrip) {
        setTrips([newTrip, ...trips]);
        return newTrip;
      }
      return null;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create trip",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing trip
  const editTrip = async (tripId: string, tripData: Partial<Trip>) => {
    setIsLoading(true);
    try {
      const updatedTrip = await updateTrip(tripId, tripData);
      if (updatedTrip) {
        setTrips(trips.map(trip => 
          trip.id === tripId ? updatedTrip : trip
        ));
        if (selectedTrip?.id === tripId) {
          setSelectedTrip(updatedTrip);
        }
        return updatedTrip;
      }
      return null;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update trip",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete trip
  const removeTrip = async (tripId: string) => {
    setIsLoading(true);
    try {
      const success = await deleteTrip(tripId);
      if (success) {
        setTrips(trips.filter(trip => trip.id !== tripId));
        if (selectedTrip?.id === tripId) {
          setSelectedTrip(null);
        }
      }
      return success;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load trips on initial mount and when user changes
  useEffect(() => {
    if (user) {
      loadTrips();
    } else {
      setTrips([]);
    }
  }, [user]);

  return {
    trips,
    selectedTrip,
    isLoading,
    error,
    loadTrips,
    loadTrip,
    addTrip,
    editTrip,
    removeTrip,
    setSelectedTrip
  };
}
