
import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook to manage request lifecycle and abort controllers
 */
export const useRequestController = () => {
  const mountedRef = useRef(true);
  const processingRef = useRef(false);
  const activeRequestsRef = useRef<AbortController[]>([]);
  
  // Cancel any active requests
  const cancelActiveRequests = useCallback(() => {
    activeRequestsRef.current.forEach(controller => {
      try {
        controller.abort();
      } catch (e) {
        // Ignore errors from aborting
      }
    });
    activeRequestsRef.current = [];
  }, []);
  
  // Create a new abort controller for a request
  const createRequestController = useCallback(() => {
    const controller = new AbortController();
    activeRequestsRef.current.push(controller);
    return controller;
  }, []);
  
  // Set mounted ref to false on unmount and cancel active requests
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      processingRef.current = false;
      cancelActiveRequests();
    };
  }, [cancelActiveRequests]);
  
  return {
    mountedRef,
    processingRef,
    createRequestController,
    cancelActiveRequests,
    activeRequestsRef
  };
};
