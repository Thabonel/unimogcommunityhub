import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Gauge,
  Fuel,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Settings,
  Download,
  RefreshCw,
  Thermometer,
  Zap,
  Wrench,
  Shield,
  Map,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useVehicleData } from '@/hooks/use-vehicle-data';
import { MaintenanceScheduleModal } from '@/components/vehicle/maintenance/MaintenanceScheduleModal';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';
import { LocationTrackingSettings } from '@/components/vehicle/location/LocationTrackingSettings';
import { ManualTripEntry } from '@/components/vehicle/location/ManualTripEntry';
import { QuickCheckin } from '@/components/vehicle/location/QuickCheckin';
import { useLocationData } from '@/hooks/use-location-data';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';



const getExpenseBreakdown = (vehicleStats: any) => {
  const items = [];
  if (vehicleStats?.totalFuelCost > 0) {
    items.push({ name: 'Fuel', value: vehicleStats.totalFuelCost, color: '#ff6b6b' });
  }
  if (vehicleStats?.totalMaintenanceCost > 0) {
    items.push({ name: 'Maintenance', value: vehicleStats.totalMaintenanceCost, color: '#4ecdc4' });
  }
  return items.length > 0 ? items : [{ name: 'No data yet', value: 1, color: '#e5e7eb' }];
};

const FullVehicleDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState('');
  const [selectedMaintenanceDescription, setSelectedMaintenanceDescription] = useState('');

  // Get the tab from URL parameter, or default to 'overview'
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => {
    // Map the tab parameter to the correct tab value
    if (tabFromUrl === 'logs') return 'maintenance'; // Service logs are under maintenance tab
    if (tabFromUrl === 'fuel') return 'fuel';
    return tabFromUrl || 'overview';
  });

  // Location tracking modals
  const [isLocationSettingsOpen, setIsLocationSettingsOpen] = useState(false);
  const [isTripEntryOpen, setIsTripEntryOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  // Get real vehicle data
  const {
    fuelData: realFuelData,
    maintenanceData: realMaintenanceData,
    vehicleStats,
    isLoading: dataLoading,
    error: dataError
  } = useVehicleData(user?.id);

  // Get vehicles to get the current vehicle ID
  const { vehicles } = useVehicles(user?.id);
  const currentVehicleId = vehicles?.[0]?.id; // Get first vehicle ID

  // Get real location data
  const {
    usageStats,
    locationHistory,
    recentTrips,
    isLoading: locationLoading,
    error: locationError,
    refreshData: refreshLocationData,
    getActivityTypeDisplay,
    getTripTypeDisplay
  } = useLocationData(user?.id, currentVehicleId);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handler for scheduling maintenance
  const handleScheduleMaintenance = (type: string, description: string) => {
    setSelectedMaintenanceType(type);
    setSelectedMaintenanceDescription(description);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleComplete = () => {
    // Refresh the data to show the new scheduled maintenance
    setLastUpdate(new Date());
  };

  const firstVehicle = vehicles?.[0];
  const currentVehicle = {
    model: firstVehicle?.model || 'Unknown',
    year: firstVehicle?.year?.toString() || '',
    vin: firstVehicle?.vin || 'Not recorded',
    mileage: vehicleStats?.totalDistance || 0,
    lastService: vehicleStats?.lastServiceDate || '',
    nextService: vehicleStats?.nextServiceDue || '',
    status: 'operational'
  };

  const kpiCards = [
    {
      title: 'Current Mileage',
      value: currentVehicle.mileage > 0 ? currentVehicle.mileage.toLocaleString() : 'N/A',
      unit: 'km',
      change: '',
      changeType: 'increase',
      icon: Gauge,
      color: 'bg-blue-500'
    },
    {
      title: 'Fuel Efficiency',
      value: vehicleStats?.avgFuelEfficiency && vehicleStats.avgFuelEfficiency > 0 ? vehicleStats.avgFuelEfficiency.toFixed(1) : 'N/A',
      unit: 'L/100km',
      change: '',
      changeType: 'decrease',
      icon: Fuel,
      color: 'bg-green-500'
    },
    {
      title: 'Total Fuel Costs',
      value: vehicleStats?.totalFuelCost && vehicleStats.totalFuelCost > 0 ? `$${vehicleStats.totalFuelCost.toLocaleString()}` : 'N/A',
      unit: '',
      change: '',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-red-500'
    },
    {
      title: 'Fill-ups',
      value: realFuelData.length > 0 ? realFuelData.length.toString() : '0',
      unit: 'logged',
      change: '',
      changeType: 'increase',
      icon: Activity,
      color: 'bg-purple-500'
    }
  ];

  if (dataLoading) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container mx-auto py-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard?tab=my-vehicles')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Vehicles
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Vehicle Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive insights for your {currentVehicle.model} • VIN: {currentVehicle.vin}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentVehicle.status === 'operational' ? 'default' : 'destructive'}>
              {currentVehicle.status === 'operational' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {currentVehicle.status}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                    </div>
                    {kpi.change && (
                    <div className="flex items-center gap-1 mt-1">
                      {kpi.changeType === 'increase' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                        {kpi.change}
                      </span>
                    </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Analytics</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="location">Location & Usage</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fuel Efficiency Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Efficiency Trend</CardTitle>
                  <CardDescription>L/100km over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realFuelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: '#22c55e' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Maintenance Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Summary</CardTitle>
                  <CardDescription>Based on your service logs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {realMaintenanceData.length > 0 ? (
                    realMaintenanceData.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">{item.category}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.items} service{item.items !== 1 ? 's' : ''} logged - Last: {new Date(item.lastService).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">${item.cost}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No service logs yet</p>
                      <p className="text-sm mt-1">Add service records to track maintenance</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Maintenance Breakdown */}
            {realMaintenanceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Breakdown</CardTitle>
                <CardDescription>Service costs by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {realMaintenanceData.slice(0, 4).map((item, index) => {
                    const colors = ['#22c55e', '#3b82f6', '#10b981', '#f59e0b'];
                    return (
                      <div key={index} className="text-center">
                        <p className="text-2xl font-bold">${item.cost}</p>
                        <p className="font-medium text-muted-foreground">{item.category}</p>
                        <p className="text-sm text-muted-foreground">{item.items} service{item.items !== 1 ? 's' : ''}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          {/* Fuel Analytics Tab */}
          <TabsContent value="fuel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Consumption & Cost</CardTitle>
                  <CardDescription>Monthly breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={realFuelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="consumption" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="cost" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Metrics</CardTitle>
                  <CardDescription>Based on your fuel log data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average L/100km</span>
                      <span className="font-medium">{vehicleStats?.avgFuelEfficiency?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <Progress value={Math.min((vehicleStats?.avgFuelEfficiency || 0) * 2, 100)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Fuel</span>
                      <span className="font-medium">
                        {realFuelData.length > 0
                          ? `${realFuelData.reduce((sum, d) => sum + (d.consumption || 0), 0).toFixed(0)} L`
                          : 'N/A'}
                      </span>
                    </div>
                    <Progress value={Math.min(realFuelData.length * 10, 100)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Fill-ups Logged</span>
                      <span className="font-medium">{realFuelData.length}</span>
                    </div>
                    <Progress value={Math.min(realFuelData.length * 10, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost Breakdown</CardTitle>
                <CardDescription>Costs by category over the last year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={realMaintenanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Cost Analysis Tab */}
          <TabsContent value="costs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Annual Operating Costs</CardTitle>
                <CardDescription>Total: $15,792</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={getExpenseBreakdown(vehicleStats)}
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getExpenseBreakdown(vehicleStats).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location & Usage Tab */}
          <TabsContent value="location" className="space-y-6">
            {/* Location Tracking Controls */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Button
                onClick={() => setIsLocationSettingsOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Tracking Settings
              </Button>
              <Button
                onClick={() => setIsTripEntryOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Add Trip Manually
              </Button>
              <Button
                onClick={() => setIsCheckinOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Quick Check-in
              </Button>
              <Button
                onClick={refreshLocationData}
                variant="outline"
                size="icon"
                disabled={locationLoading}
              >
                <RefreshCw className={`h-4 w-4 ${locationLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {locationLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading usage data...</span>
                    </div>
                  ) : locationError ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Unable to load usage statistics</p>
                      <Button onClick={refreshLocationData} variant="outline" size="sm" className="mt-2">
                        Try Again
                      </Button>
                    </div>
                  ) : usageStats ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Total Distance</span>
                        <span className="font-medium">{usageStats.total_distance_km.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Operating Hours</span>
                        <span className="font-medium">{usageStats.total_operating_hours.toFixed(1)} hrs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Off-Road Usage</span>
                        <span className="font-medium">{usageStats.off_road_percentage.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Speed</span>
                        <span className="font-medium">{usageStats.average_speed_kmh.toFixed(1)} km/h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Trips</span>
                        <span className="font-medium">{usageStats.trip_count}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No usage data available</p>
                      <p className="text-sm">Start tracking your trips to see statistics here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location History</CardTitle>
                  <CardDescription>Recent check-ins and trips</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {locationLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading location history...</span>
                    </div>
                  ) : locationError ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Unable to load location history</p>
                    </div>
                  ) : (
                    <>
                      {/* Recent Check-ins */}
                      {locationHistory && locationHistory.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground">Recent Check-ins</h4>
                          {locationHistory.slice(0, 3).map((checkin) => {
                            const display = getActivityTypeDisplay(checkin.activity_type);
                            return (
                              <div key={checkin.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                <span className="text-lg">{display.icon}</span>
                                <div className="flex-1">
                                  <p className="font-medium">{checkin.location_name}</p>
                                  <p className="text-sm text-muted-foreground">{checkin.time_ago}</p>
                                </div>
                                <Badge variant="outline">{display.label}</Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Recent Trips */}
                      {recentTrips && recentTrips.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground">Recent Trips</h4>
                          {recentTrips.slice(0, 3).map((trip) => {
                            const display = getTripTypeDisplay(trip.trip_type);
                            return (
                              <div key={trip.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                <span className="text-lg">{display.icon}</span>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {trip.trip_name || `${trip.start_location} → ${trip.end_location}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {trip.distance_km.toFixed(1)} km • {trip.duration_minutes} min • {trip.average_speed_kmh.toFixed(1)} km/h
                                  </p>
                                </div>
                                <Badge variant="outline">{display.label}</Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* No data state */}
                      {(!locationHistory || locationHistory.length === 0) &&
                       (!recentTrips || recentTrips.length === 0) && (
                        <div className="text-center py-4 text-muted-foreground">
                          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No location activity yet</p>
                          <p className="text-sm">Use the buttons above to start tracking your trips and check-ins</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Maintenance Schedule Modal */}
        {vehicles && vehicles.length > 0 && (
          <MaintenanceScheduleModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            vehicleId={vehicles[0].id}
            prefilledType={selectedMaintenanceType}
            prefilledDescription={selectedMaintenanceDescription}
            onScheduled={handleScheduleComplete}
          />
        )}

        {/* Location Tracking Modals */}
        {currentVehicleId && (
          <>
            <LocationTrackingSettings
              isOpen={isLocationSettingsOpen}
              onOpenChange={setIsLocationSettingsOpen}
              userId={user?.id || ''}
            />

            <ManualTripEntry
              isOpen={isTripEntryOpen}
              onOpenChange={setIsTripEntryOpen}
              vehicleId={currentVehicleId}
              onTripAdded={refreshLocationData}
            />

            <QuickCheckin
              isOpen={isCheckinOpen}
              onOpenChange={setIsCheckinOpen}
              vehicleId={currentVehicleId}
              onCheckinAdded={refreshLocationData}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default FullVehicleDashboard;