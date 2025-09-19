import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronRight, Home, Search, BookmarkPlus, Settings, FileText, Wrench, Clock, Bookmark, AlertTriangle, Bot, MessageCircle, X } from 'lucide-react';
import { WISBarryTab } from './WISBarryTab';
import { wisDataService } from '@/services/wis/wisDataService';
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
  // Use store state if available, fallback to local state
  const selectedVehicle = wisState?.selectedModel || 'U435';
  const vehicleModels = wisState?.models || [];
  const isLoading = wisState?.isLoading || false;

  const [systems, setSystems] = useState<SystemNode[]>([]);
  const [openTabs, setOpenTabs] = useState<ProcedureTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [showBarry, setShowBarry] = useState<boolean>(false);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Home', `Unimog ${selectedVehicle}`]);
  const [expandedSystems, setExpandedSystems] = useState<string[]>(['10', '20']);
  const [procedureSteps, setProcedureSteps] = useState<{[procedureId: string]: any[]}>({});
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);


  // Keys for localStorage
  const STORAGE_KEYS = {
    OPEN_TABS: 'wis-open-tabs',
    ACTIVE_TAB_ID: 'wis-active-tab-id',
    SELECTED_VEHICLE: 'wis-selected-vehicle',
    EXPANDED_SYSTEMS: 'wis-expanded-systems'
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Persistence helper functions
  const saveTabsToStorage = useCallback((tabs: ProcedureTab[], activeId: string | null) => {
    try {
      // Only save essential data to avoid localStorage size limits
      const tabsData = tabs.map(tab => ({
        id: tab.id,
        procedure: tab.procedure,
        component: tab.component,
        system: tab.system,
        activeView: tab.activeView
      }));
      localStorage.setItem(STORAGE_KEYS.OPEN_TABS, JSON.stringify(tabsData));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB_ID, activeId || '');
      console.log('✅ Tabs saved to localStorage:', tabsData.length, 'tabs');
    } catch (error) {
      console.error('❌ Failed to save tabs to localStorage:', error);
    }
  }, []);

  const loadTabsFromStorage = useCallback(() => {
    try {
      const savedTabs = localStorage.getItem(STORAGE_KEYS.OPEN_TABS);
      const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB_ID);

      if (savedTabs) {
        const tabsData = JSON.parse(savedTabs);
        console.log('📥 Loading tabs from localStorage:', tabsData.length, 'tabs');
        setOpenTabs(tabsData);

        if (savedActiveId && tabsData.find((tab: any) => tab.id === savedActiveId)) {
          setActiveTabId(savedActiveId);
          const activeTab = tabsData.find((tab: any) => tab.id === savedActiveId);
          if (activeTab) {
            setBreadcrumb(['Home', `Unimog ${selectedVehicle}`, activeTab.system, activeTab.procedure.title]);
          }
        } else if (tabsData.length > 0) {
          // If saved active tab doesn't exist, activate first tab
          setActiveTabId(tabsData[0].id);
          setBreadcrumb(['Home', `Unimog ${selectedVehicle}`, tabsData[0].system, tabsData[0].procedure.title]);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load tabs from localStorage:', error);
    }
  }, [selectedVehicle]);

  const saveVehicleToStorage = useCallback((vehicle: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_VEHICLE, vehicle);
      console.log('🚗 Vehicle saved to localStorage:', vehicle);
    } catch (error) {
      console.error('❌ Failed to save vehicle to localStorage:', error);
    }
  }, []);

  const saveExpandedSystemsToStorage = useCallback((expanded: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPANDED_SYSTEMS, JSON.stringify(expanded));
      console.log('⚙️ Expanded systems saved to localStorage:', expanded);
    } catch (error) {
      console.error('❌ Failed to save expanded systems to localStorage:', error);
    }
  }, []);

  // Load vehicle models from store or database
  const loadVehicleModels = useCallback(async () => {
    // If models are already in store, use those
    if (wisState?.models && wisState.models.length > 0) {
      console.log('✅ Using vehicle models from store:', wisState.models);
      return;
    }

    // Otherwise load from database
    try {
      console.log('🚗 Loading vehicle models from database...');
      if (wisActions?.loadModels) {
        await wisActions.loadModels();
      } else {
        // Fallback to direct service call if no store actions
        const models = await wisDataService.getModels();
        console.log('✅ Vehicle models loaded directly:', models);
      }
    } catch (error) {
      console.error('❌ Failed to load vehicle models:', error);
    }
  }, [wisState?.models, wisActions]);

  // Test database connectivity
  const testDatabaseConnection = async () => {
    try {
      console.log('🔍 Testing WIS database connectivity...');

      // Test basic connectivity
      const healthCheck = await wisDataService.healthCheck();
      console.log('📊 WIS Health Check:', healthCheck);

      // Test models table
      const models = await wisDataService.getModels();
      console.log('🚗 Available WIS Models:', models);

      if (models.length > 0) {
        // Test systems for first model
        const firstModel = models[0];
        console.log('🔧 Testing systems for model:', firstModel.model_code);
        const systems = await wisDataService.getSystems(firstModel.id);
        console.log('⚙️ Available Systems:', systems);

        if (systems.length > 0) {
          // Test components for first system
          const firstSystem = systems[0];
          console.log('🔩 Testing components for system:', firstSystem.system_code);
          const components = await wisDataService.getComponents(firstSystem.id);
          console.log('🧩 Available Components:', components);
        }
      }

    } catch (error) {
      console.error('❌ Database connection test failed:', error);
    }
  };

  const loadRealSystemsData = useCallback(async () => {
    try {
      console.log('🔧 Loading real WIS systems data...');
      setIsLoading(true);
      setError(null);

      // Get the current model ID first
      const models = await wisDataService.getModels();
      const currentModel = models.find(m => m.model_code === selectedVehicle);

      if (!currentModel) {
        console.warn('❌ No model found for:', selectedVehicle);
        return;
      }

      // Load systems for this model
      const systems = await wisDataService.getSystems(currentModel.id);
      console.log('📊 Loaded systems:', systems);

      // Transform systems to our UI format and load components for each system
      const systemsWithComponents: SystemNode[] = [];

      for (const system of systems) {
        try {
          // Load components for this system
          const components = await wisDataService.getComponents(system.id);

          // Transform components to UI format
          const componentsWithProcedures = [];

          for (const component of components) {
            try {
              // Load procedures for this component
              const procedures = await wisDataService.getProcedures(component.id);

              // Transform procedures to UI format
              const transformedProcedures = procedures.map(proc => ({
                id: proc.id,
                code: proc.procedure_code || `${component.component_code}.${proc.procedure_number || '01'}`,
                title: proc.procedure_title,
                difficulty: proc.difficulty_level || 'Medium',
                estimatedTime: proc.estimated_time || '1 hour'
              }));

              componentsWithProcedures.push({
                id: component.id,
                code: component.component_code,
                name: component.component_name,
                procedureCount: transformedProcedures.length,
                procedures: transformedProcedures
              });

            } catch (componentError) {
              console.warn(`⚠️ Failed to load procedures for component ${component.component_name}:`, componentError);
              // Add component without procedures as fallback
              componentsWithProcedures.push({
                id: component.id,
                code: component.component_code,
                name: component.component_name,
                procedureCount: 0,
                procedures: []
              });
            }
          }

          systemsWithComponents.push({
            id: system.id,
            code: system.system_code,
            name: system.system_name,
            icon: '⚙️',
            componentCount: componentsWithProcedures.length,
            expanded: system.system_code === '01', // Expand Engine system by default
            components: componentsWithProcedures
          });

        } catch (systemError) {
          console.warn(`⚠️ Failed to load components for system ${system.system_name}:`, systemError);
          // Add system without components as fallback
          systemsWithComponents.push({
            id: system.id,
            code: system.system_code,
            name: system.system_name,
            icon: '⚙️',
            componentCount: 0,
            expanded: false,
            components: []
          });
        }
      }

      setSystems(systemsWithComponents);
      console.log('✅ Real WIS data loaded successfully:', systemsWithComponents);

    } catch (error) {
      console.error('❌ Failed to load real systems data:', error);
      setError(`Failed to load systems data: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // Retry logic for network failures
      if (retryCount < 2 && error instanceof Error && (error.message.includes('network') || error.message.includes('fetch'))) {
        console.log('🔄 Retrying data load...', retryCount + 1);
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadRealSystemsData(), 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }

      // Fallback to a minimal system structure
      setSystems([
        {
          id: 'fallback-engine',
          code: '01',
          name: 'Engine',
          icon: '⚙️',
          componentCount: 0,
          expanded: false,
          components: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVehicle, retryCount]);

  // Load procedure steps for a specific procedure (memoized)
  const loadProcedureSteps = useCallback(async (procedureId: string) => {
    try {
      console.log('📋 Loading procedure steps for:', procedureId);

      const steps = await wisDataService.getProcedureSteps(procedureId);
      console.log('✅ Procedure steps loaded:', steps);

      setProcedureSteps(prev => ({
        ...prev,
        [procedureId]: steps
      }));

    } catch (error) {
      console.error('❌ Failed to load procedure steps:', error);
      // Set empty array as fallback
      setProcedureSteps(prev => ({
        ...prev,
        [procedureId]: []
      }));
    }
  }, []);

  // Initialize component with saved state
  useEffect(() => {
    // Load saved expanded systems
    const savedExpanded = localStorage.getItem(STORAGE_KEYS.EXPANDED_SYSTEMS);
    if (savedExpanded) {
      try {
        const expandedData = JSON.parse(savedExpanded);
        setExpandedSystems(expandedData);
      } catch (error) {
        console.error('❌ Failed to load expanded systems:', error);
      }
    }

    loadVehicleModels();
    loadRealSystemsData();
    testDatabaseConnection();
  }, [loadVehicleModels, loadRealSystemsData]);

  // Load tabs after vehicle models and systems are loaded
  useEffect(() => {
    if (systems.length > 0 && vehicleModels.length > 0) {
      loadTabsFromStorage();
    }
  }, [systems, vehicleModels, loadTabsFromStorage]);

  // Handle vehicle model changes from store
  useEffect(() => {
    if (wisState?.selectedModel && wisState.selectedModel !== selectedVehicle) {
      setBreadcrumb(['Home', `Unimog ${wisState.selectedModel}`]);
    }
  }, [wisState?.selectedModel, selectedVehicle]);

  // Save state when dependencies change
  useEffect(() => {
    if (vehicleModels.length > 0) {
      loadRealSystemsData();
    }
  }, [selectedVehicle, loadRealSystemsData, vehicleModels]);

  // Auto-save tabs whenever they change
  useEffect(() => {
    if (openTabs.length > 0 || activeTabId) {
      saveTabsToStorage(openTabs, activeTabId);
    }
  }, [openTabs, activeTabId, saveTabsToStorage]);


  // Auto-save expanded systems
  useEffect(() => {
    if (expandedSystems.length > 0) {
      saveExpandedSystemsToStorage(expandedSystems);
    }
  }, [expandedSystems, saveExpandedSystemsToStorage]);

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
        setBreadcrumb(['Home', `Unimog ${selectedVehicle}`]);
        // Clear tab storage when closing all tabs
        localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
      }

    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [activeTabId, openTabs, selectedVehicle]);


  // Handle vehicle selection
  const handleVehicleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVehicle = event.target.value;

    // Update store if available
    if (wisActions?.setSelectedModel) {
      wisActions.setSelectedModel(newVehicle);
    }

    setBreadcrumb(['Home', `Unimog ${newVehicle}`]);
    // Clear tabs when switching vehicles
    setOpenTabs([]);
    setActiveTabId(null);
    // Clear tab storage when switching vehicles
    localStorage.removeItem(STORAGE_KEYS.OPEN_TABS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB_ID);
  };

  // Toggle system expansion
  const toggleSystemExpansion = (systemId: string) => {
    setExpandedSystems(prev =>
      prev.includes(systemId)
        ? prev.filter(id => id !== systemId)
        : [...prev, systemId]
    );
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

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(tabId);
    setBreadcrumb(['Home', `Unimog ${selectedVehicle}`, `${system.code} ${system.name}`, procedure.title]);
  };

  const closeTab = (tabId: string) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);

      // If closing active tab, switch to another tab or clear
      if (activeTabId === tabId) {
        const closingTabIndex = prev.findIndex(tab => tab.id === tabId);
        if (newTabs.length > 0) {
          // Switch to previous tab or first tab
          const newActiveTab = newTabs[Math.max(0, closingTabIndex - 1)];
          setActiveTabId(newActiveTab.id);
          setBreadcrumb(['Home', `Unimog ${selectedVehicle}`, `${newActiveTab.system}`, newActiveTab.procedure.title]);
        } else {
          setActiveTabId(null);
          setBreadcrumb(['Home', `Unimog ${selectedVehicle}`]);
        }
      }

      return newTabs;
    });
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = openTabs.find(t => t.id === tabId);
    if (tab) {
      setBreadcrumb(['Home', `Unimog ${selectedVehicle}`, tab.system, tab.procedure.title]);
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
      const currentProcedure = activeTab ? {
        id: activeTab.procedure.id,
        title: activeTab.procedure.title,
        description: `${activeTab.system} - ${activeTab.component.name}`
      } : undefined;

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
                Get instant help with procedures, parts identification, troubleshooting, and technical questions for your {selectedVehicle}.
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




  return (
    <div className="h-screen bg-[#f5f5f5] flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#d4c4a8] border-r border-[#bbb] overflow-y-auto rounded-l-lg">
          <div
            onClick={() => {
              setOpenTabs([]);
              setActiveTabId(null);
              setBreadcrumb(['Home', `Unimog ${selectedVehicle}`]);
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
                  setRetryCount(0);
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
                              setBreadcrumb(['Home', `Unimog ${selectedVehicle}`]);
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
                        setBreadcrumb(['Home', `Unimog ${selectedVehicle}`]);
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
};

export default WISProfessionalInterface;