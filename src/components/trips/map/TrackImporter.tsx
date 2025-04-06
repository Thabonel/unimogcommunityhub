
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseGpxFile } from './utils/tracks/parsers';
import { geoJsonToTrack } from './utils/tracks/converters';
import { exportTrackToGpx, saveTrackToDatabase } from './utils/tracks/exporters';
import { toast } from 'sonner';
import { Track } from '@/types/track';
import TrackComments from './TrackComments';
import TrackCommunity from './TrackCommunity';
import mapboxgl from 'mapbox-gl';
import { 
  Upload, 
  Download, 
  MessageSquare, 
  Save, 
  Users,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

export interface TrackImporterProps {
  onTrackImported?: (track: Track) => void;
  onImportError?: (error: string) => void;
  currentTrack?: Track | null;
  map?: mapboxgl.Map | null;
  tracks?: Track[];
}

const TrackImporter: React.FC<TrackImporterProps> = ({
  onTrackImported = () => {},
  onImportError = () => {},
  currentTrack,
  map,
  tracks = []
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('import');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [trackDescription, setTrackDescription] = useState('');
  const [trackDifficulty, setTrackDifficulty] = useState<string | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setSelectedFile(files[0]);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      onImportError('No file selected');
      return;
    }

    setIsImporting(true);

    try {
      // Read the file
      const fileContent = await selectedFile.text();
      
      // Parse the GPX file to GeoJSON
      const geoJson = parseGpxFile(fileContent);
      
      if (!geoJson) {
        onImportError('Failed to parse GPX file');
        setIsImporting(false);
        return;
      }
      
      // Convert GeoJSON to our Track format
      const track = geoJsonToTrack(geoJson, selectedFile.name);
      
      // Notify parent component
      onTrackImported(track);
      
      // Clear selected file
      setSelectedFile(null);
      toast.success('Track imported successfully');
    } catch (error) {
      console.error('Error importing track:', error);
      onImportError('Error importing track');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    if (!currentTrack) {
      toast.error('No track selected for export');
      return;
    }
    
    exportTrackToGpx(currentTrack);
  };

  const openSaveDialog = () => {
    if (!currentTrack) {
      toast.error('No track to save');
      return;
    }
    
    setTrackName(currentTrack.name);
    setTrackDescription(currentTrack.description || '');
    setTrackDifficulty(currentTrack.difficulty);
    setSaveDialogOpen(true);
  };

  const handleSaveTrack = async () => {
    if (!currentTrack) {
      toast.error('No track to save');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Create a copy of the track with updated metadata
      const trackToSave: Track = {
        ...currentTrack,
        name: trackName || currentTrack.name,
        description: trackDescription,
        is_public: isPublic,
        difficulty: trackDifficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined
      };
      
      const trackId = await saveTrackToDatabase(trackToSave);
      
      if (trackId) {
        // Update the current track with the new ID and metadata
        onTrackImported({
          ...trackToSave,
          id: trackId
        });
        
        toast.success('Track saved successfully');
        setSaveDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving track:', error);
      toast.error('Failed to save track');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommunityTrackSelect = (track: Track) => {
    onTrackImported(track);
    setActiveTab('track');
  };

  return (
    <div className="w-full max-w-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="track" disabled={!currentTrack}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Track
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="h-4 w-4 mr-2" />
            Community
          </TabsTrigger>
        </TabsList>
        
        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="gpx-file">GPX File</Label>
              <Input
                id="gpx-file"
                type="file"
                accept=".gpx"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Upload a GPX file to import a track
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={handleImport}
                disabled={!selectedFile || isImporting}
              >
                {isImporting ? 'Importing...' : 'Import Track'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={!currentTrack}
              >
                <Download className="h-4 w-4 mr-2" />
                Export GPX
              </Button>
            </div>
            
            {currentTrack && (
              <Button
                variant="secondary"
                onClick={openSaveDialog}
              >
                <Save className="h-4 w-4 mr-2" />
                Save to Community
              </Button>
            )}
          </div>
        </TabsContent>
        
        {/* Track Tab */}
        <TabsContent value="track">
          {currentTrack ? (
            <TrackComments trackId={currentTrack.id} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No track selected. Import or select a track first.
            </div>
          )}
        </TabsContent>
        
        {/* Community Tab */}
        <TabsContent value="community">
          <TrackCommunity onSelectTrack={handleCommunityTrackSelect} />
        </TabsContent>
      </Tabs>
      
      {/* Save Track Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Track to Community</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="track-name">Track Name</Label>
              <Input
                id="track-name"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="track-description">Description</Label>
              <Textarea
                id="track-description"
                value={trackDescription}
                onChange={(e) => setTrackDescription(e.target.value)}
                placeholder="Describe this track..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="track-difficulty">Difficulty</Label>
              <Select 
                value={trackDifficulty} 
                onValueChange={setTrackDifficulty}
              >
                <SelectTrigger id="track-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="is-public">Share with community</Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSaveTrack} 
              disabled={isSaving || !trackName.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Track'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackImporter;
