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
  systems: Record<string, WISSystem[]>;
  components: Record<string, WISComponent[]>;
  proceduresList: Record<string, WISProcedure[]>;
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
  loadSystems: (modelId: string) => Promise<void>;
  loadComponents: (systemId: string) => Promise<void>;
  loadProcedures: (componentId: string) => Promise<void>;
  loadProcedure: (procedureId: string) => Promise<void>;
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
          console.log('🎭 WIS Mockup: Immediately returning static search results for:', query);
          // Immediately stop loading and provide static results
          if (!query || query.length < 2) {
            get().clearSearch();
            return;
          }

          // Immediately set all loading states to false
          set((state) => ({
            search: { ...state.search, isSearching: false },
            ui: { ...state.ui, loading: false, error: undefined, viewMode: 'search' },
          }));

          // Return static mockup results immediately
          const staticResults: WISSearchResult[] = [
            {
              result_type: 'procedure',
              id: 'mock_proc_1',
              title: `Mock Procedure: ${query}`,
              description: 'This is a demonstration procedure in mockup mode',
              code: 'MOCK001',
              rank: 1,
            }
          ];

          get().setSearchResults(staticResults);
          get().addRecentSearch(query);
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

        // Cache actions - DISABLED FOR MOCKUP MODE
        loadModels: async () => {
          console.log('🎭 WIS Mockup: Immediately loading static vehicle models');
          // Immediately set loading to false and provide static models
          set((state) => ({ ui: { ...state.ui, loading: false, error: undefined } }));

          const staticModels: WISModel[] = [
            {
              id: 'U1700L',
              model_code: 'U1700L',
              model_name: 'Unimog U1700L',
              description: 'Heavy-duty all-terrain vehicle',
              year_range: '1991-1998',
              image_url: undefined,
              active: true,
              sort_order: 1,
              created_at: new Date().toISOString(),
            },
            {
              id: 'U1300L',
              model_code: 'U1300L',
              model_name: 'Unimog U1300L',
              description: 'Medium-duty all-terrain vehicle',
              year_range: '1988-1998',
              image_url: undefined,
              active: true,
              sort_order: 2,
              created_at: new Date().toISOString(),
            },
            {
              id: 'U1250',
              model_code: 'U1250',
              model_name: 'Unimog U1250',
              description: 'Light-duty all-terrain vehicle',
              year_range: '1988-1994',
              image_url: undefined,
              active: true,
              sort_order: 3,
              created_at: new Date().toISOString(),
            }
          ];

          get().setModels(staticModels);
        },

        loadCategories: async () => {
          console.log('🎭 WIS Mockup: Skipping categories loading, using static categories');
          // Skip database loading for mockup mode
          set((state) => ({ ui: { ...state.ui, loading: false, error: undefined } }));
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

        // Load systems for a specific model - DISABLED FOR MOCKUP MODE
        loadSystems: async (modelId: string) => {
          console.log('🎭 WIS Mockup: Immediately loading static systems for', modelId);
          // Immediately set loading to false and provide static systems
          set((state) => ({ ui: { ...state.ui, loading: false, error: undefined } }));

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

          set((state) => ({
            cache: {
              ...state.cache,
              systems: { ...state.cache.systems, [modelId]: staticSystems },
            },
          }));
        },

        // Load components for a specific system - DISABLED FOR MOCKUP MODE
        loadComponents: async (systemId: string) => {
          console.log('🎭 WIS Mockup: Immediately loading static components for', systemId);
          // Immediately set loading to false and provide static components
          set((state) => ({ ui: { ...state.ui, loading: false, error: undefined } }));

          const staticComponents: WISComponent[] = [
            {
              id: `comp_${systemId}_1`,
              system_id: systemId,
              component_code: '01',
              component_name: 'Main Component',
              description: 'Primary component for this system',
              sort_order: 1,
              estimated_procedures: 5,
              created_at: new Date().toISOString(),
            }
          ];

          set((state) => ({
            cache: {
              ...state.cache,
              components: { ...state.cache.components, [systemId]: staticComponents },
            },
          }));
        },

        // Load procedures for a specific component - DISABLED FOR MOCKUP MODE
        loadProcedures: async (componentId: string) => {
          console.log('🎭 WIS Mockup: Immediately loading static procedures for', componentId);
          // Immediately set loading to false and provide static procedures
          set((state) => ({ ui: { ...state.ui, loading: false, error: undefined } }));

          const staticProcedures: WISProcedure[] = [
            {
              id: `proc_${componentId}_1`,
              component_id: componentId,
              procedure_code: 'MOCK001',
              title: 'Coolant System Service',
              description: 'Complete coolant system service procedure',
              estimated_time_hours: 1.5,
              difficulty_level: 2,
              labor_category: 'Maintenance',
              overview: 'This procedure guides you through the complete coolant system service process.',
              safety_warnings: ['Always wear appropriate safety equipment'],
              special_notes: ['Use genuine Mercedes parts'],
              version: '1.0',
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              model_code: 'U1700L',
              model_name: 'Unimog U1700L',
              system_code: '10',
              system_name: 'Engine',
              component_code: '30.01',
              component_name: 'Coolant System',
            }
          ];

          set((state) => ({
            cache: {
              ...state.cache,
              proceduresList: { ...state.cache.proceduresList, [componentId]: staticProcedures },
            },
          }));
        },

        // Load detailed procedure with steps, parts, and tools - DISABLED FOR MOCKUP MODE
        loadProcedure: async (procedureId: string) => {
          console.log('🎭 WIS Mockup: Immediately loading static procedure for', procedureId);
          // Immediately set loading to false
          set((state) => ({ ui: { ...state.ui, loading: false, error: undefined } }));
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
  loadSystems: state.loadSystems,
  loadComponents: state.loadComponents,
  loadProcedures: state.loadProcedures,
  loadProcedure: state.loadProcedure,
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