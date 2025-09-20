// WIS Store - Zustand state management for the WIS (Workshop Information System)
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

// Type definitions for WIS data structures
export interface WISModel {
  id: string;
  model_code: string;
  model_name: string;
  description?: string;
  year_range?: string;
  image_url?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  alias_of?: string; // Reference to another model's ID for aliasing
}

export interface WISSystem {
  id: string;
  model_id: string;
  system_code: string;
  system_name: string;
  description?: string;
  icon_name?: string;
  sort_order: number;
  estimated_procedures: number;
  created_at: string;
}

export interface WISComponent {
  id: string;
  system_id: string;
  component_code: string;
  component_name: string;
  description?: string;
  sort_order: number;
  estimated_procedures: number;
  created_at: string;
}

export interface WISProcedure {
  id: string;
  component_id: string;
  procedure_code: string;
  title: string;
  description?: string;
  estimated_time_hours?: number;
  difficulty_level?: number;
  labor_category?: string;
  overview?: string;
  safety_warnings?: string[];
  special_notes?: string[];
  version: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Navigation context
  model_code?: string;
  model_name?: string;
  system_code?: string;
  system_name?: string;
  component_code?: string;
  component_name?: string;
}

export interface WISProcedureStep {
  id: string;
  procedure_id: string;
  step_number: number;
  step_title?: string;
  instruction: string;
  detailed_notes?: string;
  safety_warnings?: string[];
  torque_specs?: Record<string, any>;
  measurements?: Record<string, any>;
  primary_image_url?: string;
  additional_image_urls?: string[];
  video_url?: string;
  diagram_urls?: string[];
  verification_points?: string[];
  common_mistakes?: string[];
  created_at: string;
}

export interface WISPart {
  id: string;
  mercedes_part_number: string;
  description: string;
  category?: string;
  quantity: number;
  usage_note?: string;
  required: boolean;
  step_numbers?: number[];
  specifications?: Record<string, any>;
  status: string;
  alternative_parts?: string[];
}

export interface WISTool {
  id: string;
  tool_name: string;
  tool_type?: string;
  mercedes_tool_number?: string;
  description?: string;
  required: boolean;
  usage_note?: string;
  step_numbers?: number[];
  specifications?: Record<string, any>;
  alternative_tools?: string[];
}

export interface WISServiceBulletin {
  id: string;
  bulletin_number: string;
  title: string;
  description?: string;
  content?: string;
  effective_date?: string;
  severity: string;
  category?: string;
  relationship_type?: string;
  notes?: string;
  pdf_url?: string;
}

export interface WISRelatedProcedure {
  id: string;
  procedure_code: string;
  title: string;
  description?: string;
  estimated_time_hours?: number;
  relationship_type: string;
  relationship_description?: string;
  sequence_order?: number;
}

export interface WISTreeNode {
  id: string;
  type: 'model' | 'system' | 'component' | 'procedure';
  code: string;
  name: string;
  description?: string;
  parent_id?: string;
  level: number;
  procedure_count: number;
  estimated_time?: number;
  icon_name?: string;
  sort_order: number;
  children?: WISTreeNode[];
  expanded?: boolean;
}

export interface WISSearchResult {
  result_type: 'procedure' | 'bulletin' | 'part';
  id: string;
  title: string;
  description?: string;
  code: string;
  model_code?: string;
  system_code?: string;
  component_code?: string;
  rank: number;
}

export interface WISBookmark {
  id: string;
  procedure_id: string;
  personal_notes?: string;
  completion_notes?: string;
  rating?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Search and navigation state
export interface WISSearchState {
  query: string;
  searchType: 'all' | 'procedures' | 'parts' | 'bulletins';
  isSearching: boolean;
  results: WISSearchResult[];
  recentSearches: string[];
}

export interface WISNavigationState {
  selectedModel?: string;
  selectedSystem?: string;
  selectedComponent?: string;
  selectedProcedure?: string;
  expandedNodes: Set<string>;
  navigationHistory: string[];
  breadcrumb: Array<{
    id: string;
    type: string;
    name: string;
    code: string;
  }>;
}

export interface WISUIState {
  sidebarOpen: boolean;
  activeTab: 'overview' | 'steps' | 'tools' | 'parts' | 'diagrams' | 'bulletins';
  currentStep: number;
  viewMode: 'tree' | 'search';
  loading: boolean;
  error?: string;
  isVoiceSearching: boolean;
}

export interface WISCacheState {
  models: WISModel[];
  treeData: Record<string, WISTreeNode[]>;
  procedures: Record<string, WISProcedure>;
  procedureSteps: Record<string, WISProcedureStep[]>;
  procedureParts: Record<string, WISPart[]>;
  procedureTools: Record<string, WISTool[]>;
  relatedProcedures: Record<string, WISRelatedProcedure[]>;
  serviceBulletins: Record<string, WISServiceBulletin[]>;
  bookmarks: WISBookmark[];
  lastUpdated: Record<string, number>;
}

// Main store interface
export interface WISStore {
  // State
  navigation: WISNavigationState;
  search: WISSearchState;
  ui: WISUIState;
  cache: WISCacheState;

