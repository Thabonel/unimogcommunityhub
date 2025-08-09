import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Save, Share2, Mountain } from 'lucide-react';
import { Waypoint } from '@/types/waypoint';
import { DirectionsRoute } from '@/services/mapboxDirections';
import { formatDistance, formatDuration } from '@/services/mapboxDirections';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';

interface SaveRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  waypoints: Waypoint[];
  route: DirectionsRoute | null;
  routeProfile: 'driving' | 'walking' | 'cycling';
  onSave: (data: SaveRouteData) => Promise<void>;
}

export interface SaveRouteData {
  name: string;
  description: string;
  difficulty: string;
  isPublic: boolean;
  imageUrl?: string;
  notes?: string;
}

export function SaveRouteModal({
  isOpen,
  onClose,
  waypoints,
  route,
  routeProfile,
  onSave
}: SaveRouteModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState('moderate');
  const [isPublic, setIsPublic] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload images');
        return null;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to user-photos bucket
      const { data, error } = await supabase.storage
        .from('user-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a route name');
      return;
    }

    setIsSaving(true);
    
    try {
      let finalImageUrl = imageUrl;
      
      // Upload image if one was selected
      if (imageFile) {
        const uploadedUrl = await uploadImageToSupabase(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      await onSave({
        name: name.trim(),
        description: description.trim() || generateDescription(),
        difficulty,
        isPublic,
        imageUrl: finalImageUrl,
        notes: notes.trim()
      });

      // Reset form
      setName('');
      setDescription('');
      setNotes('');
      setDifficulty('moderate');
      setIsPublic(false);
      setImageUrl(undefined);
      setImageFile(null);
      
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save route');
    } finally {
      setIsSaving(false);
    }
  };

  const generateDescription = () => {
    if (waypoints.length < 2) return '';
    
    const start = waypoints[0].name || 'Start';
    const end = waypoints[waypoints.length - 1].name || 'End';
    const via = waypoints.length > 2 ? ` via ${waypoints.length - 2} waypoints` : '';
    const distance = route ? ` - ${formatDistance(route.distance)}` : '';
    const duration = route ? `, ${formatDuration(route.duration)}` : '';
    
    return `Route from ${start} to ${end}${via}${distance}${duration} (${routeProfile})`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Save className="mr-2 h-5 w-5" />
            Save Route
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Route Name */}
          <div className="space-y-2">
            <Label htmlFor="route-name">Route Name *</Label>
            <Input
              id="route-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mountain Trail Loop"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={generateDescription() || "Describe your route..."}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Notes/Warnings */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Warnings</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any important notes, warnings, or tips for this route..."
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="flex items-center">
              <Mountain className="mr-2 h-4 w-4" />
              Difficulty Level
            </Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy - Suitable for beginners</SelectItem>
                <SelectItem value="moderate">Moderate - Some experience needed</SelectItem>
                <SelectItem value="difficult">Difficult - Experienced drivers only</SelectItem>
                <SelectItem value="extreme">Extreme - Expert level required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Route Image */}
          <div className="space-y-2">
            <Label htmlFor="route-image">Route Image (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="route-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Route preview"
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Public Sharing */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-sharing" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share with Community
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow other users to see and use this route
              </p>
            </div>
            <Switch
              id="public-sharing"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {/* Route Summary */}
          {route && (
            <div className="bg-muted rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium">Route Summary</p>
              <div className="text-sm text-muted-foreground">
                <p>Distance: {formatDistance(route.distance)}</p>
                <p>Estimated Time: {formatDuration(route.duration)}</p>
                <p>Waypoints: {waypoints.length}</p>
                <p>Travel Mode: {routeProfile}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isUploading || !name.trim()}
          >
            {isSaving ? 'Saving...' : 'Save Route'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}