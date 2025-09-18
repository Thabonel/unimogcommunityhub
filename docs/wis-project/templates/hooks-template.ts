// WIS React Hooks Template
// File: /src/hooks/useWIS.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { wisDataService } from '@/services/wis/wisDataService';
import type {
  WISModel,
  WISSystem,
  WISComponent,
  WISProcedure,
  WISProcedureStep
} from '@/stores/wisStore';

// Query keys for React Query caching
export const wisQueryKeys = {
  models: () => ['wis', 'models'] as const,
  systems: (modelId: string) => ['wis', 'systems', modelId] as const,
  components: (systemId: string) => ['wis', 'components', systemId] as const,
  procedures: (componentId: string) => ['wis', 'procedures', componentId] as const,
  procedureSteps: (procedureId: string) => ['wis', 'procedureSteps', procedureId] as const,
  search: (query: string, modelId?: string) => ['wis', 'search', query, modelId] as const,
};

/**
 * Hook to fetch all WIS models
 */
export function useWISModels() {
  return useQuery({
    queryKey: wisQueryKeys.models(),
    queryFn: () => wisDataService.getModels(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch systems for a specific model
 */
export function useWISSystems(modelId: string | null) {
  return useQuery({
    queryKey: wisQueryKeys.systems(modelId || ''),
    queryFn: () => modelId ? wisDataService.getSystems(modelId) : Promise.resolve([]),
    enabled: Boolean(modelId),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to fetch components for a specific system
 */
export function useWISComponents(systemId: string | null) {
  return useQuery({
    queryKey: wisQueryKeys.components(systemId || ''),
    queryFn: () => systemId ? wisDataService.getComponents(systemId) : Promise.resolve([]),
    enabled: Boolean(systemId),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to fetch procedures for a specific component
 */
export function useWISProcedures(componentId: string | null) {
  return useQuery({
    queryKey: wisQueryKeys.procedures(componentId || ''),
    queryFn: () => componentId ? wisDataService.getProcedures(componentId) : Promise.resolve([]),
    enabled: Boolean(componentId),
    staleTime: 1000 * 60 * 5, // Procedures change less frequently
    cacheTime: 1000 * 60 * 20,
  });
}

/**
 * Hook to fetch detailed steps for a specific procedure
 */
export function useWISProcedureSteps(procedureId: string | null) {
  return useQuery({
    queryKey: wisQueryKeys.procedureSteps(procedureId || ''),
    queryFn: () => procedureId ? wisDataService.getProcedureSteps(procedureId) : Promise.resolve([]),
    enabled: Boolean(procedureId),
    staleTime: 1000 * 60 * 15, // Steps are static once loaded
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook to search procedures with debouncing
 */
export function useWISSearch(query: string, modelId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: wisQueryKeys.search(query, modelId),
    queryFn: () => wisDataService.searchProcedures(query, modelId),
    enabled: enabled && query.length >= 2, // Only search with 2+ characters
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to prefetch related data for better UX
 */
export function useWISPrefetch() {
  const queryClient = useQueryClient();

  const prefetchSystems = (modelId: string) => {
    queryClient.prefetchQuery({
      queryKey: wisQueryKeys.systems(modelId),
      queryFn: () => wisDataService.getSystems(modelId),
      staleTime: 1000 * 60 * 10,
    });
  };

  const prefetchComponents = (systemId: string) => {
    queryClient.prefetchQuery({
      queryKey: wisQueryKeys.components(systemId),
      queryFn: () => wisDataService.getComponents(systemId),
      staleTime: 1000 * 60 * 10,
    });
  };

  const prefetchProcedures = (componentId: string) => {
    queryClient.prefetchQuery({
      queryKey: wisQueryKeys.procedures(componentId),
      queryFn: () => wisDataService.getProcedures(componentId),
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    prefetchSystems,
    prefetchComponents,
    prefetchProcedures,
  };
}