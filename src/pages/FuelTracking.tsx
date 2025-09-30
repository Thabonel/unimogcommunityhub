import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FuelTrackingTabContent from '@/components/vehicle/fuel/FuelTrackingTabContent';

const FuelTracking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
              <h1 className="text-3xl font-bold">Fuel Tracking</h1>
              <p className="text-muted-foreground">
                Log fuel fill-ups and track your vehicle's fuel consumption
              </p>
            </div>
          </div>
        </div>

        {/* Fuel Tracking Content */}
        <FuelTrackingTabContent />
      </div>
    </Layout>
  );
};

export default FuelTracking;