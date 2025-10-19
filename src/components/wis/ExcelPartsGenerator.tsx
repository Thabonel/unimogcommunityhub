import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import {
  FileSpreadsheet,
  Settings,
  Calculator,
  Package,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Wrench
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ExcelGenerationRequest {
  title: string;
  data_type: string;
  vehicle_model: string;
  include_formulas: boolean;
  format_style: string;
  include_pricing: boolean;
  include_suppliers: boolean;
  include_inventory: boolean;
  procedure_ids?: string[];
  custom_fields?: string[];
}

interface ExcelPartsGeneratorProps {
  procedureData?: {
    id: string;
    title: string;
    parts?: any[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelPartsGenerator: React.FC<ExcelPartsGeneratorProps> = ({
  procedureData,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [availableProcedures, setAvailableProcedures] = useState<any[]>([]);
  const [request, setRequest] = useState<ExcelGenerationRequest>({
    title: procedureData ? `${procedureData.title} - Parts List` : 'Unimog Parts Catalog',
    data_type: 'parts_catalog',
    vehicle_model: '',
    include_formulas: true,
    format_style: 'professional',
    include_pricing: true,
    include_suppliers: false,
    include_inventory: true,
    procedure_ids: procedureData ? [procedureData.id] : [],
    custom_fields: [],
  });

  useEffect(() => {
    if (isOpen) {
      fetchAvailableProcedures();
    }
  }, [isOpen]);

  const fetchAvailableProcedures = async () => {
    try {
      // Fetch procedures that have parts associated
      const { data, error } = await supabase.functions.invoke('chat-with-barry-agentic', {
        body: {
          messages: [{
            role: 'user',
            content: 'Get a list of WIS procedures that have parts catalogs available'
          }],
          use_tools: true,
          tool_request: {
            name: 'search_procedures',
            parameters: {
              term: 'parts',
              limit: 50
            }
          }
        }
      });

      if (data && data.procedures) {
        setAvailableProcedures(data.procedures);
      }
    } catch (error) {
      console.error('Error fetching procedures:', error);
    }
  };

  const generateExcelCatalog = async () => {
    if (!request.title.trim()) {
      toast.error('Please enter a catalog title');
      return;
    }

    if (!request.vehicle_model.trim()) {
      toast.error('Please specify a vehicle model');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 12, 85));
      }, 600);

      const catalogData = buildCatalogData();

      // Call Barry's Excel creation capability
      const { data, error } = await supabase.functions.invoke('chat-with-barry-agentic', {
        body: {
          messages: [{
            role: 'user',
            content: buildExcelPrompt()
          }],
          use_tools: true,
          tool_request: {
            name: 'create_excel_spreadsheet',
            parameters: {
              title: request.title,
              data_type: request.data_type,
              vehicle_model: request.vehicle_model,
              data: catalogData,
              include_formulas: request.include_formulas,
              format_style: request.format_style
            }
          }
        }
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (error) throw error;

      toast.success('Excel parts catalog generated successfully!');
      
      // Close dialog after short delay
      setTimeout(() => {
        onClose();
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Error generating Excel catalog:', error);
      toast.error('Failed to generate catalog');
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const buildCatalogData = () => {
    const baseData = {
      vehicle_model: request.vehicle_model,
      catalog_type: request.data_type,
      include_pricing: request.include_pricing,
      include_suppliers: request.include_suppliers,
      include_inventory: request.include_inventory,
      procedure_ids: request.procedure_ids,
      custom_fields: request.custom_fields,
    };

    if (procedureData?.parts) {
      baseData['parts_data'] = procedureData.parts;
    }

    return baseData;
  };

  const buildExcelPrompt = () => {
    let prompt = `Create a comprehensive Excel parts catalog with the following specifications:

Title: ${request.title}
Vehicle Model: ${request.vehicle_model}
Catalog Type: ${request.data_type.replace('_', ' ')}
Style: ${request.format_style}

Please create an Excel workbook with multiple sheets:

1. MAIN CATALOG SHEET:
   - Part Number (with hyperlinks where applicable)
   - Part Description
   - Category/System (Engine, Transmission, Hydraulics, etc.)
   - Vehicle Compatibility
   - OEM/Aftermarket indicator
   - Quantity per vehicle
   - Unit of measurement`;

    if (request.include_pricing) {
      prompt += `
   - List Price
   - Supplier Price (if available)
   - Price Last Updated`;
    }

    if (request.include_suppliers) {
      prompt += `
   - Primary Supplier
   - Supplier Part Number
   - Supplier Contact Info`;
    }

    if (request.include_inventory) {
      prompt += `
   - Current Stock Level
   - Minimum Stock Level
   - Reorder Point
   - Last Order Date`;
    }

    prompt += `

2. SUMMARY SHEET:
   - Total parts count by category
   - Most expensive parts (top 20)
   - Critical wear items
   - Maintenance schedule integration`;

    if (request.include_formulas) {
      prompt += `

3. CALCULATION SHEET:
   - Total catalog value calculations
   - Inventory value calculations
   - Cost analysis formulas
   - Automatic pricing updates`;
    }

    prompt += `

FORMATTING REQUIREMENTS:
- Professional ${request.format_style} styling with Unimog/Mercedes branding colors
- Frozen header rows for easy scrolling
- Data validation for dropdown fields
- Conditional formatting for stock levels and pricing
- Filter buttons on all major columns
- Print-friendly layout with page breaks
- Auto-fit column widths
- Clear section headers and categories

Make this a practical, working document that mechanics and parts managers can use daily.`;

    if (request.procedure_ids && request.procedure_ids.length > 0) {
      prompt += `\n\nFocus on parts from the following WIS procedures: ${request.procedure_ids.join(', ')}`;
    }

    return prompt;
  };

  const catalogTypes = [
    { value: 'parts_catalog', label: 'Complete Parts Catalog', icon: Package },
    { value: 'maintenance_schedule', label: 'Maintenance Parts List', icon: Wrench },
    { value: 'inventory_tracker', label: 'Inventory Management', icon: FileSpreadsheet },
    { value: 'repair_log', label: 'Repair Parts History', icon: Settings },
  ];

  const formatStyles = [
    { value: 'professional', label: 'Professional (Mercedes Styling)' },
    { value: 'colorful', label: 'Colorful (Easy Reading)' },
    { value: 'minimal', label: 'Minimal (Print-Friendly)' },
  ];

  const unimogModels = [
    'U300', 'U400', 'U500', 'U1000', 'U1200', 'U1250', 'U1300L', 
    'U1450', 'U1550L', 'U1650', 'U1700', 'U2100', 'U2150', 'U2450L',
    'U3000', 'U4000', 'U5000'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
            Generate Excel Parts Catalog
          </DialogTitle>
          <DialogDescription>
            Create a comprehensive Excel spreadsheet for Unimog parts management and tracking
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="py-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <FileSpreadsheet className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Building Excel Catalog...</h3>
                <p className="text-sm text-gray-600">Barry is creating your parts spreadsheet with formulas and formatting</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{generationProgress}% complete</p>
              </div>
              {generationProgress > 50 && (
                <div className="text-xs text-gray-600 space-y-1">
                  <div>✓ Creating worksheet structure</div>
                  {generationProgress > 70 && <div>✓ Adding formulas and calculations</div>}
                  {generationProgress > 85 && <div>✓ Applying professional formatting</div>}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Basic Information
              </h3>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Catalog Title</label>
                  <Input
                    value={request.title}
                    onChange={(e) => setRequest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., U1300L Complete Parts Catalog"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Vehicle Model</label>
                    <Select
                      value={request.vehicle_model}
                      onValueChange={(value) => setRequest(prev => ({ ...prev, vehicle_model: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {unimogModels.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Format Style</label>
                    <Select
                      value={request.format_style}
                      onValueChange={(value) => setRequest(prev => ({ ...prev, format_style: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formatStyles.map(style => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Catalog Type
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {catalogTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-colors ${
                        request.data_type === type.value 
                          ? 'border-green-500 bg-green-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setRequest(prev => ({ ...prev, data_type: type.value }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">{type.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Content Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Content Options
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="formulas"
                      checked={request.include_formulas}
                      onCheckedChange={(checked) => 
                        setRequest(prev => ({ ...prev, include_formulas: checked as boolean }))
                      }
                    />
                    <label htmlFor="formulas" className="text-sm font-medium">
                      Include Calculations & Formulas
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pricing"
                      checked={request.include_pricing}
                      onCheckedChange={(checked) => 
                        setRequest(prev => ({ ...prev, include_pricing: checked as boolean }))
                      }
                    />
                    <label htmlFor="pricing" className="text-sm font-medium">
                      Include Pricing Information
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="suppliers"
                      checked={request.include_suppliers}
                      onCheckedChange={(checked) => 
                        setRequest(prev => ({ ...prev, include_suppliers: checked as boolean }))
                      }
                    />
                    <label htmlFor="suppliers" className="text-sm font-medium">
                      Include Supplier Details
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inventory"
                      checked={request.include_inventory}
                      onCheckedChange={(checked) => 
                        setRequest(prev => ({ ...prev, include_inventory: checked as boolean }))
                      }
                    />
                    <label htmlFor="inventory" className="text-sm font-medium">
                      Include Inventory Tracking
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-800">Excel Catalog Features</p>
                    <div className="text-xs text-green-700 space-y-1">
                      <div>• Multi-sheet workbook with organized tabs</div>
                      <div>• Professional Mercedes-Unimog styling and branding</div>
                      <div>• Sortable and filterable columns for easy searching</div>
                      <div>• Part compatibility matrix for different Unimog models</div>
                      {request.include_formulas && <div>• Automatic calculations for pricing and inventory</div>}
                      {request.include_pricing && <div>• Cost analysis and budget planning tools</div>}
                      {request.include_inventory && <div>• Stock level tracking with reorder alerts</div>}
                      <div>• Print-ready formatting with proper page breaks</div>
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
              onClick={generateExcelCatalog}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Generate Excel Catalog
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExcelPartsGenerator;