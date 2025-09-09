import React, { useState, useMemo } from 'react';
import { Search, MapPin, Upload, Save, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';
import { UserLocation } from '@/hooks/use-user-location';

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
  tracks: Track[];
  isLoading: boolean;
  onTrackToggle: (trackId: string) => void;
  onTrackDelete?: (trackId: string) => void;
  onTrackSave?: (trackId: string) => void;
  onSearch?: (query: string) => void;
}

export const EnhancedTripsSidebar: React.FC<EnhancedTripsSidebarProps> = ({
  userLocation,
  tracks,
  isLoading,
  onTrackToggle,
  onTrackDelete,
  onTrackSave,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    nearby: true,
    uploaded: true,
    saved: true
  });

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

    // Apply search filter
    if (searchQuery) {
      processed = processed.filter(track =>
        track.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return processed;
  }, [tracks, userLocation, searchQuery]);

  // Separate tracks by category
  const nearbyTracks = useMemo(() => {
    return processedTracks
      .filter(track => track.distance !== undefined && track.distance <= 50) // Within 50km
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5); // Show top 5 nearest
  }, [processedTracks]);

  const uploadedTracks = useMemo(() => {
    return processedTracks.filter(track => track.type === 'uploaded');
  }, [processedTracks]);

  const savedTracks = useMemo(() => {
    return processedTracks.filter(track => track.type === 'saved');
  }, [processedTracks]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
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
      onClick={() => onTrackToggle(track.id)}
    >
      <Checkbox
        checked={track.visible}
        onCheckedChange={() => onTrackToggle(track.id)}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{track.name}</span>
          {track.difficulty && (
            <Badge variant="secondary" className={`text-xs ${getDifficultyColor(track.difficulty)}`}>
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
            <span>Length: {track.length}km</span>
          )}
        </div>
      </div>
      {track.type === 'uploaded' && onTrackSave && (
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onTrackSave(track.id);
          }}
          title="Save as trip"
        >
          <Save className="h-3 w-3" />
        </Button>
      )}
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
            </div>
          ) : (
            <p className="text-xs text-muted-foreground p-2">{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg h-full flex flex-col">
      {/* Header with Search */}
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-3">Track Management</h3>
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
            {/* Nearby Tracks Section */}
            {userLocation && nearbyTracks.length > 0 && (
              renderSection(
                'Nearby Tracks',
                <MapPin className="h-4 w-4 text-blue-500" />,
                nearbyTracks,
                'nearby',
                'No tracks found nearby'
              )
            )}

            {/* Uploaded Tracks Section */}
            {renderSection(
              'Uploaded Tracks',
              <Upload className="h-4 w-4 text-orange-500" />,
              uploadedTracks,
              'uploaded',
              'No uploaded tracks. Upload GPX/KML files to get started.'
            )}

            {/* Saved Trips Section */}
            {renderSection(
              'Saved Trips',
              <Save className="h-4 w-4 text-green-500" />,
              savedTracks,
              'saved',
              'No saved trips yet. Create your first trip!'
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
    </div>
  );
};

export default EnhancedTripsSidebar;