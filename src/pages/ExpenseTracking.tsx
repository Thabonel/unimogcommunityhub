import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExpenseTrackingSection } from '@/components/vehicle/expenses/ExpenseTrackingSection';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';

const ExpenseTracking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { vehicles, isLoading } = useVehicles(user?.id);

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
              <h1 className="text-3xl font-bold">Expense Tracking</h1>
              <p className="text-muted-foreground">
                Track all expenses for your Unimog - fuel, maintenance, parts, and more
              </p>
            </div>
          </div>
        </div>

        {/* Expense Tracking Content */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading vehicle information...</p>
          </div>
        ) : !vehicles || vehicles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No vehicles found. Please add a vehicle first.</p>
          </div>
        ) : (
          <ExpenseTrackingSection
            vehicleId={vehicles[0]?.id}
            vehicles={vehicles}
          />
        )}
      </div>
    </Layout>
  );
};

export default ExpenseTracking;