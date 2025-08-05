import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PostWithUser } from '@/types/post';
import { UserProfile } from '@/types/user';

interface UnimogHubDB extends DBSchema {
  posts: {
    key: string;
    value: PostWithUser;
    indexes: { 'by-date': Date; 'by-user': string };
  };
  profiles: {
    key: string;
    value: UserProfile;
  };
  trips: {
    key: string;
    value: any; // Trip type
  };
  knowledge: {
    key: string;
    value: {
      id: string;
      title: string;
      content: string;
      category: string;
      cached_at: Date;
    };
  };
  messages: {
    key: string;
    value: any; // Message type
    indexes: { 'by-conversation': string };
  };
  'sync-queue': {
    key: string;
    value: {
      id: string;
      type: 'post' | 'message' | 'trip' | 'profile';
      action: 'create' | 'update' | 'delete';
      data: any;
      timestamp: Date;
      attempts: number;
    };
  };
}

const DB_NAME = 'unimog-hub-offline';
const DB_VERSION = 1;

let db: IDBPDatabase<UnimogHubDB> | null = null;

/**
 * Initialize the offline database
 */
export async function initOfflineDB(): Promise<IDBPDatabase<UnimogHubDB>> {
  if (db) return db;

  db = await openDB<UnimogHubDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Posts store
      if (!db.objectStoreNames.contains('posts')) {
        const postStore = db.createObjectStore('posts', { keyPath: 'id' });
        postStore.createIndex('by-date', 'created_at');
        postStore.createIndex('by-user', 'user_id');
      }

      // Profiles store
      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'id' });
      }

      // Trips store
      if (!db.objectStoreNames.contains('trips')) {
        db.createObjectStore('trips', { keyPath: 'id' });
      }

      // Knowledge base store
      if (!db.objectStoreNames.contains('knowledge')) {
        db.createObjectStore('knowledge', { keyPath: 'id' });
      }

      // Messages store
      if (!db.objectStoreNames.contains('messages')) {
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-conversation', 'conversation_id');
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('sync-queue')) {
        db.createObjectStore('sync-queue', { keyPath: 'id' });
      }
    },
  });

  return db;
}

/**
 * Cache posts for offline access
 */
export async function cachePosts(posts: PostWithUser[]) {
  const database = await initOfflineDB();
  const tx = database.transaction('posts', 'readwrite');
  
  await Promise.all(
    posts.map(post => tx.store.put(post))
  );
  
  await tx.done;
}

/**
 * Get cached posts
 */
export async function getCachedPosts(limit = 20, offset = 0): Promise<PostWithUser[]> {
  const database = await initOfflineDB();
  const tx = database.transaction('posts', 'readonly');
  
  // Get posts sorted by date
  const posts = await tx.store.index('by-date').getAll();
  
  // Sort in descending order and apply pagination
  return posts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(offset, offset + limit);
}

/**
 * Cache user profiles
 */
export async function cacheProfiles(profiles: UserProfile[]) {
  const database = await initOfflineDB();
  const tx = database.transaction('profiles', 'readwrite');
  
  await Promise.all(
    profiles.map(profile => tx.store.put(profile))
  );
  
  await tx.done;
}

/**
 * Get cached profile
 */
export async function getCachedProfile(userId: string): Promise<UserProfile | undefined> {
  const database = await initOfflineDB();
  return database.get('profiles', userId);
}

/**
 * Add action to sync queue
 */
export async function addToSyncQueue(
  type: 'post' | 'message' | 'trip' | 'profile',
  action: 'create' | 'update' | 'delete',
  data: any
) {
  const database = await initOfflineDB();
  const id = `${type}-${action}-${Date.now()}-${Math.random()}`;
  
  await database.put('sync-queue', {
    id,
    type,
    action,
    data,
    timestamp: new Date(),
    attempts: 0,
  });
}

/**
 * Get pending sync items
 */
export async function getPendingSyncItems() {
  const database = await initOfflineDB();
  return database.getAll('sync-queue');
}

/**
 * Remove item from sync queue
 */
export async function removeSyncItem(id: string) {
  const database = await initOfflineDB();
  await database.delete('sync-queue', id);
}

/**
 * Update sync item attempts
 */
export async function updateSyncItemAttempts(id: string, attempts: number) {
  const database = await initOfflineDB();
  const item = await database.get('sync-queue', id);
  
  if (item) {
    item.attempts = attempts;
    await database.put('sync-queue', item);
  }
}

/**
 * Clear all offline data
 */
export async function clearOfflineData() {
  const database = await initOfflineDB();
  
  await Promise.all([
    database.clear('posts'),
    database.clear('profiles'),
    database.clear('trips'),
    database.clear('knowledge'),
    database.clear('messages'),
    database.clear('sync-queue'),
  ]);
}

/**
 * Get database storage info
 */
export async function getStorageInfo() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
    };
  }
  
  return null;
}