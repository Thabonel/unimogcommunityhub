import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Presentation,
  FileText,
  Image,
  Clock,
  Users,
  Settings,
  Loader2,
  CheckCircle,
  Download,
  Play
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PresentationRequest {
  title: string;
  content_type: string;
  procedure_id?: string;
  vehicle_model: string;
  include_diagrams: boolean;
  slide_count: number;
  difficulty_level: string;
  custom_content?: string;
  target_audience: string;
}

interface PresentationGeneratorProps {
  procedure?: {
    id: string;
    title: string;
    content: string;
    model_series?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationGenerator: React.FC<PresentationGeneratorProps> = ({
  procedure,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [request, setRequest] = useState<PresentationRequest>({
    title: procedure?.title ? `${procedure.title} - Training Guide` : '',
    content_type: procedure ? 'repair_procedure' : 'custom',
    procedure_id: procedure?.id,
    vehicle_model: procedure?.model_series || '',
    include_diagrams: true,
    slide_count: 12,
    difficulty_level: 'intermediate',
    target_audience: 'technicians',
  });

  const generatePresentation = async () => {
    if (!request.title.trim()) {
      toast.error('Please enter a presentation title');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Call Barry's PowerPoint creation capability
      const { data, error } = await supabase.functions.invoke('chat-with-barry-agentic', {
        body: {
          messages: [{
            role: 'user',
            content: buildPresentationPrompt()
          }],
          use_tools: true,
          tool_request: {
            name: 'create_powerpoint_presentation',
            parameters: {
              title: request.title,
              content_type: request.content_type,
              procedure_id: request.procedure_id,
              vehicle_model: request.vehicle_model,
              include_diagrams: request.include_diagrams,
              slide_count: request.slide_count,
              difficulty_level: request.difficulty_level
            }
          }
        }
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (error) throw error;

      toast.success('PowerPoint presentation generated successfully!');
      
      // Close dialog after short delay
      setTimeout(() => {
        onClose();
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error('Failed to generate presentation');
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const buildPresentationPrompt = () => {
    let prompt = `Create a professional PowerPoint presentation with the following specifications:

Title: ${request.title}
Content Type: ${request.content_type}
Vehicle Model: ${request.vehicle_model}
Target Audience: ${request.target_audience}
Difficulty Level: ${request.difficulty_level}
Number of Slides: ${request.slide_count}
Include Technical Diagrams: ${request.include_diagrams ? 'Yes' : 'No'}
`;

    if (request.procedure_id && procedure) {
      prompt += `\nSource Procedure: ${procedure.title}\nProcedure Content: ${procedure.content.substring(0, 1000)}...`;
    }

    if (request.custom_content) {
      prompt += `\nAdditional Content: ${request.custom_content}`;
    }

    prompt += `\n\nPlease create a comprehensive presentation that includes:
1. Title slide with clear branding
2. Overview/agenda slide
3. Step-by-step procedure slides with clear instructions
4. Safety warnings and cautions where appropriate
5. Tool and parts requirements
6. Troubleshooting tips
7. Summary and key takeaways
8. Questions and contact information

Make it suitable for ${request.target_audience} at ${request.difficulty_level} level.`;

    if (request.include_diagrams) {
      prompt += ' Include relevant technical diagrams, photos, and illustrations to make the content more engaging and easier to understand.';
    }

    return prompt;
  };

  const handleSlideCountChange = (value: string) => {
    setRequest(prev => ({ ...prev, slide_count: parseInt(value) || 10 }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Presentation className="h-5 w-5 mr-2 text-orange-600" />
            Generate PowerPoint Presentation
          </DialogTitle>
          <DialogDescription>
            Create a professional presentation for Unimog procedures and training materials
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="py-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <Presentation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Generating Presentation...</h3>
                <p className="text-sm text-gray-600">Barry is creating your PowerPoint slides</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{generationProgress}% complete</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Presentation Title</label>
              <Input
                value={request.title}
                onChange={(e) => setRequest(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., U1300L Engine Maintenance Guide"
              />
            </div>

            {/* Content Type and Vehicle Model */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select
                  value={request.content_type}
                  onValueChange={(value) => setRequest(prev => ({ ...prev, content_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repair_procedure">Repair Procedure</SelectItem>
                    <SelectItem value="maintenance_guide">Maintenance Guide</SelectItem>
                    <SelectItem value="training_module">Training Module</SelectItem>
                    <SelectItem value="parts_overview">Parts Overview</SelectItem>
                    <SelectItem value="custom">Custom Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Vehicle Model</label>
                <Input
                  value={request.vehicle_model}
                  onChange={(e) => setRequest(prev => ({ ...prev, vehicle_model: e.target.value }))}
                  placeholder="e.g., U1300L, U1700"
                />
              </div>
            </div>

            {/* Target Audience and Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select
                  value={request.target_audience}
                  onValueChange={(value) => setRequest(prev => ({ ...prev, target_audience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technicians">Service Technicians</SelectItem>
                    <SelectItem value="owners">Vehicle Owners</SelectItem>
                    <SelectItem value="trainees">New Trainees</SelectItem>
                    <SelectItem value="instructors">Training Instructors</SelectItem>
                    <SelectItem value="general">General Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select
                  value={request.difficulty_level}
                  onValueChange={(value) => setRequest(prev => ({ ...prev, difficulty_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Slide Count and Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Number of Slides</label>
                <Select
                  value={request.slide_count.toString()}
                  onValueChange={handleSlideCountChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 slides (Quick overview)</SelectItem>
                    <SelectItem value="12">12 slides (Standard)</SelectItem>
                    <SelectItem value="16">16 slides (Detailed)</SelectItem>
                    <SelectItem value="20">20 slides (Comprehensive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Options</label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="diagrams"
                    checked={request.include_diagrams}
                    onCheckedChange={(checked) => 
                      setRequest(prev => ({ ...prev, include_diagrams: checked as boolean }))
                    }
                  />
                  <label htmlFor="diagrams" className="text-sm">
                    Include diagrams & photos
                  </label>
                </div>
              </div>
            </div>

            {/* Custom Content */}
            {request.content_type === 'custom' && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Custom Content</label>
                <Textarea
                  value={request.custom_content || ''}
                  onChange={(e) => setRequest(prev => ({ ...prev, custom_content: e.target.value }))}
                  placeholder="Describe the specific content you want in the presentation..."
                  rows={3}
                />
              </div>
            )}

            {/* Preview Info */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Presentation className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-orange-800">Presentation Preview</p>
                    <div className="text-xs text-orange-700 space-y-1">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        ~{request.slide_count} slides for {request.target_audience}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Estimated presentation time: {Math.round(request.slide_count * 1.5)}-{Math.round(request.slide_count * 2)} minutes
                      </div>
                      {request.include_diagrams && (
                        <div className="flex items-center">
                          <Image className="h-3 w-3 mr-1" />
                          Includes technical diagrams and illustrations
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isGenerating && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={generatePresentation}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Generate Presentation
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PresentationGenerator;