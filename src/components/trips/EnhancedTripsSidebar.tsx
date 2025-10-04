import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search, MapPin, Upload, Save, ChevronDown, ChevronRight, Trash2, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';
import { UserLocation } from '@/hooks/use-user-location';
import { parseGPX } from '@/utils/gpxParser';
import { saveTrack } from '@/services/trackService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { searchTrails } from '@/services/trailService';
import { TrackDetailModal } from './TrackDetailModal';

interface Track {
  id: string;
  name: string;
  type: 'uploaded' | 'saved' | 'community';
  visible: boolean;
  data?: any;
  startLocation?: { lat: number; lon: number };
  distance?: number;
  difficulty?: 'easy' | 'moderate' | 'hard';
  length?: number; // Track length in km
}

interface EnhancedTripsSidebarProps {
  userLocation: UserLocation | null;
  mapBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;
  tracks: Track[];
  isLoading: boolean;
  onTrackToggle: (trackId: string) => void;
  onTrackDelete?: (trackId: string) => void;
  onTrackSave?: (trackId: string) => void;
  onSearch?: (query: string) => void;
}

export const EnhancedTripsSidebar: React.FC<EnhancedTripsSidebarProps> = ({
  userLocation,
  mapBounds,
  tracks,
  isLoading,
  onTrackToggle,
  onTrackDelete,
  onTrackSave,
  onSearch
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    nearby: true,
    saved: true,
    searchResults: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSearchingTrails, setIsSearchingTrails] = useState(false);
  const [trailSearchResults, setTrailSearchResults] = useState<any[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<string>('200');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate distances and filter tracks
  const processedTracks = useMemo(() => {
    let processed = tracks.map(track => {
      if (userLocation && track.startLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          track.startLocation.lat,
          track.startLocation.lon
        );
        return { ...track, distance };
      }
      return track;
    });

    // Apply distance filter (only show tracks within selected radius)
    const maxDistance = parseInt(distanceFilter);
    if (userLocation && maxDistance > 0) {
      processed = processed.filter(track =>
        track.distance !== undefined && track.distance <= maxDistance
      );
    }

    // Apply search filter
    if (searchQuery) {
      processed = processed.filter(track =>
        track.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return processed;
  }, [tracks, userLocation, searchQuery, distanceFilter]);

  // Sort all tracks by distance (if available)
  const sortedTracks = useMemo(() => {
    return processedTracks
      .sort((a, b) => {
        // Sort by distance if both have it
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        // Tracks with distance come first
        if (a.distance !== undefined) return -1;
        if (b.distance !== undefined) return 1;
        // Otherwise sort by name
        return a.name.localeCompare(b.name);
      });
  }, [processedTracks]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Debounced OSM trail search
  const performTrailSearch = useCallback(async (query: string) => {
    if (!mapBounds || query.length < 3) {
      setTrailSearchResults([]);
      return;
    }

    setIsSearchingTrails(true);
    try {
      const { trails, error } = await searchTrails(query, mapBounds);
      if (error) {
        console.error('Trail search error:', error);
        toast.error('Failed to search trails');
        setTrailSearchResults([]);
      } else {
        setTrailSearchResults(trails || []);
      }
    } catch (err) {
      console.error('Trail search exception:', err);
      toast.error('Trail search failed');
      setTrailSearchResults([]);
    } finally {
      setIsSearchingTrails(false);
    }
  }, [mapBounds]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Call original onSearch for local filtering
    if (onSearch) {
      onSearch(query);
    }

    // Debounced OSM trail search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        performTrailSearch(query);
      }, 500); // 500ms debounce
    } else {
      setTrailSearchResults([]);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const validateTrackFile = (file: File): boolean => {
    // Validate file extension and type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.gpx') && !fileName.endsWith('.kml')) {
      toast.error('Please upload a valid GPX or KML file');
      return false;
    }

    // Validate file size (20MB limit for track files)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      toast.error(`Track file is too large (max 20MB). Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }

    // Check for empty files
    if (file.size === 0) {
      toast.error('Track file appears to be empty');
      return false;
    }

    // Additional security check for file type consistency
    const isGpx = fileName.endsWith('.gpx');
    const isKml = fileName.endsWith('.kml');

    if (isGpx && file.type && !file.type.includes('xml') && !file.type.includes('gpx')) {
      toast.error('GPX file type mismatch. Please ensure you have a valid GPX file.');
      return false;
    }

    if (isKml && file.type && !file.type.includes('xml') && !file.type.includes('kml')) {
      toast.error('KML file type mismatch. Please ensure you have a valid KML file.');
      return false;
    }

    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!validateTrackFile(file)) {
      // Clear the input on validation failure
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      // Read the file content
      const text = await file.text();

      // Parse the GPX/KML file
      const parsedTrack = parseGPX(text, file.name);

      if (!parsedTrack) {
        toast.error('Failed to parse GPX/KML file. Please check the file format.');
        return;
      }

      // Ensure user is authenticated
      if (!user?.id) {
        toast.error('You must be signed in to upload tracks.');
        return;
      }

      // Save the track to database
      const savedTrack = await saveTrack(parsedTrack, user.id);

      if (savedTrack) {
        toast.success(`Track "${parsedTrack.name}" uploaded successfully!`);
        // The track list should refresh automatically via the parent component's data fetching
      } else {
        toast.error('Failed to save track to database.');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTrackItem = (track: Track) => (
    <div
      key={track.id}
      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
        ${track.visible ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-muted/50'}`}
    >
      <Checkbox
        checked={track.visible}
        onCheckedChange={() => onTrackToggle(track.id)}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 flex-shrink-0"
      />
      <div
        className="flex-1 min-w-0 pr-2"
        onClick={() => setSelectedTrackId(track.id)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{track.name}</span>
          {track.difficulty && (
            <Badge variant="secondary" className={`text-xs ${getDifficultyColor(track.difficulty)} flex-shrink-0`}>
              {track.difficulty}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {track.distance !== undefined && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {formatDistance(track.distance)}
            </span>
          )}
          {track.length && (
            <span>Length: {typeof track.length === 'number' ? track.length.toFixed(2) : parseFloat(track.length).toFixed(2)}km</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {track.type === 'saved' && onTrackDelete && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onTrackDelete(track.id);
            }}
            title="Delete track"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    tracks: Track[],
    sectionKey: keyof typeof expandedSections,
    emptyMessage: string
  ) => (
    <div className="space-y-2">
      <button
        className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded"
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
          <Badge variant="secondary" className="text-xs">
            {tracks.length}
          </Badge>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="pl-2">
          {tracks.length > 0 ? (
            <div className="space-y-1">
              {tracks.map(renderTrackItem)}
              {sectionKey === 'saved' && (
                <div className="p-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="text-xs h-7 w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {isUploading ? 'Uploading...' : 'Upload GPX/KML'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              <p className="text-xs text-muted-foreground mb-2">{emptyMessage}</p>
              {sectionKey === 'saved' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="text-xs h-7"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {isUploading ? 'Uploading...' : 'Upload GPX/KML'}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-96 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg h-full flex flex-col">
      {/* Header with Search */}
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold">Track Management</h3>

        {/* Distance Filter - Always show */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={distanceFilter} onValueChange={setDistanceFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">Within 50 km</SelectItem>
              <SelectItem value="100">Within 100 km</SelectItem>
              <SelectItem value="200">Within 200 km</SelectItem>
              <SelectItem value="500">Within 500 km</SelectItem>
              <SelectItem value="1000">Within 1000 km</SelectItem>
              <SelectItem value="99999">Show all tracks</SelectItem>
            </SelectContent>
          </Select>
          {!userLocation && (
            <span className="text-xs text-muted-foreground">(Enable location to filter)</span>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tracks by name or location..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-8 text-sm"
          />
        </div>
      </div>

      {/* Tracks List */}
      <ScrollArea className="flex-1 px-4 py-2">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* All Tracks Section */}
            {sortedTracks.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">
                      {userLocation ? 'Tracks Near You' : 'All Tracks'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {sortedTracks.length}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  {sortedTracks.map(renderTrackItem)}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <p>No tracks found</p>
                <p className="text-xs mt-1">
                  {distanceFilter !== '99999'
                    ? 'Try increasing the distance filter or searching by name'
                    : 'Upload GPX/KML files in admin to add tracks'}
                </p>
              </div>
            )}

            {/* OSM Trail Search Results Section */}
            {searchQuery.length >= 3 && (
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('searchResults')}
                  className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-sm">Search Results</span>
                    {isSearchingTrails ? (
                      <span className="text-xs text-muted-foreground">Searching...</span>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {trailSearchResults.length}
                      </Badge>
                    )}
                  </div>
                  {expandedSections.searchResults ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.searchResults && (
                  <div className="pl-2 mt-2">
                    {isSearchingTrails ? (
                      <div className="space-y-2 p-2">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : trailSearchResults.length > 0 ? (
                      <div className="space-y-1">
                        {trailSearchResults.map((trail, index) => (
                          <div
                            key={`trail-${index}`}
                            className="p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{trail.name || 'Unnamed Trail'}</p>
                                {trail.distance && (
                                  <p className="text-xs text-muted-foreground">
                                    {(trail.distance / 1000).toFixed(1)} km
                                  </p>
                                )}
                                {trail.surface && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {trail.surface}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => {
                                  toast.info('Trail display coming soon');
                                }}
                              >
                                Show
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground p-2">
                        No trails found. Try a different search term or zoom to a different area.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          {tracks.filter(t => t.visible).length} of {tracks.length} tracks visible
        </p>
      </div>

      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".gpx,.kml"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Track Detail Modal */}
      <TrackDetailModal
        trackId={selectedTrackId}
        isOpen={selectedTrackId !== null}
        onClose={() => setSelectedTrackId(null)}
      />
    </div>
  );
};

export default EnhancedTripsSidebar;