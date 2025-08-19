
import { trackActivity } from './activityTrackingService';
import { Experiment, ExperimentVariant } from './types/analyticsTypes';

// Map to store active experiments
const activeExperiments = new Map<string, Experiment>();

// Get or assign experiment variant for a user
export const getExperimentVariant = (experimentId: string): ExperimentVariant | null => {
  const experiment = activeExperiments.get(experimentId);
  if (!experiment || !experiment.active) {
    return null;
  }

  // Check if user already has assigned variant in localStorage
  const storageKey = `exp_${experimentId}`;
  const storedVariant = localStorage.getItem(storageKey) as ExperimentVariant | null;
  
  if (storedVariant && experiment.variants.includes(storedVariant)) {
    return storedVariant;
  }
  
  // Assign variant based on weightings or randomly if not specified
  let variant: ExperimentVariant;
  
  if (experiment.weightings) {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const [variantName, weight] of Object.entries(experiment.weightings)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        variant = variantName as ExperimentVariant;
        break;
      }
    }
    // Fallback to control if something goes wrong with weights
    variant = variant || 'control';
  } else {
    // Random assignment with equal probability
    const randomIndex = Math.floor(Math.random() * experiment.variants.length);
    variant = experiment.variants[randomIndex];
  }
  
  // Save assigned variant
  localStorage.setItem(storageKey, variant);
  
  // Track experiment view
  trackActivity('experiment_view', { 
    experiment_id: experimentId,
    experiment_name: experiment.name,
    variant
  });
  
  return variant;
};

// Register a new experiment
export const registerExperiment = (experiment: Experiment): void => {
  activeExperiments.set(experiment.id, experiment);
};

// Track experiment conversion
export const trackExperimentConversion = (
  experimentId: string, 
  goalName: string, 
  additionalData: Record<string, any> = {}
): void => {
  const variant = localStorage.getItem(`exp_${experimentId}`) as ExperimentVariant | null;
  
  if (!variant) return;
  
  const experiment = activeExperiments.get(experimentId);
  
  trackActivity('experiment_conversion', {
    experiment_id: experimentId,
    experiment_name: experiment?.name,
    variant,
    goal: goalName,
    ...additionalData
  });
};

// Get all registered experiments
export const getActiveExperiments = (): Experiment[] => {
  return Array.from(activeExperiments.values()).filter(exp => exp.active);
};
