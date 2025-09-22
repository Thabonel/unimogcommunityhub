// WIS API Hooks - React Query hooks for WIS data fetching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import {
  WISModel,
  WISTreeNode,
  WISProcedure,
  WISProcedureStep,
  WISPart,
  WISTool,
  WISServiceBulletin,
  WISRelatedProcedure,
  WISSearchResult,
  WISBookmark,
} from '@/stores/wisStore';

// Query keys for caching
export const WIS_QUERY_KEYS = {
  models: ['wis', 'models'] as const,
  tree: (modelId: string, searchQuery?: string) => ['wis', 'tree', modelId, searchQuery] as const,
  procedure: (procedureId: string) => ['wis', 'procedure', procedureId] as const,
  procedureSteps: (procedureId: string) => ['wis', 'procedure', procedureId, 'steps'] as const,
  procedureParts: (procedureId: string) => ['wis', 'procedure', procedureId, 'parts'] as const,
  procedureTools: (procedureId: string) => ['wis', 'procedure', procedureId, 'tools'] as const,
  relatedProcedures: (procedureId: string) => ['wis', 'procedure', procedureId, 'related'] as const,
  serviceBulletins: (procedureId: string) => ['wis', 'procedure', procedureId, 'bulletins'] as const,
  search: (query: string, type: string, modelId?: string) => ['wis', 'search', query, type, modelId] as const,
  bookmarks: ['wis', 'bookmarks'] as const,
};

// Cache configuration
const WIS_CACHE_CONFIG = {
  models: { staleTime: 60 * 60 * 1000 }, // 1 hour (rarely changes)
  tree: { staleTime: 15 * 60 * 1000 },   // 15 minutes
  procedures: { staleTime: 30 * 60 * 1000 }, // 30 minutes
  search: { staleTime: 2 * 60 * 1000 },   // 2 minutes
  bulletins: { staleTime: 5 * 60 * 1000 }, // 5 minutes (may update frequently)
};

// Hook: Get all WIS models
export const useWISModels = () => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.models,
    queryFn: async (): Promise<WISModel[]> => {
      const { data, error } = await supabase
        .from('wis_models')
        .select('*')
        .eq('active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    },
    ...WIS_CACHE_CONFIG.models,
  });
};

// Hook: Get hierarchical tree structure for a model
export const useWISTree = (modelId?: string, searchQuery?: string) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.tree(modelId || '', searchQuery),
    queryFn: async (): Promise<WISTreeNode[]> => {
      const { data, error } = await supabase.rpc('get_wis_tree', {
        model_id: modelId || null,
        search_query: searchQuery || null,
      });

      if (error) throw error;

      // Transform flat results into hierarchical tree structure
      const nodes = data || [];
      const nodeMap = new Map<string, WISTreeNode>();
      const rootNodes: WISTreeNode[] = [];

      // First pass: create all nodes
      nodes.forEach((node: any) => {
        const treeNode: WISTreeNode = {
          id: node.id,
          type: node.type,
          code: node.code,
          name: node.name,
          description: node.description,
          parent_id: node.parent_id,
          level: node.level,
          procedure_count: node.procedure_count || 0,
          estimated_time: node.estimated_time,
          icon_name: node.icon_name,
          sort_order: node.sort_order || 0,
          children: [],
          expanded: false,
        };
        nodeMap.set(node.id, treeNode);
      });

      // Second pass: build hierarchy
      nodeMap.forEach((node) => {
        if (node.parent_id && nodeMap.has(node.parent_id)) {
          const parent = nodeMap.get(node.parent_id)!;
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          rootNodes.push(node);
        }
      });

      // Sort children by sort_order
      const sortChildren = (nodes: WISTreeNode[]) => {
        nodes.sort((a, b) => a.sort_order - b.sort_order);
        nodes.forEach((node) => {
          if (node.children) {
            sortChildren(node.children);
          }
        });
      };

      sortChildren(rootNodes);
      return rootNodes;
    },
    enabled: !!modelId || !!searchQuery,
    ...WIS_CACHE_CONFIG.tree,
  });
};

// Hook: Get detailed procedure information
export const useWISProcedure = (procedureId?: string) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.procedure(procedureId || ''),
    queryFn: async (): Promise<WISProcedure | null> => {
      if (!procedureId) return null;

      const { data, error } = await supabase.rpc('get_wis_procedure_details', {
        procedure_id: procedureId,
      });

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!procedureId,
    ...WIS_CACHE_CONFIG.procedures,
  });
};

