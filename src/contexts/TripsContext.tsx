
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trip } from '@/types/trip';

interface TripsContextType {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  loading: boolean;
  error: string | null;
}

const defaultTripsContext: TripsContextType = {
  trips: [],
  setTrips: () => {},
  loading: false,
  error: null
};

const TripsContext = createContext<TripsContextType>(defaultTripsContext);

export const useTrips = () => useContext(TripsContext);

interface TripsProviderProps {
  children: ReactNode;
}

export const TripsProvider: React.FC<TripsProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, we would fetch trips from an API here

  return (
    <TripsContext.Provider value={{ trips, setTrips, loading, error }}>
      {children}
    </TripsContext.Provider>
  );
};
