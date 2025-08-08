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
        model: selectedModel,
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

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No results found. Try a different search term.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {searchResults.map((result) => (
          <Card 
            key={result.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => result.content_type === 'procedure' && loadProcedure(result.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {result.content_type === 'procedure' && <Wrench className="w-4 h-4 text-blue-500" />}
                    {result.content_type === 'part' && <Settings className="w-4 h-4 text-green-500" />}
                    <h3 className="font-semibold">{result.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {result.model && <span>Model: {result.model}</span>}
                    {result.system && <span>System: {result.system}</span>}
                    <Badge variant="secondary" className="text-xs">
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

      <Card>
        <CardHeader>
          <CardTitle>Search WIS EPC Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search procedures, parts, or bulletins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="All Models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Models</SelectItem>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.model_code}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="procedure" disabled={!selectedProcedure}>
            Procedure Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <ScrollArea className="h-[600px]">
            {renderSearchResults()}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="procedure" className="mt-6">
          <ScrollArea className="h-[600px]">
            {renderProcedure()}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}