// Hook: Get procedure steps
export const useWISProcedureSteps = (procedureId?: string) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.procedureSteps(procedureId || ''),
    queryFn: async (): Promise<WISProcedureStep[]> => {
      if (!procedureId) return [];

      const { data, error } = await supabase
        .from('wis_procedure_steps')
        .select('*')
        .eq('procedure_id', procedureId)
        .order('step_number');

      if (error) throw error;
      return data || [];
    },
    enabled: !!procedureId,
    ...WIS_CACHE_CONFIG.procedures,
  });
};

// Hook: Get procedure parts
export const useWISProcedureParts = (procedureId?: string) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.procedureParts(procedureId || ''),
    queryFn: async (): Promise<WISPart[]> => {
      if (!procedureId) return [];

      const { data, error } = await supabase.rpc('get_procedure_parts', {
        procedure_id: procedureId,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!procedureId,
    ...WIS_CACHE_CONFIG.procedures,
  });
};

// Hook: Get procedure tools
export const useWISProcedureTools = (procedureId?: string) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.procedureTools(procedureId || ''),
    queryFn: async (): Promise<WISTool[]> => {
      if (!procedureId) return [];

      const { data, error } = await supabase.rpc('get_procedure_tools', {
        procedure_id: procedureId,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!procedureId,
    ...WIS_CACHE_CONFIG.procedures,
  });
};

// Hook: Get related procedures
export const useWISRelatedProcedures = (procedureId?: string) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.relatedProcedures(procedureId || ''),
    queryFn: async (): Promise<WISRelatedProcedure[]> => {
      if (!procedureId) return [];

      const { data, error } = await supabase.rpc('get_related_procedures', {
        procedure_id: procedureId,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!procedureId,
    ...WIS_CACHE_CONFIG.procedures,
  });
};

// Hook: Get service bulletins for procedure
export const useWISServiceBulletins = (procedureId?: string) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.serviceBulletins(procedureId || ''),
    queryFn: async (): Promise<WISServiceBulletin[]> => {
      if (!procedureId) return [];

      const { data, error } = await supabase.rpc('get_procedure_bulletins', {
        procedure_id: procedureId,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!procedureId,
    ...WIS_CACHE_CONFIG.bulletins,
  });
};

// Hook: Search WIS content
export const useWISSearch = (
  query: string,
  searchType: 'all' | 'procedures' | 'parts' | 'bulletins' = 'all',
  modelId?: string,
  systemId?: string
) => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.search(query, searchType, modelId),
    queryFn: async (): Promise<WISSearchResult[]> => {
      if (!query || query.length < 2) return [];

      const { data, error } = await supabase.rpc('wis_comprehensive_search', {
        search_query: query,
        search_type: searchType,
        model_id: modelId || null,
        system_id: systemId || null,
        limit_results: 50,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: query.length > 2,
    ...WIS_CACHE_CONFIG.search,
  });
};

