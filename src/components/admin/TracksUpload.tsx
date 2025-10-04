import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, FileUp, Check, X, Loader2 } from 'lucide-react';
import { parseGPXFile } from '@/utils/gpxUtils';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface UploadedTrack {
  file: File;
  name: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export default function TracksUpload() {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [trackDescription, setTrackDescription] = useState('');
  const [makePublic, setMakePublic] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks: UploadedTrack[] = Array.from(files).map(file => ({
      file,
      name: file.name.replace(/\.(gpx|kml)$/i, ''),
      status: 'pending'
    }));

    setTracks(prev => [...prev, ...newTracks]);
    toast.success(`${files.length} file(s) selected`);
  };

  const processAndUploadTrack = async (track: UploadedTrack) => {
    try {
      // Update status to processing
      setTracks(prev => prev.map(t =>
        t.file === track.file ? { ...t, status: 'processing' } : t
      ));

      // Detect file type and parse accordingly
      const fileName = track.file.name.toLowerCase();
      const isKML = fileName.endsWith('.kml') || fileName.endsWith('.kmz');

      let parseResult;

      if (isKML) {
        // Parse KML using toGeoJSON
        const text = await track.file.text();
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(text, 'text/xml');

        // Import toGeoJSON dynamically
        const { kml } = await import('@tmcw/togeojson');
        const geoJSON = kml(kmlDoc);

        // Helper function to calculate distance using Haversine formula
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
          const R = 6371000; // Earth's radius in meters
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        // Convert GeoJSON to our track format
        parseResult = {
          tracks: geoJSON.features
            .filter((f: any) => f.geometry.type === 'LineString')
            .map((feature: any, index: number) => {
              const trackPoints = feature.geometry.coordinates.map((coord: any) => ({
                lon: coord[0],
                lat: coord[1],
                elevation: coord[2],
              }));

              // Calculate total distance
              let totalDistance = 0;
              for (let i = 1; i < trackPoints.length; i++) {
                const prev = trackPoints[i - 1];
                const curr = trackPoints[i];
                totalDistance += calculateDistance(prev.lat, prev.lon, curr.lat, curr.lon);
              }

              return {
                id: `kml-track-${index}`,
                name: feature.properties?.name || `Track ${index + 1}`,
                description: feature.properties?.description,
                distance: totalDistance,
                elevation: { min: 0, max: 0, gain: 0, loss: 0 },
                waypoints: [],
                trackPoints,
                bounds: { north: 0, south: 0, east: 0, west: 0 },
                metadata: {},
              };
            }),
          waypoints: [],
          routes: [],
          metadata: {}
        };
      } else {
        // Parse GPX file
        parseResult = await parseGPXFile(track.file);
      }

      if (!parseResult.tracks || parseResult.tracks.length === 0) {
        throw new Error('No tracks found in file');
      }

      // Process ALL tracks from the file (not just the first one)
      const savedTracks = [];
      for (const gpxTrack of parseResult.tracks) {

        // Prepare track data for database
        // Use individual track name if available, otherwise use custom name or filename
        const individualTrackName = gpxTrack.name && gpxTrack.name !== 'Unnamed Track'
          ? gpxTrack.name
          : (trackName || track.name || 'Unnamed Track');

        const trackData = {
          name: individualTrackName,
          description: trackDescription || gpxTrack.description || `Uploaded from ${track.file.name}`,
          source_type: 'gpx_upload',
          segments: {
            points: gpxTrack.trackPoints.map((pt: any) => ({
              lat: pt.lat,
              lon: pt.lon,
              ele: pt.elevation,
              time: pt.time
            })),
            bounds: gpxTrack.bounds
          },
          created_by: user?.id,
          is_public: makePublic,
          visible: true,
          distance_km: gpxTrack.distance / 1000, // Convert meters to km
          elevation_gain: gpxTrack.elevation.gain,
          difficulty: 'moderate',
          metadata: {
            ...gpxTrack.metadata,
            waypoints_count: gpxTrack.waypoints?.length || 0,
            points_count: gpxTrack.trackPoints.length,
            source_file: track.file.name
          }
        };

        // Insert into tracks table
        const { data, error } = await supabase
          .from('tracks')
          .insert(trackData)
          .select()
          .single();

        if (error) throw error;

        savedTracks.push(data);
      }

      // Update status to success
      setTracks(prev => prev.map(t =>
        t.file === track.file ? { ...t, status: 'success' } : t
      ));

      return savedTracks;
    } catch (error: any) {
      console.error('Track upload error:', error);

      // Update status to error
      setTracks(prev => prev.map(t =>
        t.file === track.file ? { ...t, status: 'error', error: error.message } : t
      ));

      throw error;
    }
  };

  const handleUploadAll = async () => {
    if (!user) {
      toast.error('You must be logged in to upload tracks');
      return;
    }

    const pendingTracks = tracks.filter(t => t.status === 'pending');

    if (pendingTracks.length === 0) {
      toast.error('No tracks to upload');
      return;
    }

    setIsUploading(true);

    try {
      let totalTracksCreated = 0;
      let errorCount = 0;

      for (const track of pendingTracks) {
        try {
          const savedTracks = await processAndUploadTrack(track);
          // Count how many individual tracks were created from this file
          totalTracksCreated += Array.isArray(savedTracks) ? savedTracks.length : 1;
        } catch (error) {
          errorCount++;
        }
      }

      if (totalTracksCreated > 0) {
        toast.success(`Successfully uploaded ${totalTracksCreated} track(s) from ${pendingTracks.length} file(s)`);
      }

      if (errorCount > 0) {
        toast.error(`Failed to upload ${errorCount} file(s)`);
      }

      // Clear form fields after successful upload
      if (errorCount === 0) {
        setTrackName('');
        setTrackDescription('');
        setMakePublic(false);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removeTrack = (file: File) => {
    setTracks(prev => prev.filter(t => t.file !== file));
  };

  const clearAll = () => {
    setTracks([]);
    setTrackName('');
    setTrackDescription('');
    toast.success('All tracks cleared');
  };

  const getStatusIcon = (status: UploadedTrack['status']) => {
    switch (status) {
      case 'pending':
        return <FileUp className="h-4 w-4 text-gray-400" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: UploadedTrack['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100';
      case 'processing':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Tracks
          </CardTitle>
          <CardDescription>
            Upload GPX or KML files to add tracks to the database. These will be available for users to search and load in the trip planner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="track-files">Select Files (GPX, KML)</Label>
            <Input
              id="track-files"
              type="file"
              accept=".gpx,.kml"
              multiple
              onChange={handleFileSelect}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can select multiple files at once
            </p>
          </div>

          {/* Track Metadata */}
          {tracks.length > 0 && (
            <>
              <div>
                <Label htmlFor="track-name">Track Name (optional)</Label>
                <Input
                  id="track-name"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  placeholder="Leave empty to use filename"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="track-description">Description (optional)</Label>
                <Textarea
                  id="track-description"
                  value={trackDescription}
                  onChange={(e) => setTrackDescription(e.target.value)}
                  placeholder="Add a description for this track"
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="make-public"
                  checked={makePublic}
                  onChange={(e) => setMakePublic(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="make-public" className="cursor-pointer">
                  Make track publicly visible
                </Label>
              </div>
            </>
          )}

          {/* Track List */}
          {tracks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selected Tracks ({tracks.length})</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
              </div>

              <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
                {tracks.map((track, index) => (
                  <div
                    key={index}
                    className={`p-3 flex items-center justify-between ${getStatusColor(track.status)}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getStatusIcon(track.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.file.name} ({(track.file.size / 1024).toFixed(1)} KB)
                        </p>
                        {track.error && (
                          <p className="text-xs text-red-600 mt-1">{track.error}</p>
                        )}
                      </div>
                    </div>

                    {track.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTrack(track.file)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          {tracks.length > 0 && (
            <div className="flex gap-3">
              <Button
                onClick={handleUploadAll}
                disabled={isUploading || tracks.every(t => t.status !== 'pending')}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {tracks.filter(t => t.status === 'pending').length} Track(s)
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Select one or more GPX/KML files from your computer</p>
          <p>2. Optionally add a custom name and description (applies to all files)</p>
          <p>3. Choose whether to make tracks public (visible to all users)</p>
          <p>4. Click "Upload" to process and save tracks to the database</p>
          <p className="pt-2 text-xs">
            <strong>Note:</strong> Each file will be parsed and stored in the tracks table.
            Users will be able to search and load these tracks in the trip planner.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
