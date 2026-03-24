/**
 * Feature Flags and Application Constants
 */

// Payment Infrastructure Control
export const PAYMENTS_ENABLED = import.meta.env.VITE_PAYMENTS_ENABLED === 'true';

// Development and Debug Flags
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development';
export const IS_STAGING = import.meta.env.VITE_APP_ENV === 'staging';

// Application Constants
export const APP_NAME = 'UnimogCommunityHub';
export const APP_VERSION = '2.0.0';

// API Configuration
export const API_TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  BARRY_AI: 30000, // 30 seconds for AI responses
  FILE_UPLOAD: 60000, // 60 seconds for file uploads
} as const;

// Subscription Configuration
export const SUBSCRIPTION_CONFIG = {
  // When payments are disabled, all users get free premium access
  DEFAULT_FREE_TIER: PAYMENTS_ENABLED ? 'free' : 'premium',
  AUTO_GRANT_PREMIUM: !PAYMENTS_ENABLED,
  FREE_ACCESS_REASON: 'Free Forever - Auto Assignment',
} as const;

// Barry AI Configuration
export const BARRY_CONFIG = {
  MAX_CONTEXT_LENGTH: 8000,
  DEFAULT_TEMPERATURE: 0.1,
  MAX_TOKENS: 2000,
} as const;

// Feature Availability Matrix
export const FEATURES = {
  PAYMENTS: PAYMENTS_ENABLED,
  SUBSCRIPTION_TIERS: PAYMENTS_ENABLED,
  VERIFICATION_REQUIRED: PAYMENTS_ENABLED,
  AUTO_FREE_ACCESS: !PAYMENTS_ENABLED,
  BARRY_AI: true,
  TRIP_PLANNING: true,
  MARKETPLACE: true,
  COMMUNITY: true,
  ADMIN_PANEL: true,
} as const;