// Hook: Get user bookmarks
export const useWISBookmarks = () => {
  return useQuery({
    queryKey: WIS_QUERY_KEYS.bookmarks,
    queryFn: async (): Promise<WISBookmark[]> => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return [];

      const { data, error } = await supabase
        .from('wis_user_bookmarks')
        .select(`
          *,
          procedure:wis_procedures(
            procedure_code,
            title,
            estimated_time_hours
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    ...WIS_CACHE_CONFIG.procedures,
  });
};

// Hook: Bookmark mutations
export const useWISBookmarkMutations = () => {
  const queryClient = useQueryClient();

  const addBookmark = useMutation({
    mutationFn: async ({ procedureId, notes }: { procedureId: string; notes?: string }) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('wis_user_bookmarks')
        .insert({
          user_id: user.id,
          procedure_id: procedureId,
          personal_notes: notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIS_QUERY_KEYS.bookmarks });
    },
  });

  const removeBookmark = useMutation({
    mutationFn: async (bookmarkId: string) => {
      const { error } = await supabase
        .from('wis_user_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIS_QUERY_KEYS.bookmarks });
    },
  });

  const updateBookmark = useMutation({
    mutationFn: async ({
      bookmarkId,
      updates,
    }: {
      bookmarkId: string;
      updates: Partial<Pick<WISBookmark, 'personal_notes' | 'completion_notes' | 'rating'>>;
    }) => {
      const { data, error } = await supabase
        .from('wis_user_bookmarks')
        .update(updates)
        .eq('id', bookmarkId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIS_QUERY_KEYS.bookmarks });
    },
  });

  const markCompleted = useMutation({
    mutationFn: async ({
      bookmarkId,
      completionNotes,
      rating,
    }: {
      bookmarkId: string;
      completionNotes?: string;
      rating?: number;
    }) => {
      const { data, error } = await supabase
        .from('wis_user_bookmarks')
        .update({
          completed_at: new Date().toISOString(),
          completion_notes: completionNotes,
          rating,
        })
        .eq('id', bookmarkId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WIS_QUERY_KEYS.bookmarks });
    },
  });

  return {
    addBookmark,
    removeBookmark,
    updateBookmark,
    markCompleted,
  };
};

// Hook: Combined WIS data for a specific procedure
export const useWISProcedureComplete = (procedureId?: string) => {
  const procedure = useWISProcedure(procedureId);
  const steps = useWISProcedureSteps(procedureId);
  const parts = useWISProcedureParts(procedureId);
  const tools = useWISProcedureTools(procedureId);
  const related = useWISRelatedProcedures(procedureId);
  const bulletins = useWISServiceBulletins(procedureId);

  return {
    procedure: procedure.data,
    steps: steps.data || [],
    parts: parts.data || [],
    tools: tools.data || [],
    related: related.data || [],
    bulletins: bulletins.data || [],
    isLoading: [procedure, steps, parts, tools, related, bulletins].some(query => query.isLoading),
    isError: [procedure, steps, parts, tools, related, bulletins].some(query => query.isError),
    errors: [procedure, steps, parts, tools, related, bulletins]
      .map(query => query.error)
      .filter(Boolean),
  };
};

// Hook: Prefetch related data for better UX
export const useWISPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchProcedure = (procedureId: string) => {
    // Prefetch procedure details
    queryClient.prefetchQuery({
      queryKey: WIS_QUERY_KEYS.procedure(procedureId),
      queryFn: async () => {
        const { data, error } = await supabase.rpc('get_wis_procedure_details', {
          procedure_id: procedureId,
        });
        if (error) throw error;
        return data?.[0] || null;
      },
      staleTime: WIS_CACHE_CONFIG.procedures.staleTime,
    });

    // Prefetch procedure steps
    queryClient.prefetchQuery({
      queryKey: WIS_QUERY_KEYS.procedureSteps(procedureId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('wis_procedure_steps')
          .select('*')
          .eq('procedure_id', procedureId)
          .order('step_number');
        if (error) throw error;
        return data || [];
      },
      staleTime: WIS_CACHE_CONFIG.procedures.staleTime,
    });
  };

  const prefetchTreeData = (modelId: string) => {
    queryClient.prefetchQuery({
      queryKey: WIS_QUERY_KEYS.tree(modelId),
      queryFn: async () => {
        const { data, error } = await supabase.rpc('get_wis_tree', {
          model_id: modelId,
          search_query: null,
        });
        if (error) throw error;
        return data || [];
      },
      staleTime: WIS_CACHE_CONFIG.tree.staleTime,
    });
  };

  return {
    prefetchProcedure,
    prefetchTreeData,
  };
};

// Hook: Voice search functionality
export const useVoiceSearch = () => {
  const queryClient = useQueryClient();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    return new Promise<string>((resolve, reject) => {
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    });
  };

  return { startListening };
};

// Hook: WIS analytics and usage tracking
export const useWISAnalytics = () => {
  const trackProcedureView = useMutation({
    mutationFn: async (procedureId: string) => {
      // This would integrate with your analytics system
      // For now, we'll just log it
      console.log('Tracking procedure view:', procedureId);
    },
  });

  const trackSearch = useMutation({
    mutationFn: async ({ query, resultCount }: { query: string; resultCount: number }) => {
      console.log('Tracking search:', { query, resultCount });
    },
  });

  const trackStepCompletion = useMutation({
    mutationFn: async ({ procedureId, stepNumber }: { procedureId: string; stepNumber: number }) => {
      console.log('Tracking step completion:', { procedureId, stepNumber });
    },
  });

  return {
    trackProcedureView,
    trackSearch,
    trackStepCompletion,
  };
};