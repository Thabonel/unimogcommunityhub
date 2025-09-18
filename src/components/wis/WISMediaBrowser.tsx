import React, { useState, useEffect, useCallback } from 'react';
import { Grid3X3, List, Search, Filter, Eye, Download, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart' | 'document';
  bucket: string;
  file_name: string;
  description: string;
  document_title: string;
  signed_url?: string;
  thumbnail_url?: string;
}

interface WISMediaBrowserProps {
  className?: string;
  selectedVehicle?: string;
  searchContext?: string;
  onMediaSelect?: (media: MediaItem) => void;
  autoLoad?: boolean; // Control automatic loading
}

const MEDIA_TYPES = [
  { key: 'all', label: 'All Media', icon: '🎬' },
  { key: 'photo', label: 'Photos', icon: '📷' },
  { key: 'diagram', label: 'Diagrams', icon: '📊' },
  { key: 'schematic', label: 'Schematics', icon: '⚡' },
  { key: 'table', label: 'Tables', icon: '📋' },
  { key: 'chart', label: 'Charts', icon: '📈' }
];

const BUCKETS = [
  { key: 'all', label: 'All Categories' },
  { key: 'wis-photos', label: 'Component Photos' },
  { key: 'wis-diagrams', label: 'Technical Diagrams' },
  { key: 'wis-schematics', label: 'Electrical Schematics' },
  { key: 'wis-tables', label: 'Reference Tables' },
  { key: 'wis-charts', label: 'Charts & Graphs' }
];

export function WISMediaBrowser({
  className,
  selectedVehicle = 'all',
  searchContext,
  onMediaSelect,
  autoLoad = false
}: WISMediaBrowserProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBucket, setSelectedBucket] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const ITEMS_PER_PAGE = 24;

  // Load media items from database with pagination
  const loadMediaItems = useCallback(async (page = 1, reset = true) => {
    setIsLoading(true);
    try {
      const limit = 20; // Much smaller initial load
      const offset = (page - 1) * limit;

      const { data: documents, error } = await supabase
        .from('wis_documents_unified')
        .select('doc_id, title, media')
        .not('media', 'is', null)
        .range(offset, offset + limit - 1); // Paginated query

      if (error) {
        console.error('Error loading media:', error);
        toast.error('Failed to load media items');
        return;
      }

      const newMediaItems: MediaItem[] = [];

      // Process documents but delay signed URL generation for performance
      for (const doc of documents || []) {
        if (doc.media && Array.isArray(doc.media)) {
          for (const mediaItem of doc.media) {
            newMediaItems.push({
              id: `${doc.doc_id}-${mediaItem.file_name}`,
              type: mediaItem.type || 'document',
              bucket: mediaItem.bucket || 'wis-media',
              file_name: mediaItem.file_name,
              description: mediaItem.description || doc.title,
              document_title: doc.title
              // signed_url will be generated on-demand when item is viewed
            });
          }
        }
      }

      if (reset) {
        setMediaItems(newMediaItems);
        setFilteredItems(newMediaItems);
      } else {
        // Append to existing items for pagination
        setMediaItems(prev => [...prev, ...newMediaItems]);
        setFilteredItems(prev => [...prev, ...newMediaItems]);
      }
    } catch (error) {
      console.error('Error loading media items:', error);
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = mediaItems;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Filter by bucket
    if (selectedBucket !== 'all') {
      filtered = filtered.filter(item => item.bucket === selectedBucket);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.description.toLowerCase().includes(query) ||
        item.document_title.toLowerCase().includes(query) ||
        item.file_name.toLowerCase().includes(query)
      );
    }

    // Filter by search context if provided
    if (searchContext) {
      const contextQuery = searchContext.toLowerCase();
      filtered = filtered.filter(item =>
        item.description.toLowerCase().includes(contextQuery) ||
        item.document_title.toLowerCase().includes(contextQuery)
      );
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset pagination
  }, [mediaItems, selectedType, selectedBucket, searchQuery, searchContext]);

  // Load initial data
  // Only load media items if autoLoad is true
  useEffect(() => {
    if (autoLoad) {
      loadMediaItems();
    }
  }, [loadMediaItems, autoLoad]);

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    if (onMediaSelect) {
      onMediaSelect(media);
    }
  };

  const closePreview = () => {
    setSelectedMedia(null);
    setZoom(1);
    setRotation(0);
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getMediaTypeIcon = (type: string) => {
    const mediaType = MEDIA_TYPES.find(t => t.key === type);
    return mediaType?.icon || '📄';
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || '';
  };

  const isImageFile = (fileName: string) => {
    const ext = getFileExtension(fileName).toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  };

  const downloadMedia = async (media: MediaItem) => {
    if (!media.signed_url) {
      toast.error('Download not available for this media');
      return;
    }

    try {
      const response = await fetch(media.signed_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = media.file_name;
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
    <div className={`wis-media-browser ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Media Library
            <Badge variant="outline" className="ml-2">
              {filteredItems.length} items
            </Badge>
          </h3>

          {/* Load button for lazy loading */}
          {!autoLoad && mediaItems.length === 0 && (
            <Button
              onClick={() => loadMediaItems()}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? 'Loading...' : 'Load Media'}
            </Button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white rounded-md p-1">
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

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-6 w-fit">
            {MEDIA_TYPES.map(type => (
              <TabsTrigger key={type.key} value={type.key} className="text-xs">
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Category Filter */}
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
          >
            {BUCKETS.map(bucket => (
              <option key={bucket.key} value={bucket.key}>
                {bucket.label}
              </option>
            ))}
          </select>
        </div>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading media...</p>
          </div>
        </div>
      )}

      {/* Media Grid/List */}
      {!isLoading && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
              {currentItems.map((media) => (
                <Card
                  key={media.id}
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => handleMediaClick(media)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square bg-gray-100 rounded-md mb-2 relative overflow-hidden">
                      {media.signed_url && isImageFile(media.file_name) ? (
                        <img
                          src={media.signed_url}
                          alt={media.description}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {getMediaTypeIcon(media.type)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {media.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getFileExtension(media.file_name)}
                        </span>
                      </div>
                      <p className="text-xs font-medium line-clamp-2">
                        {media.description}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {media.document_title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {currentItems.map((media) => (
                <Card
                  key={media.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMediaClick(media)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                        {media.signed_url && isImageFile(media.file_name) ? (
                          <img
                            src={media.signed_url}
                            alt={media.description}
                            className="w-full h-full object-cover rounded-md"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-xl">{getMediaTypeIcon(media.type)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {media.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {getFileExtension(media.file_name)}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{media.description}</h4>
                        <p className="text-xs text-gray-500">{media.document_title}</p>
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

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

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

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No media found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{selectedMedia.description}</h3>
                <p className="text-sm text-gray-500 truncate">{selectedMedia.document_title}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {isImageFile(selectedMedia.file_name) && (
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

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 bg-gray-50">
              {selectedMedia.signed_url && isImageFile(selectedMedia.file_name) ? (
                <img
                  src={selectedMedia.signed_url}
                  alt={selectedMedia.description}
                  className="max-w-full max-h-full object-contain transition-transform"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">{getMediaTypeIcon(selectedMedia.type)}</div>
                  <h4 className="text-lg font-medium mb-2">{selectedMedia.description}</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    File: {selectedMedia.file_name} ({getFileExtension(selectedMedia.file_name)})
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