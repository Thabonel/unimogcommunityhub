import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Book, 
  Wrench, 
  FileText,
  ChevronRight,
  Home,
  Settings
} from 'lucide-react';

// POC WIS System Interface - Safe implementation with sample data only
const WISSystemPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocument, setActiveDocument] = useState<string>('');

  // Sample data for POC - no database connection yet
  const sampleVehicles = [
    { id: '1', model: 'Unimog 406', years: '1977-1989' },
    { id: '2', model: 'Unimog 416', years: '1975-1995' },
    { id: '3', model: 'Unimog U400', years: '2000-2013' },
    { id: '4', model: 'Unimog U500', years: '2013-present' }
  ];

  const sampleProcedures = [
    { id: 'p1', title: 'Engine Oil Change', time: '45 min', category: 'Maintenance' },
    { id: 'p2', title: 'Brake System Inspection', time: '60 min', category: 'Safety' },
    { id: 'p3', title: 'Portal Axle Service', time: '120 min', category: 'Drivetrain' }
  ];

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-mud-black mb-2">
            WIS System - Workshop Information
          </h1>
          <p className="text-mud-black/70">
            Professional workshop manual system for Unimog vehicles (POC Version)
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mud-black/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by VIN, part number, or procedure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-military-green hover:bg-military-green/90">
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Navigation */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Vehicle Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`w-full text-left p-2 rounded hover:bg-khaki-tan/20 transition ${
                        selectedVehicle === vehicle.id ? 'bg-khaki-tan/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{vehicle.model}</p>
                          <p className="text-xs text-mud-black/60">{vehicle.years}</p>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">System Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 rounded hover:bg-khaki-tan/20 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Engine</span>
                  </button>
                  <button className="w-full text-left p-2 rounded hover:bg-khaki-tan/20 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    <span className="text-sm">Transmission</span>
                  </button>
                  <button className="w-full text-left p-2 rounded hover:bg-khaki-tan/20 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Portal Axles</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <Tabs defaultValue="procedures" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
                <TabsTrigger value="parts">Parts Catalog</TabsTrigger>
                <TabsTrigger value="wiring">Wiring Diagrams</TabsTrigger>
                <TabsTrigger value="bulletins">Service Bulletins</TabsTrigger>
              </TabsList>

              <TabsContent value="procedures" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Workshop Procedures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleProcedures.map((proc) => (
                        <div
                          key={proc.id}
                          className="p-4 border rounded-lg hover:bg-sand-beige/10 cursor-pointer transition"
                          onClick={() => setActiveDocument(proc.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <FileText className="w-5 h-5 text-military-green mt-1" />
                              <div>
                                <h3 className="font-medium">{proc.title}</h3>
                                <p className="text-sm text-mud-black/60">
                                  Category: {proc.category} | Time: {proc.time}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parts" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Electronic Parts Catalog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 text-mud-black/50">
                      <div className="text-center">
                        <Book className="w-12 h-12 mx-auto mb-3" />
                        <p>Parts catalog viewer coming soon</p>
                        <p className="text-sm mt-2">Interactive exploded diagrams will appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wiring" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Wiring Diagrams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 text-mud-black/50">
                      <div className="text-center">
                        <Settings className="w-12 h-12 mx-auto mb-3" />
                        <p>Wiring diagram viewer coming soon</p>
                        <p className="text-sm mt-2">Interactive circuit diagrams will appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bulletins" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Bulletins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 text-mud-black/50">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-3" />
                        <p>Service bulletins coming soon</p>
                        <p className="text-sm mt-2">Technical updates and recalls will appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-sand-beige/20 rounded-lg">
          <p className="text-sm text-mud-black/70 text-center">
            🚧 WIS System POC - Currently showing sample data only. Full system integration in progress.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default WISSystemPage;