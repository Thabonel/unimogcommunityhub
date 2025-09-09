import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Loader2,
  CheckCircle2,
  MessageSquare,
  Printer,
  Share2,
  Eye,
  ZoomIn,
  Play,
  Pause,
  RotateCcw,
  X
} from 'lucide-react';
import { WISSearchResult } from './WISProfessionalSearch';
import { supabase } from '@/lib/supabase-client';

interface WISProcedurePackProps {
  searchResult: WISSearchResult;
  onClose: () => void;
  onOpenInBarry?: (context: any) => void;
  className?: string;
}

interface ProcedureDetails {
  procedure_code: string;
  title: string;
  category: string;
  subcategory?: string;
  description?: string;
  content: string;
  difficulty_level?: number;
  estimated_time_minutes?: number;
  tools_required?: string[];
  materials_required?: string[];
  safety_warnings?: string[];
  steps?: any[];
  media?: MediaItem[];
}

interface MediaItem {
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart';
  bucket: string;
  file_name: string;
  description: string;
  signed_url?: string;
}

interface RelatedItem {
  type: 'part' | 'bulletin';
  id: string;
  ref: string;
  title: string;
  media_count: number;
}

interface StepProgress {
  [stepIndex: number]: boolean;
}

export function WISProcedurePack({ 
  searchResult, 
  onClose, 
  onOpenInBarry,
  className = "" 
}: WISProcedurePackProps) {
  const [details, setDetails] = useState<ProcedureDetails | null>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [relatedParts, setRelatedParts] = useState<RelatedItem[]>([]);
  const [relatedBulletins, setRelatedBulletins] = useState<RelatedItem[]>([]);
  const [stepProgress, setStepProgress] = useState<StepProgress>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchProcedureDetails();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [searchResult]);

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const fetchProcedureDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Load all chunks for this document
      const { data: chunksData, error: chunksError } = await supabase
        .from('wis_chunks')
        .select('*')
        .eq('doc_id', searchResult.doc_id)
        .order('chunk_index');

      if (chunksError) throw chunksError;
      setChunks(chunksData || []);

      // 2. Load procedure metadata if it's a procedure
      let procedureDetails: ProcedureDetails | null = null;
      
      if (searchResult.doc_type === 'procedure') {
        const { data: procData, error: procError } = await supabase
          .from('wis_procedures')
          .select('*')
          .eq('procedure_code', searchResult.ref)
          .single();

        if (procError) throw procError;
        
        // Resolve media URLs
        const mediaWithUrls = await resolveMediaUrls(procData.media || []);
        
        procedureDetails = {
          ...procData,
          content: chunksData?.map(chunk => chunk.content).join('\n\n') || procData.content,
          media: mediaWithUrls
        };
      }

      setDetails(procedureDetails);

      // 3. Find related parts (mentioned in content)
      const allContent = chunksData?.map(chunk => chunk.content).join(' ') || '';
      const partNumberPattern = /[A-Z]\d{3}[\s\-]\d{3}[\s\-]\d{2}[\s\-]\d{2}/g;
      const foundPartNumbers = allContent.match(partNumberPattern) || [];
      
      if (foundPartNumbers.length > 0) {
        const { data: partsData } = await supabase
          .from('wis_parts')
          .select('part_number, part_name, media')
          .in('part_number', foundPartNumbers.slice(0, 10));

        const relatedPartsData = (partsData || []).map(part => ({
          type: 'part' as const,
          id: part.part_number,
          ref: part.part_number,
          title: part.part_name,
          media_count: part.media ? part.media.length : 0
        }));

        setRelatedParts(relatedPartsData);
      }

      // 4. Find related bulletins (by title/category similarity)
      const { data: bulletinsData } = await supabase
        .from('wis_bulletins')
        .select('bulletin_number, title, media')
        .or(`title.ilike.%${searchResult.title}%,category.ilike.%${searchResult.title}%`)
        .limit(5);

      const relatedBulletinsData = (bulletinsData || []).map(bulletin => ({
        type: 'bulletin' as const,
        id: bulletin.bulletin_number,
        ref: bulletin.bulletin_number,
        title: bulletin.title,
        media_count: bulletin.media ? bulletin.media.length : 0
      }));

      setRelatedBulletins(relatedBulletinsData);

    } catch (err) {
      console.error('Error fetching procedure details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load procedure details');
    } finally {
      setLoading(false);
    }
  };

  const resolveMediaUrls = async (mediaItems: MediaItem[]): Promise<MediaItem[]> => {
    const resolvedMedia: MediaItem[] = [];
    
    for (const item of mediaItems) {
      try {
        const { data: signedUrl, error } = await supabase.rpc('wis_media_url', {
          bucket: item.bucket,
          file_name: item.file_name,
          expires_in: 3600
        });
        
        resolvedMedia.push({
          ...item,
          signed_url: error ? undefined : signedUrl
        });
      } catch (error) {
        console.warn(`Failed to get signed URL for ${item.file_name}:`, error);
        resolvedMedia.push(item);
      }
    }
    
    return resolvedMedia;
  };

  const handleStepComplete = (stepIndex: number) => {
    setStepProgress(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEstimatedTime = (minutes?: number) => {
    if (!minutes) return 'Not specified';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (level?: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (level?: number) => {
    switch (level) {
      case 1: return 'Basic';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      case 5: return 'Specialist';
      default: return 'Unknown';
    }
  };

  const completedSteps = Object.values(stepProgress).filter(Boolean).length;
  const totalSteps = details?.steps?.length || 0;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading procedure pack...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-2">Error loading procedure</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <Button variant="outline" onClick={fetchProcedureDetails} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">{details?.title || searchResult.title}</CardTitle>
                <Badge variant="outline" className="font-mono">
                  {searchResult.ref}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-blue-100 text-blue-800">
                  {details?.category || searchResult.doc_type}
                </Badge>
                {details?.subcategory && (
                  <Badge variant="outline">
                    {details.subcategory}
                  </Badge>
                )}
                {details?.difficulty_level && (
                  <Badge className={getDifficultyColor(details.difficulty_level)}>
                    {getDifficultyLabel(details.difficulty_level)}
                  </Badge>
                )}
              </div>

              {details?.description && (
                <p className="text-gray-700">{details.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              {onOpenInBarry && (
                <Button variant="outline" size="sm" onClick={() => onOpenInBarry(details)}>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Ask Barry
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress and Timer */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
                <div className="flex items-center gap-2">
                  {!isTimerRunning ? (
                    <Button size="sm" onClick={startTimer}>
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  ) : (
                    <Button size="sm" onClick={pauseTimer}>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-mono font-bold text-blue-600">
                      {formatTime(elapsedTime)}
                    </div>
                    {details?.estimated_time_minutes && (
                      <div className="text-sm text-gray-500">
                        Est. {formatEstimatedTime(details.estimated_time_minutes)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Completed</div>
                    <div className="text-lg font-semibold">
                      {completedSteps}/{totalSteps} steps
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Warnings */}
          {details?.safety_warnings && details.safety_warnings.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Safety Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.safety_warnings.map((warning, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 font-medium">{warning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step-by-Step Procedure */}
          {details?.steps && details.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step-by-Step Procedure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {details.steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`flex gap-4 p-4 rounded-lg border-2 transition-colors ${
                        stepProgress[index] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-start gap-3">
                        <Checkbox
                          checked={stepProgress[index] || false}
                          onCheckedChange={() => handleStepComplete(index)}
                          className="mt-1"
                        />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          stepProgress[index] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {stepProgress[index] ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="prose prose-sm max-w-none">
                          {typeof step === 'string' ? (
                            <p>{step}</p>
                          ) : (
                            <div>
                              {step.title && <h4 className="font-semibold mb-2">{step.title}</h4>}
                              <p>{step.text || step.description || JSON.stringify(step)}</p>
                              {step.notes && (
                                <div className="mt-2 text-sm text-gray-600 italic">
                                  Note: {step.notes}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Complete Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {details?.content || chunks.map(chunk => chunk.content).join('\n\n')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tools & Materials */}
          {(details?.tools_required?.length || details?.materials_required?.length) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {details?.tools_required && details.tools_required.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tools Required</h4>
                    <div className="flex flex-wrap gap-1">
                      {details.tools_required.map((tool, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {details?.materials_required && details.materials_required.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Materials Required</h4>
                    <div className="flex flex-wrap gap-1">
                      {details.materials_required.map((material, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-800">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Media Gallery */}
          {details?.media && details.media.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Media & Diagrams ({details.media.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {details.media.map((item, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium truncate">
                          {item.description}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-2 truncate">
                        {item.file_name}
                      </p>
                      
                      {item.signed_url ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">Media not available</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Parts */}
          {relatedParts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Related Parts ({relatedParts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {relatedParts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{part.title}</div>
                        <div className="text-xs text-gray-500 font-mono">{part.ref}</div>
                      </div>
                      {part.media_count > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {part.media_count} 📸
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Bulletins */}
          {relatedBulletins.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Related Bulletins ({relatedBulletins.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {relatedBulletins.map((bulletin) => (
                    <div key={bulletin.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{bulletin.title}</div>
                        <div className="text-xs text-gray-500 font-mono">{bulletin.ref}</div>
                      </div>
                      {bulletin.media_count > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {bulletin.media_count} 📸
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default WISProcedurePack;