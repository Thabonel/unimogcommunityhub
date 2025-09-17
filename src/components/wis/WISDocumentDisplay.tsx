import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Wrench,
  AlertTriangle,
  Clock,
  Settings,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Download,
  Loader2
} from 'lucide-react';
import { WISSearchSuggestion } from './WISPredictiveSearch';
import { supabase } from '@/lib/supabase-client';
import WISMediaCarousel, { MediaItem } from './WISMediaCarousel';

interface WISDocumentDisplayProps {
  selectedItem: WISSearchSuggestion;
  className?: string;
}

interface WISDocumentDetails {
  id: string;
  type: 'procedure' | 'part' | 'bulletin';
  title: string;
  ref: string;
  category?: string;
  subcategory?: string;
  description?: string;
  content?: string;
  
  // Procedure specific
  steps?: any[];
  tools_required?: string[];
  materials_required?: string[];
  safety_warnings?: string[];
  estimated_time_minutes?: number;
  difficulty_level?: number;
  
  // Part specific
  price_estimate?: number;
  availability_status?: string;
  superseded_by?: string;
  notes?: string;
  
  // Bulletin specific
  severity?: string;
  issue_date?: string;
  date_updated?: string;
  status?: string;
  
  // Media
  media?: MediaItem[];
  
  // Loading states
  loading?: boolean;
  error?: string;
}

