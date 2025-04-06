
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualSection } from '@/components/profile/vehicle/ManualSection';
import { Wrench, FileText, Calendar, Gauge, AlertCircle, Clock } from 'lucide-react';
import { useVehicleMaintenance } from '@/hooks/vehicle-maintenance';

const VehicleDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { vehicles, isLoading } = useVehicleMaintenance(user?.id);
  
  // For now, we'll assume the user has a U1700L Unimog
  // In a real implementation, this would come from the vehicles state
  const unimogModel = 'U1700L';

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
              <div className="text-center py-10">
                <p className="text-muted-foreground">Loading vehicle data...</p>
              </div>
            ) : (
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
                        <span className="font-medium">Unimog {unimogModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium">1988</span>
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
