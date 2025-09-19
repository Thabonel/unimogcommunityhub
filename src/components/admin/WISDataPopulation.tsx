// WIS Data Population Admin Interface
import React, { useState } from 'react';
import { wisDataService } from '@/services/wis/wisDataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Database,
  Truck,
  Settings,
  Wrench,
  FileText,
  Play,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface PopulationResult {
  step: string;
  success: boolean;
  message: string;
  count?: number;
}

export const WISDataPopulation: React.FC = () => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [results, setResults] = useState<PopulationResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: 'Models', icon: Truck, description: 'Unimog vehicle models' },
    { id: 'Systems', icon: Settings, description: 'Vehicle systems (Engine, Transmission, etc.)' },
    { id: 'Components', icon: Wrench, description: 'System components and parts' },
    { id: 'Procedures', icon: FileText, description: 'Workshop procedures' }
  ];

  const handlePopulateAll = async () => {
    setIsPopulating(true);
    setResults([]);
    setProgress(0);

    try {
      // Run complete population
      const result = await wisDataService.populateAllWISData();

      if (result.success) {
        setResults(result.details);
        setProgress(100);
        setCurrentStep('Complete');
      } else {
        setResults(result.details);
        setCurrentStep('Failed');
      }
    } catch (error) {
      console.error('Population error:', error);
      setResults([{
        step: 'Error',
        success: false,
        message: error.message || 'Unknown error occurred'
      }]);
      setCurrentStep('Failed');
    } finally {
      setIsPopulating(false);
    }
  };

  const handlePopulateIndividual = async (step: string) => {
    setIsPopulating(true);
    setCurrentStep(step);

    try {
      let result;
      switch (step) {
        case 'Models':
          result = await wisDataService.populateModels();
          break;
        case 'Systems':
          result = await wisDataService.populateSystems();
          break;
        case 'Components':
          result = await wisDataService.populateComponents();
          break;
        case 'Procedures':
          result = await wisDataService.populateProcedures();
          break;
        default:
          throw new Error('Invalid step');
      }

      setResults(prev => [...prev, { step, ...result }]);
    } catch (error) {
      setResults(prev => [...prev, {
        step,
        success: false,
        message: error.message || 'Unknown error occurred'
      }]);
    } finally {
      setIsPopulating(false);
      setCurrentStep('');
    }
  };

  const getStepStatus = (stepId: string) => {
    const result = results.find(r => r.step === stepId);
    if (!result) return 'pending';
    return result.success ? 'success' : 'error';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return currentStep ? <Loader2 className="h-4 w-4 text-blue-600 animate-spin" /> : null;
    }
  };

  const totalItems = results.reduce((sum, result) => sum + (result.count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">WIS Data Population</h2>
          <p className="text-sm text-gray-600 mt-1">
            Populate the WIS database with comprehensive Unimog workshop data
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Phase 2.1 - Data Population
        </Badge>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Population Controls
          </CardTitle>
          <CardDescription>
            Populate WIS database with additional models, systems, components, and procedures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={handlePopulateAll}
              disabled={isPopulating}
              className="flex-1"
              size="lg"
            >
              {isPopulating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Populate All Data
            </Button>
          </div>

          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const result = results.find(r => r.step === step.id);
          const StepIcon = step.icon;

          return (
            <Card key={step.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StepIcon className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg">{step.id}</CardTitle>
                  </div>
                  {getStatusIcon(status)}
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => handlePopulateIndividual(step.id)}
                    disabled={isPopulating}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {currentStep === step.id ? (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3 mr-2" />
                    )}
                    Populate {step.id}
                  </Button>

                  {result && (
                    <div className="space-y-2">
                      <div className={`text-xs p-2 rounded ${
                        result.success
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {result.message}
                      </div>
                      {result.count && (
                        <Badge variant="secondary" className="text-xs">
                          {result.count} items
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Population Results
              {totalItems > 0 && (
                <Badge variant="default" className="ml-2">
                  {totalItems} total items
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-start justify-between p-3 rounded-lg border ${
                      result.success
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{result.step}</span>
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className={`text-xs ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                    {result.count && (
                      <Badge variant="outline" className="text-xs">
                        {result.count}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};