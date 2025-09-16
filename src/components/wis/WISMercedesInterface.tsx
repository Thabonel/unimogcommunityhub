import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { 
  Search, 
  Settings, 
  BookOpen, 
  Wrench, 
  Package, 
  FileText, 
  AlertCircle, 
  Image, 
  Video,
  Clock,
  Star,
  ChevronRight,
  ChevronDown,
  User,
  Bot,
  Lightbulb,
  FileSpreadsheet,
  Presentation,
  Download,
  Plus,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { WISSearchRouter, WISSearchContext } from '@/services/wis/WISSearchRouter';
import { BarryDocumentGenerator } from '@/services/wis/BarryDocumentGenerator';
import { WISMediaService, WISMediaItem } from '@/services/wis/WISMediaService';
import { InteractiveBarryResponse } from './InteractiveBarryResponse';
import { InteractiveElement } from '@/utils/barry-response-parser';
import DocumentManager from './DocumentManager';
import PresentationGenerator from './PresentationGenerator';
import ExcelPartsGenerator from './ExcelPartsGenerator';

interface WISItem {
  id: string;
  title?: string;
  name?: string;
  number?: string;
  code?: string;
  category?: string;
  description?: string;
  model?: string;
  has_images?: boolean;
  has_videos?: boolean;
  difficulty?: number;
  time_estimate?: number;
  // Vector search enhancement fields
  doc_type?: string;
  doc_id?: string;
  reference_number?: string;
  content_summary?: string;
  vehicle_model?: string;
  similarity_score?: number;
  result_rank?: number;
  search_method?: 'vector_semantic' | 'hybrid_vector_text' | 'fallback_text';
}

interface WISCatalog {
  models: any[];
  procedures: { total_count: number; categories: string[]; };
  parts: { total_count: number; categories: string[]; };
  bulletins: { total_count: number; categories: string[]; };
}

interface BarryContext {
  query: string;
  explanation: string;
  curatedResults: {
    procedures: WISItem[];
    parts: WISItem[];
    bulletins: WISItem[];
  };
  suggestions: string[];
  timestamp: number;
}

interface WISMercedesInterfaceProps {
  barryContext?: BarryContext;
  onBarryRequest?: (query: string) => void;
}

export function WISMercedesInterface({ 
  barryContext, 
  onBarryRequest 
}: WISMercedesInterfaceProps = {}) {
  const { user, profile } = useAuth();
  const [catalog, setCatalog] = useState<WISCatalog | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<'procedures' | 'parts' | 'bulletins'>('procedures');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentItems, setCurrentItems] = useState<WISItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WISItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<WISItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));
  const [isBarryMode, setIsBarryMode] = useState<boolean>(!!barryContext);
  
  // WIS Search Router integration state
  const [barryResponse, setBarryResponse] = useState<any>(null);
  const [isBarryThinking, setIsBarryThinking] = useState(false);
  const [barryStatus, setBarryStatus] = useState<string>('ready');
  const [searchRouter] = useState(() => new WISSearchRouter());
  const [documentGenerator] = useState(() => new BarryDocumentGenerator());
  const [mediaService] = useState(() => new WISMediaService());
  const [relatedMedia, setRelatedMedia] = useState<WISMediaItem[]>([]);
  const [selectedInteractiveItem, setSelectedInteractiveItem] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [moduleContent, setModuleContent] = useState<Record<string, any[]>>({});
  
  // Document generation state
  const [showDocumentManager, setShowDocumentManager] = useState(false);
  const [showPresentationGenerator, setShowPresentationGenerator] = useState(false);
  const [showExcelGenerator, setShowExcelGenerator] = useState(false);
  const [selectedProcedureForDoc, setSelectedProcedureForDoc] = useState<any>(null);
  const [barryProgress, setBarryProgress] = useState<number>(0);
  const [conversationHistory, setConversationHistory] = useState<Array<{query: string, response: string, timestamp: number}>>([]);

  // Get user's primary vehicle model from profile
  const userVehicleModel = profile?.primary_vehicle_model || 'U1700L';

  // Update Barry mode when context changes
  useEffect(() => {
    if (barryContext) {
      setIsBarryMode(true);
      // Populate interface with Barry's curated results
      const allItems = [
        ...barryContext.curatedResults.procedures,
        ...barryContext.curatedResults.parts,
        ...barryContext.curatedResults.bulletins
      ];
      setCurrentItems(allItems);
      
      // Set the module based on what Barry found most of
      const counts = {
        procedures: barryContext.curatedResults.procedures.length,
        parts: barryContext.curatedResults.parts.length,
        bulletins: barryContext.curatedResults.bulletins.length
      };
      const primaryModule = Object.keys(counts).reduce((a, b) => 
        counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b
      ) as 'procedures' | 'parts' | 'bulletins';
      setSelectedModule(primaryModule);
    }
  }, [barryContext]);

  useEffect(() => {
    loadCatalog();
    loadItems();
  }, [selectedModule, selectedCategory, userVehicleModel]);

  const loadCatalog = async () => {
    try {
      const { data, error } = await supabase.rpc('get_wis_catalog', {
        model_code: userVehicleModel
      });
      if (error) throw error;
      setCatalog(data);
    } catch (error) {
      console.error('Error loading catalog:', error);
    }
  };

  const loadItems = async () => {
    // Skip loading if we're in Barry mode or if there's no search query
    if (isBarryMode || !searchQuery.trim()) {
      return;
    }
    
    setLoading(true);
    try {
      // Use Barry API for all searches
      await handleBarrySearch();
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
      setCurrentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBarrySearch = async () => {
    if (!searchQuery.trim()) return;

    setIsBarryThinking(true);
    setLoading(true);
    setBarryProgress(0);

    try {
      // Step 1: Analyze query
      setBarryStatus('Analyzing your question...');
      setBarryProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Intelligent search routing
      setBarryStatus('Using intelligent search routing...');
      setBarryProgress(40);

      const searchContext: WISSearchContext = {
        query: searchQuery,
        vehicleModel: userVehicleModel,
        contentType: selectedModule as any,
        searchMethod: 'auto' // Let the router decide the best method
      };

      // Step 3: Execute unified search (no duplicates!)
      setBarryStatus('Processing with AI and database integration...');
      setBarryProgress(70);

      console.log('Using unified WIS search router:', searchContext);
      const searchResult = await searchRouter.search(searchContext);
      console.log('Unified search result:', searchResult);

      // Step 4: Process results
      setBarryStatus('Generating response...');
      setBarryProgress(90);
      await new Promise(resolve => setTimeout(resolve, 300));

      if (searchResult.response || searchResult.items.length > 0) {
        // Store response and items
        setBarryResponse(searchResult.response);
        setCurrentItems(searchResult.items);

        // Add to conversation history
        setConversationHistory(prev => [...prev, {
          query: searchQuery,
          response: searchResult.response || `Found ${searchResult.items.length} relevant items`,
          timestamp: Date.now()
        }]);

        // Final step: Complete
        setBarryStatus('Analysis complete!');
        setBarryProgress(100);

        // Show success message with search method info
        const methodLabel = {
          'claude_ai': 'AI Analysis',
          'database': 'Database Search',
          'hybrid': 'Hybrid AI + Database',
          'barry_wis': 'Barry WIS'
        }[searchResult.source] || 'Smart Search';

        toast.success(`${methodLabel} completed - Found ${searchResult.items.length} relevant items`);

        // Enable Barry mode to show results
        setIsBarryMode(true);

        // Auto-generate helpful documents if Barry provided a detailed response
        if (searchResult.response && searchResult.response.length > 200) {
          try {
            setBarryStatus('Barry is creating helpful documents...');
            const generatedDocs = await documentGenerator.autoGenerateFromBarryResponse(
              searchResult.response,
              searchQuery,
              searchResult.items,
              userVehicleModel
            );

            if (generatedDocs.length > 0) {
              toast.success(`Barry created ${generatedDocs.length} helpful document(s) for you!`);
            }
          } catch (error) {
            console.error('Auto document generation failed:', error);
            // Don't show error to user - this is a nice-to-have feature
          }
        }

        // Load related media (schematics, diagrams, photos)
        if (searchResult.items.length > 0) {
          try {
            setBarryStatus('Loading schematics and diagrams...');
            const itemIds = searchResult.items.map(item => item.id).filter(Boolean);
            const media = await mediaService.getMediaForWISItems(itemIds, selectedModule as any);
            setRelatedMedia(media);

            if (media.length > 0) {
              console.log(`Loaded ${media.length} media items (schematics, diagrams, photos)`);
            }
          } catch (error) {
            console.error('Media loading failed:', error);
          }
        }

      } else {
        setBarryStatus('No results found');
        toast.error('No relevant information found for your query');
        setCurrentItems([]);
      }
    } catch (error) {
      console.error('Unified search failed:', error);
      setBarryStatus('Connection error');
      toast.error('Search encountered an issue. Please try again.');
      setCurrentItems([]);
    } finally {
      // Reset status after a delay
      setTimeout(() => {
        setIsBarryThinking(false);
        setLoading(false);
        setBarryStatus('ready');
        setBarryProgress(0);
      }, 1000);
    }
  };

  const handleSearch = async () => {
    await handleBarrySearch();
  };

  const handleItemSelect = async (item: WISItem) => {
    setSelectedItem(item);
    
    // Load related items (Barry's intelligent suggestions)
    try {
      const { data: related } = await supabase.rpc('get_wis_items', {
        item_type: selectedModule,
        search_terms: [item.category || ''],
        model_code: userVehicleModel,
        limit_count: 5
      });
      setRelatedItems((related || []).filter(r => r.id !== item.id));
    } catch (error) {
      console.error('Error loading related items:', error);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleModuleToggle = async (moduleKey: string) => {
    const newExpanded = new Set(expandedModules);

    if (newExpanded.has(moduleKey)) {
      // Collapse module
      newExpanded.delete(moduleKey);
    } else {
      // Expand module and load content
      newExpanded.add(moduleKey);
      await loadModuleContent(moduleKey);
    }

    setExpandedModules(newExpanded);
  };

  const loadModuleContent = async (moduleKey: string) => {
    try {
      // Only load if we don't already have content for this module
      if (moduleContent[moduleKey]) return;

      let data = [];

      // Query Supabase directly for each content type
      if (moduleKey === 'procedures') {
        const { data: proceduresData, error } = await supabase
          .from('wis_procedures')
          .select('id, title, procedure_code as code, description, difficulty, time_estimate, category, vehicle_model')
          .limit(20);

        if (!error && proceduresData) {
          data = proceduresData.map(item => ({
            ...item,
            name: item.title,
            search_method: 'database'
          }));
        }
      } else if (moduleKey === 'parts') {
        const { data: partsData, error } = await supabase
          .from('wis_parts')
          .select('id, part_name as title, part_number as code, description, category, vehicle_model')
          .limit(20);

        if (!error && partsData) {
          data = partsData.map(item => ({
            ...item,
            name: item.title,
            search_method: 'database'
          }));
        }
      } else if (moduleKey === 'bulletins') {
        const { data: bulletinsData, error } = await supabase
          .from('wis_bulletins')
          .select('id, title, bulletin_number as code, description, category, vehicle_model, urgency')
          .limit(20);

        if (!error && bulletinsData) {
          data = bulletinsData.map(item => ({
            ...item,
            name: item.title,
            search_method: 'database'
          }));
        }
      }

      setModuleContent(prev => ({
        ...prev,
        [moduleKey]: data
      }));

      console.log(`Loaded ${data.length} items for ${moduleKey}`);
    } catch (error) {
      console.error(`Failed to load content for ${moduleKey}:`, error);
      // Set empty array to stop loading state
      setModuleContent(prev => ({
        ...prev,
        [moduleKey]: []
      }));
    }
  };

  const handleInteractiveElementClick = async (element: InteractiveElement) => {
    console.log('Interactive element clicked:', element);

    try {
      // Search for the clicked element in the database
      let searchQuery = element.value;

      // Determine search type based on element type
      let contentType: 'procedures' | 'parts' | 'bulletins' | undefined;
      switch (element.type) {
        case 'procedure':
          contentType = 'procedures';
          break;
        case 'part_number':
          contentType = 'parts';
          break;
        default:
          // Let the search router decide
          break;
      }

      const searchContext: WISSearchContext = {
        query: searchQuery,
        vehicleModel: userVehicleModel,
        contentType: contentType,
        searchMethod: 'database_only' // Direct database lookup for specific items
      };

      const searchResult = await searchRouter.search(searchContext);

      if (searchResult.items.length > 0) {
        // Load the first relevant item into the central viewer
        const item = searchResult.items[0];
        setSelectedInteractiveItem(item);
        setSelectedItem(item);

        // Also load related media for this specific item
        const media = await mediaService.getMediaForWISItems([item.id], contentType || 'procedures');
        setRelatedMedia(media);

        toast.success(`Loaded details for ${element.text}`);
      } else {
        toast.error(`No details found for ${element.text}`);
      }
    } catch (error) {
      console.error('Error loading interactive element:', error);
      toast.error('Failed to load details');
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'procedures': return <Wrench className="h-4 w-4" />;
      case 'parts': return <Package className="h-4 w-4" />;
      case 'bulletins': return <AlertCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyBadge = (level?: number) => {
    if (!level) return null;
    const colors = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-red-100 text-red-800'];
    const labels = ['Basic', 'Intermediate', 'Advanced'];
    return (
      <Badge className={colors[Math.min(level - 1, 2)]}>
        {labels[Math.min(level - 1, 2)]}
      </Badge>
    );
  };

  const getSimilarityBadge = (score?: number, rank?: number) => {
    if (!score) return null;
    const percentage = Math.round(score * 100);
    const color = percentage >= 80 ? 'bg-green-100 text-green-800 border-green-200' : 
                 percentage >= 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                 'bg-blue-100 text-blue-800 border-blue-200';
    return (
      <Badge variant="outline" className={`${color} text-xs`}>
        {percentage}% match
        {rank && ` #${rank}`}
      </Badge>
    );
  };

  const getSearchMethodBadge = (method?: string) => {
    if (!method) return null;
    const config = {
      'hybrid_vector_text': { 
        label: 'AI Hybrid', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🧠'
      },
      'vector_semantic': { 
        label: 'Semantic', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '🎯'
      },
      'fallback_text': { 
        label: 'Text Search', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '📝'
      }
    }[method];
    
    if (!config) return null;
    
    return (
      <Badge variant="outline" className={`${config.color} text-xs`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex h-full bg-sand-beige/20">
      {/* Left Navigation Panel - Mercedes Style */}
      <div className="w-[420px] bg-sand-beige/30 border-r border-khaki-tan/40 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-khaki-tan/40 bg-white border border-military-green/20">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-6 w-6 text-military-green" />
            <h1 className="text-lg font-semibold text-military-green">WIS Professional</h1>
          </div>
          
          {/* Vehicle Info from Profile */}
          <div className="flex items-center gap-2 text-sm text-military-green bg-military-green/10 p-2 rounded border border-military-green/20">
            <User className="h-4 w-4" />
            <span className="font-medium text-military-green">{userVehicleModel}</span>
            <span>•</span>
            <span>From Profile</span>
          </div>
          
          {/* Document Generation Actions */}
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDocumentManager(true)}
              className="flex-1 text-xs border-military-green/30 hover:bg-military-green/10"
            >
              <FileText className="h-3 w-3 mr-1" />
              Documents
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowExcelGenerator(true)}
              className="flex-1 text-xs border-green-600/30 hover:bg-green-50"
            >
              <FileSpreadsheet className="h-3 w-3 mr-1" />
              Excel
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPresentationGenerator(true)}
              className="flex-1 text-xs border-orange-600/30 hover:bg-orange-50"
            >
              <Presentation className="h-3 w-3 mr-1" />
              PPT
            </Button>
          </div>
        </div>

        {/* Module Selection */}
        <div className="border-b border-khaki-tan/40 bg-white/60">
          <div className="p-4">
            <h3 className="font-medium text-military-green mb-3">Browse Content</h3>
            <div className="space-y-1">
              {[
                { key: 'procedures', label: 'Procedures', icon: <Wrench className="h-4 w-4" />, count: catalog?.procedures.total_count },
                { key: 'parts', label: 'Parts Catalog', icon: <Package className="h-4 w-4" />, count: catalog?.parts.total_count },
                { key: 'bulletins', label: 'Service Bulletins', icon: <AlertCircle className="h-4 w-4" />, count: catalog?.bulletins.total_count }
              ].map((module) => (
                <div key={module.key} className="space-y-1">
                  <button
                    onClick={() => handleModuleToggle(module.key)}
                    className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                      expandedModules.has(module.key)
                        ? 'bg-military-green/20 text-military-green border border-military-green/30'
                        : 'text-foreground hover:bg-military-green/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {expandedModules.has(module.key) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      {module.icon}
                      <span>{module.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.count && (
                        <Badge variant="secondary" className="text-xs">
                          {module.count}
                        </Badge>
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedModules.has(module.key) && (
                    <div className="ml-6 space-y-1 max-h-48 overflow-y-auto">
                      {moduleContent[module.key] ? (
                        moduleContent[module.key].map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedItem(item);
                              setSelectedModule(module.key as any);
                            }}
                            className="w-full text-left p-2 rounded text-xs hover:bg-military-green/10 transition-colors border border-transparent hover:border-military-green/30"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {item.title || item.name || 'Untitled'}
                                </p>
                                {item.code && (
                                  <p className="text-military-green font-mono mt-1">
                                    {item.code}
                                  </p>
                                )}
                                {item.description && (
                                  <p className="text-muted-foreground mt-1 line-clamp-2">
                                    {item.description.substring(0, 80)}...
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2" />
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground p-2">
                          Loading content...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced AI Search */}
        <div className="p-6 border-b border-khaki-tan/40 bg-white/80">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-military-green" />
              <h3 className="font-medium text-military-green">Describe Your Technical Need</h3>
            </div>
            
            <div className="space-y-3">
              <textarea
                placeholder={`Describe in detail what you're looking for or what problem you need to solve:\n\nAvailable content: Engine service (OM352), transmission maintenance, hydraulic systems, electrical troubleshooting, brake systems, fuel systems, cooling systems, and chassis maintenance.\n\nExample: "I need to replace the seals in my OM352 engine. The engine has been leaking oil and I want to find the correct seal part numbers and replacement procedures."`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
                className="w-full min-h-[140px] max-h-[250px] p-4 text-sm border border-khaki-tan/60 rounded-lg resize-y focus:ring-2 focus:ring-military-green focus:border-military-green transition-all duration-200 shadow-sm bg-white"
                rows={5}
              />
              
              <div className="flex items-center justify-between">
                <Button 
                  onClick={handleSearch} 
                  className="px-8 py-2 text-sm font-medium"
                  disabled={!searchQuery.trim() || isBarryThinking}
                >
                  {isBarryThinking ? (
                    <>
                      <Bot className="h-4 w-4 mr-2 animate-spin" />
                      Barry is thinking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Ask Barry
                    </>
                  )}
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  {searchQuery.length} characters
                </div>
              </div>
            </div>
            
            <div className="bg-background/80 rounded-lg p-3 border border-border">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="flex-shrink-0 mt-0.5">
                  <User className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p><strong>💡 Pro Tips:</strong></p>
                  <ul className="space-y-1 ml-2">
                    <li>• Be specific about your Unimog model and the exact problem</li>
                    <li>• Describe symptoms, error codes, or maintenance needs</li>
                    <li>• Drag the corner to expand this text area if needed</li>
                    <li>• Press Enter to search, Shift+Enter for new line</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-medium text-military-green mb-3 text-sm uppercase tracking-wide">
              Filter by Category
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-military-green/20 text-military-green border border-military-green/30'
                    : 'text-foreground hover:bg-military-green/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3" />
                  <span>Show All Content</span>
                </div>
                {catalog && (
                  <Badge variant="secondary" className="text-xs">
                    {catalog[selectedModule]?.total_count || 0}
                  </Badge>
                )}
              </button>

              {catalog && catalog[selectedModule]?.categories?.map((category: string) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-military-green/20 text-military-green border border-military-green/30'
                      : 'text-foreground hover:bg-military-green/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-current opacity-50" />
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                  </div>
                </button>
              ))}

              {catalog && catalog[selectedModule]?.categories?.length === 0 && (
                <div className="text-xs text-muted-foreground p-2 text-center">
                  No categories available for {selectedModule}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Search Results Banner - Show when Barry is thinking or has responded */}
        {(isBarryThinking || (isBarryMode && barryResponse) || (isBarryMode && barryContext) || (searchQuery && currentItems.length > 0 && currentItems[0]?.search_method !== 'fallback_text')) && (
          <div className={`border-b border-border p-4 ${
            isBarryMode 
              ? 'bg-gradient-to-r from-khaki-tan/10 to-sand-beige/10' 
              : 'bg-gradient-to-r from-khaki-tan/10 to-sand-beige/10'
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {isBarryMode ? (
                  <Bot className="h-5 w-5 text-military-green" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-terrain-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-foreground">
                    {isBarryThinking ? "Barry is analyzing your request..." : 
                     isBarryMode ? "Barry's AI Analysis" : "Smart Search Results"}
                  </span>
                  {isBarryThinking ? (
                    <Badge variant="outline" className="text-xs animate-pulse">Processing...</Badge>
                  ) : isBarryMode ? (
                    <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {currentItems[0]?.search_method === 'hybrid_vector_text' ? 'Hybrid AI' : 'Semantic AI'}
                    </Badge>
                  )}
                </div>
                
                {isBarryThinking ? (
                  <>
                    <p className="text-sm text-foreground mb-3">
                      {barryStatus} "{searchQuery}"
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-military-green h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${barryProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-military-green">
                      <span>Target: {selectedModule}</span>
                      <span>•</span>
                      <span>Vehicle: {userVehicleModel}</span>
                      <span>•</span>
                      <span className="animate-pulse">{Math.round(barryProgress)}% complete</span>
                    </div>
                  </>
                ) : isBarryMode && (barryResponse || barryContext) ? (
                  <div className="flex items-center gap-4 text-xs text-military-green">
                    <span>Query: "{searchQuery}"</span>
                    <span>•</span>
                    <span>Found {currentItems.length} relevant items</span>
                    <span>•</span>
                    <span>Model: {userVehicleModel}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-xs text-terrain-600">
                    <span>Search method: {currentItems[0]?.search_method === 'hybrid_vector_text' ? 'AI Hybrid Search' : 'Semantic Search'}</span>
                    <span>•</span>
                    <span>Found {currentItems.length} relevant items</span>
                    {currentItems[0]?.similarity_score && (
                      <>
                        <span>•</span>
                        <span>Best match: {Math.round(currentItems[0].similarity_score * 100)}%</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!isBarryMode && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // This would trigger Barry chat with current search context
                      if (onBarryRequest) {
                        onBarryRequest(`Explain the search results for "${searchQuery}" in detail`);
                      }
                    }}
                    className="text-terrain-600 hover:text-terrain-700 border-terrain-200"
                  >
                    <Bot className="h-3 w-3 mr-1" />
                    Ask Barry
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (isBarryMode) {
                      setIsBarryMode(false);
                    } else {
                      setSearchQuery('');
                      setCurrentItems([]);
                    }
                  }}
                  className="text-military-green hover:text-olive-drab"
                >
                  {isBarryMode ? 'Clear Barry Results' : 'Clear Search'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Top Toolbar */}
        <div className="bg-muted/50 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getModuleIcon(selectedModule)}
                <span className="font-medium text-foreground capitalize">{selectedModule}</span>
                {selectedCategory !== 'all' && (
                  <>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-muted-foreground">{selectedCategory}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {currentItems.length} items
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Items List */}
          <div className="w-1/2 border-r border-khaki-tan/40 bg-white/60">
            <div className="overflow-y-auto h-full">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : currentItems.length > 0 ? (
                /* Database Items - Secondary Content */
                <div className="divide-y divide-gray-100">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`p-4 cursor-pointer transition-all hover:bg-muted/50 hover:shadow-sm ${
                        selectedItem?.id === item.id ? 'bg-muted/50 border-r-2 border-military-green shadow-sm' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-4">
                          <h3 className="font-semibold text-foreground mb-1 leading-tight">
                            {item.title || item.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono bg-military-green/10 text-military-green px-2 py-1 rounded text-xs font-medium border border-military-green/20">
                              {item.code || item.number}
                            </span>
                            {item.category && (
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            )}
                            {item.doc_type && (
                              <Badge variant="secondary" className="text-xs">
                                {item.doc_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {getSimilarityBadge(item.similarity_score, item.result_rank)}
                          {getDifficultyBadge(item.difficulty)}
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Enhanced metadata display */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {item.time_estimate && (
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              <Clock className="h-3 w-3" />
                              {item.time_estimate}min
                            </span>
                          )}
                          {item.difficulty && (
                            <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                              <Star className="h-3 w-3" />
                              Level {item.difficulty}
                            </span>
                          )}
                          {item.vehicle_model && (
                            <span className="flex items-center gap-1 bg-military-green/10 text-military-green px-2 py-1 rounded">
                              <User className="h-3 w-3" />
                              {item.vehicle_model}
                            </span>
                          )}
                        </div>
                        
                        {/* Document Generation Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProcedureForDoc(item);
                              setShowPresentationGenerator(true);
                            }}
                            className="h-7 w-7 p-0 hover:bg-orange-100"
                            title="Create PowerPoint presentation"
                          >
                            <Presentation className="h-3 w-3 text-orange-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProcedureForDoc(item);
                              setShowExcelGenerator(true);
                            }}
                            className="h-7 w-7 p-0 hover:bg-green-100"
                            title="Create Excel parts catalog"
                          >
                            <FileSpreadsheet className="h-3 w-3 text-green-600" />
                          </Button>
                          {getSearchMethodBadge(item.search_method)}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Barry's AI recommendation for this specific item */}
                      {isBarryMode && item.result_rank === 1 && (
                        <div className="mt-3 p-2 bg-military-green/5 border border-military-green/20 rounded">
                          <div className="flex items-start gap-2">
                            <Bot className="h-3 w-3 text-military-green mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-military-green">
                              <strong>Barry recommends:</strong> This is the most relevant result for your query about {searchQuery.toLowerCase()}.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* No Barry response and no items - Show fallback */
                <div className="p-8 text-center text-muted-foreground">
                  <div className="mb-4">No items found</div>
                  {searchQuery && (
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>Try searching for:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery('OM352 engine seal')}
                          className="text-xs"
                        >
                          OM352 Engine Seals
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery('axle maintenance')}
                          className="text-xs"
                        >
                          Axle Maintenance
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery('hydraulic system')}
                          className="text-xs"
                        >
                          Hydraulic System
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery('brake service')}
                          className="text-xs"
                        >
                          Brake Service
                        </Button>
                      </div>
                      <p className="text-xs mt-3 text-muted-foreground/80">
                        The database contains 5,759 technical documents focused on engine maintenance, 
                        transmission service, hydraulic systems, and electrical troubleshooting.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Central Document Viewer */}
          <div className="flex-1 bg-white flex flex-col">
            {selectedItem ? (
              <>
                {/* Unified Central Document Viewer */}
                <div className="flex-1">
                  <Tabs defaultValue="overview" className="h-full flex flex-col">
                    {/* Enhanced Header with Controls */}
                    <div className="border-b border-border bg-gray-50 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-lg font-semibold text-foreground">
                              {selectedItem.title || selectedItem.name}
                            </h1>
                            {selectedItem.code && (
                              <span className="font-mono bg-military-green/10 text-military-green px-2 py-1 rounded text-sm border border-military-green/20">
                                {selectedItem.code || selectedItem.number}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedItem.category && (
                              <Badge variant="outline" className="text-xs">{selectedItem.category}</Badge>
                            )}
                            {getDifficultyBadge(selectedItem.difficulty)}
                            {selectedItem.time_estimate && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {selectedItem.time_estimate}min
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Professional Viewer Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="text-xs"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Print
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Create downloadable content
                              const content = `${selectedItem.title}\n\nCode: ${selectedItem.code}\n\nDescription: ${selectedItem.description}`;
                              const blob = new Blob([content], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${selectedItem.code || 'document'}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (document.fullscreenElement) {
                                document.exitFullscreen();
                              } else {
                                document.documentElement.requestFullscreen();
                              }
                            }}
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Full Screen
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(null);
                              setRelatedMedia([]);
                            }}
                            className="text-xs"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                      {selectedItem.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedItem.description}
                        </p>
                      )}

                      {/* Tab Navigation */}
                      <TabsList className="mt-4 w-fit">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="procedure">Procedure</TabsTrigger>
                        <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
                        <TabsTrigger value="parts">Related Parts</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="overview" className="flex-1 p-6">
                      <div className="space-y-4">
                        {selectedItem.time_estimate && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">Estimated time: {selectedItem.time_estimate} minutes</span>
                          </div>
                        )}
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Available Resources</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedItem.has_images && (
                              <div className="flex items-center gap-2 text-sm text-green-700">
                                <Image className="h-4 w-4" />
                                Visual diagrams available
                              </div>
                            )}
                            {selectedItem.has_videos && (
                              <div className="flex items-center gap-2 text-sm text-blue-700">
                                <Video className="h-4 w-4" />
                                Video tutorials available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="procedure" className="flex-1 p-6">
                      <div className="text-center text-gray-500 py-8">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Detailed procedure content would be displayed here</p>
                        <p className="text-sm mt-2">Step-by-step instructions with visual aids</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="diagrams" className="flex-1 p-6">
                      {relatedMedia.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="font-medium text-foreground mb-4">
                            Technical Diagrams & Schematics ({relatedMedia.length})
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {relatedMedia.map((media) => (
                              <div key={media.id} className="border border-border rounded-lg overflow-hidden">
                                <div className="bg-muted p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    {media.type === 'schematic' && <FileText className="h-4 w-4 text-blue-600" />}
                                    {media.type === 'diagram' && <Image className="h-4 w-4 text-green-600" />}
                                    {media.type === 'photo' && <Image className="h-4 w-4 text-orange-600" />}
                                    {media.type === 'chart' && <FileText className="h-4 w-4 text-purple-600" />}
                                    <span className="text-sm font-medium capitalize">{media.type}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{media.description || media.file_name}</p>
                                </div>

                                {media.signed_url && (
                                  <div className="aspect-video bg-gray-100">
                                    <img
                                      src={media.signed_url}
                                      alt={media.description || media.file_name}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}

                                <div className="p-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                      if (media.signed_url) {
                                        window.open(media.signed_url, '_blank');
                                      }
                                    }}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    View Full Size
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No diagrams or schematics found for this item</p>
                          <p className="text-sm mt-2">Technical diagrams will appear here when available</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="parts" className="flex-1 p-6">
                      <div className="text-center text-gray-500 py-8">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Related parts and components would be listed here</p>
                        <p className="text-sm mt-2">Parts catalog with availability and pricing</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium mb-2">Select an item to view details</h3>
                  <p className="text-sm">Choose from the list on the left to see detailed information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Barry's Suggestions & Context */}
      {(relatedItems.length > 0 || (isBarryMode && (barryContext || barryResponse))) && (
        <div className="w-96 bg-muted/20 border-l border-border flex flex-col">
          {/* Barry's Response Section */}
          {isBarryMode && barryResponse && (
            <div className="border-b border-border flex flex-col max-h-[600px]">
              <div className="p-4 pb-2 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-military-green" />
                  <h3 className="font-medium text-foreground">Barry's Analysis</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsBarryMode(false);
                    setBarryResponse(null);
                    setCurrentItems([]);
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white/60 rounded-lg p-4 border border-military-green/20 mb-4">
                  <InteractiveBarryResponse
                    response={barryResponse}
                    onElementClick={handleInteractiveElementClick}
                  />
                </div>

                {/* Conversational Follow-up Actions */}
                <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Continue Conversation</p>
                
                {/* Context-aware follow-up questions */}
                {searchQuery.toLowerCase().includes('oil') && (
                  <button
                    onClick={() => {
                      setSearchQuery("What's the oil capacity and viscosity for " + userVehicleModel);
                      handleSearch();
                    }}
                    className="w-full text-left p-2 rounded text-sm text-military-green bg-military-green/10 hover:bg-military-green/20 transition-colors"
                  >
                    <Lightbulb className="h-3 w-3 inline mr-1" />
                    Oil capacity and viscosity?
                  </button>
                )}
                
                {searchQuery.toLowerCase().includes('brake') && (
                  <button
                    onClick={() => {
                      setSearchQuery("How to bleed the brake system on " + userVehicleModel);
                      handleSearch();
                    }}
                    className="w-full text-left p-2 rounded text-sm text-military-green bg-military-green/10 hover:bg-military-green/20 transition-colors"
                  >
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    How to bleed brake system?
                  </button>
                )}
                
                {currentItems.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery("What tools and parts do I need for: " + searchQuery);
                      handleSearch();
                    }}
                    className="w-full text-left p-2 rounded text-sm text-military-green bg-military-green/10 hover:bg-military-green/20 transition-colors"
                  >
                    <Wrench className="h-3 w-3 inline mr-1" />
                    Required tools and parts?
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSearchQuery("Step-by-step instructions for: " + searchQuery);
                    handleSearch();
                  }}
                  className="w-full text-left p-2 rounded text-sm text-military-green bg-military-green/10 hover:bg-military-green/20 transition-colors"
                >
                  <FileText className="h-3 w-3 inline mr-1" />
                  Step-by-step guide?
                </button>
                
                <button
                  onClick={() => {
                    setSearchQuery("Common problems and troubleshooting for: " + searchQuery);
                    handleSearch();
                  }}
                  className="w-full text-left p-2 rounded text-sm text-military-green bg-military-green/10 hover:bg-military-green/20 transition-colors"
                >
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  Common problems?
                </button>
                
                {/* Clear conversation */}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setBarryResponse(null);
                    setIsBarryMode(false);
                    setCurrentItems([]);
                    setConversationHistory([]);
                    toast.success("Started new conversation with Barry");
                  }}
                  className="w-full text-left p-2 rounded text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors mt-3"
                >
                  <Bot className="h-3 w-3 inline mr-1" />
                  Start new conversation
                </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Barry's Context Section */}
          {isBarryMode && barryContext && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-4 w-4 text-military-green" />
                <h3 className="font-medium text-foreground">Barry's Insights</h3>
              </div>
              
              {barryContext.suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Follow-up Questions</p>
                  {barryContext.suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onBarryRequest?.(suggestion)}
                      className="w-full text-left p-2 rounded text-sm text-military-green bg-military-green/10 hover:bg-military-green/20 transition-colors"
                    >
                      <Lightbulb className="h-3 w-3 inline mr-1" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div className="flex-1 p-4">
              <h3 className="font-medium text-foreground mb-3">Related Items</h3>
              <div className="space-y-2">
                {relatedItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:border-military-green/50 hover:bg-military-green/10 transition-colors"
                  >
                    <p className="font-medium text-sm">{item.title || item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                    {item.has_images && (
                      <div className="flex items-center gap-1 mt-1">
                        <Image className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Visual guide</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Barry CTA when not in Barry mode */}
          {!isBarryMode && relatedItems.length === 0 && (
            <div className="p-4 text-center">
              <div className="bg-gradient-to-r from-military-green/10 to-olive-drab/10 rounded-lg p-4">
                <Bot className="h-8 w-8 mx-auto mb-2 text-military-green" />
                <p className="text-sm font-medium text-foreground mb-1">Ask Barry</p>
                <p className="text-xs text-muted-foreground mb-3">Get intelligent recommendations for your specific needs</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // This would trigger Barry chat bubble
                    if (onBarryRequest) {
                      onBarryRequest("Help me with " + userVehicleModel + " maintenance");
                    }
                  }}
                >
                  <Bot className="h-3 w-3 mr-1" />
                  Chat with Barry
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Document Generation Dialogs */}
      {showDocumentManager && (
        <Dialog open={showDocumentManager} onOpenChange={setShowDocumentManager}>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
            <DocumentManager />
          </DialogContent>
        </Dialog>
      )}
      
      <PresentationGenerator
        procedure={selectedProcedureForDoc}
        isOpen={showPresentationGenerator}
        onClose={() => {
          setShowPresentationGenerator(false);
          setSelectedProcedureForDoc(null);
        }}
      />
      
      <ExcelPartsGenerator
        procedureData={selectedProcedureForDoc}
        isOpen={showExcelGenerator}
        onClose={() => {
          setShowExcelGenerator(false);
          setSelectedProcedureForDoc(null);
        }}
      />
    </div>
  );
}