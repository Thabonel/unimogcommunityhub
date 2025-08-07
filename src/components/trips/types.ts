
import { Difficulty, TerrainType } from '@/hooks/use-trip-planning';

export interface TripSummaryProps {
  title?: string;
  startLocation: string;
  endLocation: string;
  distance?: number;
  duration?: number;
  difficulty: Difficulty;
  terrainTypes: string[];
  elevationGain?: number;
}
