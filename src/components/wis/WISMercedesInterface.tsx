import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
    setLoading(true);
    try {
      let data: any[] = [];
      let searchMethod: WISItem['search_method'] = 'fallback_text';

      if (searchQuery.trim()) {
        // Use enhanced text search with better ranking until vector functions are deployed
        try {
          console.log('Performing enhanced text search for:', searchQuery.trim());
          
          // Simplified text search that works with Supabase
          const query = searchQuery.trim();
          const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
          
          let searchResults;
          let searchError;
          
          // Try different search approaches
          if (searchTerms.length === 1) {
            // Single term search
            const term = searchTerms[0];
            ({ data: searchResults, error: searchError } = await supabase
              .from('wis_chunks')
              .select('id, title, content, doc_type, ref, updated_at')
              .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
              .order('updated_at', { ascending: false })
              .limit(50));
          } else {
            // Multi-term search - try each term separately and combine results
            const allResults = [];
            for (const term of searchTerms.slice(0, 3)) { // Limit to first 3 terms
              const { data: termResults, error: termError } = await supabase
                .from('wis_chunks')
                .select('id, title, content, doc_type, ref, updated_at')
                .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
                .limit(20);
              
              if (!termError && termResults) {
                allResults.push(...termResults);
              }
            }
            
            // Remove duplicates by id
            const uniqueResults = allResults.filter((item, index, self) => 
              index === self.findIndex(t => t.id === item.id)
            );
            
            searchResults = uniqueResults;
            searchError = null;
          }

          if (searchError) throw searchError;
          
          // Enhanced ranking based on relevance
          const rankedResults = (searchResults || []).map((item: any, index: number) => {
            const title = (item.title || '').toLowerCase();
            const content = (item.content || '').toLowerCase();
            const queryLower = query.toLowerCase();
            
            // Calculate relevance score
            let relevanceScore = 0;
            
            // Title matches are most important
            if (title.includes(queryLower)) relevanceScore += 50;
            searchTerms.forEach(term => {
              if (title.includes(term)) relevanceScore += 20;
            });
            
            // Content matches
            if (content.includes(queryLower)) relevanceScore += 25;
            searchTerms.forEach(term => {
              if (content.includes(term)) relevanceScore += 5;
            });
            
            // Boost for exact phrase matches
            if (searchTerms.length > 1 && (title.includes(queryLower) || content.includes(queryLower))) {
              relevanceScore += 30;
            }
            
            return {
              ...item,
              relevanceScore,
              similarity_score: Math.min(relevanceScore / 100, 1) // Normalize to 0-1
            };
          });
          
          // Sort by relevance score
          rankedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
          
          data = rankedResults.map((item: any, index: number) => ({
            id: item.id,
            title: item.title,
            code: item.ref,
            description: item.content ? item.content.substring(0, 200) + '...' : '',
            doc_type: item.doc_type,
            search_method: 'fallback_text' as const,
            similarity_score: item.similarity_score,
            result_rank: index + 1
          }));
          
          searchMethod = 'fallback_text';
          console.log(`Found ${data.length} results with enhanced text search`);
          
        } catch (searchError) {
          console.error('Enhanced text search failed:', searchError);
          
          // Basic fallback if enhanced search fails
          const { data: basicResults, error: basicError } = await supabase
            .from('wis_chunks')
            .select('id, title, content, doc_type, ref')
            .textSearch('content', searchQuery.trim())
            .limit(20);

          if (basicError) {
            // Final fallback - simple LIKE search
            const { data: simpleResults } = await supabase
              .from('wis_chunks')
              .select('id, title, content, doc_type, ref')
              .ilike('title', `%${searchQuery.trim()}%`)
              .limit(20);
              
            data = (simpleResults || []).map((item: any, index: number) => ({
              id: item.id,
              title: item.title,
              code: item.ref,
              description: item.content ? item.content.substring(0, 200) : '',
              doc_type: item.doc_type,
              search_method: 'fallback_text' as const,
              result_rank: index + 1
            }));
          } else {
            data = (basicResults || []).map((item: any, index: number) => ({
              id: item.id,
              title: item.title,
              code: item.ref,
              description: item.content ? item.content.substring(0, 200) : '',
              doc_type: item.doc_type,
              search_method: 'fallback_text' as const,
              result_rank: index + 1
            }));
          }
          searchMethod = 'fallback_text';
        }
      } else {
        // No search query - load all items of selected type
        try {
          const { data: allResults, error } = await supabase.rpc('get_wis_items', {
            item_type: selectedModule === 'procedures' ? 'procedure' : selectedModule === 'parts' ? 'part' : 'bulletin',
            search_terms: null,
            model_code: userVehicleModel,
            limit_count: 50
          });
          
          if (error) throw error;
          data = allResults || [];
          searchMethod = 'fallback_text';
        } catch (error) {
          console.error('Error loading all items:', error);
          // Final fallback
          const { data: chunks } = await supabase
            .from('wis_chunks')
            .select('id, title, content, doc_type, ref')
            .limit(50);
          
          data = (chunks || []).map((item: any, index: number) => ({
            id: item.id,
            title: item.title,
            code: item.ref,
            description: item.content ? item.content.substring(0, 200) : '',
            doc_type: item.doc_type,
            search_method: 'fallback_text' as const,
            result_rank: index + 1
          }));
        }
      }

      setCurrentItems(data);
      
      // Show search method info
      if (searchQuery.trim()) {
        const methodMessages = {
          'hybrid_vector_text': `Found ${data.length} results using AI-powered hybrid search`,
          'vector_semantic': `Found ${data.length} results using semantic similarity search`,
          'fallback_text': `Found ${data.length} results using text search (vector search unavailable)`
        };
        toast.success(methodMessages[searchMethod]);
      }

    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
      setCurrentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadItems();
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
        </div>

        {/* Module Selection */}
        <div className="p-4 border-b border-khaki-tan/40 bg-white/60">
          <div className="space-y-1">
            {[
              { key: 'procedures', label: 'Procedures', icon: <Wrench className="h-4 w-4" />, count: catalog?.procedures.total_count },
              { key: 'parts', label: 'Parts Catalog', icon: <Package className="h-4 w-4" />, count: catalog?.parts.total_count },
              { key: 'bulletins', label: 'Service Bulletins', icon: <AlertCircle className="h-4 w-4" />, count: catalog?.bulletins.total_count }
            ].map((module) => (
              <button
                key={module.key}
                onClick={() => setSelectedModule(module.key as any)}
                className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                  selectedModule === module.key
                    ? 'bg-military-green/20 text-military-green border border-military-green/30'
                    : 'text-foreground hover:bg-military-green/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  {module.icon}
                  <span>{module.label}</span>
                </div>
                {module.count && (
                  <Badge variant="secondary" className="text-xs">
                    {module.count}
                  </Badge>
                )}
              </button>
            ))}
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
                  disabled={!searchQuery.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Knowledge Base
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

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left p-2 rounded text-sm transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-military-green/20 text-military-green' 
                  : 'text-foreground hover:bg-military-green/10'
              }`}
            >
              All Categories
            </button>
            
            {catalog && catalog[selectedModule]?.categories?.map((category: string) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-military-green/20 text-military-green'
                    : 'text-foreground hover:bg-military-green/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Search Results Banner */}
        {((isBarryMode && barryContext) || (searchQuery && currentItems.length > 0 && currentItems[0]?.search_method !== 'fallback_text')) && (
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
                    {isBarryMode ? "Barry's AI Analysis" : "Smart Search Results"}
                  </span>
                  {isBarryMode ? (
                    <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {currentItems[0]?.search_method === 'hybrid_vector_text' ? 'Hybrid AI' : 'Semantic AI'}
                    </Badge>
                  )}
                </div>
                
                {isBarryMode && barryContext ? (
                  <>
                    <p className="text-sm text-foreground mb-3">{barryContext.explanation}</p>
                    <div className="flex items-center gap-4 text-xs text-military-green">
                      <span>Query: "{barryContext.query}"</span>
                      <span>•</span>
                      <span>Found {currentItems.length} curated items</span>
                      <span>•</span>
                      <span>Model: {userVehicleModel}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-foreground mb-3">
                      Using AI-powered search to find the most relevant results for "{searchQuery}". 
                      Results are ranked by semantic similarity and text matching.
                    </p>
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
                  </>
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
              ) : currentItems.length === 0 ? (
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
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedItem?.id === item.id ? 'bg-muted/50 border-r-2 border-military-green' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground pr-4">
                          {item.title || item.name}
                        </h3>
                        <div className="flex flex-col gap-1 items-end">
                          {getSimilarityBadge(item.similarity_score, item.result_rank)}
                          {getDifficultyBadge(item.difficulty)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                          {item.code || item.number}
                        </span>
                        {item.category && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{item.category}</span>
                          </>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {item.has_images && (
                            <span className="flex items-center gap-1">
                              <Image className="h-3 w-3" />
                              Images
                            </span>
                          )}
                          {item.has_videos && (
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Videos
                            </span>
                          )}
                          {item.time_estimate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.time_estimate}min
                            </span>
                          )}
                          {item.vehicle_model && (
                            <span className="flex items-center gap-1 text-military-green">
                              <User className="h-3 w-3" />
                              {item.vehicle_model}
                            </span>
                          )}
                        </div>
                        
                        {/* Search Method Indicator */}
                        <div className="flex-shrink-0">
                          {getSearchMethodBadge(item.search_method)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="flex-1 bg-white">
            {selectedItem ? (
              <div className="h-full flex flex-col">
                {/* Item Header */}
                <div className="border-b border-border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-xl font-semibold text-foreground mb-2">
                        {selectedItem.title || selectedItem.name}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-mono bg-muted px-3 py-1 rounded">
                          {selectedItem.code || selectedItem.number}
                        </span>
                        {selectedItem.category && (
                          <Badge variant="outline">{selectedItem.category}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      {getDifficultyBadge(selectedItem.difficulty)}
                    </div>
                  </div>

                  {selectedItem.description && (
                    <p className="text-foreground">{selectedItem.description}</p>
                  )}
                </div>

                {/* Tabbed Content */}
                <div className="flex-1">
                  <Tabs defaultValue="overview" className="h-full flex flex-col">
                    <TabsList className="mx-6 mt-4 w-fit">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="procedure">Procedure</TabsTrigger>
                      <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
                      <TabsTrigger value="parts">Related Parts</TabsTrigger>
                    </TabsList>

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
                      <div className="text-center text-gray-500 py-8">
                        <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Wiring diagrams and schematics would be displayed here</p>
                        <p className="text-sm mt-2">Interactive diagrams with zoom and annotation</p>
                      </div>
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
              </div>
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
      {(relatedItems.length > 0 || (isBarryMode && barryContext)) && (
        <div className="w-96 bg-muted/20 border-l border-border flex flex-col">
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
    </div>
  );
}