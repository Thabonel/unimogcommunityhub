import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2,
  Eye,
  Clock,
  Settings,
  Lightbulb
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  UnifiedWISSearchService, 
  UnifiedWISResult, 
  UnifiedSearchResponse,
  WISModel,
  WISProcedure,
  WISPart,
  WISBulletin
} from '@/lib/unified-wis-search';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedResultCard } from './UnifiedResultCard';
import { ProceduresView, PartsView, BulletinsView } from './DocumentViews';
import { DocumentViewerModal } from './DocumentViewerModal';

interface EnhancedWISInterfaceProps {
  defaultModelId?: string;
}

export function EnhancedWISInterface({ defaultModelId }: EnhancedWISInterfaceProps) {
  // State management
  const [models, setModels] = useState<WISModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UnifiedSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unified');
  const [activeDocument, setActiveDocument] = useState<any>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load models on component mount
  useEffect(() => {
    loadModels();
  }, []);

  // Auto-select default model
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      const defaultModel = models.find(m => m.model_code === 'U1700L') || models[0];
      setSelectedModel(defaultModel.id);
    }
  }, [models, selectedModel]);

  const loadModels = async () => {
    setInitialLoading(true);
    try {
      const modelsData = await UnifiedWISSearchService.getModels();
      setModels(modelsData);
      
      if (modelsData.length === 0) {
        toast({
          title: 'No WIS models found',
          description: 'The WIS database appears to be empty. Please check with your administrator.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading WIS models:', error);
      toast({
        title: 'Error loading models',
        description: 'Could not load vehicle models from WIS database',
        variant: 'destructive',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  // Debounced search function (enterprise pattern for performance)
  const debouncedSearch = useCallback(
    debounce(async (query: string, modelId: string) => {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }
      
      setLoading(true);
      try {
        const results = await UnifiedWISSearchService.unifiedSearch(query, modelId, {
          limit: 50,
          includeRelated: true,
          enableFuzzy: true
        });
        
        setSearchResults(results);
        setSearchSuggestions(results.search_suggestions || []);
        
        if (results.total_results === 0) {
          toast({
            title: 'No results found',
            description: `No results for "${query}" in ${getSelectedModelName()}. Check spelling or try different terms.`,
          });
        } else {
          toast({
            title: 'Search complete',
            description: `Found ${results.total_results} results across all categories`,
          });
        }
      } catch (error) {
        console.error('WIS search error:', error);
        toast({
          title: 'Search failed',
          description: 'Could not search WIS database. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }, 300),
    [toast]
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() && selectedModel) {
      debouncedSearch(query, selectedModel);
    } else {
      setSearchResults(null);
    }
  };

  // Handle search suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    if (selectedModel) {
      debouncedSearch(suggestion, selectedModel);
    }
  };

  // Get selected model name for display
  const getSelectedModelName = () => {
    const model = models.find(m => m.id === selectedModel);
    return model?.model_name || 'Unknown Model';
  };

  // Handle document view (progressive disclosure pattern)
  const handleDocumentView = (result: UnifiedWISResult | WISProcedure | WISPart | WISBulletin, type: string) => {
    setActiveDocument(result);
    setDocumentType(type);
  };

  // Toggle result expansion
  const toggleResultExpansion = (resultId: string) => {
    const newExpanded = new Set(expandedResults);
    if (expandedResults.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedResults(newExpanded);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading WIS database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Enterprise Branding */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Mercedes-Benz Workshop Information System (WIS)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enterprise-Grade Technical Documentation</h3>
            <p className="text-blue-100">
              Access the complete Mercedes Workshop Information System with unified search across all technical documentation.
              This enterprise system provides interconnected information for parts, procedures, and service bulletins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-800/30 p-3 rounded-lg">
                <FileText className="w-6 h-6 mb-2" />
                <div className="text-sm font-medium">Procedures</div>
                <div className="text-xs text-blue-200">Step-by-step repair guides</div>
              </div>
              <div className="bg-blue-800/30 p-3 rounded-lg">
                <Wrench className="w-6 h-6 mb-2" />
                <div className="text-sm font-medium">Parts Catalog</div>
                <div className="text-xs text-blue-200">Complete parts database</div>
              </div>
              <div className="bg-blue-800/30 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 mb-2" />
                <div className="text-sm font-medium">Service Bulletins</div>
                <div className="text-xs text-blue-200">TSBs and recalls</div>
              </div>
              <div className="bg-blue-800/30 p-3 rounded-lg">
                <Zap className="w-6 h-6 mb-2" />
                <div className="text-sm font-medium">Wiring Diagrams</div>
                <div className="text-xs text-blue-200">Electrical schematics</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar - Model selector (enhanced with better UX) */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="bg-gradient-to-b from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-green-900">
                <Settings className="w-5 h-5" />
                Vehicle Selection
              </CardTitle>
              <p className="text-sm text-green-700">
                Choose your Unimog model for filtered results
              </p>
            </CardHeader>
            <CardContent>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a model...</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.model_name}
                    {model.year_from && model.year_to && (
                      ` (${model.year_from}-${model.year_to})`
                    )}
                  </option>
                ))}
              </select>
              
              {selectedModel && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700">
                    ✓ Active Model:
                  </p>
                  <p className="text-sm text-gray-700 font-semibold">
                    {getSelectedModelName()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    All search results are filtered for this model
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="col-span-12 lg:col-span-9">
          {/* Unified Search (Mitchell1 1Search™ Plus pattern) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Unified WIS Search
              </CardTitle>
              <p className="text-sm text-gray-600">
                Search across procedures, parts, bulletins, and diagrams simultaneously
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for parts, procedures, or issues... (e.g., 'oil change', 'brake service', 'A000 010 07 20')"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 h-12 text-base"
                    disabled={!selectedModel || loading}
                  />
                  {loading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                  )}
                </div>
                
                {/* Search suggestions (enterprise pattern) */}
                {searchSuggestions.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Did you mean:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {!selectedModel && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Please select your vehicle model to enable search functionality.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Results (Categorized tabs - AllData pattern) */}
          {searchResults && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="unified" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  All ({searchResults.total_results})
                </TabsTrigger>
                <TabsTrigger value="procedures" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Procedures ({searchResults.procedures.length})
                </TabsTrigger>
                <TabsTrigger value="parts" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Parts ({searchResults.parts.length})
                </TabsTrigger>
                <TabsTrigger value="bulletins" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Bulletins ({searchResults.bulletins.length})
                </TabsTrigger>
                <TabsTrigger value="wiring" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Diagrams (0)
                </TabsTrigger>
              </TabsList>

              {/* Unified Results Tab (Enterprise interconnected view) */}
              <TabsContent value="unified" className="mt-6">
                <UnifiedResultsView 
                  results={searchResults.unified_results}
                  expandedResults={expandedResults}
                  onToggleExpansion={toggleResultExpansion}
                  onDocumentView={handleDocumentView}
                />
              </TabsContent>

              {/* Individual category tabs */}
              <TabsContent value="procedures" className="mt-6">
                <ProceduresView 
                  procedures={searchResults.procedures}
                  onDocumentView={(proc) => handleDocumentView(proc, 'procedure')}
                />
              </TabsContent>

              <TabsContent value="parts" className="mt-6">
                <PartsView 
                  parts={searchResults.parts}
                  onDocumentView={(part) => handleDocumentView(part, 'part')}
                />
              </TabsContent>

              <TabsContent value="bulletins" className="mt-6">
                <BulletinsView 
                  bulletins={searchResults.bulletins}
                  onDocumentView={(bulletin) => handleDocumentView(bulletin, 'bulletin')}
                />
              </TabsContent>

              <TabsContent value="wiring" className="mt-6">
                <Card>
                  <CardContent className="text-center py-12">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Wiring Diagrams</h3>
                    <p className="text-gray-600">
                      Interactive wiring diagrams will be integrated in the next update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Empty state when no search performed */}
          {!searchResults && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise WIS Search</h3>
                <p className="text-gray-600 mb-6">
                  Search the complete Mercedes-Benz Workshop Information System database.
                  Get interconnected results across all documentation types.
                </p>
                <div className="text-sm text-gray-500 space-y-2 max-w-md mx-auto">
                  <p className="font-medium">Try searching for:</p>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>• "oil change"</div>
                    <div>• "brake service"</div>
                    <div>• "A000 010 07 20"</div>
                    <div>• "transmission"</div>
                    <div>• "differential"</div>
                    <div>• "hydraulic system"</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Document Viewer Modal (Progressive disclosure) */}
      <DocumentViewerModal 
        activeDocument={activeDocument}
        documentType={documentType}
        onClose={() => {
          setActiveDocument(null);
          setDocumentType('');
        }}
      />
    </div>
  );
}

// Helper component for unified results view
function UnifiedResultsView({ 
  results, 
  expandedResults, 
  onToggleExpansion, 
  onDocumentView 
}: {
  results: UnifiedWISResult[];
  expandedResults: Set<string>;
  onToggleExpansion: (id: string) => void;
  onDocumentView: (result: UnifiedWISResult) => void;
}) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No unified results found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unified Search Results</CardTitle>
        <p className="text-sm text-gray-600">
          Results are ranked by relevance and show interconnected information
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result) => (
            <UnifiedResultCard
              key={result.doc_id}
              result={result}
              isExpanded={expandedResults.has(result.doc_id)}
              onToggleExpansion={() => onToggleExpansion(result.doc_id)}
              onView={() => onDocumentView(result)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Individual result components would be implemented here...
// [Continuing with other helper components...]

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }) as T;
}

export default EnhancedWISInterface;