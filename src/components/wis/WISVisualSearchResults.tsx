import React, { useState } from 'react';
import { Eye, Download, BookmarkPlus, Star, Clock, Wrench, ShoppingCart, ChevronRight, Image as ImageIcon, FileText, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface MediaItem {
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart' | 'document';
  bucket: string;
  file_name: string;
  description: string;
  signed_url?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  content_type: 'procedure' | 'part' | 'bulletin' | 'document';
  category?: string;
  difficulty_level?: number;
  estimated_time_minutes?: number;
  part_number?: string;
  availability_status?: string;
  procedure_code?: string;
  tools_required?: string[];
  parts_required?: string[];
  safety_warnings?: string[];
  media?: MediaItem[];
}

interface WISVisualSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultSelect: (result: SearchResult) => void;
  onBookmark?: (result: SearchResult) => void;
  onDownload?: (result: SearchResult) => void;
  isBookmarked?: (id: string) => boolean;
}

export function WISVisualSearchResults({
  results,
  isLoading,
  onResultSelect,
  onBookmark,
  onDownload,
  isBookmarked = () => false
}: WISVisualSearchResultsProps) {
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'procedure': return <Wrench className="w-4 h-4" />;
      case 'part': return <Package className="w-4 h-4" />;
      case 'bulletin': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getResultBadgeClass = (type: string) => {
    switch (type) {
      case 'procedure': return 'bg-blue-100 text-blue-800';
      case 'part': return 'bg-green-100 text-green-800';
      case 'bulletin': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
  };

  const formatDifficulty = (level: number) => {
    const levels = ['Basic', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return levels[level - 1] || 'Unknown';
  };

  const isImageFile = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
  };

  const downloadMedia = async (media: MediaItem, resultTitle: string) => {
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
      a.download = `${resultTitle}_${media.file_name}`;
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
        <p className="text-gray-500">Try adjusting your search terms or browse the Media Gallery</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Visual Preview */}
              <div className="w-48 flex-shrink-0">
                {result.media && result.media.length > 0 ? (
                  <div className="space-y-2">
                    {/* Main image */}
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group">
                      {result.media[0].signed_url && isImageFile(result.media[0].file_name) ? (
                        <img
                          src={result.media[0].signed_url}
                          alt={result.media[0].description}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {result.media[0].type === 'diagram' ? '📊' :
                           result.media[0].type === 'schematic' ? '⚡' :
                           result.media[0].type === 'table' ? '📋' :
                           result.media[0].type === 'chart' ? '📈' : '📄'}
                        </div>
                      )}
                      {result.media.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          +{result.media.length - 1}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Additional media thumbnails */}
                    {result.media.length > 1 && expandedMedia === result.id && (
                      <div className="grid grid-cols-3 gap-1">
                        {result.media.slice(1, 4).map((media, index) => (
                          <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                            {media.signed_url && isImageFile(media.file_name) ? (
                              <img
                                src={media.signed_url}
                                alt={media.description}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm">
                                {media.type === 'diagram' ? '📊' :
                                 media.type === 'schematic' ? '⚡' :
                                 media.type === 'table' ? '📋' :
                                 media.type === 'chart' ? '📈' : '📄'}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {result.media.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setExpandedMedia(expandedMedia === result.id ? null : result.id)}
                      >
                        {expandedMedia === result.id ? 'Show Less' : `Show ${result.media.length} Images`}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {getResultIcon(result.content_type)}
                    <span className="ml-2 text-sm text-gray-500">No preview</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {result.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getResultBadgeClass(result.content_type)}>
                        {getResultIcon(result.content_type)}
                        <span className="ml-1">{result.content_type.toUpperCase()}</span>
                      </Badge>
                      {result.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {result.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onBookmark && onBookmark(result)}
                    className={isBookmarked(result.id) ? 'text-yellow-500' : 'text-gray-400'}
                  >
                    <Star className={`w-4 h-4 ${isBookmarked(result.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {result.description && (
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {result.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  {result.estimated_time_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(result.estimated_time_minutes)}
                    </div>
                  )}
                  {result.difficulty_level && (
                    <div className="flex items-center gap-1">
                      <Wrench className="w-3 h-3" />
                      {formatDifficulty(result.difficulty_level)}
                    </div>
                  )}
                  {result.part_number && (
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {result.part_number}
                    </div>
                  )}
                  {result.availability_status && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.availability_status === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.availability_status === 'In Stock' ? '✅ In Stock' : '⚠️ ' + result.availability_status}
                    </span>
                  )}
                </div>

                {/* Tools & Parts Required */}
                {(result.tools_required || result.parts_required) && (
                  <div className="mb-3 space-y-1">
                    {result.tools_required && result.tools_required.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Wrench className="w-3 h-3" />
                        <span>Tools: {result.tools_required.join(', ')}</span>
                      </div>
                    )}
                    {result.parts_required && result.parts_required.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Package className="w-3 h-3" />
                        <span>Parts: {result.parts_required.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Safety Warnings */}
                {result.safety_warnings && result.safety_warnings.length > 0 && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                    <div className="flex items-center gap-1 text-red-700 font-medium mb-1">
                      <AlertCircle className="w-3 h-3" />
                      Safety Warnings
                    </div>
                    <ul className="text-red-600 space-y-1">
                      {result.safety_warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onResultSelect(result)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>

                  {result.media && result.media.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadMedia(result.media![0], result.title)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  )}

                  {result.content_type === 'part' && (
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Check Availability
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload && onDownload(result)}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}