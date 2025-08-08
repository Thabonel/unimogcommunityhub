
import { PrivacyPreferences } from '@/components/community/improvement/privacy/PrivacySettings';

const PRIVACY_SETTINGS_KEY = 'privacy_preferences';

// Default privacy settings
const defaultSettings: PrivacyPreferences = {
  allowAnalytics: true,
  allowActivityTracking: true,
  allowPersonalization: false,
  anonymizeData: false,
};

/**
 * Get user's privacy settings from localStorage
 */
export const getPrivacySettings = (): PrivacyPreferences => {
  try {
    const storedSettings = localStorage.getItem(PRIVACY_SETTINGS_KEY);
    return storedSettings 
      ? JSON.parse(storedSettings) 
      : defaultSettings;
  } catch (error) {
    console.error('Error retrieving privacy settings:', error);
    return defaultSettings;
  }
};

/**
 * Update user's privacy settings in localStorage
 */
export const updatePrivacySettings = (settings: PrivacyPreferences): void => {
  try {
    localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(settings));
    
    // Dispatch event so other components can react to privacy setting changes
    window.dispatchEvent(new CustomEvent('privacy-settings-changed', { 
      detail: settings 
    }));
  } catch (error) {
    console.error('Error saving privacy settings:', error);
  }
};

/**
 * Check if analytics tracking is allowed based on user preferences
 */
export const isTrackingAllowed = (): boolean => {
  const settings = getPrivacySettings();
  return settings.allowAnalytics;
};

/**
 * Check if activity tracking is allowed based on user preferences
 */
export const isActivityTrackingAllowed = (): boolean => {
  const settings = getPrivacySettings();
  return settings.allowAnalytics && settings.allowActivityTracking;
};

/**
 * Check if personalization is allowed based on user preferences
 */
export const isPersonalizationAllowed = (): boolean => {
  const settings = getPrivacySettings();
  return settings.allowAnalytics && settings.allowPersonalization;
};

/**
 * Check if data should be anonymized based on user preferences
 */
export const shouldAnonymizeData = (): boolean => {
  const settings = getPrivacySettings();
  return !settings.allowAnalytics || settings.anonymizeData;
};

/**
 * Anonymize user data by removing identifiable information
 */
export const anonymizeUserData = (data: Record<string, any>): Record<string, any> => {
  // Create a copy to avoid mutating the original object
  const anonymizedData = { ...data };
  
  // Remove user identifiers if anonymization is enabled
  if (shouldAnonymizeData()) {
    // Remove or hash user identifier
    if (anonymizedData.user_id) {
      anonymizedData.user_id = 'anonymous';
    }
    
    // Remove IP addresses, emails, and other PII
    const fieldsToAnonymize = ['email', 'ip_address', 'user_agent', 'full_name'];
    fieldsToAnonymize.forEach(field => {
      if (field in anonymizedData) {
        delete anonymizedData[field];
      }
      
      // Check nested objects in event_data
      if (anonymizedData.event_data && field in anonymizedData.event_data) {
        delete anonymizedData.event_data[field];
      }
    });
  }
  
  return anonymizedData;
};
