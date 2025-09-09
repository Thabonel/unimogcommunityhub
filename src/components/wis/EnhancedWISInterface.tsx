import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Lightbulb,
  Truck,
  Filter,
  MessageSquare
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { clientWISSearch, WISItem, ClientSearchResponse } from '@/lib/client-wis-search';
import { 
  UnifiedWISSearchService, 
  UnifiedWISResult, 
  UnifiedSearchResponse,
  WISProcedure,
  WISPart,
  WISBulletin,
  getFullWISDocumentDetails
} from '@/lib/unified-wis-search';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/use-profile';
import { UnifiedResultCard } from './UnifiedResultCard';
import { ProceduresView, PartsView, BulletinsView } from './DocumentViews';
import { DocumentViewerModal } from './DocumentViewerModal';
import { VehicleModelSelector, getModelSearchTokens, getModelDisplayName } from './VehicleModelSelector';
import { WISFilterPanel, WISFilters } from './WISFilterPanel';
import { WISBarryPanel } from './WISBarryPanel';
import { SearchResultSkeleton, VehicleModelSkeleton } from './SkeletonLoaders';

interface EnhancedWISInterfaceProps {
  // WIS is not vehicle-specific in actual schema
}

export function EnhancedWISInterface({}: EnhancedWISInterfaceProps) {
  // State management with personalized vehicle selection
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UnifiedSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('unified');
  const [activeDocument, setActiveDocument] = useState<any>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  // Vehicle model selection state for personalized search
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelSearchTokens, setModelSearchTokens] = useState<string[]>([]);
  
  // Filter state for advanced filtering
  const [filters, setFilters] = useState<WISFilters>({
    docTypes: [],
    systems: [],
    difficulty: [],
    hasMedia: false
  });

  // WIS Barry panel state
  const [isBarryOpen, setIsBarryOpen] = useState(false);
  
  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { user } = useAuth();
  const { userData } = useProfile();
  const { toast } = useToast();

  // Client-side filtering of search results
  const filteredSearchResults = useMemo(() => {
    if (!searchResults) return null;

    const applyFilters = (results: UnifiedWISResult[]) => {
      return results.filter(result => {
        // Document type filter
        if (filters.docTypes.length > 0 && !filters.docTypes.includes(result.doc_type)) {
          return false;
        }

        // System category filter (simple keyword matching for now)
        if (filters.systems.length > 0) {
          const hasSystemMatch = filters.systems.some(system => {
            const content = (result.title + ' ' + result.content).toLowerCase();
            switch (system) {
              case 'engine': return content.includes('engine') || content.includes('motor') || content.includes('cooling');
              case 'transmission': return content.includes('transmission') || content.includes('gearbox') || content.includes('pto');
              case 'axles': return content.includes('axle') || content.includes('differential') || content.includes('diff');
              case 'hydraulics': return content.includes('hydraulic') || content.includes('steering') || content.includes('pump');
              case 'electrical': return content.includes('electrical') || content.includes('wiring') || content.includes('light');
              case 'suspension': return content.includes('suspension') || content.includes('spring') || content.includes('shock');
              case 'brakes': return content.includes('brake') || content.includes('braking');
              case 'cabin': return content.includes('cabin') || content.includes('interior') || content.includes('hvac');
              case 'implements': return content.includes('implement') || content.includes('attachment') || content.includes('tool');
              case 'maintenance': return content.includes('maintenance') || content.includes('service') || content.includes('oil');
              default: return true;
            }
          });
          if (!hasSystemMatch) return false;
        }

        // Media filter
        if (filters.hasMedia && (!result.media_count || result.media_count === 0)) {
          return false;
        }

        return true;
      });
    };

    return {
      ...searchResults,
      unified_results: applyFilters(searchResults.unified_results),
      procedures: searchResults.procedures.filter(proc => {
        if (filters.docTypes.length > 0 && !filters.docTypes.includes('procedure')) return false;
        // Apply other filters similarly...
        return true;
      }),
      parts: searchResults.parts.filter(part => {
        if (filters.docTypes.length > 0 && !filters.docTypes.includes('part')) return false;
        // Apply other filters similarly...
        return true;
      }),
      bulletins: searchResults.bulletins.filter(bulletin => {
        if (filters.docTypes.length > 0 && !filters.docTypes.includes('bulletin')) return false;
        // Apply other filters similarly...
        return true;
      })
    };
  }, [searchResults, filters]);

  // Calculate filtered result counts
  const totalResults = searchResults?.total_results || 0;
  const filteredResults = filteredSearchResults?.unified_results.length || 0;

  // WIS database is ready immediately - no model loading needed


  // Debounced search function with model-biased search (enterprise pattern for performance)
  const debouncedSearch = useCallback(
    debounce(async (query: string, modelTokens: string[] = []) => {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }
      
      setLoading(true);
      try {
        // Implement model-biased search by prepending model tokens to query
        let biasedQuery = query;
        if (modelTokens.length > 0) {
          // Add model tokens to boost relevance for user's vehicle
          const modelPrefix = modelTokens.slice(0, 3).join(' '); // Use top 3 tokens to avoid over-long queries
          biasedQuery = `${modelPrefix} ${query}`;
        }
        
        console.log('WIS Search:', { originalQuery: query, biasedQuery, modelTokens });
        
        // Use new client-side search instead of broken server-side search
        const searchResponse = await clientWISSearch.search(query, {}, 1, 50);
        
        // Transform to match expected format
        const results: UnifiedSearchResponse = {
          unified_results: searchResponse.items.map(item => ({
            doc_id: item.id,
            doc_type: item.doc_type,
            ref: item.part_number || item.bulletin_number || item.procedure_code || '',
            title: item.title,
            content: item.content,
            media: item.media,
            relevance_score: 1.0,
            related_parts: [],
            related_procedures: [],
            related_bulletins: []
          })),
          procedures: searchResponse.items.filter(i => i.doc_type === 'procedure').map(item => ({
            id: item.id,
            procedure_code: item.procedure_code || '',
            title: item.title,
            category: item.category,
            subcategory: item.subcategory,
            description: item.description,
            content: item.content,
            difficulty_level: item.difficulty_level,
            estimated_time_minutes: 60,
            tools_required: [],
            parts_required: [],
            safety_warnings: [],
            steps: [],
            is_published: true,
            media: item.media,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          parts: searchResponse.items.filter(i => i.doc_type === 'part').map(item => ({
            id: item.id,
            part_number: item.part_number || '',
            part_name: item.title,
            category: item.category,
            subcategory: item.subcategory,
            description: item.description || item.content,
            price_estimate: null,
            availability_status: 'available',
            superseded_by: null,
            notes: null,
            media: item.media,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          bulletins: searchResponse.items.filter(i => i.doc_type === 'bulletin').map(item => ({
            id: item.id,
            bulletin_number: item.bulletin_number || '',
            title: item.title,
            category: item.category,
            severity: 'Informational',
            description: item.description,
            content: item.content,
            date_issued: '2024-01-01',
            date_updated: null,
            status: 'active',
            media: item.media,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          search_suggestions: [],
          total_results: searchResponse.pagination.total
        };
        
        setSearchResults(results);
        setSearchSuggestions(results.search_suggestions || []);
        
        const selectedModelName = selectedModel ? getModelDisplayName(selectedModel) : null;
        
        if (results.total_results === 0 && results.search_suggestions?.length > 0) {
          toast({
            title: 'No results found',
            description: `Did you mean: ${results.search_suggestions.join(', ')}?`,
          });
        } else if (results.total_results === 0) {
          toast({
            title: 'No results found',
            description: selectedModelName 
              ? `No results found for ${selectedModelName}. Try a different search term.`
              : 'Check spelling or try different terms.',
          });
        } else {
          toast({
            title: 'Search complete',
            description: selectedModelName 
              ? `Found ${results.total_results} results for ${selectedModelName}`
              : `Found ${results.total_results} results across all categories`,
          });
        }
      } catch (error) {
        console.error('WIS search error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('WIS search detailed error:', errorMessage);
        
        toast({
          title: 'Search Error',
          description: `WIS database search failed: ${errorMessage}. Please check your connection and try again.`,
          variant: 'destructive',
        });
        
        // Clear results on error
        setSearchResults(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    [toast, selectedModel]
  );

  // Handle search input changes (no automatic search)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear results if query is empty, but don't search automatically
    if (!query.trim()) {
      setSearchResults(null);
    }
  };

  // Handle search execution (on Enter or explicit trigger)
  const executeSearch = () => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery, modelSearchTokens);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  // Handle search suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    debouncedSearch(suggestion, modelSearchTokens);
  };

  // Handle vehicle model selection
  const handleModelChange = (modelId: string, tokens: string[]) => {
    setSelectedModel(modelId);
    setModelSearchTokens(tokens);
    
    // Re-run search with new model bias if there's an active search
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery, tokens);
    }
  };


  // Handle document view (progressive disclosure pattern) - ENHANCED to fetch full details
  const handleDocumentView = async (result: UnifiedWISResult | WISProcedure | WISPart | WISBulletin, type: string) => {
    try {
      // Show loading state
      setLoading(true);
      
      let docId = '';
      let docType = type as 'part' | 'procedure' | 'bulletin';
      
      // Extract document ID based on result type
      if ('doc_id' in result) {
        // UnifiedWISResult
        docId = result.doc_id;
        docType = result.doc_type;
      } else if ('id' in result) {
        // Direct document object
        docId = result.id;
      }
      
      if (docId) {
        // Fetch complete document details including all content
        const fullDocument = await getFullWISDocumentDetails(docId, docType);
        
        if (fullDocument) {
          setActiveDocument(fullDocument);
          setDocumentType(docType);
        } else {
          // Fallback to basic document if full details not available
          setActiveDocument(result);
          setDocumentType(type);
          
          toast({
            title: 'Limited information available',
            description: 'Showing available data, but some details may be missing.',
            variant: 'default'
          });
        }
      } else {
        // Fallback for objects without IDs
        setActiveDocument(result);
        setDocumentType(type);
      }
    } catch (error) {
      console.error('Error loading document details:', error);
      toast({
        title: 'Error loading document',
        description: 'Could not load complete document details. Showing basic information.',
        variant: 'destructive'
      });
      
      // Fallback to basic document
      setActiveDocument(result);
      setDocumentType(type);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening Barry with document context
  const handleOpenBarryWithDocument = (document?: any) => {
    if (document) {
      setActiveDocument(document);
    }
    setIsBarryOpen(true);
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


  return (
    <div className="space-y-6">
      {/* Hero Section with Enterprise Branding */}
      <Card className="bg-card border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
            <Settings className="w-8 h-8 text-primary" />
            Mercedes-Benz Workshop Information System (WIS)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Enterprise-Grade Technical Documentation</h3>
            <p className="text-muted-foreground">
              Access the complete Mercedes Workshop Information System with unified search across all technical documentation.
              This enterprise system provides interconnected information for parts, procedures, and service bulletins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-muted/50 border border-border p-3 rounded-lg">
                <FileText className="w-6 h-6 mb-2 text-primary" />
                <div className="text-sm font-medium text-foreground">Procedures</div>
                <div className="text-xs text-muted-foreground">Step-by-step repair guides</div>
              </div>
              <div className="bg-muted/50 border border-border p-3 rounded-lg">
                <Wrench className="w-6 h-6 mb-2 text-primary" />
                <div className="text-sm font-medium text-foreground">Parts Catalog</div>
                <div className="text-xs text-muted-foreground">Complete parts database</div>
              </div>
              <div className="bg-muted/50 border border-border p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 mb-2 text-primary" />
                <div className="text-sm font-medium text-foreground">Service Bulletins</div>
                <div className="text-xs text-muted-foreground">TSBs and recalls</div>
              </div>
              <div className="bg-muted/50 border border-border p-3 rounded-lg">
                <Zap className="w-6 h-6 mb-2 text-primary" />
                <div className="text-sm font-medium text-foreground">Wiring Diagrams</div>
                <div className="text-xs text-muted-foreground">Electrical schematics</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Model Selection */}
      <VehicleModelSelector 
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        className="mb-6"
      />

      {/* Main content area with filter layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Filter Panel (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6">
            <WISFilterPanel 
              filters={filters}
              onFiltersChange={setFilters}
              totalResults={totalResults}
              filteredResults={filteredResults}
            />
          </div>
        </div>

        {/* Main search and results area */}
        <div className="col-span-1 lg:col-span-3">
          {/* Mobile Filter Drawer */}
          <div className="lg:hidden mb-4">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(filters.docTypes.length + filters.systems.length + filters.difficulty.length + (filters.hasMedia ? 1 : 0)) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.docTypes.length + filters.systems.length + filters.difficulty.length + (filters.hasMedia ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter WIS Results
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <WISFilterPanel 
                    filters={filters}
                    onFiltersChange={setFilters}
                    totalResults={totalResults}
                    filteredResults={filteredResults}
                    className="border-0 shadow-none"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Unified Search with Model Context */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Unified WIS Search
                {selectedModel && (
                  <Badge variant="outline" className="ml-2 bg-amber-50 border-amber-200 text-amber-700">
                    <Truck className="w-3 h-3 mr-1" />
                    {getModelDisplayName(selectedModel)}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {selectedModel 
                  ? `Search results prioritized for ${getModelDisplayName(selectedModel)} • Covers procedures, parts, bulletins, and diagrams`
                  : 'Search across procedures, parts, bulletins, and diagrams simultaneously'
                }
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={selectedModel 
                      ? `Search ${getModelDisplayName(selectedModel)} procedures, parts, or issues... (Press Enter to search)`
                      : "Search for parts, procedures, or issues... (Press Enter to search)"
                    }
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-base"
                    disabled={loading}
                    autoComplete="on"
                    autoCorrect="on"
                    autoCapitalize="words"
                    spellCheck="true"
                    name="wis-search"
                    role="searchbox"
                    aria-label="Search WIS documentation"
                  />
                  {!loading && (
                    <Button
                      size="sm"
                      onClick={executeSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      disabled={!searchQuery.trim()}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  )}
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
                
              </div>
            </CardContent>
          </Card>

          {/* Search Results (Categorized tabs with filtering) */}
          {filteredSearchResults && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="unified" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  All ({filteredResults})
                  {filteredResults !== totalResults && (
                    <span className="text-xs text-gray-500">/{totalResults}</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="procedures" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Procedures ({filteredSearchResults.procedures.length})
                </TabsTrigger>
                <TabsTrigger value="parts" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Parts ({filteredSearchResults.parts.length})
                </TabsTrigger>
                <TabsTrigger value="bulletins" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Bulletins ({filteredSearchResults.bulletins.length})
                </TabsTrigger>
                <TabsTrigger value="wiring" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Diagrams (0)
                </TabsTrigger>
                <TabsTrigger value="barry" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  WIS Barry
                </TabsTrigger>
              </TabsList>

              {/* Unified Results Tab (Enterprise interconnected view with filtering) */}
              <TabsContent value="unified" className="mt-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SearchResultSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <UnifiedResultsView 
                    results={filteredSearchResults.unified_results}
                    expandedResults={expandedResults}
                    onToggleExpansion={toggleResultExpansion}
                    onDocumentView={handleDocumentView}
                  />
                )}
              </TabsContent>

              {/* Individual category tabs with filtered results */}
              <TabsContent value="procedures" className="mt-6">
                <ProceduresView 
                  procedures={filteredSearchResults.procedures}
                  onDocumentView={(proc) => handleDocumentView(proc, 'procedure')}
                />
              </TabsContent>

              <TabsContent value="parts" className="mt-6">
                <PartsView 
                  parts={filteredSearchResults.parts}
                  onDocumentView={(part) => handleDocumentView(part, 'part')}
                />
              </TabsContent>

              <TabsContent value="bulletins" className="mt-6">
                <BulletinsView 
                  bulletins={filteredSearchResults.bulletins}
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

              <TabsContent value="barry" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <MessageSquare className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask WIS Barry</h3>
                      <p className="text-gray-600 mb-6">
                        Get technical assistance and answers about your {selectedModel ? getModelDisplayName(selectedModel) : 'Unimog'}.
                      </p>
                      <Button
                        onClick={() => setIsBarryOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Start Conversation
                      </Button>
                    </div>
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


      {/* Context-Aware WIS Barry Panel */}
      <WISBarryPanel
        selectedModel={selectedModel}
        currentDocument={activeDocument}
        isOpen={isBarryOpen}
        onClose={() => setIsBarryOpen(false)}
      />

      {/* Document Viewer Modal (Progressive disclosure) */}
      <DocumentViewerModal 
        activeDocument={activeDocument}
        documentType={documentType}
        onClose={() => {
          setActiveDocument(null);
          setDocumentType('');
        }}
        onOpenInBarry={handleOpenBarryWithDocument}
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
  onDocumentView: (result: UnifiedWISResult | WISProcedure | WISPart | WISBulletin, type: string) => void;
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
              onView={() => onDocumentView(result, result.doc_type)}
              onRelatedItemClick={(item, type) => onDocumentView(item, type)}
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