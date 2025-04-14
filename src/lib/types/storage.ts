
import { STORAGE_BUCKETS } from '../supabase';

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

export interface StorageStatus {
  isAvailable: boolean;
  buckets: Record<StorageBucket, boolean>;
  error?: string;
}
