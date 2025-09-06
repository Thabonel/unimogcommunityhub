import React from 'react';
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
  Star
} from 'lucide-react';
import { UnifiedWISResult } from '@/lib/unified-wis-search';

interface UnifiedResultCardProps {
  result: UnifiedWISResult;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onView: () => void;
}

export function UnifiedResultCard({ result, isExpanded, onToggleExpansion, onView }: UnifiedResultCardProps) {
  const getDocTypeIcon = (docType: string) => {
    switch (docType) {
      case 'procedure': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'part': return <Wrench className="w-5 h-5 text-green-500" />;
      case 'bulletin': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
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

  const hasRelatedContent = result.related_parts.length > 0 || 
                           result.related_procedures.length > 0 || 
                           result.related_bulletins.length > 0;

  return (
    <Card className="border-2 hover:border-blue-200 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
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
              
              <p className="text-gray-700 leading-relaxed">
                {result.content_summary}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {hasRelatedContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleExpansion}
                className="flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Related ({result.related_parts.length + result.related_procedures.length + result.related_bulletins.length})
                  </>
                )}
              </Button>
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={onView}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="w-4 h-4" />
              View Details
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
                      <div key={part.id} className="text-sm">
                        <div className="font-mono text-green-700">{part.part_number}</div>
                        <div className="text-green-600 truncate">{part.part_name}</div>
                      </div>
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
                      <div key={proc.id} className="text-sm">
                        <div className="font-medium text-blue-700 truncate">{proc.title}</div>
                        <div className="text-blue-600 text-xs flex items-center gap-2">
                          {proc.estimated_time_minutes && (
                            <>
                              <Clock className="w-3 h-3" />
                              {proc.estimated_time_minutes} min
                            </>
                          )}
                        </div>
                      </div>
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
                      <div key={bulletin.id} className="text-sm">
                        <div className="font-medium text-orange-700 truncate">{bulletin.title}</div>
                        <div className="text-orange-600 text-xs flex items-center gap-2">
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
                      </div>
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