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
import { Link, useNavigate } from 'react-router-dom';
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

// Sample data for charts
const fuelData = [
  { month: 'Jan', consumption: 285, cost: 1140, efficiency: 8.2 },
  { month: 'Feb', consumption: 298, cost: 1192, efficiency: 7.9 },
  { month: 'Mar', consumption: 267, cost: 1068, efficiency: 8.7 },
  { month: 'Apr', consumption: 289, cost: 1156, efficiency: 8.1 },
  { month: 'May', consumption: 301, cost: 1204, efficiency: 7.8 },
  { month: 'Jun', consumption: 278, cost: 1112, efficiency: 8.4 }
];

const maintenanceData = [
  { category: 'Engine', cost: 1240, items: 12, lastService: '2024-01-15' },
  { category: 'Transmission', cost: 890, items: 6, lastService: '2024-02-20' },
  { category: 'Brakes', cost: 650, items: 8, lastService: '2024-01-30' },
  { category: 'Hydraulics', cost: 1520, items: 15, lastService: '2024-02-10' },
  { category: 'Tires', cost: 2100, items: 4, lastService: '2024-01-25' }
];

const performanceData = [
  { metric: 'Off-Road Hours', value: 124, target: 150, unit: 'hrs' },
  { metric: 'Load Capacity Used', value: 6.2, target: 8.5, unit: 'tons' },
  { metric: 'Ground Clearance', value: 450, target: 450, unit: 'mm' },
  { metric: 'Hydraulic Pressure', value: 240, target: 240, unit: 'bar' }
];

const expenseBreakdown = [
  { name: 'Fuel', value: 6872, color: '#ff6b6b' },
  { name: 'Maintenance', value: 4320, color: '#4ecdc4' },
  { name: 'Insurance', value: 1800, color: '#45b7d1' },
  { name: 'Registration', value: 650, color: '#96ceb4' },
  { name: 'Parts', value: 2150, color: '#feca57' }
];

const FullVehicleDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentVehicle = {
    model: 'U1700L',
    year: '1987',
    vin: 'WDB4351011234567',
    mileage: 45200,
    lastService: '2024-01-15',
    nextService: '2024-04-15',
    status: 'operational'
  };

  const kpiCards = [
    {
      title: 'Current Mileage',
      value: currentVehicle.mileage.toLocaleString(),
      unit: 'km',
      change: '+1,247',
      changeType: 'increase',
      icon: Gauge,
      color: 'bg-blue-500'
    },
    {
      title: 'Fuel Efficiency',
      value: '8.4',
      unit: 'L/100km',
      change: '-0.3',
      changeType: 'decrease',
      icon: Fuel,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Costs',
      value: '1,112',
      unit: '$',
      change: '+8.2%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-red-500'
    },
    {
      title: 'Uptime',
      value: '96.8',
      unit: '%',
      change: '+2.1%',
      changeType: 'increase',
      icon: Activity,
      color: 'bg-purple-500'
    }
  ];

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container mx-auto py-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Analytics</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
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
                    <LineChart data={fuelData}>
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
                  <CardTitle>Maintenance Status</CardTitle>
                  <CardDescription>Upcoming services and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Oil Change Due</p>
                        <p className="text-sm text-muted-foreground">In 2 weeks or 800km</p>
                      </div>
                    </div>
                    <Button size="sm">Schedule</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Annual Inspection</p>
                        <p className="text-sm text-muted-foreground">Completed 2 months ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Passed</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Thermometer className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Coolant System</p>
                        <p className="text-sm text-muted-foreground">Operating normally</p>
                      </div>
                    </div>
                    <Badge variant="outline">Good</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vehicle Health Score */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Health Score</CardTitle>
                <CardDescription>Overall condition based on diagnostics and maintenance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { system: 'Engine', score: 92, color: '#22c55e' },
                    { system: 'Transmission', score: 88, color: '#3b82f6' },
                    { system: 'Hydraulics', score: 95, color: '#10b981' },
                    { system: 'Electrical', score: 85, color: '#f59e0b' }
                  ].map((system, index) => (
                    <div key={index} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart data={[{ value: system.score }]} innerRadius="60%" outerRadius="100%">
                            <RadialBar dataKey="value" fill={system.color} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{system.score}%</span>
                        </div>
                      </div>
                      <p className="font-medium">{system.system}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                    <AreaChart data={fuelData}>
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
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average L/100km</span>
                      <span className="font-medium">8.2</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Idle Time Ratio</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Load Efficiency</span>
                      <span className="font-medium">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
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
                  <BarChart data={maintenanceData}>
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

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceData.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">{metric.value} {metric.unit}</span>
                      <span className="text-sm text-muted-foreground">Target: {metric.target} {metric.unit}</span>
                    </div>
                    <Progress value={(metric.value / metric.target) * 100} className="h-3" />
                  </CardContent>
                </Card>
              ))}
            </div>
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
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Distance</span>
                    <span className="font-medium">1,247 km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Operating Hours</span>
                    <span className="font-medium">124 hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Off-Road Usage</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Speed</span>
                    <span className="font-medium">45 km/h</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location History</CardTitle>
                  <CardDescription>Recent activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { location: 'Forest Service Road 42', time: '2 hours ago', type: 'Off-road' },
                    { location: 'Highway 1 to Brisbane', time: 'Yesterday', type: 'On-road' },
                    { location: 'Mining Site Alpha', time: '2 days ago', type: 'Work site' },
                    { location: 'Base Workshop', time: '3 days ago', type: 'Maintenance' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.location}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FullVehicleDashboard;