  // Navigation actions
  setSelectedModel: (modelId?: string) => void;
  setSelectedSystem: (systemId?: string) => void;
  setSelectedComponent: (componentId?: string) => void;
  setSelectedProcedure: (procedureId?: string) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  navigateBack: () => void;
  navigateForward: () => void;
  clearNavigation: () => void;
  updateBreadcrumb: () => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchType: (type: 'all' | 'procedures' | 'parts' | 'bulletins') => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
  setSearchResults: (results: WISSearchResult[]) => void;

  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: 'overview' | 'steps' | 'tools' | 'parts' | 'diagrams' | 'bulletins') => void;
  setCurrentStep: (step: number) => void;
  setViewMode: (mode: 'tree' | 'search') => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  setVoiceSearching: (isSearching: boolean) => void;

  // Cache actions
  loadModels: () => Promise<void>;
  loadCategories: () => Promise<void>;
  setModels: (models: WISModel[]) => void;
  setTreeData: (modelId: string, data: WISTreeNode[]) => void;
  setProcedure: (procedureId: string, procedure: WISProcedure) => void;
  setProcedureSteps: (procedureId: string, steps: WISProcedureStep[]) => void;
  setProcedureParts: (procedureId: string, parts: WISPart[]) => void;
  setProcedureTools: (procedureId: string, tools: WISTool[]) => void;
  setRelatedProcedures: (procedureId: string, related: WISRelatedProcedure[]) => void;
  setServiceBulletins: (procedureId: string, bulletins: WISServiceBulletin[]) => void;
  setBookmarks: (bookmarks: WISBookmark[]) => void;

  // Utility actions
  setUserContext: (context: { userId?: string; vehicleModel?: string; preferences?: any }) => void;
  getCachedData: <T>(key: string) => T | undefined;
  isCacheValid: (key: string, maxAge?: number) => boolean;
  clearCache: () => void;
  reset: () => void;
}

// Initial state values
const initialNavigationState: WISNavigationState = {
  selectedModel: undefined,
  selectedSystem: undefined,
  selectedComponent: undefined,
  selectedProcedure: undefined,
  expandedNodes: new Set(),
  navigationHistory: [],
  breadcrumb: [],
};

const initialSearchState: WISSearchState = {
  query: '',
  searchType: 'all',
  isSearching: false,
  results: [],
  recentSearches: [],
};

const initialUIState: WISUIState = {
  sidebarOpen: true,
  activeTab: 'overview',
  currentStep: 1,
  viewMode: 'tree',
  loading: false,
  error: undefined,
  isVoiceSearching: false,
};

const initialCacheState: WISCacheState = {
  models: [],
  systems: {},
  components: {},
  proceduresList: {},
  treeData: {},
  procedures: {},
  procedureSteps: {},
  procedureParts: {},
  procedureTools: {},
  relatedProcedures: {},
  serviceBulletins: {},
  bookmarks: [],
  lastUpdated: {},
};

// Helper function to resolve model aliases
const resolveModelAlias = (modelCode: string, models: WISModel[]): string => {
  const model = models.find(m => m.model_code === modelCode);
  if (model?.alias_of) {
    // Find the target model and return its code
    const targetModel = models.find(m => m.id === model.alias_of);
    return targetModel?.model_code || modelCode;
  }
  return modelCode;
};

