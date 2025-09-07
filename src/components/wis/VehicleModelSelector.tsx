import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Truck, 
  User, 
  Calendar,
  Settings,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';

// Comprehensive Unimog model database for WIS search tokens
export interface UnimogModel {
  id: string;
  series: string;
  model: string;
  displayName: string;
  yearRange: string;
  engine?: string;
  searchTokens: string[];
  category: 'Classic' | 'Medium' | 'Heavy' | 'Extreme';
}

// Complete Unimog model database for accurate WIS search
export const UNIMOG_MODELS: UnimogModel[] = [
  // U300 Series - Classic Light Unimogs
  {
    id: 'u300-401',
    series: 'U300',
    model: 'U401',
    displayName: 'U401 (25hp)',
    yearRange: '1951-1956',
    engine: 'M136',
    searchTokens: ['U401', 'U 401', '401', 'M136', 'U300'],
    category: 'Classic'
  },
  {
    id: 'u300-402',
    series: 'U300',
    model: 'U402',
    displayName: 'U402 (25hp)',
    yearRange: '1956-1963',
    engine: 'M136',
    searchTokens: ['U402', 'U 402', '402', 'M136', 'U300'],
    category: 'Classic'
  },
  {
    id: 'u300-403',
    series: 'U300',
    model: 'U403',
    displayName: 'U403 (34hp)',
    yearRange: '1959-1963',
    engine: 'M180',
    searchTokens: ['U403', 'U 403', '403', 'M180', 'U300'],
    category: 'Classic'
  },
  {
    id: 'u300-404s',
    series: 'U300',
    model: 'U404S',
    displayName: 'U404S (34hp)',
    yearRange: '1963-1980',
    engine: 'M180',
    searchTokens: ['U404S', 'U 404S', '404S', '404', 'M180', 'U300'],
    category: 'Classic'
  },

  // U400 Series - Medium Duty
  {
    id: 'u400-406',
    series: 'U400',
    model: 'U406',
    displayName: 'U406 (65hp)',
    yearRange: '1963-1980',
    engine: 'OM312',
    searchTokens: ['U406', 'U 406', '406', 'OM312', 'U400'],
    category: 'Medium'
  },
  {
    id: 'u400-416',
    series: 'U400',
    model: 'U416',
    displayName: 'U416 (65hp)',
    yearRange: '1963-1980',
    engine: 'OM312',
    searchTokens: ['U416', 'U 416', '416', 'OM312', 'U400'],
    category: 'Medium'
  },
  {
    id: 'u400-424',
    series: 'U400',
    model: 'U424',
    displayName: 'U424 (81hp)',
    yearRange: '1975-1989',
    engine: 'OM314',
    searchTokens: ['U424', 'U 424', '424', 'OM314', 'U400'],
    category: 'Medium'
  },
  {
    id: 'u400-435',
    series: 'U400',
    model: 'U435',
    displayName: 'U435 (81hp)',
    yearRange: '1975-1989',
    engine: 'OM314',
    searchTokens: ['U435', 'U 435', '435', 'OM314', 'U400'],
    category: 'Medium'
  },

  // U1000 Series - Modern Medium
  {
    id: 'u1000-900',
    series: 'U1000',
    model: 'U900',
    displayName: 'U900 (81hp)',
    yearRange: '1980-2000',
    engine: 'OM314',
    searchTokens: ['U900', 'U 900', '900', 'OM314', 'U1000'],
    category: 'Medium'
  },
  {
    id: 'u1000-1000',
    series: 'U1000',
    model: 'U1000',
    displayName: 'U1000 (81hp)',
    yearRange: '1980-2000',
    engine: 'OM314',
    searchTokens: ['U1000', 'U 1000', '1000', 'OM314'],
    category: 'Medium'
  },
  {
    id: 'u1000-1200',
    series: 'U1000',
    model: 'U1200',
    displayName: 'U1200 (81hp)',
    yearRange: '1980-2000',
    engine: 'OM314',
    searchTokens: ['U1200', 'U 1200', '1200', 'OM314', 'U1000'],
    category: 'Medium'
  },
  {
    id: 'u1000-1400',
    series: 'U1000',
    model: 'U1400',
    displayName: 'U1400 (81hp)',
    yearRange: '1980-2000',
    engine: 'OM314',
    searchTokens: ['U1400', 'U 1400', '1400', 'OM314', 'U1000'],
    category: 'Medium'
  },

  // U1300L Series - Heavy Duty
  {
    id: 'u1300l-1300l',
    series: 'U1300L',
    model: 'U1300L',
    displayName: 'U1300L (125hp)',
    yearRange: '1980-2006',
    engine: 'OM352',
    searchTokens: ['U1300L', 'U 1300L', '1300L', '1300', 'OM352', 'U1300'],
    category: 'Heavy'
  },

  // U1700L Series - Popular Heavy Duty
  {
    id: 'u1700l-435',
    series: 'U1700L',
    model: 'U1700L 435',
    displayName: 'U1700L 435 (174hp)',
    yearRange: '2000-2013',
    engine: 'OM366',
    searchTokens: ['U1700L', 'U 1700L', '1700L', '1700', 'U1700L 435', '435', 'OM366'],
    category: 'Heavy'
  },

  // U2150L Series - Extreme Heavy Duty
  {
    id: 'u2150l-500',
    series: 'U2150L',
    model: 'U2150L 500',
    displayName: 'U2150L 500 (204hp)',
    yearRange: '2000-2013',
    engine: 'OM366',
    searchTokens: ['U2150L', 'U 2150L', '2150L', '2150', 'U2150L 500', '500', 'OM366'],
    category: 'Extreme'
  },

  // U3000/U4000/U5000 Series - Modern Extreme
  {
    id: 'u3000-3000',
    series: 'U3000',
    model: 'U3000',
    displayName: 'U3000 (204hp)',
    yearRange: '2000-2013',
    engine: 'OM366',
    searchTokens: ['U3000', 'U 3000', '3000', 'OM366'],
    category: 'Extreme'
  },
  {
    id: 'u4000-4000',
    series: 'U4000',
    model: 'U4000',
    displayName: 'U4000 (242hp)',
    yearRange: '2000-2013',
    engine: 'OM924',
    searchTokens: ['U4000', 'U 4000', '4000', 'OM924'],
    category: 'Extreme'
  },
  {
    id: 'u5000-5000',
    series: 'U5000',
    model: 'U5000',
    displayName: 'U5000 (279hp)',
    yearRange: '2000-2013',
    engine: 'OM926',
    searchTokens: ['U5000', 'U 5000', '5000', 'OM926'],
    category: 'Extreme'
  }
];

interface VehicleModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string, searchTokens: string[]) => void;
  className?: string;
}

export function VehicleModelSelector({ 
  selectedModel, 
  onModelChange, 
  className = '' 
}: VehicleModelSelectorProps) {
  const { userData } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [userModel, setUserModel] = useState<UnimogModel | null>(null);

  // Find user's default model based on their profile
  useEffect(() => {
    if (userData?.unimogModel) {
      // Find matching model from database
      const foundModel = UNIMOG_MODELS.find(model => 
        model.model === userData.unimogModel ||
        model.displayName.includes(userData.unimogModel) ||
        model.searchTokens.some(token => token === userData.unimogModel)
      );
      
      if (foundModel) {
        setUserModel(foundModel);
        // Auto-select user's model if no selection made yet
        if (!selectedModel || selectedModel === '') {
          onModelChange(foundModel.id, foundModel.searchTokens);
        }
      }
    }
  }, [userData, selectedModel, onModelChange]);

  // Filter models based on search and category
  const filteredModels = useMemo(() => {
    return UNIMOG_MODELS.filter(model => {
      const matchesSearch = searchQuery === '' || 
        model.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.searchTokens.some(token => 
          token.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesCategory = selectedCategory === 'all' || 
        model.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group models by category for display
  const modelsByCategory = useMemo(() => {
    const grouped = filteredModels.reduce((acc, model) => {
      if (!acc[model.category]) {
        acc[model.category] = [];
      }
      acc[model.category].push(model);
      return acc;
    }, {} as Record<string, UnimogModel[]>);
    
    return grouped;
  }, [filteredModels]);

  const selectedModelData = UNIMOG_MODELS.find(m => m.id === selectedModel);

  const handleModelSelect = (model: UnimogModel) => {
    onModelChange(model.id, model.searchTokens);
    setIsExpanded(false);
  };

  const clearSelection = () => {
    onModelChange('', []);
  };

  const categoryColors = {
    'Classic': 'bg-amber-100 text-amber-800 border-amber-300',
    'Medium': 'bg-blue-100 text-blue-800 border-blue-300',
    'Heavy': 'bg-green-100 text-green-800 border-green-300',
    'Extreme': 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="w-5 h-5" />
          Select Your Vehicle Model
          {userModel && (
            <Badge variant="outline" className="ml-2 bg-blue-50 border-blue-200 text-blue-700">
              <User className="w-3 h-3 mr-1" />
              Your Vehicle
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Selection Display */}
        {selectedModelData ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-military-green/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-military-green" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {selectedModelData.displayName}
                  </h3>
                  <Badge className={categoryColors[selectedModelData.category]}>
                    {selectedModelData.category}
                  </Badge>
                  {userModel?.id === selectedModelData.id && (
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs">
                      <User className="w-3 h-3 mr-1" />
                      Your Vehicle
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedModelData.yearRange}
                  {selectedModelData.engine && (
                    <>
                      <span className="text-gray-400">•</span>
                      <Settings className="w-4 h-4" />
                      {selectedModelData.engine}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Change
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearSelection}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">No Vehicle Selected</h3>
            <p className="text-sm text-gray-500 mb-3">
              Select your Unimog model for personalized WIS results
            </p>
            {userModel && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleModelSelect(userModel)}
                className="mb-2"
              >
                <User className="w-4 h-4 mr-2" />
                Use My Vehicle ({userModel.displayName})
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(true)}
            >
              Choose Model
            </Button>
          </div>
        )}

        {/* Expandable Model Selection */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Search and Filter Controls */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search models... (e.g., U1700L, 435, OM366)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Classic">Classic</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                  <SelectItem value="Extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Grid */}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {Object.entries(modelsByCategory).map(([category, models]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                      {category}
                    </Badge>
                    <span className="text-sm text-gray-500">({models.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model)}
                        className="p-3 text-left border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-military-green/20 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-gray-900 truncate">
                                {model.displayName}
                              </h5>
                              {userModel?.id === model.id && (
                                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs">
                                  <User className="w-3 h-3 mr-1" />
                                  Yours
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {model.yearRange}
                              {model.engine && ` • ${model.engine}`}
                            </p>
                          </div>
                          <Truck className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Truck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p>No models found matching your search</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchQuery('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get search tokens for a model
export function getModelSearchTokens(modelId: string): string[] {
  const model = UNIMOG_MODELS.find(m => m.id === modelId);
  return model ? model.searchTokens : [];
}

// Helper function to get model display name
export function getModelDisplayName(modelId: string): string {
  const model = UNIMOG_MODELS.find(m => m.id === modelId);
  return model ? model.displayName : 'Unknown Model';
}

export default VehicleModelSelector;