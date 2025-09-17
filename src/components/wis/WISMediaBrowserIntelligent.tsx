import React, { useState, useEffect, useCallback } from 'react';
import { Grid3X3, List, Search, Filter, Eye, Download, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw, Brain, Lightbulb, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WISContextAwareService, { WISCatalogItem, WISMediaItem, ContextAwareQuery } from '@/services/wisContextAwareService';
import { toast } from 'sonner';

interface WISMediaBrowserIntelligentProps {
  className?: string;
  selectedVehicle?: string;
  searchContext?: string;
  onMediaSelect?: (media: WISMediaItem) => void;
  initialQuery?: string;
}

const CATEGORIES = [
  'All Categories',
  'Engine',
  'Transmission',
  'Hydraulic System',
  'Electrical',
  'Chassis',
  'Body',
  'Cooling System',
  'Fuel System'
];

const MEDIA_TYPES = [
  { key: 'all', label: 'All Media', icon: '🎬' },
  { key: 'photo', label: 'Photos', icon: '📷' },
  { key: 'diagram', label: 'Diagrams', icon: '📊' },
  { key: 'schematic', label: 'Schematics', icon: '⚡' },
  { key: 'table', label: 'Tables', icon: '📋' },
  { key: 'chart', label: 'Charts', icon: '📈' }
];

export function WISMediaBrowserIntelligent({
  className,
  selectedVehicle = 'all',
  searchContext,
  onMediaSelect,
  initialQuery = ''
}: WISMediaBrowserIntelligentProps) {
  const [catalogItems, setCatalogItems] = useState<WISCatalogItem[]>([]);
  const [mediaItems, setMediaItems] = useState<WISMediaItem[]>([]);
  const [recommendations, setRecommendations] = useState<WISCatalogItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedMedia, setSelectedMedia] = useState<WISMediaItem | null>(null);
  const [activeTab, setActiveTab] = useState('search');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [hasMediaOnly, setHasMediaOnly] = useState(false);

  const ITEMS_PER_PAGE = 24;
  const wisService = WISContextAwareService.getInstance();

  // Initialize Barry's catalog browser
  useEffect(() => {
    const loadCategoryBrowser = async () => {
      try {
        setIsLoading(true);
        const categoryData = await wisService.getCategoryBrowser();
        setCategories(categoryData.categories);

        // If we have an initial query, search immediately
        if (initialQuery || searchContext) {
          await performIntelligentSearch(initialQuery || searchContext || '');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load Barry\'s catalog');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryBrowser();
  }, [initialQuery, searchContext]);

  // Perform intelligent search using Barry's catalog
  const performIntelligentSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCatalogItems([]);
      setMediaItems([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchQuery: ContextAwareQuery = {
        query: query.trim(),
        category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
        mediaTypes: selectedType !== 'all' ? [selectedType] : undefined,
        hasMedia: hasMediaOnly,
        limit: 50
      };

      console.log('🧠 Barry searching catalog:', searchQuery);

      // Get catalog items first (Barry knows what exists)
      const searchResults = await wisService.searchCatalog(searchQuery);

      setCatalogItems(searchResults.items);
      console.log(`📚 Barry found ${searchResults.items.length} catalog items`);

      // Get contextual media for the found items
      if (searchResults.items.length > 0) {
        const mediaResults = await wisService.getContextualMedia(
          searchResults.items,
          selectedType !== 'all' ? [selectedType] : undefined
        );

        setMediaItems(mediaResults);
        console.log(`🎨 Barry loaded ${mediaResults.length} contextual media items`);

        // Get smart recommendations based on first result
        if (searchResults.items[0]) {
          const recs = await wisService.getSmartRecommendations(
            {
              contentType: searchResults.items[0].contentType,
              contentId: searchResults.items[0].contentId
            },
            5
          );
          setRecommendations(recs);
          console.log(`💡 Barry suggests ${recs.length} related items`);
        }
      } else {
        setMediaItems([]);
        setRecommendations([]);
      }

      // Reset pagination
      setCurrentPage(1);

      toast.success(`Barry found ${searchResults.items.length} relevant items${searchResults.cacheHit ? ' (from memory)' : ''}`);

    } catch (error) {
      console.error('Intelligent search error:', error);
      toast.error('Barry encountered an error while searching');
    } finally {
      setIsSearching(false);
    }
  }, [selectedCategory, selectedType, hasMediaOnly]);

  // Handle search execution
  const handleSearch = () => {
    performIntelligentSearch(searchQuery);
  };

  // Handle category selection
  const handleCategoryClick = async (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('category');

    // Load items in this category
    const query = categoryName === 'All Categories' ? '' : categoryName;
    await performIntelligentSearch(query);
  };

  // Handle media item click
  const handleMediaClick = (media: WISMediaItem) => {
    setSelectedMedia(media);
    if (onMediaSelect) {
      onMediaSelect(media);
    }
  };

  // Handle recommendation click
  const handleRecommendationClick = async (item: WISCatalogItem) => {
    console.log('🎯 Following Barry\'s recommendation:', item.title);
    setSearchQuery(item.title);
    await performIntelligentSearch(item.title);
    setActiveTab('search');
  };

  const closePreview = () => {
    setSelectedMedia(null);
    setZoom(1);
    setRotation(0);
  };

  // Pagination for media items
  const totalPages = Math.ceil(mediaItems.length / ITEMS_PER_PAGE);
  const currentMediaItems = mediaItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getMediaTypeIcon = (type: string) => {
    const mediaType = MEDIA_TYPES.find(t => t.key === type);
    return mediaType?.icon || '📄';
  };

  const isImageFile = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  };

  const downloadMedia = async (media: WISMediaItem) => {
    if (!media.publicUrl) {
      toast.error('Download not available for this media');
      return;
    }

    try {
      const response = await fetch(media.publicUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = media.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Media downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download media');
    }
  };

  return (
    <div className={`wis-intelligent-media-browser ${className}`}>
      {/* Enhanced Header with Barry's Intelligence */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Barry's Intelligent Media Library
                </h3>
                <p className="text-sm text-gray-600">
                  Context-aware search • No more random image dumps • Smart recommendations
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              {catalogItems.length} items in catalog
            </Badge>
            <Badge variant="outline" className="bg-white">
              {mediaItems.length} relevant media
            </Badge>
          </div>
        </div>

        {/* Search Bar with Enhanced Controls */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Ask Barry to find specific media (e.g., 'OM352 engine diagrams', 'brake system photos')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} disabled={isSearching} className="px-6">
            {isSearching ? '🤔 Thinking...' : '🔍 Search'}
          </Button>
        </div>

        {/* Advanced Filters */}
        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border">
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="grid grid-cols-6 w-fit">
              {MEDIA_TYPES.map(type => (
                <TabsTrigger key={type.key} value={type.key} className="text-xs">
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasMediaOnly}
              onChange={(e) => setHasMediaOnly(e.target.checked)}
              className="rounded"
            />
            Only items with media
          </label>

          <div className="flex items-center gap-1 bg-gray-50 rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="w-8 h-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="w-8 h-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Results
            {mediaItems.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {mediaItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <Tags className="w-4 h-4" />
            Categories
            <Badge variant="secondary" className="ml-1">
              {categories.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Barry Suggests
            {recommendations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {recommendations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Search Results Tab */}
        <TabsContent value="search" className="mt-0">
          {isSearching && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Barry is searching his catalog...</p>
              </div>
            </div>
          )}

          {!isSearching && mediaItems.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
                  {currentMediaItems.map((media) => (
                    <Card
                      key={media.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 group border-2 hover:border-blue-300"
                      onClick={() => handleMediaClick(media)}
                    >
                      <CardContent className="p-3">
                        <div className="aspect-square bg-gray-100 rounded-md mb-2 relative overflow-hidden">
                          {media.publicUrl && isImageFile(media.fileName) ? (
                            <img
                              src={media.publicUrl}
                              alt={media.description || 'Media item'}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                              {getMediaTypeIcon(media.mediaType)}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs bg-white/90">
                              {media.mediaType}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium line-clamp-2">
                            {media.description || media.fileName}
                          </p>
                          <div className="flex items-center gap-1">
                            {media.contextTags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  {currentMediaItems.map((media) => (
                    <Card
                      key={media.id}
                      className="cursor-pointer hover:shadow-md transition-shadow group"
                      onClick={() => handleMediaClick(media)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                            {media.publicUrl && isImageFile(media.fileName) ? (
                              <img
                                src={media.publicUrl}
                                alt={media.description || 'Media item'}
                                className="w-full h-full object-cover rounded-md"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xl">{getMediaTypeIcon(media.mediaType)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {media.mediaType}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Priority: {media.viewPriority}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm mb-1">
                              {media.description || media.fileName}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {media.contextTags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadMedia(media);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {!isSearching && searchQuery && mediaItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🤔</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Barry couldn't find matching media</h3>
              <p className="text-gray-500 mb-4">Try a different search term or browse categories</p>
              <Button onClick={() => setActiveTab('category')}>
                Browse Categories
              </Button>
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to help you find the right media</h3>
              <p className="text-gray-500 mb-4">
                Tell Barry what you're looking for, and he'll find only the relevant photos and diagrams
              </p>
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="category" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    {category.name}
                    <Badge variant="secondary">
                      {category.total_count} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Parts: {category.total_parts || 0}</span>
                      <span>Procedures: {category.total_procedures || 0}</span>
                    </div>
                    {category.subcategories?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 3).map((sub: any) => (
                          <Badge key={sub.name} variant="outline" className="text-xs">
                            {sub.name}
                          </Badge>
                        ))}
                        {category.subcategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-0">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800 font-medium">
                  Barry suggests these related items based on your current search
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((item, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRecommendationClick(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          {item.contentType === 'part' && '🔧'}
                          {item.contentType === 'procedure' && '📋'}
                          {item.contentType === 'bulletin' && '⚠️'}
                          {item.contentType === 'chunk' && '📄'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.subcategory && (
                              <Badge variant="outline" className="text-xs">
                                {item.subcategory}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {item.hasPhotos && <span>📷 Photos</span>}
                            {item.hasDiagrams && <span>📊 Diagrams</span>}
                            {item.hasSchematics && <span>⚡ Schematics</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No recommendations yet</h3>
              <p className="text-gray-500">Search for something first, and Barry will suggest related items</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Enhanced Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">
                  {selectedMedia.description || selectedMedia.fileName}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMedia.contextTags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {isImageFile(selectedMedia.fileName) && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setZoom(prev => Math.max(0.1, prev - 0.2))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setRotation(prev => (prev + 90) % 360)}>
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => downloadMedia(selectedMedia)}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={closePreview}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 bg-gray-50">
              {selectedMedia.publicUrl && isImageFile(selectedMedia.fileName) ? (
                <img
                  src={selectedMedia.publicUrl}
                  alt={selectedMedia.description || 'Media item'}
                  className="max-w-full max-h-full object-contain transition-transform"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">{getMediaTypeIcon(selectedMedia.mediaType)}</div>
                  <h4 className="text-lg font-medium mb-2">
                    {selectedMedia.description || selectedMedia.fileName}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    File: {selectedMedia.fileName} • Type: {selectedMedia.mediaType}
                  </p>
                  <Button onClick={() => downloadMedia(selectedMedia)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}