import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gauge, Save, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';

interface VehicleDataEntry {
  id?: string;
  vehicle_id: string;
  entry_type: 'odometer_update' | 'performance' | 'condition' | 'modification';
  value: number;
  unit: string;
  description: string;
  location?: string;
  entry_date: string;
  notes?: string;
}

const VehicleData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { vehicles, isLoading, refetchVehicles } = useVehicles(user?.id);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [entries, setEntries] = useState<VehicleDataEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<VehicleDataEntry>>({
    entry_type: 'odometer_update',
    entry_date: new Date().toISOString().split('T')[0],
    unit: 'km'
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load vehicle data entries from the database
  const loadEntries = async () => {
    if (!selectedVehicle) return;

    try {
      // First try to load from vehicle_data_entries table
      const { data, error } = await supabase
        .from('vehicle_data_entries')
        .select('*')
        .eq('vehicle_id', selectedVehicle)
        .order('entry_date', { ascending: false });

      if (!error && data) {
        setEntries(data);
      } else {
        // Table might not exist yet, show empty state
        setEntries([]);
      }
    } catch (error) {
      console.error('Error loading vehicle data entries:', error);
      setEntries([]);
    }
  };

  useEffect(() => {
    if (selectedVehicle) {
      loadEntries();
    }
  }, [selectedVehicle]);

  // Set default vehicle if only one available
  useEffect(() => {
    if (vehicles && vehicles.length === 1 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [vehicles, selectedVehicle]);

  const handleSaveEntry = async () => {
    if (!selectedVehicle || !newEntry.value) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a value',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      // First, try to save to vehicle_data_entries table for history tracking
      const entryData = {
        vehicle_id: selectedVehicle,
        entry_type: newEntry.entry_type,
        value: newEntry.value,
        unit: newEntry.unit || 'km',
        description: `${newEntry.entry_type === 'odometer_update' ? 'Odometer reading' : 'Vehicle data'}: ${newEntry.value} ${newEntry.unit}`,
        location: newEntry.location,
        entry_date: newEntry.entry_date,
        notes: newEntry.notes
      };

      // Try to insert into vehicle_data_entries table
      const { error: entryError } = await supabase
        .from('vehicle_data_entries')
        .insert([entryData]);

      // If entry successful or table doesn't exist, also update the vehicle's current odometer
      if (newEntry.entry_type === 'odometer_update') {
        const { error: updateError } = await supabase
          .from('vehicles')
          .update({
            current_odometer: newEntry.value,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedVehicle);

        if (updateError) throw updateError;
      }

      // If entry insertion failed (table doesn't exist), that's ok for now
      if (entryError && !entryError.message.includes('relation "vehicle_data_entries" does not exist')) {
        throw entryError;
      }

      toast({
        title: 'Success',
        description: `Vehicle ${newEntry.entry_type === 'odometer_update' ? 'odometer' : 'data'} updated successfully`
      });

      // Reset form
      setNewEntry({
        entry_type: 'odometer_update',
        entry_date: new Date().toISOString().split('T')[0],
        unit: 'km'
      });

      // Refresh vehicle data to show updated odometer
      refetchVehicles();

      // Reload entries to show the new entry if table exists
      loadEntries();

    } catch (error) {
      console.error('Error saving vehicle data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save vehicle data',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getEntryTypeLabel = (type: string) => {
    switch (type) {
      case 'odometer_update': return 'Odometer Update';
      case 'performance': return 'Performance Data';
      case 'condition': return 'Vehicle Condition';
      case 'modification': return 'Modification';
      default: return type;
    }
  };

  const getEntryTypeBadge = (type: string) => {
    switch (type) {
      case 'odometer_update': return 'bg-blue-100 text-blue-800';
      case 'performance': return 'bg-green-100 text-green-800';
      case 'condition': return 'bg-yellow-100 text-yellow-800';
      case 'modification': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8 bg-background min-h-[calc(100vh-64px)]">
        {/* Back button */}
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate('/profile?tab=vehicles')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Vehicles
        </Button>

        <div className="bg-card px-6 py-8 rounded-lg border">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Gauge className="h-8 w-8" />
            VEHICLE DATA ENTRY
          </h1>
          <p className="text-muted-foreground mb-6">
            Record odometer readings, performance data, and vehicle modifications.
          </p>

          {/* Vehicle Selection */}
          {vehicles && vehicles.length > 1 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vehicle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} - {vehicle.model} ({vehicle.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {selectedVehicle && (
            <>
              {/* Data Entry Form */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Update Odometer</CardTitle>
                  <CardDescription>Record your current vehicle mileage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">Current Odometer Reading</Label>
                      <Input
                        id="value"
                        type="number"
                        placeholder="45200"
                        value={newEntry.value || ''}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={newEntry.unit}
                        onValueChange={(value) => setNewEntry(prev => ({ ...prev, unit: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="km">Kilometers</SelectItem>
                          <SelectItem value="miles">Miles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="entry_date">Date</Label>
                    <Input
                      id="entry_date"
                      type="date"
                      value={newEntry.entry_date || ''}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, entry_date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional notes about this odometer reading..."
                      value={newEntry.notes || ''}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <Button
                    onClick={handleSaveEntry}
                    disabled={isSaving || !newEntry.value}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Updating...' : 'Update Odometer'}
                  </Button>
                </CardContent>
              </Card>

              {/* Current Vehicle Info */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Current Vehicle Information</CardTitle>
                  <CardDescription>Your vehicle's current status</CardDescription>
                </CardHeader>
                <CardContent>
                  {vehicles && vehicles.find(v => v.id === selectedVehicle) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted/30 rounded-md">
                        <p className="text-xs font-medium text-muted-foreground">Current Odometer</p>
                        <p className="text-xl font-semibold">
                          {vehicles.find(v => v.id === selectedVehicle)?.current_odometer.toLocaleString()} {vehicles.find(v => v.id === selectedVehicle)?.odometer_unit}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-md">
                        <p className="text-xs font-medium text-muted-foreground">Vehicle</p>
                        <p className="text-lg font-semibold">
                          {vehicles.find(v => v.id === selectedVehicle)?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vehicles.find(v => v.id === selectedVehicle)?.model} ({vehicles.find(v => v.id === selectedVehicle)?.year})
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-md">
                        <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-semibold">
                          {new Date(vehicles.find(v => v.id === selectedVehicle)?.updated_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Entries</CardTitle>
                  <CardDescription>Your vehicle data history</CardDescription>
                </CardHeader>
                <CardContent>
                  {entries.length === 0 ? (
                    <div>
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium mb-2">No entries yet</h3>
                        <p className="text-muted-foreground mb-4">Start tracking your vehicle data with your first entry above</p>
                      </div>
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-blue-800 text-sm">
                          <strong>Note:</strong> Additional vehicle data tracking features (performance metrics, condition reports, modifications) will be available in a future update. For now, you can update your odometer reading and it will feed into your dashboard analytics.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className={getEntryTypeBadge(entry.entry_type)}>
                                {getEntryTypeLabel(entry.entry_type)}
                              </Badge>
                              <span className="font-medium">{entry.description}</span>
                            </div>
                            <span className="text-lg font-semibold">
                              {entry.value.toLocaleString()} {entry.unit}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(entry.entry_date).toLocaleDateString()}
                            </span>
                            {entry.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {entry.location}
                              </span>
                            )}
                          </div>

                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {(!vehicles || vehicles.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <Gauge className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-medium mb-2">No vehicles found</h3>
                <p className="text-muted-foreground mb-4">You need to add a vehicle first to track data</p>
                <Button onClick={() => navigate('/profile')}>
                  Go to Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VehicleData;