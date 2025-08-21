import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Settings,
  Upload,
  Eye,
  Download,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { WISService } from '@/services/wisService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import WISUploadManager from '@/components/admin/WISUploadManager';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocument, setActiveDocument] = useState<string>('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadManager, setShowUploadManager] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadData();
  }, [selectedVehicle]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load vehicles
      const vehiclesData = await WISService.getVehicles();
      setVehicles(vehiclesData);

      // Load procedures
      const proceduresData = await WISService.getProcedures(selectedVehicle);
      setProcedures(proceduresData);

      // Load parts
      const partsData = await WISService.getParts(selectedVehicle);
      setParts(partsData);

      // Load bulletins
      const selectedVehicleModel = vehicles.find(v => v.id === selectedVehicle)?.model_name;
      const bulletinsData = await WISService.getBulletins(selectedVehicleModel);
      setBulletins(bulletinsData);
    } catch (error) {
      console.error('Error loading WIS data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load WIS data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentView = async (docType: string, docId: string, docTitle: string) => {
    // Log access
    await WISService.logAccess(docType, docId, docTitle);
    setActiveDocument(docId);
    
    toast({
      title: 'Document opened',
      description: `Viewing: ${docTitle}`,
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await WISService.searchContent(searchQuery, 'all', 
        vehicles.find(v => v.id === selectedVehicle)?.model_name
      );
      
      // Display results in appropriate tabs
      if (results.length > 0) {
        toast({
          title: 'Search complete',
          description: `Found ${results.length} results`,
        });
      } else {
        toast({
          title: 'No results',
          description: 'Try different search terms',
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/knowledge')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-mud-black mb-2">
                Workshop Database
              </h1>
              <p className="text-mud-black/70">
                Mercedes-Benz Workshop Information System (WIS)
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowUploadManager(!showUploadManager)}
                className="bg-military-green hover:bg-military-green/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Manage Uploads
              </Button>
            )}
          </div>
          
          {/* Explanatory Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h2 className="font-semibold text-base mb-2">About the Workshop Information System</h2>
            <p className="text-sm text-mud-black/70 mb-2">
              Access the official Mercedes Workshop Information System - the comprehensive digital database used by 
              Mercedes-Benz dealerships and certified mechanics worldwide. This system replaced traditional paper manuals 
              and microfilm documentation, providing:
            </p>
            <ul className="text-sm text-mud-black/70 ml-4 list-disc">
              <li>Step-by-step repair procedures for all Unimog models (1985-present)</li>
              <li>Exploded parts diagrams and component identification</li>
              <li>Wiring schematics and electrical troubleshooting guides</li>
              <li>Torque specifications and fluid requirements</li>
              <li>Technical Service Bulletins (TSBs) and recalls</li>
            </ul>
            <p className="text-xs text-mud-black/60 mt-2">
              This is the same resource used by Mercedes technicians for warranty work and ensures all repairs follow factory specifications.
            </p>
          </div>
        </div>

        {/* Upload Manager for Admins */}
        {isAdmin && showUploadManager && (
          <div className="mb-6">
            <WISUploadManager />
          </div>
        )}

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
                  {loading ? (
                    <p className="text-sm text-gray-500">Loading vehicles...</p>
                  ) : vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle.id)}
                        className={`w-full text-left p-2 rounded hover:bg-khaki-tan/20 transition ${
                          selectedVehicle === vehicle.id ? 'bg-khaki-tan/30' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{vehicle.model_name}</p>
                            <p className="text-xs text-mud-black/60">
                              {vehicle.year_from && vehicle.year_to 
                                ? `${vehicle.year_from}-${vehicle.year_to}`
                                : vehicle.model_code || 'All years'}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No vehicles available</p>
                  )}
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
                      {loading ? (
                        <p className="text-sm text-gray-500">Loading procedures...</p>
                      ) : procedures.length > 0 ? (
                        procedures.map((proc) => (
                          <div
                            key={proc.id}
                            className="p-4 border rounded-lg hover:bg-sand-beige/10 cursor-pointer transition"
                            onClick={() => handleDocumentView('procedure', proc.id, proc.title)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-military-green mt-1" />
                                <div>
                                  <h3 className="font-medium">{proc.title}</h3>
                                  <p className="text-sm text-mud-black/60">
                                    Category: {proc.category} 
                                    {proc.time_required_minutes && ` | Time: ${proc.time_required_minutes} min`}
                                    {proc.difficulty_level && ` | Difficulty: ${proc.difficulty_level}/5`}
                                  </p>
                                  {proc.vehicle && (
                                    <p className="text-xs text-mud-black/50 mt-1">
                                      {proc.vehicle.model_name} {proc.vehicle.model_code}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No procedures available</p>
                          {selectedVehicle ? (
                            <p className="text-sm mt-2">Select a different vehicle</p>
                          ) : (
                            <p className="text-sm mt-2">Select a vehicle to view procedures</p>
                          )}
                        </div>
                      )}
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
                    {loading ? (
                      <p className="text-sm text-gray-500">Loading parts catalog...</p>
                    ) : parts.length > 0 ? (
                      <div className="space-y-3">
                        {parts.map((part) => (
                          <div
                            key={part.id}
                            className="p-4 border rounded-lg hover:bg-sand-beige/10 transition"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-3">
                                  <Wrench className="w-5 h-5 text-military-green mt-1" />
                                  <div className="flex-1">
                                    <h3 className="font-medium">{part.part_number}</h3>
                                    <p className="text-sm text-mud-black/70">{part.description}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-mud-black/60">
                                      {part.category && <span>Category: {part.category}</span>}
                                      {part.price_eur && <span>€{part.price_eur}</span>}
                                      {part.quantity_in_stock > 0 && (
                                        <span className="text-green-600">In Stock: {part.quantity_in_stock}</span>
                                      )}
                                    </div>
                                    {part.superseded_by && (
                                      <p className="text-xs text-orange-600 mt-1">
                                        Superseded by: {part.superseded_by}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDocumentView('part', part.id, part.part_number)}
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-mud-black/50">
                        <div className="text-center">
                          <Book className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No parts available</p>
                          <p className="text-sm mt-2">Select a vehicle to view parts</p>
                        </div>
                      </div>
                    )}
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
                    {loading ? (
                      <p className="text-sm text-gray-500">Loading bulletins...</p>
                    ) : bulletins.length > 0 ? (
                      <div className="space-y-3">
                        {bulletins.map((bulletin) => (
                          <div
                            key={bulletin.id}
                            className="p-4 border rounded-lg hover:bg-sand-beige/10 cursor-pointer transition"
                            onClick={() => handleDocumentView('bulletin', bulletin.id, bulletin.title)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-military-green mt-1" />
                                <div className="flex-1">
                                  <h3 className="font-medium">{bulletin.title}</h3>
                                  <p className="text-sm text-mud-black/60">{bulletin.bulletin_number}</p>
                                  {bulletin.description && (
                                    <p className="text-sm text-mud-black/70 mt-1">{bulletin.description}</p>
                                  )}
                                  <div className="flex gap-3 mt-2 text-xs">
                                    <span className="text-mud-black/60">
                                      <Clock className="w-3 h-3 inline mr-1" />
                                      {new Date(bulletin.issue_date).toLocaleDateString()}
                                    </span>
                                    {bulletin.priority_level && (
                                      <span className={`px-2 py-0.5 rounded ${
                                        bulletin.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                        bulletin.priority_level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                        bulletin.priority_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                        {bulletin.priority_level}
                                      </span>
                                    )}
                                  </div>
                                  {bulletin.affected_models && bulletin.affected_models.length > 0 && (
                                    <p className="text-xs text-mud-black/50 mt-2">
                                      Affects: {bulletin.affected_models.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-mud-black/50">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No service bulletins available</p>
                          <p className="text-sm mt-2">Check back for updates</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Note */}
        {!user && (
          <div className="mt-8 p-4 bg-sand-beige/20 rounded-lg">
            <p className="text-sm text-mud-black/70 text-center">
              Sign in to access the full WIS system and track your document access history
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WISSystemPage;