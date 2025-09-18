import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Save, Share2, Mountain, Users, User, X } from 'lucide-react';
import { Waypoint } from '@/types/waypoint';
import { DirectionsRoute } from '@/services/mapboxDirections';
import { formatDistance, formatDuration } from '@/services/mapboxDirections';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  sharedWithUsers?: string[];
  sharedWithGroups?: string[];
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
  
  // Sharing state
  const [sharedWithUsers, setSharedWithUsers] = useState<string[]>([]);
  const [sharedWithGroups, setSharedWithGroups] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{id: string, name: string}[]>([]);
  const [availableGroups, setAvailableGroups] = useState<{id: string, name: string}[]>([]);
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [groupSearchOpen, setGroupSearchOpen] = useState(false);

  // Fetch available users and groups when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsersAndGroups();
    }
  }, [isOpen]);

  const fetchAvailableUsersAndGroups = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all users except current user
      const { data: users } = await supabase
        .from('profiles')
        .select('id, display_name')
        .neq('id', user.id)
        .order('display_name');

      if (users) {
        setAvailableUsers(users.map(u => ({ id: u.id, name: u.display_name || 'Unknown User' })));
      }

      // Fetch groups the user is a member of
      const { data: groups } = await supabase
        .from('community_groups')
        .select(`
          id,
          name,
          group_members!inner(user_id)
        `)
        .eq('group_members.user_id', user.id)
        .order('name');

      if (groups) {
        setAvailableGroups(groups.map(g => ({ id: g.id, name: g.name })));
      }
    } catch (error) {
      console.error('Error fetching users and groups:', error);
    }
  };

  const toggleUserShare = (userId: string) => {
    setSharedWithUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleGroupShare = (groupId: string) => {
    setSharedWithGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const removeUserShare = (userId: string) => {
    setSharedWithUsers(prev => prev.filter(id => id !== userId));
  };

  const removeGroupShare = (groupId: string) => {
    setSharedWithGroups(prev => prev.filter(id => id !== groupId));
  };

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

    console.log('🚀 Starting save process for route:', name.trim());
    setIsSaving(true);

    try {
      let uploadedImageUrl: string | undefined = undefined;

      // Upload image if selected
      if (imageFile) {
        console.log('📸 Uploading image...');
        const url = await uploadImageToSupabase(imageFile);
        if (url) {
          uploadedImageUrl = url;
          console.log('✅ Image uploaded successfully:', url);
        } else {
          console.warn('⚠️ Image upload failed, continuing without image');
        }
      }

      const saveData = {
        name: name.trim(),
        description: description.trim(),
        difficulty,
        isPublic,
        imageUrl: uploadedImageUrl,
        notes: notes.trim(),
        sharedWithUsers: sharedWithUsers.length > 0 ? sharedWithUsers : undefined,
        sharedWithGroups: sharedWithGroups.length > 0 ? sharedWithGroups : undefined
      };

      console.log('💾 Calling onSave with data:', saveData);

      // Save route with metadata
      await onSave(saveData);

      console.log('✅ Save completed successfully');

      // Reset form
      setName('');
      setDescription('');
      setNotes('');
      setDifficulty('moderate');
      setIsPublic(false);
      setImageUrl(undefined);
      setImageFile(null);
      setSharedWithUsers([]);
      setSharedWithGroups([]);

      onClose();
    } catch (error) {
      console.error('❌ Save error in modal:', error);
      
      // More detailed error handling
      if (error instanceof Error) {
        toast.error(`Failed to save route: ${error.message}`);
      } else {
        toast.error('Failed to save route - unknown error');
      }
    } finally {
      console.log('🏁 Resetting saving state');
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setName('');
      setDescription('');
      setNotes('');
      setDifficulty('moderate');
      setIsPublic(false);
      setImageUrl(undefined);
      setImageFile(null);
      setSharedWithUsers([]);
      setSharedWithGroups([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center">
            <Save className="mr-2 h-5 w-5" />
            Save Route
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto min-h-0 pr-4">
          <div className="space-y-4 py-4 pb-6">
          {/* Route Info Display */}
          {route && (
            <div className="bg-muted rounded-lg p-3 space-y-1">
              <div className="text-sm">
                <span className="font-medium">Distance:</span> {formatDistance(route.distance)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Duration:</span> {formatDuration(route.duration)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Waypoints:</span> {waypoints.length}
              </div>
              <div className="text-sm">
                <span className="font-medium">Mode:</span> {routeProfile}
              </div>
            </div>
          )}

          {/* Route Name */}
          <div className="space-y-2">
            <Label htmlFor="route-name">Route Name *</Label>
            <Input
              id="route-name"
              placeholder="e.g., Morning Trail Run"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="route-description">Description</Label>
            <Textarea
              id="route-description"
              placeholder="Describe your route..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Notes/Warnings */}
          <div className="space-y-2">
            <Label htmlFor="route-notes">Notes & Warnings</Label>
            <Textarea
              id="route-notes"
              placeholder="Any important notes, warnings, or tips for this route..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="route-difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="route-difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    Easy
                  </span>
                </SelectItem>
                <SelectItem value="moderate">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                    Moderate
                  </span>
                </SelectItem>
                <SelectItem value="hard">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    Hard
                  </span>
                </SelectItem>
                <SelectItem value="expert">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                    Expert
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="route-image">Route Photo</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="route-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="flex-1"
              />
              {imageUrl && (
                <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                  <img src={imageUrl} alt="Route preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Public Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="route-public">Share with Community</Label>
              <div className="text-sm text-muted-foreground">
                Make this route visible to all users
              </div>
            </div>
            <Switch
              id="route-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="flex-shrink-0"
            />
          </div>

          {/* Share with specific users */}
          <div className="space-y-2">
            <Label>Share with Users</Label>
            <div className="space-y-2">
              <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Select users to share with...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {availableUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            toggleUserShare(user.id);
                            setUserSearchOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {sharedWithUsers.includes(user.id) && (
                              <span className="mr-2">✓</span>
                            )}
                            {user.name}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {sharedWithUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sharedWithUsers.map(userId => {
                    const user = availableUsers.find(u => u.id === userId);
                    return user ? (
                      <Badge key={userId} variant="secondary">
                        {user.name}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => removeUserShare(userId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Share with groups */}
          <div className="space-y-2">
            <Label>Share with Groups</Label>
            <div className="space-y-2">
              <Popover open={groupSearchOpen} onOpenChange={setGroupSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Select groups to share with...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search groups..." />
                    <CommandEmpty>No groups found. Join a group first!</CommandEmpty>
                    <CommandGroup>
                      {availableGroups.map((group) => (
                        <CommandItem
                          key={group.id}
                          onSelect={() => {
                            toggleGroupShare(group.id);
                            setGroupSearchOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {sharedWithGroups.includes(group.id) && (
                              <span className="mr-2">✓</span>
                            )}
                            {group.name}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {sharedWithGroups.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sharedWithGroups.map(groupId => {
                    const group = availableGroups.find(g => g.id === groupId);
                    return group ? (
                      <Badge key={groupId} variant="secondary">
                        {group.name}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => removeGroupShare(groupId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading || !name.trim()}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Route
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}