// Create the WIS store
export const useWISStore = create<WISStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        navigation: initialNavigationState,
        search: initialSearchState,
        ui: initialUIState,
        cache: initialCacheState,

        // Navigation actions
        setSelectedModel: (modelId) => {
          set((state) => {
            // Clear downstream selections when model changes
            const newNavigation = {
              ...state.navigation,
              selectedModel: modelId,
              selectedSystem: undefined,
              selectedComponent: undefined,
              selectedProcedure: undefined,
            };

            // Add to history if changing
            if (modelId && modelId !== state.navigation.selectedModel) {
              newNavigation.navigationHistory = [
                ...state.navigation.navigationHistory,
                `model:${modelId}`,
              ].slice(-20); // Keep last 20 items
            }

            return {
              navigation: newNavigation,
              ui: { ...state.ui, viewMode: 'tree' },
            };
          });
        },

        setSelectedSystem: (systemId) => {
          set((state) => {
            const newNavigation = {
              ...state.navigation,
              selectedSystem: systemId,
              selectedComponent: undefined,
              selectedProcedure: undefined,
            };

            if (systemId && systemId !== state.navigation.selectedSystem) {
              newNavigation.navigationHistory = [
                ...state.navigation.navigationHistory,
                `system:${systemId}`,
              ].slice(-20);
            }

            return { navigation: newNavigation };
          });
        },

        setSelectedComponent: (componentId) => {
          set((state) => {
            const newNavigation = {
              ...state.navigation,
              selectedComponent: componentId,
              selectedProcedure: undefined,
            };

            if (componentId && componentId !== state.navigation.selectedComponent) {
              newNavigation.navigationHistory = [
                ...state.navigation.navigationHistory,
                `component:${componentId}`,
              ].slice(-20);
            }

            return { navigation: newNavigation };
          });
        },

        setSelectedProcedure: (procedureId) => {
          set((state) => {
            const newNavigation = {
              ...state.navigation,
              selectedProcedure: procedureId,
            };

            if (procedureId && procedureId !== state.navigation.selectedProcedure) {
              newNavigation.navigationHistory = [
                ...state.navigation.navigationHistory,
                `procedure:${procedureId}`,
              ].slice(-20);
            }

            return {
              navigation: newNavigation,
              ui: { ...state.ui, activeTab: 'overview', currentStep: 1 },
            };
          });
        },

        toggleNodeExpansion: (nodeId) => {
          set((state) => {
            const expandedNodes = new Set(state.navigation.expandedNodes);
            if (expandedNodes.has(nodeId)) {
              expandedNodes.delete(nodeId);
            } else {
              expandedNodes.add(nodeId);
            }
            return {
              navigation: { ...state.navigation, expandedNodes },
            };
          });
        },

        navigateBack: () => {
          set((state) => {
            const history = [...state.navigation.navigationHistory];
            if (history.length > 1) {
              history.pop(); // Remove current
              const previous = history[history.length - 1];
              if (previous) {
                const [type, id] = previous.split(':');
                // Reset appropriate selection based on type
                const newNavigation = { ...state.navigation, navigationHistory: history };

                if (type === 'model') {
                  newNavigation.selectedModel = id;
                  newNavigation.selectedSystem = undefined;
                  newNavigation.selectedComponent = undefined;
                  newNavigation.selectedProcedure = undefined;
                } else if (type === 'system') {
                  newNavigation.selectedSystem = id;
                  newNavigation.selectedComponent = undefined;
                  newNavigation.selectedProcedure = undefined;
                } else if (type === 'component') {
                  newNavigation.selectedComponent = id;
                  newNavigation.selectedProcedure = undefined;
                } else if (type === 'procedure') {
                  newNavigation.selectedProcedure = id;
                }

                return { navigation: newNavigation };
              }
            }
            return state;
          });
        },

        navigateForward: () => {
          // Implementation for forward navigation if needed
        },

        clearNavigation: () => {
          set((state) => ({
            navigation: {
              ...initialNavigationState,
              expandedNodes: state.navigation.expandedNodes, // Keep expanded state
            },
            ui: { ...state.ui, activeTab: 'overview', currentStep: 1 },
          }));
        },

        updateBreadcrumb: () => {
          set((state) => {
            const breadcrumb: typeof state.navigation.breadcrumb = [];
            const { cache } = state;

            // Add model to breadcrumb
            if (state.navigation.selectedModel) {
              const model = cache.models.find(m => m.id === state.navigation.selectedModel);
              if (model) {
                breadcrumb.push({
                  id: model.id,
                  type: 'model',
                  name: model.model_name,
                  code: model.model_code,
                });
              }
            }

            // Add system, component, procedure to breadcrumb
            // This would require additional cache lookups based on IDs
            // Implementation can be expanded based on actual cache structure

            return {
              navigation: { ...state.navigation, breadcrumb },
            };
          });
        },

        // Search actions
        setSearchQuery: (query) => {
          set((state) => ({
            search: { ...state.search, query },
          }));
        },

        setSearchType: (searchType) => {
          set((state) => ({
            search: { ...state.search, searchType },
          }));
        },

        performSearch: async (query) => {
          if (!query || query.length < 2) {
            get().clearSearch();
            return;
          }

          set((state) => ({
            search: { ...state.search, isSearching: true },
            ui: { ...state.ui, loading: true, error: undefined, viewMode: 'search' },
          }));

          try {
            // Import wisDataService dynamically to avoid circular imports
            const { wisDataService } = await import('@/services/wis/wisDataService');

            const currentState = get();
            const selectedModel = currentState.navigation.selectedModel;

            // Resolve model alias if needed for search
            const resolvedModel = selectedModel ? resolveModelAlias(selectedModel, currentState.cache.models) : selectedModel;

            console.log(`Searching procedures for model ${selectedModel}${resolvedModel !== selectedModel ? ` (resolved to ${resolvedModel})` : ''}`);

            // Perform search using the real WIS API
            const results = await wisDataService.searchProcedures(
              query,
              resolvedModel,
              50 // limit
            );

            // Transform API results to WISSearchResult format
            const transformedResults: WISSearchResult[] = results.map((result: any) => ({
              id: result.id,
              title: result.procedure_title || result.title,
              description: result.description || result.overview || 'No description available',
              type: 'procedure',
              modelCode: result.model_code || selectedModel,
              systemCode: result.system_code,
              componentCode: result.component_code,
              procedureCode: result.procedure_code,
              relevanceScore: 1.0, // searchProcedures doesn't return relevance score
              estimatedTime: result.estimated_duration || result.estimated_time,
              difficulty: result.difficulty_level ? `Level ${result.difficulty_level}` : undefined,
              tags: [], // searchProcedures doesn't return tags
              lastUpdated: result.updated_at ? new Date(result.updated_at) : new Date(),
            }));

            get().setSearchResults(transformedResults);
            get().addRecentSearch(query);
          } catch (error) {
            console.error('Search failed:', error);
            set((state) => ({
              ui: { ...state.ui, error: error instanceof Error ? error.message : 'Search failed' },
            }));
          } finally {
            set((state) => ({
              search: { ...state.search, isSearching: false },
              ui: { ...state.ui, loading: false },
            }));
          }
        },

        clearSearch: () => {
          set((state) => ({
            search: { ...state.search, query: '', results: [], isSearching: false },
            ui: { ...state.ui, viewMode: 'tree' },
          }));
        },

        addRecentSearch: (query) => {
          set((state) => {
            const recentSearches = [
              query,
              ...state.search.recentSearches.filter(q => q !== query),
            ].slice(0, 10); // Keep last 10 searches

            return {
              search: { ...state.search, recentSearches },
            };
          });
        },

        setSearchResults: (results) => {
          set((state) => ({
            search: { ...state.search, results },
          }));
        },

        // UI actions
        setSidebarOpen: (sidebarOpen) => {
          set((state) => ({
            ui: { ...state.ui, sidebarOpen },
          }));
        },

        setActiveTab: (activeTab) => {
          set((state) => ({
            ui: { ...state.ui, activeTab },
          }));
        },

        setCurrentStep: (currentStep) => {
          set((state) => ({
            ui: { ...state.ui, currentStep },
          }));
        },

        setViewMode: (viewMode) => {
          set((state) => ({
            ui: { ...state.ui, viewMode },
          }));
        },

        setLoading: (loading) => {
          set((state) => ({
            ui: { ...state.ui, loading },
          }));
        },

        setError: (error) => {
          set((state) => ({
            ui: { ...state.ui, error },
          }));
        },

        setVoiceSearching: (isVoiceSearching) => {
          set((state) => ({
            ui: { ...state.ui, isVoiceSearching },
          }));
        },

        // Cache actions
        loadModels: async () => {
          try {
            set((state) => ({ ui: { ...state.ui, loading: true, error: undefined } }));

            // Import wisDataService dynamically to avoid circular imports
            const { wisDataService } = await import('@/services/wis/wisDataService');
            const models = await wisDataService.getModels();

            // Transform API response to WISModel format
            const transformedModels: WISModel[] = models.map((model: any) => ({
              id: model.id || model.model_code,
              model_code: model.model_code,
              model_name: model.model_name,
              description: model.description,
              year_range: model.year_start && model.year_end ? `${model.year_start}-${model.year_end}` : undefined,
              image_url: model.image_url,
              active: model.is_active ?? true,
              sort_order: model.sort_order || 0,
              created_at: model.created_at || new Date().toISOString(),
              alias_of: model.alias_of, // Include alias information
            }));

            get().setModels(transformedModels);
          } catch (error) {
            console.error('Failed to load models:', error);
            set((state) => ({
              ui: { ...state.ui, error: error instanceof Error ? error.message : 'Failed to load models' },
            }));
          } finally {
            set((state) => ({ ui: { ...state.ui, loading: false } }));
          }
        },

        loadCategories: async () => {
          try {
            set((state) => ({ ui: { ...state.ui, loading: true, error: undefined } }));

            // Import wisDataService dynamically to avoid circular imports
            const { wisDataService } = await import('@/services/wis/wisDataService');

            // For now, we'll load systems instead of categories since that's what's available
            // Categories could be derived from systems if needed
            const selectedModel = get().navigation.selectedModel;
            if (selectedModel) {
              const systems = await wisDataService.getSystems(selectedModel);
              console.log('Systems loaded as categories:', systems);
            } else {
              console.log('No selected model for loading categories');
            }
          } catch (error) {
            console.error('Failed to load categories:', error);
            set((state) => ({
              ui: { ...state.ui, error: error instanceof Error ? error.message : 'Failed to load categories' },
            }));
          } finally {
            set((state) => ({ ui: { ...state.ui, loading: false } }));
          }
        },

        setModels: (models) => {
          set((state) => ({
            cache: {
              ...state.cache,
              models,
              lastUpdated: { ...state.cache.lastUpdated, models: Date.now() },
            },
          }));
        },

        // Load systems for a specific model
        loadSystems: async (modelId: string) => {
          if (!modelId) {
            console.warn('loadSystems: modelId is required');
            return;
          }

          try {
            set((state) => ({ ui: { ...state.ui, loading: true, error: undefined } }));

            // Ensure models are loaded first for UUID resolution
            const currentState = get();
            if (!currentState.cache.models || currentState.cache.models.length === 0) {
              console.log('Models not loaded, loading them first...');
              await get().loadModels();
            }

            // Get fresh state after loading models
            const refreshedState = get();
            const resolvedModelId = resolveModelAlias(modelId, refreshedState.cache.models);

            // Convert model code to UUID for database query
            const resolveModelCodeToUUID = (modelCode: string): string => {
              const models = refreshedState.cache.models;
              const model = models.find(m => m.model_code === modelCode);
              return model?.id || modelCode; // Fallback to original if not found
            };

            const modelUUID = resolveModelCodeToUUID(resolvedModelId);

            console.log(`Loading systems for model ${modelId}${resolvedModelId !== modelId ? ` (resolved to ${resolvedModelId})` : ''} (UUID: ${modelUUID})`);

            // Import wisDataService dynamically to avoid circular imports
            const { wisDataService } = await import('@/services/wis/wisDataService');
            const systems = await wisDataService.getSystems(modelUUID);

            // Transform API response to WISSystem format with defensive programming
            const transformedSystems: WISSystem[] = (systems || []).map((system: any) => ({
              id: system.id || `system_${Date.now()}`,
              model_id: system.model_id || modelId,
              system_code: system.system_code || '',
              system_name: system.system_name || 'Unknown System',
              description: system.description || '',
              icon_name: system.icon_name || 'wrench',
              sort_order: system.sort_order || 0,
              estimated_procedures: system.estimated_procedures || 0,
              created_at: system.created_at || new Date().toISOString(),
            }));

            // Store in cache
            set((state) => ({
              cache: {
                ...state.cache,
                systems: { ...state.cache.systems, [modelId]: transformedSystems },
                lastUpdated: { ...state.cache.lastUpdated, [`systems_${modelId}`]: Date.now() },
              },
            }));

            console.log(`Loaded ${transformedSystems.length} systems for model ${modelId}`);
          } catch (error) {
            console.error('Failed to load systems:', error);

            // Fallback to static mock data to prevent complete failure
            const staticSystems: WISSystem[] = [
              {
                id: 'static_engine',
                model_id: modelId,
                system_code: '01',
                system_name: 'Engine Management',
                description: 'Engine control and diagnostics',
                icon_name: 'engine',
                sort_order: 1,
                estimated_procedures: 45,
                created_at: new Date().toISOString(),
              },
              {
                id: 'static_transmission',
                model_id: modelId,
                system_code: '02',
                system_name: 'Transmission',
                description: 'Transmission and drivetrain',
                icon_name: 'gear',
                sort_order: 2,
                estimated_procedures: 32,
                created_at: new Date().toISOString(),
              },
              {
                id: 'static_hydraulics',
                model_id: modelId,
                system_code: '03',
                system_name: 'Hydraulic Systems',
                description: 'Hydraulic pump and controls',
                icon_name: 'hydraulic',
                sort_order: 3,
                estimated_procedures: 28,
                created_at: new Date().toISOString(),
              }
            ];

            console.log(`Database failed, using static fallback data for model ${modelId}`);

            set((state) => ({
              ui: { ...state.ui, error: undefined }, // Clear error since we have fallback
              cache: {
                ...state.cache,
                systems: { ...state.cache.systems, [modelId]: staticSystems },
              },
            }));
          } finally {
            set((state) => ({ ui: { ...state.ui, loading: false } }));
          }
        },

        // Load components for a specific system
        loadComponents: async (systemId: string) => {
          if (!systemId) {
            console.warn('loadComponents: systemId is required');
            return;
          }

          try {
            set((state) => ({ ui: { ...state.ui, loading: true, error: undefined } }));

            // Import wisDataService dynamically to avoid circular imports
            const { wisDataService } = await import('@/services/wis/wisDataService');
            const components = await wisDataService.getComponents(systemId);

            // Transform API response to WISComponent format with defensive programming
            const transformedComponents: WISComponent[] = (components || []).map((component: any) => ({
              id: component.id || `component_${Date.now()}`,
              system_id: component.system_id || systemId,
              component_code: component.component_code || '',
              component_name: component.component_name || 'Unknown Component',
              description: component.description || '',
              sort_order: component.sort_order || 0,
              estimated_procedures: component.estimated_procedures || 0,
              created_at: component.created_at || new Date().toISOString(),
            }));

            // Store in cache
            set((state) => ({
              cache: {
                ...state.cache,
                components: { ...state.cache.components, [systemId]: transformedComponents },
                lastUpdated: { ...state.cache.lastUpdated, [`components_${systemId}`]: Date.now() },
              },
            }));

            console.log(`Loaded ${transformedComponents.length} components for system ${systemId}`);
          } catch (error) {
            console.error('Failed to load components:', error);
            set((state) => ({
              ui: { ...state.ui, error: error instanceof Error ? error.message : 'Failed to load components' },
              // Fallback: provide empty array to prevent crashes
              cache: {
                ...state.cache,
                components: { ...state.cache.components, [systemId]: [] },
              },
            }));
          } finally {
            set((state) => ({ ui: { ...state.ui, loading: false } }));
          }
        },

        // Load procedures for a specific component
        loadProcedures: async (componentId: string) => {
          if (!componentId) {
            console.warn('loadProcedures: componentId is required');
            return;
          }

          try {
            set((state) => ({ ui: { ...state.ui, loading: true, error: undefined } }));

            // Import wisDataService dynamically to avoid circular imports
            const { wisDataService } = await import('@/services/wis/wisDataService');
            const procedures = await wisDataService.getProcedures(componentId);

            // Transform API response to WISProcedure format with defensive programming
            const transformedProcedures: WISProcedure[] = (procedures || []).map((procedure: any) => ({
              id: procedure.id || `procedure_${Date.now()}`,
              component_id: procedure.component_id || componentId,
              procedure_code: procedure.procedure_code || '',
              title: procedure.title || procedure.procedure_title || 'Unknown Procedure',
              description: procedure.description || '',
              estimated_time_hours: procedure.estimated_time_hours || procedure.estimated_duration || 0,
              difficulty_level: procedure.difficulty_level || 1,
              labor_category: procedure.labor_category || 'General',
              overview: procedure.overview || '',
              safety_warnings: procedure.safety_warnings || [],
              special_notes: procedure.special_notes || [],
              version: procedure.version || '1.0',
              status: procedure.status || 'active',
              created_at: procedure.created_at || new Date().toISOString(),
              updated_at: procedure.updated_at || new Date().toISOString(),
              // Navigation context
              model_code: procedure.model_code || '',
              model_name: procedure.model_name || '',
              system_code: procedure.system_code || '',
              system_name: procedure.system_name || '',
              component_code: procedure.component_code || '',
              component_name: procedure.component_name || '',
            }));

            // Store in cache
            set((state) => ({
              cache: {
                ...state.cache,
                proceduresList: { ...state.cache.proceduresList, [componentId]: transformedProcedures },
                lastUpdated: { ...state.cache.lastUpdated, [`procedures_${componentId}`]: Date.now() },
              },
            }));

            console.log(`Loaded ${transformedProcedures.length} procedures for component ${componentId}`);
          } catch (error) {
            console.error('Failed to load procedures:', error);
            set((state) => ({
              ui: { ...state.ui, error: error instanceof Error ? error.message : 'Failed to load procedures' },
              // Fallback: provide empty array to prevent crashes
              cache: {
                ...state.cache,
                proceduresList: { ...state.cache.proceduresList, [componentId]: [] },
              },
            }));
          } finally {
            set((state) => ({ ui: { ...state.ui, loading: false } }));
          }
        },

        // Load detailed procedure with steps, parts, and tools
        loadProcedure: async (procedureId: string) => {
          if (!procedureId) {
            console.warn('loadProcedure: procedureId is required');
            return;
          }

          try {
            set((state) => ({ ui: { ...state.ui, loading: true, error: undefined } }));

            // Import wisDataService dynamically to avoid circular imports
            const { wisDataService } = await import('@/services/wis/wisDataService');

            // Load procedure details with error handling for each part
            const [procedure, steps, parts, tools] = await Promise.allSettled([
              wisDataService.getProcedure(procedureId),
              wisDataService.getProcedureSteps(procedureId),
              wisDataService.getProcedureParts(procedureId),
              wisDataService.getProcedureTools(procedureId),
            ]);

            // Extract results with defensive error handling
            const procedureData = procedure.status === 'fulfilled' ? procedure.value : null;
            const stepData = steps.status === 'fulfilled' ? steps.value || [] : [];
            const partData = parts.status === 'fulfilled' ? parts.value || [] : [];
            const toolData = tools.status === 'fulfilled' ? tools.value || [] : [];

            if (!procedureData) {
              throw new Error('Procedure not found');
            }

            // Transform and cache procedure
            const transformedProcedure: WISProcedure = {
              id: procedureData.id || procedureId,
              component_id: procedureData.component_id || '',
              procedure_code: procedureData.procedure_code || '',
              title: procedureData.title || procedureData.procedure_title || 'Unknown Procedure',
              description: procedureData.description || '',
              estimated_time_hours: procedureData.estimated_time_hours || 0,
              difficulty_level: procedureData.difficulty_level || 1,
              labor_category: procedureData.labor_category || 'General',
              overview: procedureData.overview || '',
              safety_warnings: procedureData.safety_warnings || [],
              special_notes: procedureData.special_notes || [],
              version: procedureData.version || '1.0',
              status: procedureData.status || 'active',
              created_at: procedureData.created_at || new Date().toISOString(),
              updated_at: procedureData.updated_at || new Date().toISOString(),
              // Navigation context
              model_code: procedureData.model_code || '',
              model_name: procedureData.model_name || '',
              system_code: procedureData.system_code || '',
              system_name: procedureData.system_name || '',
              component_code: procedureData.component_code || '',
              component_name: procedureData.component_name || '',
            };

            // Cache all data with error recovery
            get().setProcedure(procedureId, transformedProcedure);
            get().setProcedureSteps(procedureId, stepData);
            get().setProcedureParts(procedureId, partData);
            get().setProcedureTools(procedureId, toolData);

            console.log(`Loaded procedure ${procedureId} with ${stepData.length} steps, ${partData.length} parts, ${toolData.length} tools`);
          } catch (error) {
            console.error('Failed to load procedure:', error);
            set((state) => ({
              ui: { ...state.ui, error: error instanceof Error ? error.message : 'Failed to load procedure' },
            }));
          } finally {
            set((state) => ({ ui: { ...state.ui, loading: false } }));
          }
        },

        setTreeData: (modelId, data) => {
          set((state) => ({
            cache: {
              ...state.cache,
              treeData: { ...state.cache.treeData, [modelId]: data },
              lastUpdated: { ...state.cache.lastUpdated, [`tree_${modelId}`]: Date.now() },
            },
          }));
        },

        setProcedure: (procedureId, procedure) => {
          set((state) => ({
            cache: {
              ...state.cache,
              procedures: { ...state.cache.procedures, [procedureId]: procedure },
              lastUpdated: { ...state.cache.lastUpdated, [`procedure_${procedureId}`]: Date.now() },
            },
          }));
        },

        setProcedureSteps: (procedureId, steps) => {
          set((state) => ({
            cache: {
              ...state.cache,
              procedureSteps: { ...state.cache.procedureSteps, [procedureId]: steps },
              lastUpdated: { ...state.cache.lastUpdated, [`steps_${procedureId}`]: Date.now() },
            },
          }));
        },

        setProcedureParts: (procedureId, parts) => {
          set((state) => ({
            cache: {
              ...state.cache,
              procedureParts: { ...state.cache.procedureParts, [procedureId]: parts },
              lastUpdated: { ...state.cache.lastUpdated, [`parts_${procedureId}`]: Date.now() },
            },
          }));
        },

        setProcedureTools: (procedureId, tools) => {
          set((state) => ({
            cache: {
              ...state.cache,
              procedureTools: { ...state.cache.procedureTools, [procedureId]: tools },
              lastUpdated: { ...state.cache.lastUpdated, [`tools_${procedureId}`]: Date.now() },
            },
          }));
        },

        setRelatedProcedures: (procedureId, related) => {
          set((state) => ({
            cache: {
              ...state.cache,
              relatedProcedures: { ...state.cache.relatedProcedures, [procedureId]: related },
              lastUpdated: { ...state.cache.lastUpdated, [`related_${procedureId}`]: Date.now() },
            },
          }));
        },

        setServiceBulletins: (procedureId, bulletins) => {
          set((state) => ({
            cache: {
              ...state.cache,
              serviceBulletins: { ...state.cache.serviceBulletins, [procedureId]: bulletins },
              lastUpdated: { ...state.cache.lastUpdated, [`bulletins_${procedureId}`]: Date.now() },
            },
          }));
        },

        setBookmarks: (bookmarks) => {
          set((state) => ({
            cache: {
              ...state.cache,
              bookmarks,
              lastUpdated: { ...state.cache.lastUpdated, bookmarks: Date.now() },
            },
          }));
        },

        // Utility actions
        setUserContext: (context) => {
          console.log('Setting user context:', context);
          // For now, just log the context. We could store it in cache or ui state if needed
          // This allows us to set user preferences, vehicle model, etc.
          if (context.vehicleModel) {
            get().setSelectedModel(context.vehicleModel);
          }
        },

        getCachedData: <T>(key: string): T | undefined => {
          const state = get();
          return (state.cache as any)[key] as T;
        },

        isCacheValid: (key: string, maxAge = 5 * 60 * 1000): boolean => {
          const state = get();
          const lastUpdated = state.cache.lastUpdated[key];
          if (!lastUpdated) return false;
          return Date.now() - lastUpdated < maxAge;
        },

        clearCache: () => {
          set((state) => ({
            cache: initialCacheState,
          }));
        },

        reset: () => {
          set(() => ({
            navigation: initialNavigationState,
            search: initialSearchState,
            ui: initialUIState,
            cache: initialCacheState,
          }));
        },
      }),
      {
        name: 'wis-store',
        partialize: (state) => ({
          // Only persist certain parts of the state
          navigation: {
            selectedModel: state.navigation.selectedModel,
            selectedSystem: state.navigation.selectedSystem,
            selectedComponent: state.navigation.selectedComponent,
            selectedProcedure: state.navigation.selectedProcedure,
            expandedNodes: Array.from(state.navigation.expandedNodes), // Convert Set to Array for serialization
          },
          search: {
            recentSearches: state.search.recentSearches,
          },
          ui: {
            sidebarOpen: state.ui.sidebarOpen,
            activeTab: state.ui.activeTab,
          },
          cache: {
            models: state.cache.models,
            bookmarks: state.cache.bookmarks,
            // Don't persist everything to avoid large localStorage usage
          },
        }),
        onRehydrateStorage: () => (state) => {
          // Convert expandedNodes back to Set after rehydration
          if (state?.navigation.expandedNodes) {
            state.navigation.expandedNodes = new Set(state.navigation.expandedNodes as any);
          }
        },
      }
    ),
    { name: 'WIS Store' }
  )
);

// Selector hooks for specific parts of the store
export const useWISNavigation = () => useWISStore((state) => state.navigation);
export const useWISSearch = () => useWISStore((state) => state.search);
export const useWISUI = () => useWISStore((state) => state.ui);
export const useWISCache = () => useWISStore((state) => state.cache);

// Action hooks
export const useWISActions = () => useWISStore(
  (state) => ({
    // Navigation
    setSelectedModel: state.setSelectedModel,
    setSelectedSystem: state.setSelectedSystem,
    setSelectedComponent: state.setSelectedComponent,
    setSelectedProcedure: state.setSelectedProcedure,
    toggleNodeExpansion: state.toggleNodeExpansion,
    navigateBack: state.navigateBack,
    clearNavigation: state.clearNavigation,

    // Search
    setSearchQuery: state.setSearchQuery,
    setSearchType: state.setSearchType,
    performSearch: state.performSearch,
  clearSearch: state.clearSearch,

  // UI
  setSidebarOpen: state.setSidebarOpen,
  setActiveTab: state.setActiveTab,
  setCurrentStep: state.setCurrentStep,
  setViewMode: state.setViewMode,
  setLoading: state.setLoading,
  setError: state.setError,
  setVoiceSearching: state.setVoiceSearching,

  // Cache
  loadModels: state.loadModels,
  loadCategories: state.loadCategories,
  setModels: state.setModels,
  setTreeData: state.setTreeData,
  setProcedure: state.setProcedure,
  setProcedureSteps: state.setProcedureSteps,
  setProcedureParts: state.setProcedureParts,
  setProcedureTools: state.setProcedureTools,
  setRelatedProcedures: state.setRelatedProcedures,
  setServiceBulletins: state.setServiceBulletins,
  setBookmarks: state.setBookmarks,

  // Utility
  setUserContext: state.setUserContext,
  getCachedData: state.getCachedData,
  isCacheValid: state.isCacheValid,
  clearCache: state.clearCache,
  reset: state.reset,
  }),
  shallow
);