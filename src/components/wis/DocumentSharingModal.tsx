import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Share2,
  FileSpreadsheet,
  Presentation,
  FileText,
  CheckSquare,
  Settings,
  X,
  Upload,
  Check,
  AlertCircle,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

interface DocumentSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData?: {
    title: string;
    filename: string;
    documentType: 'powerpoint' | 'excel' | 'pdf' | 'checklist' | 'procedure';
    vehicleModel?: string;
    originalQuery?: string;
    generationMethod?: string;
    fileContent?: string; // Base64 encoded file
  } | null;
}

const DocumentTypeIcons = {
  powerpoint: Presentation,
  excel: FileSpreadsheet,
  pdf: FileText,
  checklist: CheckSquare,
  procedure: FileText,
};

const VEHICLE_MODELS = [
  'U1700L', 'U1300L', 'U5000', 'U4000', 'U2400', 'U1450L', 'U1550L', 'U2150L'
];

const CATEGORIES = [
  'maintenance', 'repair', 'procedures', 'parts', 'hydraulics', 'engine',
  'transmission', 'electrical', 'brakes', 'suspension', 'documentation',
  'training', 'education', 'inventory', 'management'
];

export function DocumentSharingModal({
  isOpen,
  onClose,
  documentData
}: DocumentSharingModalProps) {
  const [title, setTitle] = useState(documentData?.title || '');
  const [description, setDescription] = useState('');
  const [selectedVehicleModels, setSelectedVehicleModels] = useState<string[]>(
    documentData?.vehicleModel ? [documentData.vehicleModel] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const { toast } = useToast();

  const handleVehicleModelToggle = (model: string) => {
    setSelectedVehicleModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleShare = async () => {
    if (!documentData || !title.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title for the document.',
        variant: 'destructive'
      });
      return;
    }

    setIsSharing(true);
    try {
      const { error } = await supabase.functions.invoke('share-generated-document', {
        body: {
          documentData: {
            title: title.trim(),
            description: description.trim() || undefined,
            documentType: documentData.documentType,
            fileName: documentData.filename,
            fileContent: documentData.fileContent || '',
            vehicleModels: selectedVehicleModels,
            categories: selectedCategories,
            tags: tags,
            originalQuery: documentData.originalQuery,
            generationMethod: documentData.generationMethod
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setShared(true);
      toast({
        title: 'Document Shared Successfully!',
        description: 'Your document has been added to the community library.',
        variant: 'default'
      });

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setShared(false);
      }, 2000);

    } catch (error) {
      console.error('Error sharing document:', error);
      toast({
        title: 'Sharing Failed',
        description: error instanceof Error ? error.message : 'Could not share document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    if (!isSharing) {
      onClose();
      setShared(false);
    }
  };

  if (!documentData) return null;

  const IconComponent = DocumentTypeIcons[documentData.documentType] || FileText;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {shared ? (
              <>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                Document Shared Successfully!
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-blue-600" />
                </div>
                Share Document with Community
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {shared ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Document Added to Community Library
            </h3>
            <p className="text-gray-600 mb-4">
              Other Unimog enthusiasts can now discover and use your document.
            </p>
            <p className="text-sm text-gray-500">
              This dialog will close automatically...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Document Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <IconComponent className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{documentData.filename}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {documentData.documentType} document generated by Barry AI
                  </p>
                </div>
              </div>
              {documentData.originalQuery && (
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Generated from:</strong> "{documentData.originalQuery}"
                </div>
              )}
            </div>

            {/* Document Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Document Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for the community"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what this document contains and how it might help other Unimog owners..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Vehicle Models */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Applicable Vehicle Models
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {VEHICLE_MODELS.map((model) => (
                    <div key={model} className="flex items-center space-x-2">
                      <Checkbox
                        id={model}
                        checked={selectedVehicleModels.includes(model)}
                        onCheckedChange={() => handleVehicleModelToggle(model)}
                      />
                      <label
                        htmlFor={model}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {model}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Categories
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Custom Tags
                </Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Add custom tags..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium mb-1">Community Sharing</p>
                  <p className="text-blue-700">
                    By sharing this document, you're contributing to the Unimog community knowledge base.
                    Other users will be able to download and use this document, and they can rate it to
                    help others find the most useful content.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSharing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleShare}
                disabled={!title.trim() || isSharing}
                className="gap-2"
              >
                {isSharing ? (
                  <>
                    <Upload className="w-4 h-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share with Community
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}