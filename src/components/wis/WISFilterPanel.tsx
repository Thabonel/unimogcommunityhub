import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Filter, 
  X, 
  FileText, 
  Wrench, 
  AlertTriangle,
  Image,
  Star,
  Settings,
  RefreshCcw,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { UnifiedWISResult } from '@/lib/unified-wis-search';

export interface WISFilters {
  docTypes: string[];
  systems: string[];
  difficulty: string[];
  hasMedia: boolean;
  minYear?: number;
  maxYear?: number;
}

interface WISFilterPanelProps {
  filters: WISFilters;
  onFiltersChange: (filters: WISFilters) => void;
  totalResults: number;
  filteredResults: number;
  className?: string;
}

// WIS Document Types with descriptions and icons
const DOC_TYPES = [
  { 
    id: 'procedure', 
    label: 'Procedures', 
    icon: FileText, 
    description: 'Step-by-step repair guides',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  { 
    id: 'part', 
    label: 'Parts', 
    icon: Wrench, 
    description: 'Parts catalog and specifications',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  { 
    id: 'bulletin', 
    label: 'Bulletins', 
    icon: AlertTriangle, 
    description: 'Service bulletins and recalls',
    color: 'bg-amber-100 text-amber-800 border-amber-300'
  }
];

// Unimog System Categories for filtering
const SYSTEM_CATEGORIES = [
  { id: 'engine', label: 'Engine', description: 'Engine, cooling, fuel system' },
  { id: 'transmission', label: 'Transmission', description: 'Gearbox, transfer case, PTO' },
  { id: 'axles', label: 'Axles & Diff', description: 'Front/rear axles, differentials, locks' },
  { id: 'hydraulics', label: 'Hydraulics', description: 'Working hydraulics, steering' },
  { id: 'electrical', label: 'Electrical', description: 'Wiring, lighting, controls' },
  { id: 'suspension', label: 'Suspension', description: 'Springs, shocks, chassis' },
  { id: 'brakes', label: 'Brakes', description: 'Service brakes, parking brake' },
  { id: 'cabin', label: 'Cabin', description: 'Interior, HVAC, comfort' },
  { id: 'implements', label: 'Implements', description: 'Attachments, tools, accessories' },
  { id: 'maintenance', label: 'Maintenance', description: 'Service intervals, fluids' }
];

// Difficulty levels for procedures
const DIFFICULTY_LEVELS = [
  { id: '1', label: 'Basic', icon: Star, description: 'Simple tasks, basic tools' },
  { id: '2', label: 'Intermediate', icon: Star, description: 'Some experience required' },
  { id: '3', label: 'Advanced', icon: Star, description: 'Professional level' },
  { id: '4', label: 'Expert', icon: Star, description: 'Specialized tools/knowledge' },
  { id: '5', label: 'Dealer Only', icon: Star, description: 'Factory tools required' }
];

export function WISFilterPanel({ 
  filters, 
  onFiltersChange, 
  totalResults, 
  filteredResults,
  className = '' 
}: WISFilterPanelProps) {
  const [isDocTypesOpen, setIsDocTypesOpen] = useState(true);
  const [isSystemsOpen, setIsSystemsOpen] = useState(true);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  // Count of active filters
  const activeFiltersCount = 
    filters.docTypes.length + 
    filters.systems.length + 
    filters.difficulty.length + 
    (filters.hasMedia ? 1 : 0);

  const handleDocTypeChange = (docType: string, checked: boolean) => {
    const newDocTypes = checked 
      ? [...filters.docTypes, docType]
      : filters.docTypes.filter(type => type !== docType);
    
    onFiltersChange({ ...filters, docTypes: newDocTypes });
  };

  const handleSystemChange = (system: string, checked: boolean) => {
    const newSystems = checked 
      ? [...filters.systems, system]
      : filters.systems.filter(sys => sys !== system);
    
    onFiltersChange({ ...filters, systems: newSystems });
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulty = checked 
      ? [...filters.difficulty, difficulty]
      : filters.difficulty.filter(diff => diff !== difficulty);
    
    onFiltersChange({ ...filters, difficulty: newDifficulty });
  };

  const handleMediaToggle = (checked: boolean) => {
    onFiltersChange({ ...filters, hasMedia: checked });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      docTypes: [],
      systems: [],
      difficulty: [],
      hasMedia: false
    });
  };

  const clearSpecificFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'docTypes':
        if (value) {
          onFiltersChange({
            ...filters,
            docTypes: filters.docTypes.filter(type => type !== value)
          });
        } else {
          onFiltersChange({ ...filters, docTypes: [] });
        }
        break;
      case 'systems':
        if (value) {
          onFiltersChange({
            ...filters,
            systems: filters.systems.filter(sys => sys !== value)
          });
        } else {
          onFiltersChange({ ...filters, systems: [] });
        }
        break;
      case 'difficulty':
        if (value) {
          onFiltersChange({
            ...filters,
            difficulty: filters.difficulty.filter(diff => diff !== value)
          });
        } else {
          onFiltersChange({ ...filters, difficulty: [] });
        }
        break;
      case 'hasMedia':
        onFiltersChange({ ...filters, hasMedia: false });
        break;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </CardTitle>
        
        {/* Results summary */}
        <div className="text-sm text-gray-600">
          {activeFiltersCount > 0 ? (
            <span>
              Showing <strong>{filteredResults.toLocaleString()}</strong> of{' '}
              <strong>{totalResults.toLocaleString()}</strong> results
            </span>
          ) : (
            <span>
              <strong>{totalResults.toLocaleString()}</strong> total results
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Active Filter Tags */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Active Filters</h4>
            <div className="flex flex-wrap gap-1">
              {filters.docTypes.map(docType => {
                const docTypeInfo = DOC_TYPES.find(dt => dt.id === docType);
                return (
                  <Badge 
                    key={docType} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-red-100"
                    onClick={() => clearSpecificFilter('docTypes', docType)}
                  >
                    {docTypeInfo?.label}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                );
              })}
              {filters.systems.map(system => {
                const systemInfo = SYSTEM_CATEGORIES.find(sc => sc.id === system);
                return (
                  <Badge 
                    key={system} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-red-100"
                    onClick={() => clearSpecificFilter('systems', system)}
                  >
                    {systemInfo?.label}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                );
              })}
              {filters.difficulty.map(difficulty => {
                const diffInfo = DIFFICULTY_LEVELS.find(dl => dl.id === difficulty);
                return (
                  <Badge 
                    key={difficulty} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-red-100"
                    onClick={() => clearSpecificFilter('difficulty', difficulty)}
                  >
                    {diffInfo?.label}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                );
              })}
              {filters.hasMedia && (
                <Badge 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-red-100"
                  onClick={() => clearSpecificFilter('hasMedia')}
                >
                  <Image className="w-3 h-3 mr-1" />
                  With Media
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Document Types Filter */}
        <Collapsible open={isDocTypesOpen} onOpenChange={setIsDocTypesOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
            <h4 className="text-sm font-medium text-gray-900">Document Types</h4>
            {isDocTypesOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {DOC_TYPES.map(docType => (
              <div key={docType.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`doctype-${docType.id}`}
                  checked={filters.docTypes.includes(docType.id)}
                  onCheckedChange={(checked) => 
                    handleDocTypeChange(docType.id, checked === true)
                  }
                />
                <div className="flex-1 min-w-0">
                  <Label 
                    htmlFor={`doctype-${docType.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <docType.icon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{docType.label}</span>
                  </Label>
                  <p className="text-xs text-gray-500 ml-6">{docType.description}</p>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* System Categories Filter */}
        <Collapsible open={isSystemsOpen} onOpenChange={setIsSystemsOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
            <h4 className="text-sm font-medium text-gray-900">System Categories</h4>
            {isSystemsOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {SYSTEM_CATEGORIES.map(system => (
                <div key={system.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`system-${system.id}`}
                    checked={filters.systems.includes(system.id)}
                    onCheckedChange={(checked) => 
                      handleSystemChange(system.id, checked === true)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={`system-${system.id}`}
                      className="cursor-pointer"
                    >
                      <span className="font-medium">{system.label}</span>
                    </Label>
                    <p className="text-xs text-gray-500">{system.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Difficulty Level Filter */}
        <Collapsible open={isDifficultyOpen} onOpenChange={setIsDifficultyOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
            <h4 className="text-sm font-medium text-gray-900">Difficulty Level</h4>
            {isDifficultyOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {DIFFICULTY_LEVELS.map(difficulty => (
              <div key={difficulty.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`difficulty-${difficulty.id}`}
                  checked={filters.difficulty.includes(difficulty.id)}
                  onCheckedChange={(checked) => 
                    handleDifficultyChange(difficulty.id, checked === true)
                  }
                />
                <div className="flex-1 min-w-0">
                  <Label 
                    htmlFor={`difficulty-${difficulty.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star}
                          className={`w-3 h-3 ${
                            star <= parseInt(difficulty.id)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{difficulty.label}</span>
                  </Label>
                  <p className="text-xs text-gray-500 ml-8">{difficulty.description}</p>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Media Filter */}
        <Collapsible open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
            <h4 className="text-sm font-medium text-gray-900">Media Content</h4>
            {isMediaOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="has-media"
                checked={filters.hasMedia}
                onCheckedChange={(checked) => handleMediaToggle(checked === true)}
              />
              <div className="flex-1 min-w-0">
                <Label htmlFor="has-media" className="flex items-center gap-2 cursor-pointer">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Has Images/Diagrams</span>
                </Label>
                <p className="text-xs text-gray-500 ml-6">
                  Show only documents with illustrations and photos
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default WISFilterPanel;