
import { STORAGE_BUCKETS } from '../supabase';

// Define the storage bucket type based on the values in STORAGE_BUCKETS
export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

export interface StorageStatus {
  isAvailable: boolean;
  buckets: Record<StorageBucket, boolean>;
  error?: string;
}

// Helper type for bucket operations
export interface BucketOperationResult {
  success: boolean;
  error?: string;
  details?: any;
}
