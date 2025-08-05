/**
 * Legacy Supabase client export
 * @deprecated Use @/lib/supabase-client instead
 * This file maintains backwards compatibility while we migrate
 */

// Re-export everything from the centralized client
export * from './supabase-client';
export { default } from './supabase-client';

// Re-export types for backwards compatibility
export type { StorageBucket } from './types/storage';