export function WISDocumentDisplay({ selectedItem, className = "" }: WISDocumentDisplayProps) {
  const [document, setDocument] = useState<WISDocumentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch complete document details
  useEffect(() => {
    if (!selectedItem) return;
    
    fetchDocumentDetails(selectedItem);
  }, [selectedItem]);

  const fetchDocumentDetails = async (item: WISSearchSuggestion) => {
    setLoading(true);
    setError(null);
    
    try {
      let data = null;
      let tableName = '';
      
      switch (item.type) {
        case 'procedure':
          tableName = 'wis_procedures';
          break;
        case 'part':
          tableName = 'wis_parts';
          break;
        case 'bulletin':
          tableName = 'wis_bulletins';
          break;
      }

      const { data: docData, error: docError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', item.id)
        .single();

      if (docError) {
        throw new Error(`Failed to fetch ${item.type} details`);
      }

      // Resolve media URLs if present
      let resolvedMedia = [];
      if (docData.media && Array.isArray(docData.media)) {
        resolvedMedia = await Promise.all(
          docData.media.map(async (mediaItem: any) => {
            try {
              const { data: signedUrl } = await supabase.rpc('wis_media_url', {
                bucket: mediaItem.bucket,
                file_name: mediaItem.file_name,
                expires_in: 3600
              });
              
              return {
                ...mediaItem,
                signed_url: signedUrl || ''
              };
            } catch (error) {
              console.warn('Failed to get signed URL for media:', mediaItem.file_name);
              return mediaItem;
            }
          })
        );
      }

      const documentDetails: WISDocumentDetails = {
        ...docData,
        type: item.type,
        ref: item.ref,
        media: resolvedMedia
      };

      setDocument(documentDetails);
    } catch (err) {
      console.error('Error fetching document details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  // Get icon for document type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'procedure': return <FileText className="w-5 h-5" />;
      case 'part': return <Wrench className="w-5 h-5" />;
      case 'bulletin': return <AlertTriangle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // Get badge variant for document type
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'procedure': return 'bg-blue-100 text-blue-800' as const;
      case 'part': return 'bg-green-100 text-green-800' as const;
      case 'bulletin': return 'bg-orange-100 text-orange-800' as const;
      default: return 'secondary' as const;
    }
  };

  // Format difficulty level
  const formatDifficulty = (level?: number) => {
    if (!level) return 'Unknown';
    const levels = ['', 'Basic', 'Intermediate', 'Advanced', 'Expert', 'Specialist'];
    return levels[level] || `Level ${level}`;
  };

  // Format time estimate
  const formatTime = (minutes?: number) => {
    if (!minutes) return 'Not specified';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  // Render loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
            <p className="text-gray-500">Loading document details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
            <p className="text-red-600 mb-2">Error loading document</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => fetchDocumentDetails(selectedItem)}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render document not found
  if (!document) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-4 text-gray-300" />
            <p>Select an item to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-gray-600">
              {getTypeIcon(document.type)}
            </div>
            <div>
              <CardTitle className="text-xl mb-2">{document.title}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeBadgeVariant(document.type)}>
                  {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {document.ref}
                </Badge>
                {document.category && (
                  <Badge variant="secondary">{document.category}</Badge>
                )}
              </div>
              {document.subcategory && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Subcategory:</span> {document.subcategory}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        {document.description && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{document.description}</p>
          </div>
        )}

        {/* Type-specific information */}
        {document.type === 'procedure' && (
          <>
            {/* Procedure Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {document.difficulty_level && (
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Difficulty</div>
                    <div className="text-sm text-gray-600">{formatDifficulty(document.difficulty_level)}</div>
                  </div>
                </div>
              )}
              {document.estimated_time_minutes && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Time Est.</div>
                    <div className="text-sm text-gray-600">{formatTime(document.estimated_time_minutes)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Required */}
            {document.tools_required && document.tools_required.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tools Required</h3>
                <div className="flex flex-wrap gap-2">
                  {document.tools_required.map((tool, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Materials Required */}
            {document.materials_required && document.materials_required.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Materials Required</h3>
                <div className="flex flex-wrap gap-2">
                  {document.materials_required.map((material, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-800">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Warnings */}
            {document.safety_warnings && document.safety_warnings.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Safety Warnings
                </h3>
                <div className="space-y-2">
                  {document.safety_warnings.map((warning, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm">{warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            {document.steps && document.steps.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Procedure Steps</h3>
                <div className="space-y-3">
                  {document.steps.map((step, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div className="text-sm text-gray-800">
                        {typeof step === 'string' ? step : step.description || step.text || JSON.stringify(step)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {document.type === 'part' && (
          <>
            {/* Part Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {document.availability_status && (
                <div>
                  <div className="text-sm font-medium">Availability</div>
                  <Badge 
                    variant={document.availability_status === 'available' ? 'secondary' : 'outline'}
                    className={document.availability_status === 'available' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {document.availability_status}
                  </Badge>
                </div>
              )}
              {document.price_estimate && (
                <div>
                  <div className="text-sm font-medium">Price Est.</div>
                  <div className="text-sm text-gray-600">€{document.price_estimate}</div>
                </div>
              )}
            </div>

            {/* Superseded Info */}
            {document.superseded_by && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> This part has been superseded by: {document.superseded_by}
                </p>
              </div>
            )}

            {/* Notes */}
            {document.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{document.notes}</p>
              </div>
            )}
          </>
        )}

        {document.type === 'bulletin' && (
          <>
            {/* Bulletin Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {document.severity && (
                <div>
                  <div className="text-sm font-medium">Severity</div>
                  <Badge 
                    variant={document.severity === 'Critical' ? 'destructive' : 'secondary'}
                    className={
                      document.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      document.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      document.severity === 'Low' ? 'bg-blue-100 text-blue-800' : ''
                    }
                  >
                    {document.severity}
                  </Badge>
                </div>
              )}
              {document.issue_date && (
                <div>
                  <div className="text-sm font-medium">Issue Date</div>
                  <div className="text-sm text-gray-600">
                    {new Date(document.issue_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              {document.status && (
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <Badge 
                    variant={document.status === 'active' ? 'secondary' : 'outline'}
                    className={document.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {document.status}
                  </Badge>
                </div>
              )}
            </div>
          </>
        )}

        {/* Content */}
        {document.content && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Content</h3>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {document.content}
              </div>
            </div>
          </>
        )}

        {/* Media */}
        {document.media && document.media.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Media & Diagrams</h3>
              <WISMediaCarousel
                media={document.media}
                height={400}
                showThumbnails={true}
                className="border rounded-lg"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default WISDocumentDisplay;