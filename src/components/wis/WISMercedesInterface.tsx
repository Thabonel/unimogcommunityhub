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
    if (!catalog) return;
    
    setLoading(true);
    try {
      const searchTerms = searchQuery.trim() ? [searchQuery.trim()] : null;
      const { data, error } = await supabase.rpc('get_wis_items', {
        item_type: selectedModule === 'procedures' ? 'procedure' : selectedModule === 'parts' ? 'part' : 'bulletin',
        search_terms: searchTerms,
        model_code: userVehicleModel,
        limit_count: 50
      });

      if (error) throw error;
      setCurrentItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation Panel - Mercedes Style */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-900">WIS Professional</h1>
          </div>
          
          {/* Vehicle Info from Profile */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
            <User className="h-4 w-4" />
            <span className="font-medium">{userVehicleModel}</span>
            <span>•</span>
            <span>From Profile</span>
          </div>
        </div>

        {/* Module Selection */}
        <div className="p-4 border-b border-gray-200">
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
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
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

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder={`Search ${selectedModule}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="text-sm"
            />
            <Button size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left p-2 rounded text-sm transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
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
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
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
        {/* Barry Explanation Banner */}
        {isBarryMode && barryContext && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-blue-900">Barry's Analysis</span>
                  <Badge variant="outline" className="text-xs">GPT-5</Badge>
                </div>
                <p className="text-sm text-blue-800 mb-3">{barryContext.explanation}</p>
                <div className="flex items-center gap-4 text-xs text-blue-600">
                  <span>Query: "{barryContext.query}"</span>
                  <span>•</span>
                  <span>Found {currentItems.length} relevant items</span>
                  <span>•</span>
                  <span>Model: {userVehicleModel}</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsBarryMode(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear Barry Results
              </Button>
            </div>
          </div>
        )}

        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getModuleIcon(selectedModule)}
                <span className="font-medium text-gray-900 capitalize">{selectedModule}</span>
                {selectedCategory !== 'all' && (
                  <>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{selectedCategory}</span>
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
          <div className="w-1/2 border-r border-gray-200 bg-white">
            <div className="overflow-y-auto h-full">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : currentItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No items found</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-blue-50 ${
                        selectedItem?.id === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 pr-4">
                          {item.title || item.name}
                        </h3>
                        {getDifficultyBadge(item.difficulty)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
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
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
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
                <div className="border-b border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedItem.title || selectedItem.name}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-3 py-1 rounded">
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
                    <p className="text-gray-700">{selectedItem.description}</p>
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
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
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
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
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
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Barry's Context Section */}
          {isBarryMode && barryContext && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-gray-900">Barry's Insights</h3>
              </div>
              
              {barryContext.suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Follow-up Questions</p>
                  {barryContext.suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onBarryRequest?.(suggestion)}
                      className="w-full text-left p-2 rounded text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
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
              <h3 className="font-medium text-gray-900 mb-3">Related Items</h3>
              <div className="space-y-2">
                {relatedItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
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
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <Bot className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-blue-900 mb-1">Ask Barry</p>
                <p className="text-xs text-blue-700 mb-3">Get intelligent recommendations for your specific needs</p>
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