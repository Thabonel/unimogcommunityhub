
/**
 * Utility functions for trip-related components
 */

import { Difficulty } from '@/hooks/use-trip-planning';

/**
 * Returns the appropriate color class based on difficulty level
 */
export const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'beginner': return 'bg-green-500';
    case 'intermediate': return 'bg-blue-500';
    case 'advanced': return 'bg-orange-500';
    case 'expert': return 'bg-red-500';
    default: return 'bg-blue-500';
  }
};

/**
 * Returns the formatted label for a difficulty level
 */
export const getDifficultyLabel = (difficulty: Difficulty): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};
