import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Wrench, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  ExternalLink,
  Clock,
  Star,
  Image,
  Zap,
  Settings,
  Cog,
  Gauge,
  Droplets,
  Car,
  Truck,
  BookOpen,
  Play,
  Bookmark
} from 'lucide-react';
import { UnifiedWISResult } from '@/lib/unified-wis-search';

interface UnifiedResultCardProps {
  result: UnifiedWISResult;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onView: () => void;
  onRelatedItemClick?: (item: any, type: 'procedure' | 'part' | 'bulletin') => void;
}

export function UnifiedResultCard({ result, isExpanded, onToggleExpansion, onView, onRelatedItemClick }: UnifiedResultCardProps) {
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  const getDocTypeIcon = (docType: string) => {
    switch (docType) {
      case 'procedure': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'part': return <Wrench className="w-5 h-5 text-green-500" />;
      case 'bulletin': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Enhanced system detection based on content analysis
  const detectSystems = (content: string, title: string, category?: string) => {
    const text = (content + ' ' + title + ' ' + (category || '')).toLowerCase();
    const systems = [];

    // Engine system
    if (text.match(/(engine|motor|om\d+|cooling|radiator|thermostat|oil|filter|fuel|injection)/)) {
      systems.push({ id: 'engine', label: 'Engine', icon: Cog, color: 'bg-red-100 text-red-800 border-red-200' });
    }

    // Transmission system
    if (text.match(/(transmission|gearbox|gear|clutch|pto|transfer)/)) {
      systems.push({ id: 'transmission', label: 'Transmission', icon: Settings, color: 'bg-blue-100 text-blue-800 border-blue-200' });
    }

    // Axles and differentials
    if (text.match(/(axle|differential|diff|lock|portal|hub)/)) {
      systems.push({ id: 'axles', label: 'Axles & Diff', icon: Gauge, color: 'bg-green-100 text-green-800 border-green-200' });
    }

    // Hydraulic systems
    if (text.match(/(hydraulic|steering|pump|cylinder|valve|working hydraulics)/)) {
      systems.push({ id: 'hydraulics', label: 'Hydraulics', icon: Droplets, color: 'bg-cyan-100 text-cyan-800 border-cyan-200' });
    }

    // Electrical systems
    if (text.match(/(electrical|wiring|light|battery|alternator|starter|fuse)/)) {
      systems.push({ id: 'electrical', label: 'Electrical', icon: Zap, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' });
    }

    // Suspension and chassis
    if (text.match(/(suspension|spring|shock|chassis|frame|mount)/)) {
      systems.push({ id: 'suspension', label: 'Suspension', icon: Car, color: 'bg-purple-100 text-purple-800 border-purple-200' });
    }

    // Braking systems
    if (text.match(/(brake|braking|pad|disc|drum|caliper)/)) {
      systems.push({ id: 'brakes', label: 'Brakes', icon: AlertTriangle, color: 'bg-orange-100 text-orange-800 border-orange-200' });
    }

    // Cabin and interior
    if (text.match(/(cabin|interior|seat|dashboard|hvac|air|conditioning)/)) {
      systems.push({ id: 'cabin', label: 'Cabin', icon: Truck, color: 'bg-gray-100 text-gray-800 border-gray-200' });
    }

    return systems.slice(0, 3); // Limit to top 3 most relevant systems
  };

  // Get difficulty level based on content analysis
  const getDifficultyLevel = (content: string, title: string) => {
    const text = (content + ' ' + title).toLowerCase();
    let difficulty = 1;

    // Basic indicators
    if (text.match(/(special tool|specialized|professional|dealer|factory)/)) difficulty = Math.max(difficulty, 4);
    if (text.match(/(complex|advanced|expert|precision)/)) difficulty = Math.max(difficulty, 3);
    if (text.match(/(remove engine|rebuild|overhaul|calibration)/)) difficulty = Math.max(difficulty, 4);
    if (text.match(/(torque specification|timing|alignment)/)) difficulty = Math.max(difficulty, 3);
    if (text.match(/(maintenance|oil change|filter|check|inspect)/)) difficulty = Math.max(difficulty, 1);

    return Math.min(5, difficulty);
  };

  // Enhanced media handling with thumbnails
  const getMediaThumbnails = () => {
    if (!result.media || result.media.length === 0) return [];
    
    return result.media.slice(0, 3).map((media, index) => {
      const mediaId = `${result.doc_id}-${index}`;
      const hasError = imageLoadErrors.has(mediaId);
      
      return {
        id: mediaId,
        url: media.signed_url || media.media_url,
        type: media.media_type,
        hasError
      };
    });
  };

  const handleImageError = (mediaId: string) => {
    setImageLoadErrors(prev => new Set([...prev, mediaId]));
  };

  const getDocTypeBadge = (docType: string) => {
    const colors = {
      procedure: 'bg-blue-100 text-blue-800 border-blue-200',
      part: 'bg-green-100 text-green-800 border-green-200',
      bulletin: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[docType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMatchTypeBadge = (matchType?: string) => {
    if (!matchType) return null;
    
    const badges = {
      title: { text: 'Title Match', color: 'bg-purple-100 text-purple-800' },
      part_number: { text: 'Part #', color: 'bg-indigo-100 text-indigo-800' },
      content: { text: 'Content', color: 'bg-gray-100 text-gray-800' },
      category: { text: 'Category', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    const badge = badges[matchType as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <Badge variant="outline" className={`text-xs ${badge.color}`}>
        {badge.text}
      </Badge>
    );
  };

  // Calculate relevance score visualization
  const getRelevanceStars = (score?: number) => {
    if (!score) return null;
    const stars = Math.min(5, Math.max(1, Math.round(score)));
    return (
      <div className="flex items-center gap-1" title={`Relevance: ${score.toFixed(1)}`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Detect systems and difficulty for this result
  const detectedSystems = detectSystems(result.content || result.content_summary || '', result.title, result.category);
  const difficultyLevel = getDifficultyLevel(result.content || result.content_summary || '', result.title);
  const mediaThumbnails = getMediaThumbnails();
  
  const hasRelatedContent = result.related_parts.length > 0 || 
                           result.related_procedures.length > 0 || 
                           result.related_bulletins.length > 0;

  return (
    <Card className="border-2 hover:border-blue-200 transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardContent className="p-0">
        {/* Media Strip - Inline Thumbnails */}
        {mediaThumbnails.length > 0 && (
          <div className="bg-gray-50 border-b border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {mediaThumbnails.length} Media {result.media && result.media.length > 3 && `(+${result.media.length - 3} more)`}
              </span>
            </div>
            <div className="flex gap-2">
              {mediaThumbnails.map((media) => (
                <div 
                  key={media.id}
                  className="w-16 h-16 bg-white border border-gray-300 rounded-lg overflow-hidden flex-shrink-0"
                >
                  {!media.hasError ? (
                    <img
                      src={media.url}
                      alt="Technical diagram"
                      className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                      onError={() => handleImageError(media.id)}
                      onClick={onView}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Header section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              {getDocTypeIcon(result.doc_type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {result.title}
                  </h3>
                  <Badge variant="outline" className={getDocTypeBadge(result.doc_type)}>
                    {result.doc_type.charAt(0).toUpperCase() + result.doc_type.slice(1)}
                  </Badge>
                  {getMatchTypeBadge(result.match_type)}
                </div>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {result.reference_number}
                  </span>
                  {result.category && (
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">•</span>
                      {result.category}
                      {result.subcategory && ` / ${result.subcategory}`}
                    </span>
                  )}
                  {getRelevanceStars(result.search_score)}
                </div>

                {/* System Badges and Difficulty */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {detectedSystems.map((system) => (
                    <Badge key={system.id} variant="outline" className={`text-xs ${system.color}`}>
                      <system.icon className="w-3 h-3 mr-1" />
                      {system.label}
                    </Badge>
                  ))}
                  
                  {difficultyLevel > 1 && (
                    <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: difficultyLevel }, (_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </Badge>
                  )}

                  {mediaThumbnails.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                      <Image className="w-3 h-3 mr-1" />
                      Illustrated
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {result.content_summary}
                </p>
              </div>
            </div>
          
          {/* Enhanced Actions */}
          <div className="flex items-center gap-2 ml-4">
            {hasRelatedContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleExpansion}
                className="flex items-center gap-1 hover:bg-gray-50"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Collapse</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span className="hidden sm:inline">Related</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {result.related_parts.length + result.related_procedures.length + result.related_bulletins.length}
                    </Badge>
                  </>
                )}
              </Button>
            )}

            {/* Bookmark Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement bookmarking functionality
              }}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={onView}
              className="flex items-center gap-1 bg-military-green hover:bg-military-green/90"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
              <span className="sm:hidden">Details</span>
            </Button>
          </div>
        </div>

        {/* Expanded interconnected content (enterprise pattern) */}
        {isExpanded && hasRelatedContent && (
          <div className="border-t pt-4 mt-4 space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Related Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Related Parts */}
              {result.related_parts.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h5 className="font-medium text-green-800 flex items-center gap-1 mb-2">
                    <Wrench className="w-4 h-4" />
                    Related Parts ({result.related_parts.length})
                  </h5>
                  <div className="space-y-2">
                    {result.related_parts.slice(0, 3).map((part) => (
                      <button
                        key={part.id}
                        onClick={() => onRelatedItemClick?.(part, 'part')}
                        className="w-full text-left text-sm p-2 rounded border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                      >
                        <div className="font-mono text-green-700 flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          {part.part_number}
                        </div>
                        <div className="text-green-600 truncate">{part.part_name}</div>
                      </button>
                    ))}
                    {result.related_parts.length > 3 && (
                      <div className="text-xs text-green-600">
                        +{result.related_parts.length - 3} more parts
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Procedures */}
              {result.related_procedures.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="font-medium text-blue-800 flex items-center gap-1 mb-2">
                    <FileText className="w-4 h-4" />
                    Related Procedures ({result.related_procedures.length})
                  </h5>
                  <div className="space-y-2">
                    {result.related_procedures.slice(0, 2).map((proc) => (
                      <button
                        key={proc.id}
                        onClick={() => onRelatedItemClick?.(proc, 'procedure')}
                        className="w-full text-left text-sm p-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-blue-700 truncate flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          {proc.title}
                        </div>
                        <div className="text-blue-600 text-xs flex items-center gap-2 mt-1">
                          {proc.estimated_time_minutes && (
                            <>
                              <Clock className="w-3 h-3" />
                              {proc.estimated_time_minutes} min
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                    {result.related_procedures.length > 2 && (
                      <div className="text-xs text-blue-600">
                        +{result.related_procedures.length - 2} more procedures
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Bulletins */}
              {result.related_bulletins.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <h5 className="font-medium text-orange-800 flex items-center gap-1 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Related Bulletins ({result.related_bulletins.length})
                  </h5>
                  <div className="space-y-2">
                    {result.related_bulletins.slice(0, 2).map((bulletin) => (
                      <button
                        key={bulletin.id}
                        onClick={() => onRelatedItemClick?.(bulletin, 'bulletin')}
                        className="w-full text-left text-sm p-2 rounded border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-orange-700 truncate flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          {bulletin.title}
                        </div>
                        <div className="text-orange-600 text-xs flex items-center gap-2 mt-1">
                          <span>{bulletin.bulletin_number}</span>
                          {bulletin.severity && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-1 py-0 ${
                                bulletin.severity === 'critical' ? 'border-red-300 text-red-700' : 
                                bulletin.severity === 'high' ? 'border-orange-300 text-orange-700' :
                                'border-gray-300 text-gray-700'
                              }`}
                            >
                              {bulletin.severity}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                    {result.related_bulletins.length > 2 && (
                      <div className="text-xs text-orange-600">
                        +{result.related_bulletins.length - 2} more bulletins
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}