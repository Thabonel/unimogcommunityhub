import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { POIType, POI_ICONS, savePOI } from '@/services/poiService';
import { toast } from 'sonner';

interface AddPOIModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: [number, number] | null;
  onSave: (poi: any) => void;
}

export function AddPOIModal({
  isOpen,
  onClose,
  coordinates,
  onSave
}: AddPOIModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<POIType>('other');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!coordinates) {
      toast.error('No coordinates selected');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a name for this point');
      return;
    }

    setIsSaving(true);
    
    try {
      const poi = await savePOI(
        coordinates,
        type,
        name.trim(),
        description.trim() || undefined
      );

      if (poi) {
        onSave(poi);
        
        // Reset form
        setName('');
        setType('other');
        setDescription('');
        
        onClose();
      }
    } catch (error) {
      console.error('Error saving POI:', error);
      toast.error('Failed to save point of interest');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setName('');
    setType('other');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Add Point of Interest
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* POI Type */}
          <div className="space-y-2">
            <Label htmlFor="poi-type">Type *</Label>
            <Select value={type} onValueChange={(value) => setType(value as POIType)}>
              <SelectTrigger id="poi-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Object.entries(POI_ICONS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">{config.icon}</span>
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* POI Name */}
          <div className="space-y-2">
            <Label htmlFor="poi-name">Name *</Label>
            <Input
              id="poi-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Hidden Water Spring"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="poi-description">Description / Notes</Label>
            <Textarea
              id="poi-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add helpful information about this location..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>

          {/* Coordinates Display */}
          {coordinates && (
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm font-medium mb-1">Location</p>
              <p className="text-sm text-muted-foreground font-mono">
                {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
              </p>
            </div>
          )}

          {/* Selected Type Preview */}
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Selected Type</p>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{POI_ICONS[type].icon}</span>
              <span className="text-sm">{POI_ICONS[type].label}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? 'Saving...' : 'Add POI'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}