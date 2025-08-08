
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
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
  registerExperiment, 
  getExperimentVariant,
  trackExperimentConversion 
} from '@/services/analytics/activityTrackingService';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, BarChart, Trash2 } from 'lucide-react';

// Local storage of experiments for this demo
// In a real implementation, these would be stored in the database
const EXPERIMENTS_STORAGE_KEY = 'community_experiments';

interface ExperimentDefinition {
  id: string;
  name: string;
  description: string;
  variants: string[];
  active: boolean;
  conversionGoals: string[];
  startDate: string;
  endDate?: string;
  results?: {
    views: Record<string, number>;
    conversions: Record<string, number>;
  };
}

export function ABTestingControls() {
  const [experiments, setExperiments] = useState<ExperimentDefinition[]>([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentDefinition | null>(null);
  const [newExperiment, setNewExperiment] = useState<Partial<ExperimentDefinition>>({
    name: '',
    description: '',
    variants: ['control', 'variant_a'],
    active: true,
    conversionGoals: ['button_click'],
    startDate: new Date().toISOString().split('T')[0]
  });

  // Load experiments from localStorage on component mount
  useEffect(() => {
    const storedExperiments = localStorage.getItem(EXPERIMENTS_STORAGE_KEY);
    if (storedExperiments) {
      try {
        setExperiments(JSON.parse(storedExperiments));
      } catch (error) {
        console.error('Error parsing stored experiments:', error);
      }
    }
  }, []);

  // Save experiments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(EXPERIMENTS_STORAGE_KEY, JSON.stringify(experiments));
    
    // Register active experiments with the tracking service
    experiments.filter(exp => exp.active).forEach(exp => {
      registerExperiment({
        id: exp.id,
        name: exp.name,
        description: exp.description,
        variants: exp.variants as any,
        active: exp.active
      });
    });
  }, [experiments]);

  // Create a new experiment
  const handleCreateExperiment = () => {
    if (!newExperiment.name || !newExperiment.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    const id = `exp_${Date.now()}`;
    const newExp: ExperimentDefinition = {
      id,
      name: newExperiment.name || '',
      description: newExperiment.description || '',
      variants: newExperiment.variants || ['control', 'variant_a'],
      active: true,
      conversionGoals: newExperiment.conversionGoals || ['button_click'],
      startDate: newExperiment.startDate || new Date().toISOString().split('T')[0],
      results: {
        views: {},
        conversions: {}
      }
    };
    
    setExperiments(prev => [...prev, newExp]);
    
    // Register with tracking service
    registerExperiment({
      id: newExp.id,
      name: newExp.name,
      description: newExp.description,
      variants: newExp.variants as any,
      active: newExp.active
    });
    
    setShowNewDialog(false);
    
    // Reset form
    setNewExperiment({
      name: '',
      description: '',
      variants: ['control', 'variant_a'],
      active: true,
      conversionGoals: ['button_click'],
      startDate: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: 'Experiment Created',
      description: `${newExp.name} has been created and activated.`,
    });
  };
  
  // Toggle experiment active status
  const toggleExperimentStatus = (id: string) => {
    setExperiments(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, active: !exp.active };
      }
      return exp;
    }));
  };
  
  // Delete experiment
  const deleteExperiment = (id: string) => {
    setExperiments(prev => prev.filter(exp => exp.id !== id));
    
    toast({
      title: 'Experiment Deleted',
      description: 'The experiment has been deleted.',
    });
  };
  
  // View experiment results
  const viewResults = (experiment: ExperimentDefinition) => {
    // In a real implementation, this would fetch actual data from the database
    // For now, we'll simulate some results
    const simulatedExp = { ...experiment };
    
    if (!simulatedExp.results) {
      simulatedExp.results = {
        views: {},
        conversions: {}
      };
    }
    
    // Simulate data for each variant
    simulatedExp.variants.forEach(variant => {
      if (!simulatedExp.results!.views[variant]) {
        simulatedExp.results!.views[variant] = Math.floor(Math.random() * 1000) + 100;
      }
      
      if (!simulatedExp.results!.conversions[variant]) {
        // Conversion rate between 1% and 10%
        const conversionRate = Math.random() * 0.09 + 0.01;
        simulatedExp.results!.conversions[variant] = Math.floor(simulatedExp.results!.views[variant] * conversionRate);
      }
    });
    
    setSelectedExperiment(simulatedExp);
    setShowResultsDialog(true);
  };
  
  // Calculate conversion rate
  const getConversionRate = (views: number, conversions: number) => {
    return views > 0 ? ((conversions / views) * 100).toFixed(2) : '0.00';
  };
  
  // Add variant to experiment
  const addVariant = () => {
    const existingVariants = newExperiment.variants || [];
    const newVariantIndex = existingVariants.length;
    
    if (newVariantIndex >= 4) {
      toast({
        title: 'Maximum Variants Reached',
        description: 'You can have up to 4 variants in an experiment.',
        variant: 'destructive'
      });
      return;
    }
    
    const variantName = `variant_${String.fromCharCode(97 + newVariantIndex - 1)}`;
    setNewExperiment(prev => ({
      ...prev,
      variants: [...(prev.variants || []), variantName]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>A/B Testing</CardTitle>
          <CardDescription>
            Create and manage A/B tests for community features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowNewDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Experiment
            </Button>
          </div>
          
          {experiments.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No experiments yet. Create one to start testing!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiments.map((experiment) => (
                  <TableRow key={experiment.id}>
                    <TableCell>{experiment.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={experiment.active} 
                          onCheckedChange={() => toggleExperimentStatus(experiment.id)} 
                        />
                        <span className={experiment.active ? "text-green-600" : "text-gray-400"}>
                          {experiment.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(experiment.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{experiment.variants.join(', ')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewResults(experiment)}
                        >
                          <BarChart className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => deleteExperiment(experiment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* New Experiment Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Experiment</DialogTitle>
            <DialogDescription>
              Set up an A/B test to compare different versions of a feature
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Experiment Name</label>
              <Input 
                id="name" 
                value={newExperiment.name} 
                onChange={(e) => setNewExperiment({...newExperiment, name: e.target.value})} 
                placeholder="e.g., Button Color Test"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Input 
                id="description" 
                value={newExperiment.description} 
                onChange={(e) => setNewExperiment({...newExperiment, description: e.target.value})} 
                placeholder="What are you testing?"
              />
            </div>
            
            <div className="grid gap-2">
              <label>Variants</label>
              <div className="space-y-2">
                {(newExperiment.variants || []).map((variant, index) => (
                  <div key={variant} className="flex items-center space-x-2">
                    <span className="w-24">{variant}</span>
                    <Input 
                      value={variant} 
                      disabled
                      className="flex-1"
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <PlusCircle className="mr-1 h-3 w-3" /> Add Variant
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="goal">Primary Conversion Goal</label>
              <Input 
                id="goal" 
                value={newExperiment.conversionGoals?.[0] || 'button_click'} 
                onChange={(e) => setNewExperiment({
                  ...newExperiment, 
                  conversionGoals: [e.target.value]
                })} 
                placeholder="e.g., button_click"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="startDate">Start Date</label>
              <Input 
                id="startDate" 
                type="date" 
                value={newExperiment.startDate} 
                onChange={(e) => setNewExperiment({...newExperiment, startDate: e.target.value})} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateExperiment}>Create Experiment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Experiment Results</DialogTitle>
            <DialogDescription>
              {selectedExperiment?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedExperiment && selectedExperiment.results && (
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedExperiment.variants.map(variant => {
                    const views = selectedExperiment.results?.views[variant] || 0;
                    const conversions = selectedExperiment.results?.conversions[variant] || 0;
                    return (
                      <TableRow key={variant}>
                        <TableCell>{variant}</TableCell>
                        <TableCell>{views}</TableCell>
                        <TableCell>{conversions}</TableCell>
                        <TableCell>
                          {getConversionRate(views, conversions)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Winner Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    // Find winning variant
                    const results = selectedExperiment.results!;
                    const winner = Object.keys(results.conversions).reduce(
                      (best, current) => {
                        const currentRate = results.conversions[current] / results.views[current];
                        const bestRate = results.conversions[best] / results.views[best];
                        return currentRate > bestRate ? current : best;
                      },
                      Object.keys(results.conversions)[0]
                    );
                    
                    const winnerViews = results.views[winner] || 0;
                    const winnerConversions = results.conversions[winner] || 0;
                    const winnerRate = parseFloat(getConversionRate(winnerViews, winnerConversions));
                    
                    // Calculate lift over control
                    const controlViews = results.views['control'] || 0;
                    const controlConversions = results.conversions['control'] || 0;
                    const controlRate = controlViews > 0 ? (controlConversions / controlViews) * 100 : 0;
                    
                    const lift = winner !== 'control' ? ((winnerRate / controlRate) - 1) * 100 : 0;
                    
                    return winner === 'control' 
                      ? 'The control version is currently performing best. Consider refining your test variants.'
                      : `The "${winner}" variant is outperforming the control by approximately ${lift.toFixed(1)}%. Consider implementing this version.`;
                  })()}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowResultsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
