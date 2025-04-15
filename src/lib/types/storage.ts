
import { STORAGE_BUCKETS, BucketName } from '../supabase';

// Define the storage bucket type based on the values in STORAGE_BUCKETS
export type StorageBucket = BucketName;

export interface StorageStatus {
  isAvailable: boolean;
  buckets: Record<StorageBucket, boolean>;
  error?: string;
}
