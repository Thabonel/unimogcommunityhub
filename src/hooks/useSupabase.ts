/**
 * React hooks for Supabase operations
 * Provides a clean interface to the SupabaseService
 */

import { useCallback, useMemo, useEffect, useState } from 'react';
import { SupabaseService, QueryOptions, MutationOptions, Result } from '@/services/core/SupabaseService';
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

// Main hook for Supabase operations
export function useSupabase() {
  const service = useMemo(() => SupabaseService.getInstance(), []);
  
  const query = useCallback(
    async <T>(table: string, options: QueryOptions = {}): Promise<Result<T>> => {
      return service.query<T>(table, options);
    },
    [service]
  );
  
  const mutate = useCallback(
    async <T>(
      table: string,
      operation: 'insert' | 'update' | 'delete' | 'upsert',
      data: any,
      options: MutationOptions = {}
    ): Promise<Result<T>> => {
      return service.mutate<T>(table, operation, data, options);
    },
    [service]
  );
  
  const subscribe = useCallback(
    (table: string, callback: (payload: any) => void, filter?: any) => {
      return service.subscribe(table, callback, filter);
    },
    [service]
  );
  
  const healthCheck = useCallback(async () => {
    return service.healthCheck();
  }, [service]);
  
  return {
    query,
    mutate,
    subscribe,
    healthCheck,
    client: service.getClient()
  };
}

// Hook for queries with React Query integration
export function useSupabaseQuery<T>(
  key: string | string[],
  table: string,
  queryOptions?: QueryOptions,
  reactQueryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { query } = useSupabase();
  
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const result = await query<T>(table, queryOptions);
      if (!result.success) {
        throw result.error;
      }
      return result.data!;
    },
    retry: false, // We handle retries in SupabaseService
    ...reactQueryOptions
  });
}

// Hook for mutations with React Query integration
export function useSupabaseMutation<T, V = any>(
  table: string,
  operation: 'insert' | 'update' | 'delete' | 'upsert',
  mutationOptions?: MutationOptions,
  reactMutationOptions?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
) {
  const { mutate } = useSupabase();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: V) => {
      const result = await mutate<T>(table, operation, data, mutationOptions);
      if (!result.success) {
        throw result.error;
      }
      return result.data!;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [table] });
    },
    ...reactMutationOptions
  });
}

// Hook for realtime subscriptions
export function useSupabaseSubscription(
  table: string,
  callback: (payload: any) => void,
  filter?: any,
  deps: any[] = []
) {
  const { subscribe } = useSupabase();
  
  useEffect(() => {
    const channel = subscribe(table, callback, filter);
    
    return () => {
      channel.unsubscribe();
    };
  }, [table, ...deps]);
}

// Hook for health monitoring
export function useSupabaseHealth(intervalMs = 30000) {
  const { healthCheck } = useSupabase();
  const [health, setHealth] = useState<{
    healthy: boolean;
    latency: number;
    circuitBreaker: any;
  } | null>(null);
  
  useEffect(() => {
    const check = async () => {
      const result = await healthCheck();
      setHealth(result);
    };
    
    // Initial check
    check();
    
    // Set up interval
    const interval = setInterval(check, intervalMs);
    
    return () => clearInterval(interval);
  }, [healthCheck, intervalMs]);
  
  return health;
}

// Hook for metrics
export function useSupabaseMetrics(metricName?: string) {
  const service = useMemo(() => SupabaseService.getInstance(), []);
  const [metrics, setMetrics] = useState<any>(null);
  
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(service.getMetrics(metricName));
    };
    
    // Initial fetch
    updateMetrics();
    
    // Listen for metric updates
    const listener = () => updateMetrics();
    service.on('metric', listener);
    
    return () => {
      service.off('metric', listener);
    };
  }, [service, metricName]);
  
  return metrics;
}

// Example usage hooks for common operations

// Hook for fetching user profile
export function useProfile(userId?: string) {
  const { client } = useSupabase();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!userId) {
      client.auth.getUser().then(({ data }) => {
        setCurrentUserId(data.user?.id || null);
      });
    }
  }, [client, userId]);
  
  const id = userId || currentUserId;
  
  return useSupabaseQuery(
    ['profile', id],
    'profiles',
    {
      filters: id ? [{ column: 'id', operator: 'eq', value: id }] : undefined
    },
    {
      enabled: !!id
    }
  );
}

// Hook for updating profile
export function useUpdateProfile() {
  return useSupabaseMutation(
    'profiles',
    'update',
    {
      retryOptions: {
        maxRetries: 2,
        backoff: 'exponential'
      }
    }
  );
}