import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Wrench, 
  FileText, 
  Clock, 
  Shield,
  ChevronRight,
  Download,
  BookOpen,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Zap,
  Settings
} from 'lucide-react';
import { wisContentService, WISProcedure, WISPart, WISModel, WISSearchResult } from '@/services/wis/wisContentService';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export function WISContentViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [models, setModels] = useState<WISModel[]>([]);
  const [searchResults, setSearchResults] = useState<WISSearchResult[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState<WISProcedure | null>(null);
  const [procedureParts, setProcedureParts] = useState<WISPart[]>([]);
  const [systems, setSystems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [isDemoMode, setIsDemoMode] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load models on mount
  useEffect(() => {
    loadModels();
    checkDemoMode();
  }, []);

  // Search when query changes
  useEffect(() => {
    if (debouncedSearch || selectedModel || selectedSystem) {
      performSearch();
    }
  }, [debouncedSearch, selectedModel, selectedSystem]);

  // Load systems when model changes
  useEffect(() => {
    if (selectedModel) {
      loadSystemsForModel(selectedModel);
    } else {
      setSystems([]);
      setSelectedSystem('');
    }
  }, [selectedModel]);

  const loadModels = async () => {
    const modelList = await wisContentService.getModels();
    setModels(modelList);
  };

  const checkDemoMode = async () => {
    const isDemo = await wisContentService.isDemoMode();
    setIsDemoMode(isDemo);
  };

  const loadSystemsForModel = async (model: string) => {
    const systemList = await wisContentService.getSystemsForModel(model);
    setSystems(systemList);
  };

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const results = await wisContentService.search(debouncedSearch, {
        model: selectedModel === 'all' ? undefined : selectedModel,
        system: selectedSystem
      });
      setSearchResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProcedure = async (procedureId: string) => {
    setIsLoading(true);
    try {
      const procedure = await wisContentService.getProcedure(procedureId);
      if (procedure) {
        setSelectedProcedure(procedure);
        // Load parts for procedure
        const parts = await wisContentService.getPartsForProcedure(procedure.parts_required);
        setProcedureParts(parts);
        setActiveTab('procedure');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFilteredResults = (contentType: 'procedure' | 'part' | 'bulletin') => {
    const filteredResults = searchResults.filter(result => result.content_type === contentType);
    
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">
            Loading {contentType}s{selectedModel ? ` for ${models.find(m => m.model_code === selectedModel)?.model_name}` : ''}...
          </p>
        </div>
      );
    }

    if (!selectedModel) {
      const contentTypeInfo = {
        procedure: { icon: Wrench, title: 'Procedures', desc: 'Step-by-step repair and maintenance instructions', color: 'blue' },
        part: { icon: Settings, title: 'Parts', desc: 'Part numbers, diagrams, and specifications', color: 'green' },
        bulletin: { icon: Shield, title: 'Bulletins', desc: 'Safety notices and service recommendations', color: 'red' }
      };
      const info = contentTypeInfo[contentType];
      const IconComponent = info.icon;
      
      return (
        <div className="text-center py-12">
          <IconComponent className={`w-16 h-16 text-${info.color}-400 mx-auto mb-4`} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Vehicle Model</h3>
          <p className="text-gray-600 mb-4">
            Choose your vehicle model above to see {info.title.toLowerCase()}<br />
            specific to your Unimog or Mercedes.
          </p>
          <p className="text-sm text-gray-500">
            {info.desc}
          </p>
        </div>
      );
    }

    if (filteredResults.length === 0) {
      const modelName = models.find(m => m.model_code === selectedModel)?.model_name;
      const contentTypeLabels = {
        procedure: 'procedures',
        part: 'parts', 
        bulletin: 'bulletins'
      };
      
      return (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No {contentTypeLabels[contentType]} Found</h3>
          <p className="text-gray-600 mb-4">
            No {contentTypeLabels[contentType]} found for <strong>{modelName}</strong>
            {debouncedSearch && (
              <>
                <br />matching "<span className="font-mono text-sm bg-gray-100 px-1 rounded">{debouncedSearch}</span>"
              </>
            )}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Found {filteredResults.length} {contentType}{filteredResults.length !== 1 ? 's' : ''} for{' '}
            <strong>{models.find(m => m.model_code === selectedModel)?.model_name}</strong>
            {selectedSystem && (
              <> in <strong>{selectedSystem}</strong> system</>
            )}
          </p>
        </div>
        
        {filteredResults.map((result) => (
          <Card 
            key={result.id} 
            className={cn(
              "hover:shadow-md transition-shadow cursor-pointer border-l-4",
              {
                "border-l-blue-500": result.content_type === 'procedure',
                "border-l-green-500": result.content_type === 'part',
                "border-l-red-500": result.content_type === 'bulletin'
              }
            )}
            onClick={() => result.content_type === 'procedure' && loadProcedure(result.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {result.content_type === 'procedure' && <Wrench className="w-4 h-4 text-blue-500" />}
                    {result.content_type === 'part' && <Settings className="w-4 h-4 text-green-500" />}
                    {result.content_type === 'bulletin' && <Shield className="w-4 h-4 text-red-500" />}
                    <h3 className="font-semibold">{result.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {result.system && <span>System: {result.system}</span>}
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", {
                        "bg-blue-100 text-blue-800": result.content_type === 'procedure',
                        "bg-green-100 text-green-800": result.content_type === 'part',
                        "bg-red-100 text-red-800": result.content_type === 'bulletin'
                      })}
                    >
                      {result.content_type}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {selectedModel ? `Searching ${models.find(m => m.model_code === selectedModel)?.model_name} database...` : 'Searching...'}
          </p>
        </div>
      );
    }

    if (!selectedModel && !debouncedSearch) {
      return (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Vehicle First</h3>
          <p className="text-gray-600 mb-6">
            Choose your vehicle model above to see procedures, parts, and bulletins<br />
            specific to your Unimog or Mercedes model.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Wrench className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">Procedures</h4>
              <p className="text-xs text-blue-700">Step-by-step repair guides</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Settings className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium text-green-900">Parts</h4>
              <p className="text-xs text-green-700">Part numbers and diagrams</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <Shield className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-medium text-red-900">Bulletins</h4>
              <p className="text-xs text-red-700">Safety and service notices</p>
            </div>
          </div>
        </div>
      );
    }

    if (searchResults.length === 0 && selectedModel) {
      const modelName = models.find(m => m.model_code === selectedModel)?.model_name;
      return (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">
            No {debouncedSearch ? 'matching' : ''} content found for <strong>{modelName}</strong>
            {debouncedSearch && (
              <>
                <br />matching "<span className="font-mono text-sm bg-gray-100 px-1 rounded">{debouncedSearch}</span>"
              </>
            )}
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Try:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Different search terms (e.g., "engine", "brake", "oil")</li>
              <li>Selecting "All Systems" in the filter above</li>
              <li>Checking if your model has different content categories</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {selectedModel && searchResults.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for{' '}
              <strong>{models.find(m => m.model_code === selectedModel)?.model_name}</strong>
              {selectedSystem && (
                <> in <strong>{selectedSystem}</strong> system</>
              )}
            </p>
          </div>
        )}
        
        {searchResults.map((result) => (
          <Card 
            key={result.id} 
            className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
            onClick={() => result.content_type === 'procedure' && loadProcedure(result.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {result.content_type === 'procedure' && <Wrench className="w-4 h-4 text-blue-500" />}
                    {result.content_type === 'part' && <Settings className="w-4 h-4 text-green-500" />}
                    {result.content_type === 'bulletin' && <Shield className="w-4 h-4 text-red-500" />}
                    <h3 className="font-semibold">{result.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {result.system && <span>System: {result.system}</span>}
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", {
                        "bg-blue-100 text-blue-800": result.content_type === 'procedure',
                        "bg-green-100 text-green-800": result.content_type === 'part',
                        "bg-red-100 text-red-800": result.content_type === 'bulletin'
                      })}
                    >
                      {result.content_type}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderProcedure = () => {
    if (!selectedProcedure) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedProcedure.title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <Badge className={getDifficultyColor(selectedProcedure.difficulty)}>
                {selectedProcedure.difficulty.toUpperCase()}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {selectedProcedure.time_estimate} minutes
              </span>
              <span className="text-sm text-gray-600">
                Model: {selectedProcedure.model} | {selectedProcedure.system}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
        </div>

        {selectedProcedure.safety_warnings.length > 0 && (
          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              <strong>Safety Warnings:</strong>
              <ul className="list-disc list-inside mt-1">
                {selectedProcedure.safety_warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Required Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedProcedure.tools_required.map((tool, idx) => (
                <Badge key={idx} variant="outline">
                  <Wrench className="w-3 h-3 mr-1" />
                  {tool}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {procedureParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{part.description}</p>
                    <p className="text-sm text-gray-600">Part #: {part.part_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${part.price}</p>
                    <Badge variant={part.availability === 'In Stock' ? 'default' : 'secondary'}>
                      {part.availability}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procedure</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedProcedure.content }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProcedure.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.description}</p>
                    <p className="text-sm text-gray-600">{step.timeMinutes} minutes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {isDemoMode && (
        <Alert>
          <Zap className="w-4 h-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> This is sample data. To use real WIS EPC data, follow the extraction guide.
          </AlertDescription>
        </Alert>
      )}

      {/* Vehicle Selection - Primary Filter */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Settings className="w-5 h-5" />
            Select Your Vehicle Model
          </CardTitle>
          <p className="text-sm text-blue-700">
            Choose your vehicle model to see only relevant procedures, parts, and bulletins
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full h-12 text-base bg-white border-blue-300 focus:border-blue-500">
                <SelectValue placeholder="Select a vehicle model..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-gray-500 italic">
                  View all models (not recommended)
                </SelectItem>
                
                {/* Group models by series */}
                {(() => {
                  const groupedModels = models.reduce((groups, model) => {
                    // Extract series from model code (e.g., U400 -> U Series, G-Class -> G Series)
                    let series = 'Other';
                    if (model.model_code.startsWith('U')) {
                      series = 'Unimog U-Series';
                    } else if (model.model_code.includes('G')) {
                      series = 'Mercedes G-Class';
                    } else if (model.model_code.includes('SLK') || model.model_code.includes('SL')) {
                      series = 'Mercedes SL/SLK';
                    } else if (model.model_code.includes('C') || model.model_code.includes('E')) {
                      series = 'Mercedes Sedan/Wagon';
                    }
                    
                    if (!groups[series]) groups[series] = [];
                    groups[series].push(model);
                    return groups;
                  }, {} as Record<string, typeof models>);
                  
                  return Object.entries(groupedModels).map(([series, seriesModels]) => (
                    <div key={series}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-50 border-b">
                        {series}
                      </div>
                      {seriesModels.map((model) => (
                        <SelectItem key={model.id} value={model.model_code} className="py-3 pl-6">
                          <div className="flex flex-col">
                            <span className="font-medium">{model.model_name}</span>
                            <span className="text-xs text-gray-500">
                              {model.year_from} - {model.year_to || 'Present'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ));
                })()}
              </SelectContent>
            </Select>
          </div>
          
          {selectedModel && selectedModel !== 'all' && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-green-700">
                ✓ Showing content for: {models.find(m => m.model_code === selectedModel)?.model_name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                All procedures, parts, and bulletins are now filtered for your vehicle model
              </p>
            </div>
          )}
          
          {selectedModel === 'all' && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700">
                ⚠️ Showing all models - content may not be relevant to your vehicle
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and System Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Workshop Database</CardTitle>
          {!selectedModel && (
            <p className="text-sm text-amber-600">
              ⚠️ Select a vehicle model above for best results
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search procedures, parts, or bulletins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                disabled={!selectedModel}
              />
            </div>
            <Select value={selectedSystem} onValueChange={setSelectedSystem} disabled={!selectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="All Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Systems</SelectItem>
                {systems.map((system) => (
                  <SelectItem key={system} value={system}>
                    {system}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="flex items-center gap-1">
            <Search className="w-4 h-4" />
            All Results
          </TabsTrigger>
          <TabsTrigger value="procedures" className="flex items-center gap-1">
            <Wrench className="w-4 h-4" />
            Procedures
          </TabsTrigger>
          <TabsTrigger value="parts" className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            Parts
          </TabsTrigger>
          <TabsTrigger value="bulletins" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Bulletins
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <ScrollArea className="h-[600px]">
            {renderSearchResults()}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="procedures" className="mt-6">
          <ScrollArea className="h-[600px]">
            {renderFilteredResults('procedure')}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="parts" className="mt-6">
          <ScrollArea className="h-[600px]">
            {renderFilteredResults('part')}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="bulletins" className="mt-6">
          <ScrollArea className="h-[600px]">
            {renderFilteredResults('bulletin')}
          </ScrollArea>
        </TabsContent>

        {/* Procedure Details Modal/Overlay */}
        {selectedProcedure && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Procedure Details</h2>
                <Button variant="ghost" onClick={() => setSelectedProcedure(null)}>
                  ×
                </Button>
              </div>
              <ScrollArea className="h-[70vh]">
                <div className="p-6">
                  {renderProcedure()}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}