// SimpleWISInterface - Clean, functional WIS interface without complex state management
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Truck, Cog, Wrench, ChevronRight, ChevronDown, FileText } from 'lucide-react';

// Simple types for the demonstration
interface WISModel {
  id: string;
  model_code: string;
  model_name: string;
}

interface WISSystem {
  id: string;
  system_code: string;
  system_name: string;
  estimated_procedures: number;
}

interface WISComponent {
  id: string;
  component_code: string;
  component_name: string;
  estimated_procedures: number;
}

interface WISProcedure {
  id: string;
  procedure_code: string;
  title: string;
  estimated_time_hours: number;
  difficulty_level: number;
}

const SimpleWISInterface: React.FC = () => {
  const [models, setModels] = useState<WISModel[]>([]);
  const [systems, setSystems] = useState<WISSystem[]>([]);
  const [components, setComponents] = useState<WISComponent[]>([]);
  const [procedures, setProcedures] = useState<WISProcedure[]>([]);

  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [selectedProcedure, setSelectedProcedure] = useState<string>('');

  const [loading, setLoading] = useState(false);

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, []);

  // Load systems when model changes
  useEffect(() => {
    if (selectedModel) {
      loadSystems(selectedModel);
      setSelectedSystem('');
      setSelectedComponent('');
      setSelectedProcedure('');
    }
  }, [selectedModel]);

  // Load components when system changes
  useEffect(() => {
    if (selectedSystem) {
      loadComponents(selectedSystem);
      setSelectedComponent('');
      setSelectedProcedure('');
    }
  }, [selectedSystem]);

  // Load procedures when component changes
  useEffect(() => {
    if (selectedComponent) {
      loadProcedures(selectedComponent);
      setSelectedProcedure('');
    }
  }, [selectedComponent]);

  const loadModels = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real implementation this would use the MCP server
      const mockModels: WISModel[] = [
        { id: '1', model_code: 'U435', model_name: 'Unimog U435' }
      ];
      setModels(mockModels);

      // Auto-select first model
      if (mockModels.length > 0) {
        setSelectedModel(mockModels[0].id);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSystems = async (modelId: string) => {
    setLoading(true);
    try {
      // Mock systems for U435
      const mockSystems: WISSystem[] = [
        { id: '1', system_code: '10', system_name: 'Engine', estimated_procedures: 45 },
        { id: '2', system_code: '15', system_name: 'Fuel System', estimated_procedures: 28 },
        { id: '3', system_code: '20', system_name: 'Cooling System', estimated_procedures: 18 },
        { id: '4', system_code: '25', system_name: 'Exhaust System', estimated_procedures: 12 },
        { id: '5', system_code: '30', system_name: 'Transmission', estimated_procedures: 38 },
        { id: '6', system_code: '35', system_name: 'Clutch', estimated_procedures: 15 },
        { id: '7', system_code: '40', system_name: 'Axles & Differential', estimated_procedures: 42 },
        { id: '8', system_code: '45', system_name: 'Steering', estimated_procedures: 22 },
        { id: '9', system_code: '50', system_name: 'Brakes', estimated_procedures: 35 },
        { id: '10', system_code: '55', system_name: 'Electrical', estimated_procedures: 55 },
        { id: '11', system_code: '60', system_name: 'Hydraulics', estimated_procedures: 25 },
        { id: '12', system_code: '65', system_name: 'Pneumatics', estimated_procedures: 18 },
        { id: '13', system_code: '70', system_name: 'Cabin & Body', estimated_procedures: 30 },
        { id: '14', system_code: '75', system_name: 'Implements', estimated_procedures: 40 },
        { id: '15', system_code: '80', system_name: 'Maintenance', estimated_procedures: 25 },
        { id: '16', system_code: '90', system_name: 'Troubleshooting', estimated_procedures: 20 }
      ];
      setSystems(mockSystems);
    } catch (error) {
      console.error('Error loading systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComponents = async (systemId: string) => {
    setLoading(true);
    try {
      // Mock components based on system
      const systemName = systems.find(s => s.id === systemId)?.system_name;
      let mockComponents: WISComponent[] = [];

      if (systemName === 'Engine') {
        mockComponents = [
          { id: '1', component_code: '10.10', component_name: 'Engine Block', estimated_procedures: 8 },
          { id: '2', component_code: '10.15', component_name: 'Cylinder Head', estimated_procedures: 12 },
          { id: '3', component_code: '10.20', component_name: 'Pistons & Rods', estimated_procedures: 6 },
          { id: '4', component_code: '10.25', component_name: 'Crankshaft', estimated_procedures: 4 },
          { id: '5', component_code: '10.30', component_name: 'Camshaft', estimated_procedures: 5 },
          { id: '6', component_code: '10.35', component_name: 'Valvetrain', estimated_procedures: 10 }
        ];
      } else if (systemName === 'Axles & Differential') {
        mockComponents = [
          { id: '7', component_code: '40.10', component_name: 'Portal Axles', estimated_procedures: 15 },
          { id: '8', component_code: '40.15', component_name: 'Differential', estimated_procedures: 12 },
          { id: '9', component_code: '40.20', component_name: 'Portal Hub', estimated_procedures: 8 },
          { id: '10', component_code: '40.25', component_name: 'Axle Shafts', estimated_procedures: 7 }
        ];
      } else {
        mockComponents = [
          { id: '11', component_code: `${systems.find(s => s.id === systemId)?.system_code}.10`, component_name: 'Main Assembly', estimated_procedures: 5 },
          { id: '12', component_code: `${systems.find(s => s.id === systemId)?.system_code}.15`, component_name: 'Control Unit', estimated_procedures: 3 },
          { id: '13', component_code: `${systems.find(s => s.id === systemId)?.system_code}.20`, component_name: 'Sensors', estimated_procedures: 4 }
        ];
      }

      setComponents(mockComponents);
    } catch (error) {
      console.error('Error loading components:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProcedures = async (componentId: string) => {
    setLoading(true);
    try {
      // Mock procedures based on component
      const componentName = components.find(c => c.id === componentId)?.component_name;
      let mockProcedures: WISProcedure[] = [];

      if (componentName === 'Portal Hub') {
        mockProcedures = [
          { id: '1', procedure_code: '40.20.001', title: 'Remove and Install Portal Hub', estimated_time_hours: 2.5, difficulty_level: 3 },
          { id: '2', procedure_code: '40.20.002', title: 'Replace Portal Hub Seals', estimated_time_hours: 1.5, difficulty_level: 2 },
          { id: '3', procedure_code: '40.20.003', title: 'Check Portal Hub Oil Level', estimated_time_hours: 0.25, difficulty_level: 1 },
          { id: '4', procedure_code: '40.20.004', title: 'Portal Hub Bearing Replacement', estimated_time_hours: 3.0, difficulty_level: 4 },
          { id: '5', procedure_code: '40.20.005', title: 'Portal Hub Gear Inspection', estimated_time_hours: 1.0, difficulty_level: 2 },
          { id: '6', procedure_code: '40.20.006', title: 'Portal Hub Assembly Torque Specs', estimated_time_hours: 0.5, difficulty_level: 1 },
          { id: '7', procedure_code: '40.20.007', title: 'Portal Hub Alignment Check', estimated_time_hours: 1.5, difficulty_level: 3 },
          { id: '8', procedure_code: '40.20.008', title: 'Portal Hub Troubleshooting Guide', estimated_time_hours: 0.75, difficulty_level: 2 }
        ];
      } else {
        mockProcedures = [
          { id: '9', procedure_code: `${components.find(c => c.id === componentId)?.component_code}.001`, title: `Remove and Install ${componentName}`, estimated_time_hours: 2.0, difficulty_level: 3 },
          { id: '10', procedure_code: `${components.find(c => c.id === componentId)?.component_code}.002`, title: `${componentName} Inspection`, estimated_time_hours: 1.0, difficulty_level: 2 },
          { id: '11', procedure_code: `${components.find(c => c.id === componentId)?.component_code}.003`, title: `${componentName} Adjustment`, estimated_time_hours: 1.5, difficulty_level: 2 }
        ];
      }

      setProcedures(mockProcedures);
    } catch (error) {
      console.error('Error loading procedures:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      default: return 'Unknown';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <Truck className="w-4 h-4" />
        {models.find(m => m.id === selectedModel) && (
          <>
            <span className="font-medium">{models.find(m => m.id === selectedModel)?.model_name}</span>
            {selectedSystem && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span>{systems.find(s => s.id === selectedSystem)?.system_name}</span>
              </>
            )}
            {selectedComponent && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span>{components.find(c => c.id === selectedComponent)?.component_name}</span>
              </>
            )}
            {selectedProcedure && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-blue-600 font-medium">{procedures.find(p => p.id === selectedProcedure)?.title}</span>
              </>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Model Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Vehicle Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {models.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{model.model_code}</div>
                      <div className="text-xs text-gray-500">{model.model_name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Systems */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cog className="w-4 h-4 text-green-600" />
              Systems
              <Badge variant="secondary" className="text-xs">
                {systems.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-1">
                {systems.map((system) => (
                  <Button
                    key={system.id}
                    variant={selectedSystem === system.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-between h-auto p-3"
                    onClick={() => setSelectedSystem(system.id)}
                  >
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{system.system_code} - {system.system_name}</div>
                      <div className="text-xs text-gray-500">{system.estimated_procedures} procedures</div>
                    </div>
                    {selectedSystem === system.id && <ChevronDown className="w-3 h-3" />}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Components */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-600" />
              Components
              <Badge variant="secondary" className="text-xs">
                {components.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-1">
                {components.map((component) => (
                  <Button
                    key={component.id}
                    variant={selectedComponent === component.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-between h-auto p-3"
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{component.component_code}</div>
                      <div className="text-xs text-gray-600">{component.component_name}</div>
                      <div className="text-xs text-gray-500">{component.estimated_procedures} procedures</div>
                    </div>
                    {selectedComponent === component.id && <ChevronDown className="w-3 h-3" />}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Procedures */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Procedures
              <Badge variant="secondary" className="text-xs">
                {procedures.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {procedures.map((procedure) => (
                  <Button
                    key={procedure.id}
                    variant={selectedProcedure === procedure.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => setSelectedProcedure(procedure.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{procedure.procedure_code}</div>
                      <div className="text-xs text-gray-600 mb-2">{procedure.title}</div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getDifficultyColor(procedure.difficulty_level)}`}>
                          {getDifficultyText(procedure.difficulty_level)}
                        </Badge>
                        <span className="text-xs text-gray-500">{procedure.estimated_time_hours}h</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Procedure Details */}
      {selectedProcedure && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              {procedures.find(p => p.id === selectedProcedure)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Procedure Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Code:</span>
                  <div>{procedures.find(p => p.id === selectedProcedure)?.procedure_code}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Estimated Time:</span>
                  <div>{procedures.find(p => p.id === selectedProcedure)?.estimated_time_hours} hours</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Difficulty:</span>
                  <div>
                    <Badge className={getDifficultyColor(procedures.find(p => p.id === selectedProcedure)?.difficulty_level || 1)}>
                      {getDifficultyText(procedures.find(p => p.id === selectedProcedure)?.difficulty_level || 1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="text-gray-600">
                  <strong>Note:</strong> This demonstrates the hierarchical navigation structure.
                  In Phase 2, this area would display the full step-by-step procedure with parts, tools,
                  diagrams, and safety information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleWISInterface;