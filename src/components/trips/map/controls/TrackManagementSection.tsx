
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Route, Upload, Trash2, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { parseGPX, parseKML } from '@/utils/gpxParser';
import { saveTrack, fetchUserTracks, deleteTrack, updateTrackVisibility } from '@/services/trackService';
import { useAuth } from '@/contexts/AuthContext';

interface Track {
  id: string;
  name: string;
  visible: boolean;
  data: any;
  saved?: boolean;
}

interface TrackManagementSectionProps {
  expanded: boolean;
  onToggleExpand: () => void;
  onTracksChange?: (tracks: Track[]) => void;
}

const TrackManagementSection = ({
  expanded,
  onToggleExpand,
  onTracksChange
}: TrackManagementSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load user's saved tracks on mount
  useEffect(() => {
    if (user && expanded) {
      loadUserTracks();
    }
  }, [user, expanded]);

  const loadUserTracks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userTracks = await fetchUserTracks(user.id);
      const formattedTracks = userTracks.map(track => ({
        id: track.id,
        name: track.name,
        visible: track.visible,
        data: track.segments,
        saved: true
      }));
      setTracks(formattedTracks);
      
      if (onTracksChange) {
        onTracksChange(formattedTracks);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['.gpx', '.kml'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      toast.error('Please upload a GPX or KML file');
      return;
    }

    setUploading(true);
    
    try {
      const text = await file.text();
      
      // Parse the file based on type
      let parsedTrack = null;
      if (fileExtension === '.gpx') {
        parsedTrack = parseGPX(text);
      } else if (fileExtension === '.kml') {
        parsedTrack = parseKML(text);
      }
      
      if (!parsedTrack) {
        toast.error('Failed to parse track file');
        return;
      }
      
      // If user is logged in, save to database
      if (user) {
        const savedTrack = await saveTrack(parsedTrack, user.id);
        if (savedTrack) {
          const newTrack: Track = {
            id: savedTrack.id,
            name: savedTrack.name,
            visible: savedTrack.visible,
            data: savedTrack.segments,
            saved: true
          };
          
          const updatedTracks = [...tracks, newTrack];
          setTracks(updatedTracks);
          
          if (onTracksChange) {
            onTracksChange(updatedTracks.map(t => ({
              ...t,
              type: t.saved ? 'saved' : 'uploaded',
              startLocation: t.data?.points?.[0] ? {
                lat: t.data.points[0].lat,
                lon: t.data.points[0].lon
              } : undefined,
              length: t.data?.totalDistance || savedTrack.distance_km
            })));
          }
          
          toast.success(`Track saved: ${parsedTrack.name} (${parsedTrack.totalDistance.toFixed(1)} km)`);
        }
      } else {
        // If not logged in, keep in local state only
        const newTrack: Track = {
          id: `track-${Date.now()}`,
          name: parsedTrack.name || file.name.replace(/\.[^/.]+$/, ""),
          visible: true,
          data: parsedTrack,
          saved: false
        };
        
        const updatedTracks = [...tracks, newTrack];
        setTracks(updatedTracks);
        
        if (onTracksChange) {
          onTracksChange(updatedTracks.map(t => ({
            ...t,
            type: 'uploaded',
            startLocation: t.data?.points?.[0] ? {
              lat: t.data.points[0].lat,
              lon: t.data.points[0].lon
            } : undefined,
            length: t.data?.totalDistance
          })));
        }
        
        toast.info('Track imported locally. Sign in to save permanently.');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read file');
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toggleTrackVisibility = (trackId: string) => {
    const updatedTracks = tracks.map(track => 
      track.id === trackId ? { ...track, visible: !track.visible } : track
    );
    setTracks(updatedTracks);
    
    if (onTracksChange) {
      onTracksChange(updatedTracks);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    // If it's a saved track and user is logged in, delete from database
    if (track.saved && user) {
      const success = await deleteTrack(trackId, user.id);
      if (!success) return;
    }
    
    const updatedTracks = tracks.filter(t => t.id !== trackId);
    setTracks(updatedTracks);
    
    if (onTracksChange) {
      onTracksChange(updatedTracks);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        className="w-full justify-start px-2 py-1 h-auto text-sm"
        onClick={onToggleExpand}
      >
        <Route className="h-4 w-4 mr-2" />
        Track Management
      </Button>
      
      {expanded && (
        <div className="ml-6 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".gpx,.kml"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            <Upload className="h-3 w-3 mr-1" />
            {uploading ? 'Uploading...' : 'Upload GPX/KML'}
          </Button>
          
          {tracks.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No tracks uploaded yet. Upload a track to display it on the map.
            </p>
          ) : (
            <div className="space-y-1">
              {tracks.map(track => (
                <div key={track.id} className="flex items-center gap-2 p-1 rounded hover:bg-muted/50">
                  <Checkbox
                    checked={track.visible}
                    onCheckedChange={() => toggleTrackVisibility(track.id)}
                    className="h-3 w-3"
                  />
                  <span className="text-xs flex-1 truncate">{track.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0"
                    onClick={() => handleDeleteTrack(track.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackManagementSection;
