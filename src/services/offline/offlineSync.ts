import { supabase } from '@/lib/supabase-client';
import {
  getPendingSyncItems,
  removeSyncItem,
  updateSyncItemAttempts,
  addToSyncQueue,
} from './offlineStorage';

const MAX_RETRY_ATTEMPTS = 3;

/**
 * Process offline sync queue
 */
export async function processOfflineQueue() {
  const items = await getPendingSyncItems();
  
  if (items.length === 0) {
    return { processed: 0, failed: 0 };
  }

  console.log(`[Offline Sync] Processing ${items.length} queued items`);
  
  let processed = 0;
  let failed = 0;

  for (const item of items) {
    try {
      const success = await syncItem(item);
      
      if (success) {
        await removeSyncItem(item.id);
        processed++;
      } else {
        // Update attempts
        const newAttempts = item.attempts + 1;
        
        if (newAttempts >= MAX_RETRY_ATTEMPTS) {
          // Max attempts reached, remove from queue
          await removeSyncItem(item.id);
          failed++;
          console.error(`[Offline Sync] Max attempts reached for item ${item.id}`);
        } else {
          await updateSyncItemAttempts(item.id, newAttempts);
        }
      }
    } catch (error) {
      console.error(`[Offline Sync] Error processing item ${item.id}:`, error);
      failed++;
    }
  }

  console.log(`[Offline Sync] Processed: ${processed}, Failed: ${failed}`);
  
  return { processed, failed };
}

/**
 * Sync individual item
 */
async function syncItem(item: any): Promise<boolean> {
  switch (item.type) {
    case 'post':
      return syncPost(item);
    case 'message':
      return syncMessage(item);
    case 'trip':
      return syncTrip(item);
    case 'profile':
      return syncProfile(item);
    default:
      console.warn(`[Offline Sync] Unknown item type: ${item.type}`);
      return false;
  }
}

/**
 * Sync post actions
 */
async function syncPost(item: any): Promise<boolean> {
  try {
    switch (item.action) {
      case 'create': {
        const { error } = await supabase
          .from('community_posts')
          .insert(item.data);
        
        if (error) {
          console.error('[Offline Sync] Post create error:', error);
          return false;
        }
        return true;
      }
      
      case 'update': {
        const { error } = await supabase
          .from('community_posts')
          .update(item.data)
          .eq('id', item.data.id);
        
        if (error) {
          console.error('[Offline Sync] Post update error:', error);
          return false;
        }
        return true;
      }
      
      case 'delete': {
        const { error } = await supabase
          .from('community_posts')
          .delete()
          .eq('id', item.data.id);
        
        if (error) {
          console.error('[Offline Sync] Post delete error:', error);
          return false;
        }
        return true;
      }
      
      default:
        return false;
    }
  } catch (error) {
    console.error('[Offline Sync] Post sync error:', error);
    return false;
  }
}

/**
 * Sync message actions
 */
async function syncMessage(item: any): Promise<boolean> {
  try {
    switch (item.action) {
      case 'create': {
        const { error } = await supabase
          .from('messages')
          .insert(item.data);
        
        if (error) {
          console.error('[Offline Sync] Message create error:', error);
          return false;
        }
        return true;
      }
      
      default:
        return false;
    }
  } catch (error) {
    console.error('[Offline Sync] Message sync error:', error);
    return false;
  }
}

/**
 * Sync trip actions
 */
async function syncTrip(item: any): Promise<boolean> {
  try {
    switch (item.action) {
      case 'create':
      case 'update': {
        const { error } = await supabase
          .from('trips')
          .upsert(item.data);
        
        if (error) {
          console.error('[Offline Sync] Trip sync error:', error);
          return false;
        }
        return true;
      }
      
      default:
        return false;
    }
  } catch (error) {
    console.error('[Offline Sync] Trip sync error:', error);
    return false;
  }
}

/**
 * Sync profile actions
 */
async function syncProfile(item: any): Promise<boolean> {
  try {
    switch (item.action) {
      case 'update': {
        const { error } = await supabase
          .from('profiles')
          .update(item.data)
          .eq('id', item.data.id);
        
        if (error) {
          console.error('[Offline Sync] Profile update error:', error);
          return false;
        }
        return true;
      }
      
      default:
        return false;
    }
  } catch (error) {
    console.error('[Offline Sync] Profile sync error:', error);
    return false;
  }
}

/**
 * Create offline-aware wrapper for Supabase operations
 */
export function createOfflineWrapper<T extends (...args: any[]) => Promise<any>>(
  onlineOperation: T,
  offlineOperation: (args: Parameters<T>) => void,
  type: 'post' | 'message' | 'trip' | 'profile',
  action: 'create' | 'update' | 'delete'
): T {
  return (async (...args: Parameters<T>) => {
    if (navigator.onLine) {
      // Try online operation
      try {
        const result = await onlineOperation(...args);
        return result;
      } catch (error) {
        // If online operation fails, queue for later
        console.warn('[Offline] Online operation failed, queuing for sync:', error);
        offlineOperation(args);
        
        // Queue for sync
        await addToSyncQueue(type, action, args[0]);
        
        // Return a mock success response
        return { data: args[0], error: null };
      }
    } else {
      // Offline - queue for later
      offlineOperation(args);
      await addToSyncQueue(type, action, args[0]);
      
      // Return a mock success response
      return { data: args[0], error: null };
    }
  }) as T;
}