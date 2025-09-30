import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gauge, FileText, PlusCircle, Fuel, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AddVehicleDialog from './AddVehicleDialog';
import { EditVehicleDialog } from '@/components/community/EditVehicleDialog';

interface Vehicle {
  id: string;
  user_id: string;
  name: string;
  model: string;
  year: string;
  description?: string;
  modifications?: string;
  country_code?: string;
  country?: string;
  region?: string;
  city?: string;
  is_showcase: boolean;
  photos: string[];
  created_at: string;
  updated_at: string;
}

interface VehiclesTabProps {
  userData: {
    unimogModel: string;
    joinDate: string;
  };
}

const VehiclesTab = ({ userData }: VehiclesTabProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  // Fetch user's vehicles
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['user-vehicles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }

      return data as Vehicle[];
    },
    enabled: !!user?.id,
  });

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your showcase? This cannot be undone.')) {
      return;
    }

    setDeletingVehicleId(vehicleId);

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;

      toast({
        title: 'Vehicle removed',
        description: 'Your vehicle has been removed from the showcase.',
      });

      // Refresh vehicles list
      queryClient.invalidateQueries({ queryKey: ['user-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-vehicle'] });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove vehicle. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setDeletingVehicleId(null);
    }
  };

  const handleEditSuccess = () => {
    // Refresh vehicles list
    queryClient.invalidateQueries({ queryKey: ['user-vehicles'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-vehicle'] });
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6">
      {/* My Vehicles Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Vehicles</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddVehicleDialog(true)}
            >
              <PlusCircle size={16} className="mr-2" />
              Add Vehicle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't added any vehicles to the showcase yet.
              </p>
              <Button onClick={() => setShowAddVehicleDialog(true)}>
                <PlusCircle size={16} className="mr-2" />
                Add Your First Vehicle
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="border rounded-lg p-4 hover:border-military-green/50 transition-colors">
                  <div className="flex gap-4">
                    {/* Vehicle Photo */}
                    {vehicle.photos && vehicle.photos.length > 0 ? (
                      <img
                        src={vehicle.photos[0]}
                        alt={vehicle.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No photo</span>
                      </div>
                    )}

                    {/* Vehicle Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.model} • {vehicle.year}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingVehicle(vehicle)}
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(vehicle.id)}
                            disabled={deletingVehicleId === vehicle.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {/* Location */}
                      {(vehicle.city || vehicle.country) && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          {vehicle.city && vehicle.country
                            ? `${vehicle.city}, ${vehicle.country}`
                            : vehicle.city || vehicle.country}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-muted-foreground">
                          {vehicle.photos?.length || 0} photos
                        </span>
                        {vehicle.is_showcase && (
                          <span className="px-2 py-0.5 bg-military-green/20 text-military-green rounded-full text-xs">
                            In Showcase
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar size={14} />
                          Added {new Date(vehicle.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Description Preview */}
                      {vehicle.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {vehicle.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Maintenance Dashboard Card */}
      <Card>
        <CardHeader>
          <CardTitle>VEHICLE MAINTENANCE DASHBOARD</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track maintenance, access manuals, and keep your Unimog in top condition.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/full-vehicle-dashboard">
              <Button className="w-full flex gap-2 items-center bg-primary text-primary-foreground hover:bg-primary/90">
                <Gauge size={16} />
                View Full Dashboard
              </Button>
            </Link>
            <Link to="/fuel-tracking">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <Fuel size={16} />
                Fuel Tracking
              </Button>
            </Link>
            <Link to="/service-logs">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <FileText size={16} />
                Service Logs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Add Vehicle Dialog */}
      <AddVehicleDialog
        isOpen={showAddVehicleDialog}
        onClose={() => setShowAddVehicleDialog(false)}
      />

      {/* Edit Vehicle Dialog */}
      {editingVehicle && (
        <EditVehicleDialog
          isOpen={!!editingVehicle}
          onClose={() => setEditingVehicle(null)}
          vehicle={editingVehicle}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default VehiclesTab;