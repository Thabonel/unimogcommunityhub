import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Wrench, DollarSign, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface ServiceLogEntry {
  id: string;
  date: string;
  mileage: number;
  type: 'maintenance' | 'repair' | 'inspection' | 'upgrade';
  title: string;
  description: string;
  cost?: number;
  duration?: string;
  nextService?: string;
}

interface ServiceLogbookCardProps {
  isOffline?: boolean;
  vehicleId: string;
}

export const ServiceLogbookCard = ({ isOffline = false, vehicleId }: ServiceLogbookCardProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState<ServiceLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newEntry, setNewEntry] = useState({
    date: '',
    mileage: '',
    type: 'maintenance' as const,
    title: '',
    description: '',
    cost: '',
    duration: '',
    nextService: ''
  });

  // Load service entries from database
  const loadServiceEntries = async () => {
    if (!vehicleId || isOffline) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading service entries:', error);
        toast.error('Failed to load service entries');
        return;
      }

      // Convert database records to ServiceLogEntry format
      const serviceEntries: ServiceLogEntry[] = data.map(record => ({
        id: record.id,
        date: record.date,
        mileage: record.odometer,
        type: mapMaintenanceTypeToServiceType(record.maintenance_type),
        title: record.maintenance_type,
        description: record.notes || '',
        cost: record.cost ? parseFloat(record.cost) : undefined,
        duration: undefined, // Not stored in maintenance_logs
        nextService: undefined // Not stored in maintenance_logs
      }));

      setEntries(serviceEntries);
    } catch (error) {
      console.error('Error loading service entries:', error);
      toast.error('Failed to load service entries');
    } finally {
      setIsLoading(false);
    }
  };

  // Map maintenance types to service log types
  const mapMaintenanceTypeToServiceType = (maintenanceType: string): 'maintenance' | 'repair' | 'inspection' | 'upgrade' => {
    const type = maintenanceType.toLowerCase();
    if (type.includes('inspection') || type.includes('check')) return 'inspection';
    if (type.includes('repair') || type.includes('fix') || type.includes('replace')) return 'repair';
    if (type.includes('upgrade') || type.includes('modification')) return 'upgrade';
    return 'maintenance';
  };

  // Load entries on component mount and when vehicleId changes
  useEffect(() => {
    loadServiceEntries();
  }, [vehicleId, isOffline]);

  const handleAddEntry = async () => {
    if (!newEntry.date || !newEntry.title || !newEntry.mileage || !user || !vehicleId) return;

    setIsSubmitting(true);
    try {
      // Save to database
      const { data, error } = await supabase
        .from('maintenance_logs')
        .insert([
          {
            vehicle_id: vehicleId,
            maintenance_type: newEntry.title,
            date: newEntry.date,
            odometer: parseInt(newEntry.mileage),
            cost: newEntry.cost ? parseFloat(newEntry.cost) : null,
            currency: 'USD',
            notes: newEntry.description || null,
            completed_by: null,
            location: null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding service entry:', error);
        toast.error('Failed to add service entry');
        return;
      }

      // Convert the saved record to ServiceLogEntry format
      const newServiceEntry: ServiceLogEntry = {
        id: data.id,
        date: data.date,
        mileage: data.odometer,
        type: mapMaintenanceTypeToServiceType(data.maintenance_type),
        title: data.maintenance_type,
        description: data.notes || '',
        cost: data.cost ? parseFloat(data.cost) : undefined,
        duration: newEntry.duration || undefined,
        nextService: newEntry.nextService || undefined
      };

      // Add to local state
      setEntries([newServiceEntry, ...entries]);

      // Reset form
      setNewEntry({
        date: '',
        mileage: '',
        type: 'maintenance',
        title: '',
        description: '',
        cost: '',
        duration: '',
        nextService: ''
      });

      setIsDialogOpen(false);
      toast.success('Service entry added successfully');
    } catch (error) {
      console.error('Error adding service entry:', error);
      toast.error('Failed to add service entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'repair': return <AlertTriangle className="h-4 w-4" />;
      case 'inspection': return <Clock className="h-4 w-4" />;
      case 'upgrade': return <Plus className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'upgrade': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Logbook</CardTitle>
            <CardDescription>Track maintenance, repairs, and inspections for your Unimog</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isOffline}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Service Entry</DialogTitle>
                <DialogDescription>Record a new maintenance or repair entry</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Mileage (km)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="45200"
                      value={newEntry.mileage}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, mileage: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newEntry.type} onValueChange={(value) => setNewEntry(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="upgrade">Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Oil Change & Filter Replacement"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of work performed..."
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="85"
                      value={newEntry.cost}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, cost: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="2 hours"
                      value={newEntry.duration}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="nextService">Next Service Date (optional)</Label>
                  <Input
                    id="nextService"
                    type="date"
                    value={newEntry.nextService}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, nextService: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEntry}
                  disabled={!newEntry.date || !newEntry.title || !newEntry.mileage || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Entry'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isOffline && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 text-sm">You're offline. You can view existing entries but cannot add new ones.</p>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Loading service entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium mb-2">No service entries yet</h3>
              <p className="text-muted-foreground mb-4">Start tracking your Unimog's maintenance and repairs</p>
              <Button onClick={() => setIsDialogOpen(true)} disabled={isOffline}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Entry
              </Button>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getTypeBadgeColor(entry.type)}`}>
                      {getTypeIcon(entry.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{entry.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <span>{entry.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getTypeBadgeColor(entry.type)}>
                    {entry.type}
                  </Badge>
                </div>

                {entry.description && (
                  <p className="text-sm text-muted-foreground">{entry.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  {entry.cost && (
                    <span className="flex items-center gap-1 text-green-600">
                      <DollarSign className="h-3 w-3" />
                      ${entry.cost}
                    </span>
                  )}
                  {entry.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.duration}
                    </span>
                  )}
                  {entry.nextService && (
                    <span className="text-blue-600">
                      Next service: {new Date(entry.nextService).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};