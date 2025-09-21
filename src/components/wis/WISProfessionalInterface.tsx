import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronDown, ChevronRight, Home, Search, BookmarkPlus, Settings, FileText, Wrench, Clock, Bookmark, AlertTriangle, Bot, MessageCircle, X } from 'lucide-react';
import { WISBarryTab } from './WISBarryTab';
import { useWISStore } from '@/stores/wisStore';
import { useShallow } from 'zustand/react/shallow';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface WISProfessionalInterfaceProps {
  barryContext?: any;
  onBarryRequest?: (query: string, vehicleModel?: string) => void;
  barryMode?: boolean;
  wisState?: {
    selectedModel?: string;
    selectedCategory?: string;
    searchResults?: any[];
    isLoading?: boolean;
    procedures?: any[];
    models?: any[];
    categories?: any[];
  };
  wisActions?: any;
}

interface SystemNode {
  id: string;
  code: string;
  name: string;
  icon?: string;
  componentCount: number;
  expanded?: boolean;
  components?: ComponentNode[];
}

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  procedureCount: number;
  procedures?: ProcedureNode[];
}

interface ProcedureNode {
  id: string;
  code: string;
  title: string;
  difficulty: string;
  estimatedTime: string;
}

interface ProcedureTab {
  id: string;
  procedure: ProcedureNode;
  component: string;
  system: string;
  activeView: 'overview' | 'steps' | 'media';
}

const STORAGE_KEYS = {
  OPEN_TABS: 'wis-open-tabs',
  ACTIVE_TAB_ID: 'wis-active-tab-id',
  SELECTED_VEHICLE: 'wis-selected-vehicle',
  EXPANDED_SYSTEMS: 'wis-expanded-systems',
} as const;

