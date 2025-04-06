
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualSection } from '@/components/profile/vehicle/ManualSection';
import { Wrench, FileText, Calendar, Gauge, AlertCircle, Clock, Plus } from 'lucide-react';
import { useVehicleMaintenance } from '@/hooks/vehicle-maintenance';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const VehicleDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { vehicles, isLoading, error } = useVehicleMaintenance(user?.id);
  
  // For now, we'll assume the user has a U1700L Unimog
  // In a real implementation, this would come from the vehicles state
  const unimogModel = vehicles && vehicles.length > 0 ? vehicles[0].model : 'U1700L';

  useEffect(() => {
    // Log for debugging
    console.log('Vehicle dashboard data:', { vehicles, isLoading, error, userId: user?.id });
  }, [vehicles, isLoading, error, user?.id]);

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-10">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Wrench className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
      <p className="text-muted-foreground mb-6">
        Add your first vehicle to start tracking maintenance.
      </p>
      <Button asChild>
        <Link to="/profile" className="flex items-center gap-2">
          <Plus size={16} />
          Add Vehicle
        </Link>
      </Button>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-10">
      <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">Error loading vehicle data</h3>
      <p className="text-muted-foreground mb-6">
        {error?.message || "There was an error loading your vehicle data. Please try again later."}
      </p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2 text-unimog-800 dark:text-unimog-200 flex items-center gap-2">
          <Wrench className="h-8 w-8" />
          Vehicle Maintenance Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Track maintenance, access manuals, and keep your Unimog in top condition.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Gauge size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Calendar size={16} />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="manuals" className="flex items-center gap-2">
              <FileText size={16} />
              Manuals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {isLoading ? (
              renderLoadingState()
            ) : error ? (
              renderErrorState()
            ) : vehicles && vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                    <CardDescription>Your registered Unimog information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-medium">Unimog {vehicles[0].model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium">{vehicles[0].year || '1988'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engine:</span>
                        <span className="font-medium">OM352A 5.7L diesel</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transmission:</span>
                        <span className="font-medium">UG 3/40 - 8F/8R</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Status</CardTitle>
                    <CardDescription>Current vehicle health and alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-md">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Oil change due soon</p>
                          <p className="text-sm">Recommended within the next 500 km</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-md">
                        <Clock className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Next service inspection</p>
                          <p className="text-sm">Due in 3 months or 5,000 km</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              renderEmptyState()
            )}
          </TabsContent>
          
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>Track your vehicle's service record</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Maintenance log feature coming soon. You'll be able to record and track all your vehicle's service history here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manuals">
            <Card>
              <CardHeader>
                <CardTitle>Technical Documentation</CardTitle>
                <CardDescription>Access your vehicle's manuals and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <ManualSection modelCode={unimogModel} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VehicleDashboard;
