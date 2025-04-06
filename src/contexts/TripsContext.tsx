
import React, { createContext, useContext, ReactNode } from 'react';
import { Trip } from '@/types/trip';
import { useTrips } from '@/hooks/use-trips';

interface TripsContextType {
  trips: Trip[];
  selectedTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  loadTrips: () => Promise<void>;
  loadTrip: (tripId: string) => Promise<Trip | null>;
  addTrip: (tripData: Partial<Trip>) => Promise<Trip | null>;
  editTrip: (tripId: string, tripData: Partial<Trip>) => Promise<Trip | null>;
  removeTrip: (tripId: string) => Promise<boolean>;
  setSelectedTrip: (trip: Trip | null) => void;
}

const defaultTripsContext: TripsContextType = {
  trips: [],
  selectedTrip: null,
  isLoading: false,
  error: null,
  loadTrips: async () => {},
  loadTrip: async () => null,
  addTrip: async () => null,
  editTrip: async () => null,
  removeTrip: async () => false,
  setSelectedTrip: () => {}
};

const TripsContext = createContext<TripsContextType>(defaultTripsContext);

export const useTripsContext = () => useContext(TripsContext);

interface TripsProviderProps {
  children: ReactNode;
}

export const TripsProvider: React.FC<TripsProviderProps> = ({ children }) => {
  const tripsData = useTrips();

  return (
    <TripsContext.Provider value={tripsData}>
      {children}
    </TripsContext.Provider>
  );
};
