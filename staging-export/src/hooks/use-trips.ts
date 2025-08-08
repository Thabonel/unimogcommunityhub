
import { useState, useEffect, useCallback, useRef } from 'react';
import { Trip } from '@/types/trip';
import { 
  fetchTrips, 
  fetchTripById, 
  createTrip, 
  updateTrip, 
  deleteTrip 
} from '@/services/tripService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);

  // Fetch all trips
  const loadTrips = useCallback(async () => {
    console.log('useTrips.loadTrips called, user:', user?.id);
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTrips();
      console.log('Trips fetched:', data);
      setTrips(data || []);
    } catch (err: any) {
      console.error('Error fetching trips:', err);
      setError(err.message || 'Failed to load trips');
      toast({
        title: "Error fetching trips",
        description: err.message || "Failed to load trips",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
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

  // Load trips only once when user becomes available
  useEffect(() => {
    if (user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadTrips();
    }
  }, [user, loadTrips]);

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
