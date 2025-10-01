
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import { getDifficultyColor, getDifficultyLabel } from '../utils/tripUtils';
import { Difficulty } from '@/hooks/use-trip-planning';

interface TripDetailsHeaderProps {
  title: string;
  difficulty: Difficulty;
}

const TripDetailsHeader = ({ title, difficulty }: TripDetailsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="flex items-center">
        <Map className="mr-2 h-5 w-5" />
        {title}
      </CardTitle>
      <div className="flex items-center space-x-2">
        <div className={`h-3 w-3 rounded-full ${getDifficultyColor(difficulty)}`}></div>
        <span className="text-sm font-medium">
          {getDifficultyLabel(difficulty)}
        </span>
      </div>
    </div>
  );
};

export default TripDetailsHeader;
