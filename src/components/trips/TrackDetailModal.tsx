import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MapPin,
  Ruler,
  TrendingUp,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CompatibilityReportForm } from './CompatibilityReportForm';

interface TrackDetailModalProps {
  trackId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Track {
  id: string;
  name: string;
  description?: string;
  distance_km: number;
  elevation_gain?: number;
  difficulty: string;
  is_public: boolean;
  visible: boolean;
  created_at: string;
  min_track_width_m?: number;
  min_width_location?: string;
  min_overhead_clearance_m?: number;
  min_clearance_location?: string;
  low_branches?: boolean;
  max_wheelbase_m?: number;
  tight_turns?: boolean;
  min_ground_clearance_cm?: number;
  suitable_for_short_wb?: boolean;
  suitable_for_long_wb?: boolean;
  suitable_for_expedition?: boolean;
}

interface CompatibilityReport {
  id: string;
  user_id: string;
  unimog_model: string;
  wheelbase_cm: number;
  total_height_cm: number;
  total_width_cm?: number;
  body_type?: string;
  camper_manufacturer?: string;
  successfully_completed: boolean;
  width_tight?: boolean;
  width_issue_location?: string;
  height_tight?: boolean;
  height_issue_location?: string;
  wheelbase_issue?: boolean;
  turning_issue_location?: string;
  notes?: string;
  driven_date: string;
  weather_conditions?: string;
  helpful_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export function TrackDetailModal({ trackId, isOpen, onClose }: TrackDetailModalProps) {
  const { user } = useAuth();
  const [track, setTrack] = useState<Track | null>(null);
  const [reports, setReports] = useState<CompatibilityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    if (trackId && isOpen) {
      fetchTrackDetails();
      fetchCompatibilityReports();
    }
  }, [trackId, isOpen]);

  const fetchTrackDetails = async () => {
    if (!trackId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', trackId)
        .single();

      if (error) throw error;
      setTrack(data);
    } catch (error) {
      console.error('Error fetching track:', error);
      toast.error('Failed to load track details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompatibilityReports = async () => {
    if (!trackId) return;

    try {
      const { data, error } = await supabase
        .from('unimog_compatibility_reports')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq('track_id', trackId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching compatibility reports:', error);
    }
  };

  const handleVote = async (reportId: string, voteType: 'helpful' | 'not_helpful') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('track_contribution_votes')
        .select('*')
        .eq('contribution_id', reportId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        await supabase
          .from('track_contribution_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
      } else {
        // Insert new vote
        await supabase
          .from('track_contribution_votes')
          .insert({
            contribution_id: reportId,
            user_id: user.id,
            vote_type: voteType,
          });
      }

      // Update helpful count
      const helpfulVotes = await supabase
        .from('track_contribution_votes')
        .select('*')
        .eq('contribution_id', reportId)
        .eq('vote_type', 'helpful');

      await supabase
        .from('unimog_compatibility_reports')
        .update({ helpful_count: helpfulVotes.data?.length || 0 })
        .eq('id', reportId);

      fetchCompatibilityReports();
      toast.success('Vote recorded');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {track?.name || 'Loading...'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading track details...</div>
            </div>
          ) : track ? (
            <div className="space-y-6 pr-4">
              {/* Track Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Length</div>
                      <div className="text-lg font-semibold">{track.distance_km.toFixed(2)} km</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Difficulty</div>
                      <Badge variant="secondary" className="mt-1">
                        {track.difficulty}
                      </Badge>
                    </div>
                    {track.elevation_gain && (
                      <div>
                        <div className="text-sm text-muted-foreground">Elevation Gain</div>
                        <div className="text-lg font-semibold flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {Math.round(track.elevation_gain)}m
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">Reports</div>
                      <div className="text-lg font-semibold">{reports.length}</div>
                    </div>
                  </div>

                  {track.description && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground mb-1">Description</div>
                      <p className="text-sm">{track.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Unimog Compatibility */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Unimog Compatibility
                    </h3>
                  </div>

                  {reports.length > 0 ? (
                    <div className="space-y-2">
                      {track.suitable_for_short_wb && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Suitable for short wheelbase Unimogs</span>
                        </div>
                      )}
                      {track.suitable_for_long_wb && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Suitable for long wheelbase Unimogs</span>
                        </div>
                      )}
                      {track.suitable_for_expedition && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Suitable for expedition campers</span>
                        </div>
                      )}

                      {track.min_track_width_m && (
                        <div className="flex items-center gap-2 text-sm mt-4">
                          <Ruler className="h-4 w-4 text-muted-foreground" />
                          <span>Min width: {track.min_track_width_m}m</span>
                          {track.min_width_location && (
                            <span className="text-muted-foreground">({track.min_width_location})</span>
                          )}
                        </div>
                      )}

                      {track.min_overhead_clearance_m && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-muted-foreground rotate-90" />
                          <span>Min overhead: {track.min_overhead_clearance_m}m</span>
                          {track.min_clearance_location && (
                            <span className="text-muted-foreground">({track.min_clearance_location})</span>
                          )}
                        </div>
                      )}

                      {track.low_branches && (
                        <div className="flex items-center gap-2 text-sm text-yellow-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Low branches reported</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No compatibility reports yet. Be the first to share your experience!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Community Reports */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Community Reports ({reports.length})</h3>
                  <Button onClick={() => setShowReportForm(true)} size="sm">
                    Add Your Experience
                  </Button>
                </div>

                {reports.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No reports yet. Share your experience to help other Unimog owners!
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <Card key={report.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium">
                                {report.profiles?.full_name || 'Anonymous'}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {formatDate(report.created_at)}
                              </div>
                            </div>
                            <div className="text-right">
                              {report.successfully_completed ? (
                                <Badge variant="default" className="gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Completed
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="gap-1">
                                  <XCircle className="h-3 w-3" />
                                  Turned Back
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{report.unimog_model}</span>
                              {report.body_type && <span className="text-muted-foreground">• {report.body_type}</span>}
                              {report.camper_manufacturer && (
                                <span className="text-muted-foreground">({report.camper_manufacturer})</span>
                              )}
                            </div>

                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>Height: {report.total_height_cm}cm</span>
                              <span>Wheelbase: {report.wheelbase_cm}cm</span>
                              {report.total_width_cm && <span>Width: {report.total_width_cm}cm</span>}
                            </div>

                            {(report.width_tight || report.height_tight || report.wheelbase_issue) && (
                              <div className="flex gap-2 flex-wrap mt-3">
                                {report.width_tight && (
                                  <Badge variant="outline" className="text-xs">
                                    Width: Tight
                                  </Badge>
                                )}
                                {report.height_tight && (
                                  <Badge variant="outline" className="text-xs">
                                    Height: Tight
                                  </Badge>
                                )}
                                {report.wheelbase_issue && (
                                  <Badge variant="outline" className="text-xs">
                                    Tight Turns
                                  </Badge>
                                )}
                              </div>
                            )}

                            {report.notes && (
                              <p className="mt-3 text-sm bg-muted/50 p-3 rounded">
                                "{report.notes}"
                              </p>
                            )}

                            {(report.width_issue_location || report.height_issue_location || report.turning_issue_location) && (
                              <div className="mt-3 space-y-1 text-xs">
                                {report.width_issue_location && (
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                                    <span>Width: {report.width_issue_location}</span>
                                  </div>
                                )}
                                {report.height_issue_location && (
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                                    <span>Height: {report.height_issue_location}</span>
                                  </div>
                                )}
                                {report.turning_issue_location && (
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                                    <span>Turning: {report.turning_issue_location}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(report.id, 'helpful')}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Helpful ({report.helpful_count})
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Track not found
            </div>
          )}
        </ScrollArea>
      </DialogContent>

      {showReportForm && trackId && (
        <CompatibilityReportForm
          trackId={trackId}
          trackName={track?.name || ''}
          isOpen={showReportForm}
          onClose={() => setShowReportForm(false)}
          onSuccess={() => {
            setShowReportForm(false);
            fetchCompatibilityReports();
            fetchTrackDetails();
          }}
        />
      )}
    </Dialog>
  );
}
