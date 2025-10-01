
import { useState } from 'react';
import { useAnalytics } from './use-analytics';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type TerrainType = 'desert' | 'mountain' | 'forest' | 'river' | 'snow' | 'mud' | string;

export interface TripPlan {
  id: string;
  title: string;
  startLocation: string;
  endLocation: string;
  waypoints: string[];
  distance: number;
  duration: number;
  difficulty: Difficulty;
  terrainTypes: TerrainType[];
  poiTypes: string[];
}

export function useTripPlanning() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [selectedTerrainTypes, setSelectedTerrainTypes] = useState<TerrainType[]>([]);
  const [selectedPois, setSelectedPois] = useState<string[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const { trackFeatureUse } = useAnalytics();
  
  const generateTripId = () => {
    return `trip-${Math.floor(Math.random() * 10000)}-${Date.now()}`;
  };
  
  const planTrip = async () => {
    if (!startLocation || !endLocation) {
      return null;
    }
    
    setIsPlanning(true);
    trackFeatureUse('trip_planning', {
      start: startLocation,
      end: endLocation,
      difficulty,
      terrains: selectedTerrainTypes.join(',')
    });
    
    try {
      // In a real implementation, this would call an API
      // For now, let's mock a trip plan response
      const mockTripPlan: TripPlan = {
        id: generateTripId(),
        title: `${startLocation} to ${endLocation}`,
        startLocation,
        endLocation,
        waypoints: [],
        distance: Math.floor(Math.random() * 500) + 50, // Random distance between 50-550 km
        duration: Math.floor(Math.random() * 10) + 1, // Random duration between 1-10 days
        difficulty,
        terrainTypes: selectedTerrainTypes.length > 0 ? selectedTerrainTypes : ['mountain', 'forest'],
        poiTypes: selectedPois
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTripPlan(mockTripPlan);
      setIsPlanning(false);
      return mockTripPlan;
    } catch (error) {
      console.error("Failed to plan trip:", error);
      setIsPlanning(false);
      return null;
    }
  };
  
  const clearPlan = () => {
    setTripPlan(null);
    trackFeatureUse('trip_planning', { action: 'clear' });
  };
  
  return {
    startLocation,
    setStartLocation,
    endLocation,
    setEndLocation,
    difficulty,
    setDifficulty,
    selectedTerrainTypes,
    setSelectedTerrainTypes,
    selectedPois,
    setSelectedPois,
    isPlanning,
    tripPlan,
    planTrip,
    clearPlan
  };
}
