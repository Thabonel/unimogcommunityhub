import { useState, useEffect, useCallback } from 'react';

interface UseOfflineOptions {
  onOnline?: () => void;
  onOffline?: () => void;
}

/**
 * Hook to detect online/offline status
 */
export function useOffline(options: UseOfflineOptions = {}) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  
  const { onOnline, onOffline } = options;

  const updateOnlineStatus = useCallback(() => {
    const offline = !navigator.onLine;
    setIsOffline(offline);
    
    if (offline) {
      setWasOffline(true);
      if (onOffline) onOffline();
    } else {
      if (wasOffline && onOnline) onOnline();
      setWasOffline(false);
    }
  }, [onOnline, onOffline, wasOffline]);

  useEffect(() => {
    // Check initial status
    updateOnlineStatus();

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Periodic check (some browsers don't fire events reliably)
    const interval = setInterval(updateOnlineStatus, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, [updateOnlineStatus]);

  return {
    isOffline,
    isOnline: !isOffline,
    wasOffline,
  };
}

/**
 * Hook to manage offline queue for actions
 */
export function useOfflineQueue<T = any>() {
  const QUEUE_KEY = 'offline-action-queue';
  
  const getQueue = (): T[] => {
    try {
      const queue = localStorage.getItem(QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  };

  const addToQueue = (action: T) => {
    const queue = getQueue();
    queue.push(action);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  };

  const processQueue = async (processor: (action: T) => Promise<void>) => {
    const queue = getQueue();
    const failed: T[] = [];

    for (const action of queue) {
      try {
        await processor(action);
      } catch (error) {
        console.error('Failed to process queued action:', error);
        failed.push(action);
      }
    }

    // Update queue with failed actions only
    localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
    
    return {
      processed: queue.length - failed.length,
      failed: failed.length,
    };
  };

  const clearQueue = () => {
    localStorage.removeItem(QUEUE_KEY);
  };

  const getQueueSize = () => {
    return getQueue().length;
  };

  return {
    addToQueue,
    processQueue,
    clearQueue,
    getQueueSize,
    getQueue,
  };
}