// SortableTab component for drag-and-drop
interface SortableTabProps {
  tab: ProcedureTab;
  activeTabId: string | null;
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

const SortableTab: React.FC<SortableTabProps> = ({ tab, activeTabId, onSwitchTab, onCloseTab }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex-shrink-0 flex items-center min-w-0 max-w-[200px] transition-all duration-300 rounded-t-lg border-t border-l border-r ${
        activeTabId === tab.id
          ? 'bg-white border-[#ddd] shadow-sm translate-y-0 z-10 border-b-white'
          : 'bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] border-[#e0e0e0] hover:from-[#f8f8f8] hover:to-[#eeeeee] hover:shadow-sm translate-y-1 border-b-[#eee]'
      }`}
    >
      <div
        {...listeners}
        className="flex-1 px-3 py-2 min-w-0 cursor-pointer"
        onClick={() => onSwitchTab(tab.id)}
      >
        <div className="text-xs text-gray-600 truncate">📋 {tab.procedure.code}</div>
        <div className={`text-sm font-medium truncate ${
          activeTabId === tab.id ? 'text-gray-900' : 'text-gray-700'
        }`}>
          {tab.procedure.title}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCloseTab(tab.id);
        }}
        className="flex-shrink-0 w-5 h-5 mr-2 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-all duration-200 text-xs opacity-60 hover:opacity-100"
        title="Close tab"
      >
        ✕
      </button>
    </div>
  );
};

const WISProfessionalInterface: React.FC<WISProfessionalInterfaceProps> = ({
  barryContext,
  onBarryRequest,
  barryMode = false,
  wisState,
  wisActions
}) => {
  // Debug logging for production troubleshooting
  console.log('🔧 WISProfessionalInterface: Component rendering started');

  try {
    // ✅ GOOD: Use specific store selectors with defensive access
    console.log('🔧 WISProfessionalInterface: About to call useWISStore selectors');

    if (!useWISStore) {
      throw new Error('useWISStore is not available - store import failed');
    }

    const selectedModel = useWISStore((state) => state?.navigation?.selectedModel);
    const storeModels = useWISStore((state) => state?.cache?.models || []);

    console.log('🔧 WISProfessionalInterface: Store selectors completed', {
      selectedModel,
      storeModelsLength: storeModels?.length || 0,
      storeModelsType: typeof storeModels
    });

    const vehicleModels = useMemo(() => {
      console.log('🔧 WISProfessionalInterface: Computing vehicleModels', { storeModels });
      if (storeModels && storeModels.length > 0) {
        return storeModels
          .filter((model) => model.active !== false)
          .map((model) => ({
            code: model.model_code,
            name: model.model_name || model.model_code,
            id: model.id,
          }));
      }

      return [
        {
          code: 'U435',
          name: 'U435 (Mercedes-Benz Unimog - also for U1700L users)',
          id: '6fc18b1f-157a-40cb-a03e-c20faf34478f',
        },
      ];
    }, [storeModels]);

  const selectedVehicle = useMemo(() => {
    if (selectedModel) {
      return selectedModel;
    }

    return vehicleModels[0]?.code || 'U435';
  }, [selectedModel, vehicleModels]);

  const getVehicleDisplayName = useCallback(
    (vehicleCode?: string) => {
      if (!vehicleCode) {
        return 'Unimog';
      }

      const match = vehicleModels.find((model) => model.code === vehicleCode);
      return match?.name || `Unimog ${vehicleCode}`;
    },
    [vehicleModels]
  );

  const selectedVehicleLabel = useMemo(
    () => getVehicleDisplayName(selectedVehicle),
    [getVehicleDisplayName, selectedVehicle]
  );

    const storeSystems = useWISStore((state) => {
      console.log('🔧 WISProfessionalInterface: Computing storeSystems', { selectedVehicle });
      if (!selectedVehicle) {
        return [];
      }

      const cachedSystems = state?.cache?.systems?.[selectedVehicle];
      if (cachedSystems && Array.isArray(cachedSystems)) {
        return cachedSystems;
      }

      return [];
    });

  // ✅ GOOD: Transform store systems to component format with stable reference
  const mappedStoreSystems = useMemo(
    () =>
      storeSystems.map((system) => ({
        id: system.id,
        code: system.system_code,
        name: system.system_name,
        icon: system.icon_name || '🔧',
        componentCount: system.estimated_procedures || 0,
        expanded: false,
        components: [],
      })),
    [storeSystems]
  );

    // Local UI state only (not data state)
    const [systems, setSystems] = useState<SystemNode[]>([]);

    console.log('🔧 WISProfessionalInterface: About to call useShallow selector');

    const {
      loadModels,
      loadSystems,
      loadComponents,
      loadProcedures,
      loadProcedure,
      setSelectedModel,
    } = useWISStore(
      useShallow((state) => {
        console.log('🔧 WISProfessionalInterface: useShallow selector called', { state: !!state });
        return {
          loadModels: state?.loadModels,
          loadSystems: state?.loadSystems,
          loadComponents: state?.loadComponents,
          loadProcedures: state?.loadProcedures,
          loadProcedure: state?.loadProcedure,
          setSelectedModel: state?.setSelectedModel,
        };
      })
    );

    console.log('🔧 WISProfessionalInterface: useShallow selector completed', {
      hasLoadModels: !!loadModels,
      hasLoadSystems: !!loadSystems,
      hasSetSelectedModel: !!setSelectedModel
    });

  const [openTabs, setOpenTabs] = useState<ProcedureTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [showBarry, setShowBarry] = useState<boolean>(false);
  const [expandedSystems, setExpandedSystems] = useState<string[]>([]);
  const [procedureSteps, setProcedureSteps] = useState<{[procedureId: string]: any[]}>({});
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Home', selectedVehicleLabel]);
  const systemDetailsLoading = useRef<Set<string>>(new Set());
  const hasInitializedVehicle = useRef<boolean>(false);

  const isLoading = loadingCount > 0;

  const startLoading = useCallback(() => {
    setLoadingCount((count) => count + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((count) => (count > 0 ? count - 1 : 0));
  }, []);

  const getDifficultyLabel = useCallback((level?: number | null) => {
    if (!level || level <= 1) {
      return 'Easy';
    }

    if (level === 2) {
      return 'Medium';
    }

    if (level >= 4) {
      return 'Expert';
    }

    return 'Hard';
  }, []);

  const formatEstimatedTime = useCallback((hours?: number | null) => {
    if (!hours || hours <= 0) {
      return 'N/A';
    }

    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }

    if (Number.isInteger(hours)) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    }

    return `${hours.toFixed(1)} hours`;
  }, []);

  const applyComponentsToSystem = useCallback((systemId: string, componentNodes: ComponentNode[]) => {
    setSystems((currentSystems) =>
      currentSystems.map((system) =>
        system.id === systemId
          ? {
              ...system,
              components: componentNodes,
            }
          : system
      )
    );
  }, []);

  const buildComponentNodes = useCallback(
    (componentsData: any[], proceduresCache: Record<string, any[]>) =>
      componentsData.map((component) => {
        const componentProcedures = proceduresCache?.[component.id] || [];

        const procedureNodes: ProcedureNode[] = componentProcedures.map((procedure: any) => ({
          id: procedure.id || `${component.id}-procedure`,
          code: procedure.procedure_code || procedure.procedureCode || procedure.id || 'PROC',
          title: procedure.title || procedure.procedure_title || 'Untitled Procedure',
          difficulty: getDifficultyLabel(procedure.difficulty_level),
          estimatedTime: formatEstimatedTime(procedure.estimated_time_hours),
        }));

        return {
          id: component.id,
          code: component.component_code || component.code || component.id,
          name: component.component_name || component.name || 'Unknown Component',
          procedureCount: procedureNodes.length || component.estimated_procedures || 0,
          procedures: procedureNodes,
        } as ComponentNode;
      }),
    [formatEstimatedTime, getDifficultyLabel]
  );

  const ensureSystemDetails = useCallback(
    async (systemId: string) => {
      if (!systemId) {
        return;
      }

      if (systemDetailsLoading.current.has(systemId)) {
        return;
      }

      const systemFromState = systems.find((system) => system.id === systemId);
      if (!systemFromState) {
        return;
      }

      if (systemFromState.components && systemFromState.components.length > 0) {
        return;
      }

      const currentState = useWISStore.getState();
      const cachedComponents = currentState.cache?.components?.[systemId];

      if (cachedComponents && cachedComponents.length > 0) {
        const componentNodes = buildComponentNodes(cachedComponents, currentState.cache?.proceduresList || {});
        applyComponentsToSystem(systemId, componentNodes);
        return;
      }

      systemDetailsLoading.current.add(systemId);
      let localLoading = false;

      try {
        localLoading = true;
        startLoading();
        await loadComponents(systemId);

        const componentState = useWISStore.getState();
        const loadedComponents = componentState.cache?.components?.[systemId] || [];

        for (const component of loadedComponents) {
          const proceduresCache = useWISStore.getState().cache?.proceduresList?.[component.id];
          if (!proceduresCache || proceduresCache.length === 0) {
            await loadProcedures(component.id);
          }
        }

        const refreshedState = useWISStore.getState();
        const refreshedComponents = refreshedState.cache?.components?.[systemId] || [];
        const componentNodes = buildComponentNodes(refreshedComponents, refreshedState.cache?.proceduresList || {});
        applyComponentsToSystem(systemId, componentNodes);
      } catch (detailError) {
        console.error(`❌ Failed to load system details for ${systemId}:`, detailError);
        setError('Unable to load system details. Please try again.');
      } finally {
        systemDetailsLoading.current.delete(systemId);
        if (localLoading) {
          stopLoading();
        }
      }
    },
    [
      applyComponentsToSystem,
      buildComponentNodes,
      loadComponents,
      loadProcedures,
      startLoading,
      stopLoading,
      systems,
    ]
  );

  useEffect(() => {
    if (expandedSystems.length === 0) {
      return;
    }

    expandedSystems.forEach((systemId) => {
      ensureSystemDetails(systemId);
    });
  }, [expandedSystems, ensureSystemDetails]);

  useEffect(() => {
    let cancelled = false;

    const ensureModelsLoaded = async () => {
      if (storeModels && storeModels.length > 0) {
        return;
      }

      try {
        startLoading();
        await loadModels();
      } catch (modelError) {
        console.error('❌ Failed to load WIS models:', modelError);
        if (!cancelled) {
          setError('Unable to load vehicle models. Showing offline reference content.');
        }
      } finally {
        if (!cancelled) {
          stopLoading();
        }
      }
    };

    ensureModelsLoaded();

    return () => {
      cancelled = true;
    };
  }, [storeModels, loadModels, startLoading, stopLoading]);

  useEffect(() => {
    setBreadcrumb((prev) => {
      if (prev.length > 1 && prev[1] === selectedVehicleLabel) {
        return prev;
      }

      return ['Home', selectedVehicleLabel];
    });
  }, [selectedVehicleLabel]);

  useEffect(() => {
    if (mappedStoreSystems.length === 0) {
      setSystems((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setSystems((previousSystems) => {
      const previousMap = new Map(previousSystems.map((system) => [system.id, system]));

      return mappedStoreSystems.map((system) => {
        const previous = previousMap.get(system.id);
        return {
          ...system,
          expanded: expandedSystems.includes(system.id),
          components: previous?.components || [],
        };
      });
    });
  }, [mappedStoreSystems, expandedSystems]);

  const saveVehicleToStorage = useCallback((vehicle: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_VEHICLE, vehicle);
      console.log('🚗 Vehicle saved to localStorage:', vehicle);
    } catch (error) {
      console.error('❌ Failed to save vehicle to localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (hasInitializedVehicle.current) {
      return;
    }

    if (vehicleModels.length === 0) {
      return;
    }

    let savedVehicle: string | null = null;

    try {
      savedVehicle = localStorage.getItem(STORAGE_KEYS.SELECTED_VEHICLE);
    } catch (storageError) {
      console.warn('⚠️ Unable to read saved vehicle from localStorage:', storageError);
    }

    const validSavedVehicle = savedVehicle && vehicleModels.some((model) => model.code === savedVehicle)
      ? savedVehicle
      : null;

    const candidateVehicle =
      validSavedVehicle ||
      (selectedModel && vehicleModels.some((model) => model.code === selectedModel)
        ? selectedModel
        : vehicleModels[0]?.code);

    if (candidateVehicle) {
      setSelectedModel(candidateVehicle);
      saveVehicleToStorage(candidateVehicle);
    }

    hasInitializedVehicle.current = true;
  }, [vehicleModels, selectedModel, setSelectedModel, saveVehicleToStorage]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const saveExpandedSystemsStable = useCallback((expanded: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPANDED_SYSTEMS, JSON.stringify(expanded));
    } catch (error) {
      console.error('❌ Failed to save expanded systems:', error);
    }
  }, []);

  // Load vehicle models - STATIC VERSION (no database calls)
  const loadRealSystemsData = useCallback(async () => {
    console.log('🔧 Loading static WIS systems data...');
    startLoading();

    // Static mock data - no database calls
    const mockSystems: SystemNode[] = [
      {
        id: '01',
        code: '01',
        name: 'Engine',
        icon: '⚙️',
        componentCount: 3,
        expanded: true,
        components: [
          {
            id: '01-01',
            code: '01-01',
            name: 'Engine Block',
            procedureCount: 2,
            procedures: [
              {
                id: '01-01-001',
                code: '01-01-001',
                title: 'Engine Oil Change',
                difficulty: 'Easy',
                estimatedTime: '30 minutes'
              },
              {
                id: '01-01-002',
                code: '01-01-002',
                title: 'Valve Adjustment',
                difficulty: 'Medium',
                estimatedTime: '2 hours'
              }
            ]
          }
        ]
      },
      {
        id: '02',
        code: '02',
        name: 'Transmission',
        icon: '⚙️',
        componentCount: 2,
        expanded: false,
        components: [
          {
            id: '02-01',
            code: '02-01',
            name: 'Gearbox',
            procedureCount: 1,
            procedures: [
              {
                id: '02-01-001',
                code: '02-01-001',
                title: 'Transmission Fluid Change',
                difficulty: 'Medium',
                estimatedTime: '1 hour'
              }
            ]
          }
        ]
      },
      {
        id: '03',
        code: '03',
        name: 'Axles & Differential',
        icon: '⚙️',
        componentCount: 1,
        expanded: false,
        components: [
          {
            id: '03-01',
            code: '03-01',
            name: 'Front Axle',
            procedureCount: 1,
            procedures: [
              {
                id: '03-01-001',
                code: '03-01-001',
                title: 'Differential Service',
                difficulty: 'Hard',
                estimatedTime: '3 hours'
              }
            ]
          }
        ]
      }
    ];

    // Simulate loading time and resolve when finished so callers can await completion
    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setSystems(mockSystems);
          console.log('✅ Static WIS data loaded successfully:', mockSystems);
          const defaultExpanded = mockSystems.filter((system) => system.expanded).map((system) => system.id);
          setExpandedSystems(defaultExpanded);
          saveExpandedSystemsStable(defaultExpanded);
          resolve();
        }, 500);
      });
    } finally {
      stopLoading();
    }
  }, [saveExpandedSystemsStable, startLoading, stopLoading]);

  useEffect(() => {
    if (!selectedVehicle) {
      return;
    }

    let cancelled = false;
    let localLoading = false;

    const ensureSystemsLoaded = async () => {
      const currentState = useWISStore.getState();
      const cachedSystems = currentState.cache?.systems?.[selectedVehicle];

      if (cachedSystems && cachedSystems.length > 0) {
        return;
      }

      try {
        localLoading = true;
        startLoading();
        setError(null);
        await loadSystems(selectedVehicle);

        if (cancelled) {
          return;
        }

        const refreshedState = useWISStore.getState();
        const refreshedSystems = refreshedState.cache?.systems?.[selectedVehicle];

        if (!refreshedSystems || refreshedSystems.length === 0) {
          console.warn('⚠️ No live systems returned, loading static fallback data.');
          setError('Failed to load live WIS data. Loading offline reference content.');
          await loadRealSystemsData();
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error('❌ Failed to load systems:', loadError);
          setError('Failed to load live WIS data. Loading offline reference content.');
          await loadRealSystemsData();
        }
      } finally {
        if (localLoading) {
          stopLoading();
        }
      }
    };

    ensureSystemsLoaded();

    return () => {
      cancelled = true;
    };
  }, [selectedVehicle, loadSystems, startLoading, stopLoading, loadRealSystemsData]);

  const loadProcedureSteps = useCallback(async (procedureId: string) => {
    if (!procedureId) {
      return;
    }

    const cachedSteps = useWISStore.getState().cache?.procedureSteps?.[procedureId];
    if (cachedSteps && cachedSteps.length > 0) {
      setProcedureSteps((prev) => ({
        ...prev,
        [procedureId]: cachedSteps,
      }));
      return;
    }

    try {
      startLoading();
      await loadProcedure(procedureId);
      const updatedSteps = useWISStore.getState().cache?.procedureSteps?.[procedureId] || [];
      setProcedureSteps((prev) => ({
        ...prev,
        [procedureId]: updatedSteps,
      }));
    } catch (stepsError) {
      console.error('❌ Failed to load procedure steps:', stepsError);
      setError('Unable to load detailed procedure steps. Please try again.');
      setProcedureSteps((prev) => ({
        ...prev,
        [procedureId]: [],
      }));
    } finally {
      stopLoading();
    }
  }, [loadProcedure, startLoading, stopLoading]);

    // ✅ GOOD: One-time initialization only - no dependencies that cause loops
    useEffect(() => {
      console.log('🔧 WISProfessionalInterface: Initializing localStorage data');

      // Check if localStorage is available (might fail in some production environments)
      if (typeof localStorage === 'undefined') {
        console.warn('🔧 WISProfessionalInterface: localStorage not available, skipping storage operations');
        return;
      }

      // Load saved expanded systems from localStorage
      try {
        const savedExpanded = localStorage.getItem(STORAGE_KEYS.EXPANDED_SYSTEMS);
        console.log('🔧 WISProfessionalInterface: savedExpanded from localStorage:', savedExpanded);
        if (savedExpanded) {
          const expandedData = JSON.parse(savedExpanded);
          if (Array.isArray(expandedData)) {
            setExpandedSystems(expandedData);
            console.log('🔧 WISProfessionalInterface: Set expanded systems:', expandedData);
          }
        }
      } catch (storageError) {
        console.error('❌ Failed to load expanded systems:', storageError);
        // Don't throw, just continue
      }

      // Load saved tabs from localStorage
      try {
        const savedTabs = localStorage.getItem(STORAGE_KEYS.OPEN_TABS);
        const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB_ID);
        console.log('🔧 WISProfessionalInterface: savedTabs from localStorage:', savedTabs);
        if (savedTabs) {
          const tabsData = JSON.parse(savedTabs);
          if (Array.isArray(tabsData)) {
            setOpenTabs(tabsData);
            setActiveTabId(savedActiveId || null);
            console.log('🔧 WISProfessionalInterface: Restored tabs:', tabsData.length);
          }
        }
      } catch (storageError) {
        console.error('❌ Failed to load tabs:', storageError);
        // Don't throw, just continue
      }

      console.log('🔧 WISProfessionalInterface: localStorage initialization completed');
    }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl+W or Cmd+W to close active tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w' && !e.shiftKey && activeTabId) {
        e.preventDefault();
        closeTab(activeTabId);
      }

      // Ctrl+Shift+W or Cmd+Shift+W to close all tabs
      if ((e.ctrlKey || e.metaKey) && e.key === 'W' && e.shiftKey && openTabs.length > 0) {
        e.preventDefault();
        setOpenTabs([]);
        setActiveTabId(null);
        setBreadcrumb(['Home', selectedVehicleLabel]);
        // Clear tab storage when closing all tabs
        localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
      }

    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [activeTabId, openTabs, selectedVehicle]);


  // Handle vehicle selection
  // ✅ GOOD: Event-driven vehicle selection with store integration
  const handleVehicleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVehicle = event.target.value;

    console.log('🚗 Vehicle selection changed to:', newVehicle);

    let localLoading = false;

    try {
      setError(null);
      localLoading = true;
      startLoading();

      setSelectedModel(newVehicle);
      saveVehicleToStorage(newVehicle);

      setOpenTabs([]);
      setActiveTabId(null);
      setProcedureSteps({});
      setSystems([]);
      setExpandedSystems([]);
      saveExpandedSystemsStable([]);
      setBreadcrumb(['Home', getVehicleDisplayName(newVehicle)]);

      try {
        localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
      } catch (storageError) {
        console.error('❌ Failed to clear tab storage:', storageError);
      }

      await loadSystems(newVehicle);

      const refreshedState = useWISStore.getState();
      const refreshedSystems = refreshedState.cache?.systems?.[newVehicle];
      if (!refreshedSystems || refreshedSystems.length === 0) {
        setError('Unable to load the selected model. Showing offline reference content.');
        await loadRealSystemsData();
      } else {
        setError(null);
      }
    } catch (error) {
      console.error('❌ Failed to handle vehicle selection:', error);
      setError('Unable to load the selected model. Showing offline reference content.');
      await loadRealSystemsData();
    } finally {
      if (localLoading) {
        stopLoading();
      }
    }
  };

  // Toggle system expansion
  const toggleSystemExpansion = (systemId: string) => {
    const isCurrentlyExpanded = expandedSystems.includes(systemId);

    setExpandedSystems((prev) => {
      const newExpanded = isCurrentlyExpanded
        ? prev.filter((id) => id !== systemId)
        : [...prev, systemId];

      saveExpandedSystemsStable(newExpanded);
      return newExpanded;
    });

    if (!isCurrentlyExpanded) {
      ensureSystemDetails(systemId);
    }
  };

  // Tab management functions
  const openProcedureTab = (procedure: ProcedureNode, component: ComponentNode, system: SystemNode) => {
    const tabId = `${procedure.id}-${Date.now()}`;

    // Check if procedure is already open
    const existingTab = openTabs.find(tab => tab.procedure.id === procedure.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    const newTab: ProcedureTab = {
      id: tabId,
      procedure: procedure,
      component: component.name,
      system: system.name,
      activeView: 'overview'
    };

    setOpenTabs(prev => {
      const newTabs = [...prev, newTab];
      // Save immediately without useEffect
      try {
        localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(newTabs));
      } catch (error) {
        console.error('❌ Failed to save tabs:', error);
      }
      return newTabs;
    });

    setActiveTabId(tabId);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, tabId);
    } catch (error) {
      console.error('❌ Failed to save active tab:', error);
    }

    setBreadcrumb(['Home', selectedVehicleLabel, `${system.code} ${system.name}`, procedure.title]);
  };

  const closeTab = (tabId: string) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);

      // Save immediately without useEffect
      try {
        localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(newTabs));
      } catch (error) {
        console.error('❌ Failed to save tabs:', error);
      }

      // If closing active tab, switch to another tab or clear
      if (activeTabId === tabId) {
        const closingTabIndex = prev.findIndex(tab => tab.id === tabId);
        if (newTabs.length > 0) {
          // Switch to previous tab or first tab
          const newActiveTab = newTabs[Math.max(0, closingTabIndex - 1)];
          setActiveTabId(newActiveTab.id);
          try {
            localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, newActiveTab.id);
          } catch (error) {
            console.error('❌ Failed to save active tab:', error);
          }
          setBreadcrumb(['Home', selectedVehicleLabel, `${newActiveTab.system}`, newActiveTab.procedure.title]);
        } else {
          setActiveTabId(null);
          try {
            localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
          } catch (error) {
            console.error('❌ Failed to clear active tab:', error);
          }
          setBreadcrumb(['Home', selectedVehicleLabel]);
        }
      }

      return newTabs;
    });
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, tabId);
    } catch (error) {
      console.error('❌ Failed to save active tab:', error);
    }

    const tab = openTabs.find(t => t.id === tabId);
    if (tab) {
      setBreadcrumb(['Home', selectedVehicleLabel, tab.system, tab.procedure.title]);
    }
  };

  // Handle drag end for tab reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setOpenTabs((tabs) => {
        const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
        const newIndex = tabs.findIndex((tab) => tab.id === over.id);

        return arrayMove(tabs, oldIndex, newIndex);
      });
    }
  };


  const updateTabView = (tabId: string, view: 'overview' | 'steps' | 'media') => {
    setOpenTabs(prev =>
      prev.map(tab =>
        tab.id === tabId ? { ...tab, activeView: view } : tab
      )
    );

    // Load procedure steps when switching to steps view
    if (view === 'steps') {
      const tab = openTabs.find(t => t.id === tabId);
      if (tab && !procedureSteps[tab.procedure.id]) {
        loadProcedureSteps(tab.procedure.id);
      }
    }
  };


  // Get current active tab
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  // Render content based on active tab
  const renderTabContent = () => {
    if (showBarry) {
      const currentProcedure = activeTab
        ? {
            id: activeTab.procedure.id,
            title: activeTab.procedure.title,
            description: `${activeTab.system} - ${activeTab.component}`,
          }
        : undefined;

      return (
        <div className="h-full">
          <WISBarryTab
            currentProcedure={currentProcedure}
            vehicleModel={selectedVehicle}
            className="h-full"
            onClose={() => setShowBarry(false)}
          />
        </div>
      );
    }

    if (!activeTab) {
      return (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Procedure Selection */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Wrench className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Browse Procedures</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Choose a procedure from the left sidebar to view detailed step-by-step instructions, required tools, and parts information.
              </p>
              <div className="text-xs text-blue-600 font-medium">
                📍 Use the navigation tree to explore systems and components
              </div>
            </div>

            {/* Barry Assistant */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Barry AI Assistant</h3>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Get instant help with procedures, parts identification, troubleshooting, and technical questions for your {selectedVehicleLabel}.
              </p>
              <button
                onClick={() => setShowBarry(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Barry
              </button>
            </div>
          </div>
        </div>
      );
    }

    const selectedProcedure = {
      ...activeTab.procedure,
      component: activeTab.component,
      system: activeTab.system
    };

    switch (activeTab.activeView) {
      case 'overview':
        return (
          <div className="p-2">
            <div className="mb-0">
              <h3 className="text-base font-bold mb-0 uppercase">Procedure Overview</h3>
              <p className="text-sm leading-relaxed text-gray-600 mb-3">
                Follow all safety guidelines and use appropriate tools for this service procedure.
              </p>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1 p-4 bg-[#fff8dc] border-l-4 border-[#ffa500] rounded-md">
                <h4 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  Safety Notice
                </h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  Always wear appropriate safety equipment and follow Unimog safety procedures.
                </p>
              </div>
              <div className="flex-1 p-4 bg-[#f0f8ff] border-l-4 border-[#4682b4] rounded-md">
                <h4 className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
                  <Wrench className="w-3 h-3" />
                  Required Tools
                </h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  Standard workshop tools, torque wrench, Mercedes-Benz special tools as specified.
                </p>
              </div>
            </div>

            <div className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-md p-4">
              <h4 className="text-sm font-bold mb-2">Estimated Time: {selectedProcedure.estimatedTime}</h4>
              <h4 className="text-sm font-bold mb-2">Difficulty Level: {selectedProcedure.difficulty}</h4>
              <h4 className="text-sm font-bold mb-2">System: {selectedProcedure.system}</h4>
              <h4 className="text-sm font-bold mb-2">Component: {selectedProcedure.component}</h4>
            </div>
          </div>
        );

      case 'steps':
        const steps = procedureSteps[selectedProcedure.id] || [];
        const isLoadingSteps = !procedureSteps.hasOwnProperty(selectedProcedure.id);

        return (
          <div className="p-2">
            <h3 className="text-base font-bold mb-5 uppercase">Procedure Steps</h3>
            {isLoadingSteps ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading procedure steps...</div>
              </div>
            ) : steps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm">No detailed steps available for this procedure.</div>
                <div className="text-xs mt-2">Contact your service manager for detailed instructions.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id || index} className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-md p-4 flex items-start gap-3">
                    <div className="bg-[#5a6b3a] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {step.step_number || index + 1}
                    </div>
                    <div className="flex-1">
                      {step.step_title && (
                        <div className="text-sm font-semibold text-gray-900 mb-2">
                          {step.step_title}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed text-gray-800">
                        {step.instruction || `Step ${step.step_number || index + 1} for ${selectedProcedure.title}`}
                      </div>

                      {/* Safety warnings */}
                      {step.safety_warnings && step.safety_warnings.length > 0 && (
                        <div className="mt-2">
                          {step.safety_warnings.map((warning, idx) => (
                            <div key={idx} className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1 mt-1">
                              <strong>⚠️ Warning:</strong> {warning}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Torque specifications */}
                      {step.torque_specs && Object.keys(step.torque_specs).length > 0 && (
                        <div className="mt-2">
                          {Object.entries(step.torque_specs).map(([item, spec], idx) => (
                            <div key={idx} className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 mt-1">
                              <strong>🔧 Torque:</strong> {item.replace(/_/g, ' ')}: {spec}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Verification points */}
                      {step.verification_points && step.verification_points.length > 0 && (
                        <div className="mt-2">
                          {step.verification_points.map((point, idx) => (
                            <div key={idx} className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1 mt-1">
                              <strong>✓ Verify:</strong> {point}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Common mistakes */}
                      {step.common_mistakes && step.common_mistakes.length > 0 && (
                        <div className="mt-2">
                          {step.common_mistakes.map((mistake, idx) => (
                            <div key={idx} className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 mt-1">
                              <strong>⚠️ Avoid:</strong> {mistake}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'media':
        return (
          <div className="p-2">
            <h3 className="text-base font-bold mb-5 uppercase">Media & Diagrams</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-md p-4 text-center">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-sm font-semibold">Wiring Diagram</div>
                <div className="text-xs text-gray-600">WIS-{selectedProcedure.code}-01.pdf</div>
              </div>
              <div className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-md p-4 text-center">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-sm font-semibold">Component Layout</div>
                <div className="text-xs text-gray-600">WIS-{selectedProcedure.code}-02.pdf</div>
              </div>
              <div className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-md p-4 text-center">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-sm font-semibold">Torque Specifications</div>
                <div className="text-xs text-gray-600">WIS-{selectedProcedure.code}-03.pdf</div>
              </div>
              <div className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-md p-4 text-center">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-sm font-semibold">Video Guide</div>
                <div className="text-xs text-gray-600">WIS-{selectedProcedure.code}-video.mp4</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };




    console.log('🔧 WISProfessionalInterface: About to render component');

    return (
      <div className="h-screen bg-[#f5f5f5] flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Activation Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 border-b border-red-700 shadow-lg">
        <div className="flex items-center justify-center gap-3 max-w-6xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
          <div className="text-center">
            <div className="font-bold text-sm">
              🎯 WIS ACTIVATION MILESTONE
            </div>
            <div className="text-xs opacity-90 mt-1">
              This professional Mercedes WIS system will become operational after <strong>15 Premium monthly signups</strong> or <strong>1 Lifetime member</strong> joins!
            </div>
          </div>
          <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#d4c4a8] border-r border-[#bbb] overflow-y-auto rounded-l-lg">
          <div
            onClick={() => {
              setOpenTabs([]);
              setActiveTabId(null);
              setBreadcrumb(['Home', selectedVehicleLabel]);
              // Clear tab storage when going back to systems
              localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
              localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
            }}
            className="p-3 bg-black bg-opacity-10 border-b border-[#bbb] text-xs text-gray-700 cursor-pointer hover:bg-black hover:bg-opacity-15 transition-all duration-200"
          >
            ← BACK TO SYSTEMS
          </div>

          <div className="p-4 border-b border-[#bbb]">
            <h3 className="text-xs text-gray-600 mb-2 uppercase font-medium">Vehicle Model</h3>
            <select
              value={selectedVehicle}
              onChange={handleVehicleSelect}
              className="w-full bg-white border border-[#ccc] p-3 rounded-lg text-sm shadow-sm hover:border-gray-400 focus:border-[#5a6b3a] focus:ring-2 focus:ring-[#5a6b3a] focus:ring-opacity-20 transition-all"
            >
              {vehicleModels.map((vehicle) => (
                <option key={vehicle.code} value={vehicle.code}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4">
            <h3 className="text-xs text-gray-600 mb-3 uppercase font-medium">System Groups</h3>

            <div className="space-y-3">
              {systems.map((system) => (
                <div key={system.id}>
                  {/* System Header */}
                  <div
                    className={`rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      activeTab?.system === system.name
                        ? 'bg-[#5a6b3a] text-white border border-[#4a5a2a] shadow-lg'
                        : 'bg-white bg-opacity-80 border border-[#ccc] hover:bg-opacity-100'
                    }`}
                    onClick={() => toggleSystemExpansion(system.id)}
                  >
                    <div className="p-3 flex items-center gap-3 text-sm font-bold">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-sm ${
                        activeTab?.system === system.name
                          ? 'bg-white bg-opacity-30'
                          : 'bg-white bg-opacity-40'
                      }`}>
                        🔧
                      </div>
                      <div className="flex-1">
                        <div>{system.code} {system.name}</div>
                        <div className={`text-xs font-normal ${
                          activeTab?.system === system.name
                            ? 'text-white text-opacity-80'
                            : 'text-gray-600'
                        }`}>
                          {system.componentCount} components
                        </div>
                      </div>
                      {expandedSystems.includes(system.id) ? (
                        <ChevronDown className={`w-4 h-4 ${
                          activeTab?.system === system.name
                            ? 'text-white text-opacity-80'
                            : 'text-gray-500'
                        }`} />
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${
                          activeTab?.system === system.name
                            ? 'text-white text-opacity-80'
                            : 'text-gray-500'
                        }`} />
                      )}
                    </div>
                  </div>

                  {/* System Components - Show when expanded */}
                  {expandedSystems.includes(system.id) && system.components && (
                    <div className="ml-4 mt-2 space-y-2">
                      {system.components.map((component) => (
                        <div key={component.id} className="bg-white bg-opacity-60 border border-[#ddd] rounded-lg hover:bg-opacity-80 transition-all duration-200">
                          <div className="p-3 text-xs">
                            <div className="font-medium">{component.code} {component.name}</div>
                            <div className="text-gray-600 mt-1">{component.procedureCount} procedures</div>

                            {/* Show procedures if available */}
                            {component.procedures && component.procedures.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {component.procedures.map((procedure) => (
                                  <div
                                    key={procedure.id}
                                    className="p-2 bg-white bg-opacity-50 rounded cursor-pointer hover:bg-opacity-80 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openProcedureTab(procedure, component, system);
                                    }}
                                  >
                                    <div className="font-medium text-[#5a6b3a]">{procedure.title}</div>
                                    <div className="text-gray-500 text-xs">{procedure.code} • {procedure.difficulty} • {procedure.estimatedTime}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto rounded-r-lg">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 mb-2">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Error:</span>
              </div>
              <p className="text-xs mt-1">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  loadRealSystemsData();
                }}
                className="mt-2 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded transition-colors"
              >
                Retry Loading
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 mb-2">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Loading WIS data...</span>
              </div>
            </div>
          )}
          <div className="p-2 border-b border-[#eee] bg-[#f9f9f9]">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs text-gray-600">
                {breadcrumb.map((crumb, index) => (
                  <span key={index}>
                    {index < breadcrumb.length - 1 ? (
                      <>
                        <a
                          href="#"
                          className="text-[#5a6b3a] no-underline hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            if (index === 0) {
                              setOpenTabs([]);
                              setActiveTabId(null);
                              setBreadcrumb(['Home', selectedVehicleLabel]);
                              // Clear tab storage when clicking home
                              localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
                              localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
                            }
                          }}
                        >
                          {index === 0 ? '🏠 ' : ''}{crumb}
                        </a>
                        <span> › </span>
                      </>
                    ) : (
                      <span className="text-gray-800">{crumb}</span>
                    )}
                  </span>
                ))}
              </div>
              {activeTabId && (
                <div className="flex gap-0">
                  <button
                    onClick={() => updateTabView(activeTabId, 'overview')}
                    className={`px-3 py-1.5 text-xs cursor-pointer transition-all duration-200 ${
                      activeTab?.activeView === 'overview'
                        ? 'bg-[#5a6b3a] text-white'
                        : 'bg-[#f0f0f0] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => updateTabView(activeTabId, 'steps')}
                    className={`px-3 py-1.5 text-xs cursor-pointer transition-all duration-200 ${
                      activeTab?.activeView === 'steps'
                        ? 'bg-[#5a6b3a] text-white'
                        : 'bg-[#f0f0f0] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    Steps
                  </button>
                  <button
                    onClick={() => updateTabView(activeTabId, 'media')}
                    className={`px-3 py-1.5 text-xs cursor-pointer transition-all duration-200 ${
                      activeTab?.activeView === 'media'
                        ? 'bg-[#5a6b3a] text-white'
                        : 'bg-[#f0f0f0] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    Media
                  </button>
                </div>
              )}
            </div>


            {/* Browser-Style Tab Bar with Drag-and-Drop */}
            {openTabs.length > 0 && (
              <div className="border-b border-[#eee] bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] flex px-2 pt-2">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={openTabs.map(tab => tab.id)} strategy={horizontalListSortingStrategy}>
                    <div className="flex-1 flex overflow-x-auto scrollbar-hide gap-1">
                      {openTabs.map((tab) => (
                        <SortableTab
                          key={tab.id}
                          tab={tab}
                          activeTabId={activeTabId}
                          onSwitchTab={switchTab}
                          onCloseTab={closeTab}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                {/* Close All Tabs Button */}
                {openTabs.length > 1 && (
                  <div className="flex-shrink-0 flex items-center ml-2">
                    <button
                      onClick={() => {
                        setOpenTabs([]);
                        setActiveTabId(null);
                        setBreadcrumb(['Home', selectedVehicleLabel]);
                        // Clear tab storage when closing all tabs
                        localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
                        localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
                      }}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow transition-all duration-200"
                      title="Close All Tabs (or use Ctrl+Shift+W)"
                    >
                      Close All
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>


          {/* Dynamic Content */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5a6b3a]"></div>
                  <span className="text-sm text-gray-600">Loading procedure...</span>
                </div>
              </div>
            )}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
    );

  } catch (error) {
    console.error('🔧 WISProfessionalInterface: Component error caught:', error);
    throw error; // Re-throw to trigger ErrorBoundary
  }
};

// Add displayName for better debugging
WISProfessionalInterface.displayName = 'WISProfessionalInterface';

export default WISProfessionalInterface;