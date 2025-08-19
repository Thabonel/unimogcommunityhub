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
              placeholder="e.g., Hidden Waterfall"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="poi-description">Description</Label>
            <Textarea
              id="poi-description"
              placeholder="Add any helpful details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Coordinates Display */}
          {coordinates && (
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm">
                <span className="font-medium">Location:</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Lat: {coordinates[1].toFixed(6)}, Lng: {coordinates[0].toFixed(6)}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
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
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? 'Saving...' : 'Save POI'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}