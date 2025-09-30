import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceLogbookCard } from '@/components/vehicle/dashboard/ServiceLogbookCard';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';

const ServiceLogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { vehicles, isLoading } = useVehicles(user?.id);

  // Get the first vehicle ID (or handle multiple vehicles later)
  const vehicleId = vehicles && vehicles.length > 0 ? vehicles[0].id : '';

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard?tab=my-vehicles')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Vehicles
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Service Logbook</h1>
              <p className="text-muted-foreground">
                Track all maintenance, repairs, and inspections for your Unimog
              </p>
            </div>
          </div>
        </div>

        {/* Service Logbook Content */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading vehicle information...</p>
          </div>
        ) : !vehicleId ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No vehicle found. Please add a vehicle first.</p>
          </div>
        ) : (
          <ServiceLogbookCard vehicleId={vehicleId} />
        )}
      </div>
    </Layout>
  );
};

export default ServiceLogs;