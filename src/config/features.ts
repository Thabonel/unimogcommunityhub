// Feature flags for progressive deployment
// This allows us to enable/disable features without code changes

export const FEATURES = {
  // WIS System Integration
  WIS_ENABLED: true, // Enabled for staging deployment
  
  // Future features can be added here
  // EXAMPLE_FEATURE: false,
};

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature] || false;
};