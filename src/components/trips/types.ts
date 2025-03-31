
import { Difficulty, TerrainType } from '@/hooks/use-trip-planning';

export interface TripPlannerProps {
  onClose: () => void;
}

export interface RouteFormProps {
  startLocation: string;
  setStartLocation: (value: string) => void;
  endLocation: string;
  setEndLocation: (value: string) => void;
  difficulty: Difficulty;
  setDifficulty: (value: Difficulty) => void;
}

export interface TerrainFormProps {
  selectedTerrainTypes: TerrainType[];
  handleTerrainChange: (terrain: string) => void;
}

export interface PoiFormProps {
  selectedPois: string[];
  handlePoiChange: (poi: string) => void;
}
