/**
 * Supabase Error Handler
 * Simple error handling for Supabase operations
 */

import { logger } from '@/utils/logger';

/**
 * Handle Supabase errors with logging
 */
export function handleSupabaseError(error: any, context: string = 'Unknown') {
  if (!error) return null;

  // Log the error
  logger.error(`Supabase error in ${context}`, error, {
    component: 'SupabaseErrorHandler',
    context,
    errorMessage: error?.message || 'Unknown error'
  });

  // Return the error for handling by the caller
  return error;
}

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: any): boolean {
  const message = error?.message || '';
  return (
    message.includes('JWT expired') ||
    message.includes('Invalid login credentials') ||
    message.includes('Email not confirmed') ||
    message.includes('User not found') ||
    message.includes('refresh_token_not_found')
  );
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: any): boolean {
  const message = error?.message || '';
  return (
    message.includes('Network') ||
    message.includes('fetch') ||
    message.includes('Connection')
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  if (!error) return 'An unexpected error occurred';

  const message = error?.message || '';

  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }

  if (message.includes('Email not confirmed')) {
    return 'Please confirm your email address';
  }

  if (message.includes('User already registered')) {
    return 'An account with this email already exists';
  }

  if (isNetworkError(error)) {
    return 'Network connection issue. Please check your internet connection.';
  }

  if (message.includes('JWT expired')) {
    return 'Your session has expired. Please sign in again.';
  }

  // Return the original message if no specific handling
  return message || 'An unexpected error occurred';
}

// Legacy export for backward compatibility
export const handleSupabaseErrorLegacy = handleSupabaseError;