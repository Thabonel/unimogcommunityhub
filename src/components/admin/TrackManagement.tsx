import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Eye, EyeOff, Trash2, Search, MapPin, Filter,
  Globe, Lock, Calendar, User, Pencil
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Track {
  id: string;
  name: string;
  description?: string;
  source_type: string;
  is_public: boolean;
  visible: boolean;
  distance_km?: number;
  elevation_gain?: number;
  created_at: string;
  created_by: string;
  metadata?: any;
}

export default function TrackManagement() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [publicFilter, setPublicFilter] = useState('all');
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    distance_km: 0,
    elevation_gain: 0,
  });

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    filterTracks();
  }, [tracks, searchQuery, visibilityFilter, publicFilter]);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast.error('Failed to load tracks');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTracks = () => {
    let filtered = [...tracks];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(track =>
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Visibility filter
    if (visibilityFilter === 'visible') {
      filtered = filtered.filter(track => track.visible === true);
    } else if (visibilityFilter === 'hidden') {
      filtered = filtered.filter(track => track.visible === false);
    }

    // Public filter
    if (publicFilter === 'public') {
      filtered = filtered.filter(track => track.is_public === true);
    } else if (publicFilter === 'private') {
      filtered = filtered.filter(track => track.is_public === false);
    }

    setFilteredTracks(filtered);
  };

  const toggleVisibility = async (trackId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .update({ visible: !currentVisibility })
        .eq('id', trackId);

      if (error) throw error;

      setTracks(prev => prev.map(track =>
        track.id === trackId ? { ...track, visible: !currentVisibility } : track
      ));

      toast.success(`Track ${!currentVisibility ? 'shown' : 'hidden'}`);
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update track visibility');
    }
  };

  const togglePublic = async (trackId: string, currentPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .update({ is_public: !currentPublic })
        .eq('id', trackId);

      if (error) throw error;

      setTracks(prev => prev.map(track =>
        track.id === trackId ? { ...track, is_public: !currentPublic } : track
      ));

      toast.success(`Track made ${!currentPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Error toggling public status:', error);
      toast.error('Failed to update track public status');
    }
  };

  const deleteTrack = async (trackId: string, trackName: string) => {
    if (!confirm(`Are you sure you want to delete "${trackName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      setTracks(prev => prev.filter(track => track.id !== trackId));
      setSelectedTracks(prev => {
        const newSet = new Set(prev);
        newSet.delete(trackId);
        return newSet;
      });
      toast.success(`Deleted "${trackName}"`);
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
    }
  };

  const toggleSelectAll = () => {
    if (selectedTracks.size === filteredTracks.length) {
      setSelectedTracks(new Set());
    } else {
      setSelectedTracks(new Set(filteredTracks.map(track => track.id)));
    }
  };

  const toggleSelectTrack = (trackId: string) => {
    setSelectedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const bulkToggleVisibility = async (visible: boolean) => {
    if (selectedTracks.size === 0) {
      toast.error('No tracks selected');
      return;
    }

    try {
      const { error } = await supabase
        .from('tracks')
        .update({ visible })
        .in('id', Array.from(selectedTracks));

      if (error) throw error;

      setTracks(prev => prev.map(track =>
        selectedTracks.has(track.id) ? { ...track, visible } : track
      ));

      toast.success(`${selectedTracks.size} track(s) ${visible ? 'shown' : 'hidden'}`);
      setSelectedTracks(new Set());
    } catch (error) {
      console.error('Error bulk updating visibility:', error);
      toast.error('Failed to update track visibility');
    }
  };

  const bulkTogglePublic = async (isPublic: boolean) => {
    if (selectedTracks.size === 0) {
      toast.error('No tracks selected');
      return;
    }

    try {
      const { error } = await supabase
        .from('tracks')
        .update({ is_public: isPublic })
        .in('id', Array.from(selectedTracks));

      if (error) throw error;

      setTracks(prev => prev.map(track =>
        selectedTracks.has(track.id) ? { ...track, is_public: isPublic } : track
      ));

      toast.success(`${selectedTracks.size} track(s) made ${isPublic ? 'public' : 'private'}`);
      setSelectedTracks(new Set());
    } catch (error) {
      console.error('Error bulk updating public status:', error);
      toast.error('Failed to update track public status');
    }
  };

  const bulkDelete = async () => {
    if (selectedTracks.size === 0) {
      toast.error('No tracks selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedTracks.size} track(s)? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .in('id', Array.from(selectedTracks));

      if (error) throw error;

      setTracks(prev => prev.filter(track => !selectedTracks.has(track.id)));
      toast.success(`Deleted ${selectedTracks.size} track(s)`);
      setSelectedTracks(new Set());
    } catch (error) {
      console.error('Error bulk deleting tracks:', error);
      toast.error('Failed to delete tracks');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDistance = (km?: number) => {
    if (!km) return 'N/A';
    return `${km.toFixed(1)} km`;
  };

  const openEditDialog = (track: Track) => {
    setEditingTrack(track);
    setEditFormData({
      name: track.name,
      description: track.description || '',
      distance_km: track.distance_km || 0,
      elevation_gain: track.elevation_gain || 0,
    });
  };

  const closeEditDialog = () => {
    setEditingTrack(null);
    setEditFormData({
      name: '',
      description: '',
      distance_km: 0,
      elevation_gain: 0,
    });
  };

  const saveTrackEdit = async () => {
    if (!editingTrack) return;

    try {
      const { error } = await supabase
        .from('tracks')
        .update({
          name: editFormData.name,
          description: editFormData.description || null,
          distance_km: editFormData.distance_km || null,
          elevation_gain: editFormData.elevation_gain || null,
        })
        .eq('id', editingTrack.id);

      if (error) throw error;

      setTracks(prev => prev.map(track =>
        track.id === editingTrack.id
          ? { ...track, ...editFormData }
          : track
      ));

      toast.success('Track updated successfully');
      closeEditDialog();
    } catch (error) {
      console.error('Error updating track:', error);
      toast.error('Failed to update track');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Track Management
          </CardTitle>
          <CardDescription>
            Manage uploaded tracks - toggle visibility, make public/private, or delete closed routes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tracks.length}</div>
            <p className="text-xs text-muted-foreground">Total Tracks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tracks.filter(t => t.visible).length}</div>
            <p className="text-xs text-muted-foreground">Visible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tracks.filter(t => t.is_public).length}</div>
            <p className="text-xs text-muted-foreground">Public</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tracks.filter(t => t.source_type === 'gpx_upload').length}</div>
            <p className="text-xs text-muted-foreground">Uploaded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tracks by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Visibility Filter */}
              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="visible">Visible Only</SelectItem>
                  <SelectItem value="hidden">Hidden Only</SelectItem>
                </SelectContent>
              </Select>

              {/* Public Filter */}
              <Select value={publicFilter} onValueChange={setPublicFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access</SelectItem>
                  <SelectItem value="public">Public Only</SelectItem>
                  <SelectItem value="private">Private Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedTracks.size > 0 && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedTracks.size} track(s) selected
                </span>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkToggleVisibility(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Show
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkToggleVisibility(false)}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkTogglePublic(true)}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Make Public
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkTogglePublic(false)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Make Private
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={bulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tracks Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading tracks...
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No tracks found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedTracks.size === filteredTracks.length && filteredTracks.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </TableHead>
                    <TableHead className="w-[300px]">Track Name</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTracks.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedTracks.has(track.id)}
                          onChange={() => toggleSelectTrack(track.id)}
                          className="h-4 w-4 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="flex items-center gap-2">
                            {track.name}
                            {!track.visible && (
                              <Badge variant="outline" className="text-xs">
                                Hidden
                              </Badge>
                            )}
                          </div>
                          {track.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                              {track.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDistance(track.distance_km)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {track.source_type === 'gpx_upload' ? 'Upload' : 'Planner'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {track.is_public ? (
                            <Badge variant="default" className="text-xs gap-1">
                              <Globe className="h-3 w-3" />
                              Public
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Lock className="h-3 w-3" />
                              Private
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(track.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(track)}
                            title="Edit track"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(track.id, track.visible)}
                            title={track.visible ? 'Hide track' : 'Show track'}
                          >
                            {track.visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublic(track.id, track.is_public)}
                            title={track.is_public ? 'Make private' : 'Make public'}
                          >
                            {track.is_public ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Globe className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTrack(track.id, track.name)}
                            className="text-destructive hover:text-destructive"
                            title="Delete track"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Track Dialog */}
      <Dialog open={!!editingTrack} onOpenChange={() => closeEditDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>
              Update track details. Changes will be saved to the database.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Track Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter track name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter track description (optional)"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-distance">Distance (km)</Label>
                <Input
                  id="edit-distance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editFormData.distance_km}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, distance_km: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-elevation">Elevation Gain (m)</Label>
                <Input
                  id="edit-elevation"
                  type="number"
                  step="1"
                  min="0"
                  value={editFormData.elevation_gain}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, elevation_gain: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={saveTrackEdit} disabled={!editFormData.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
