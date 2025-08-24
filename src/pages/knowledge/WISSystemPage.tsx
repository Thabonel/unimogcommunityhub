import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ArrowLeft,
  X
} from 'lucide-react';
import { WISService } from '@/services/wisService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import WISUploadManager from '@/components/admin/WISUploadManager';
import { seedWISData } from '@/utils/seedWISData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const WISSystemPage = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocument, setActiveDocument] = useState<any>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadManager, setShowUploadManager] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredProcedures, setFilteredProcedures] = useState<any[]>([]);
  const [filteredParts, setFilteredParts] = useState<any[]>([]);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Load vehicles on mount and seed data if needed
  useEffect(() => {
    const initializeData = async () => {
      const seedResult = await seedWISData(); // Ensure sample data exists
      console.log('Seed result:', seedResult);
      await loadVehicles();
    };
    initializeData();
  }, []);

  // Load data when vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      loadVehicleData();
    } else {
      // Load all data when no vehicle selected
      loadAllData();
    }
  }, [selectedVehicle]);

  // Filter by category
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProcedures(procedures.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      ));
      setFilteredParts(parts.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      ));
    } else {
      setFilteredProcedures(procedures);
      setFilteredParts(parts);
    }
  }, [selectedCategory, procedures, parts]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const vehiclesData = await WISService.getVehicles();
      console.log('Loaded WIS vehicles:', vehiclesData);
      
      // Update U1700L to show 435 series designation
      const updatedVehicles = vehiclesData.map(v => {
        if (v.model_code === 'U1700L') {
          return { ...v, model_name: 'Unimog U1700L (435 Series)' };
        }
        return v;
      });
      setVehicles(updatedVehicles);
      
      // If no vehicles loaded, show a message
      if (updatedVehicles.length === 0) {
        toast({
          title: 'No WIS vehicles found',
          description: 'Sample data may need to be loaded. Please refresh the page.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast({
        title: 'Error loading vehicles',
        description: 'Could not load WIS vehicle data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVehicleData = async () => {
    setLoading(true);
    try {
      console.log('Loading data for vehicle ID:', selectedVehicle);
      
      // Load procedures for selected vehicle
      const proceduresData = await WISService.getProcedures(selectedVehicle);
      console.log('Loaded procedures:', proceduresData);
      setProcedures(proceduresData);
      setFilteredProcedures(proceduresData);

      // Load parts for selected vehicle
      const partsData = await WISService.getParts(selectedVehicle);
      console.log('Loaded parts:', partsData);
      setParts(partsData);
      setFilteredParts(partsData);

      // Load bulletins for selected vehicle
      const bulletinsData = await WISService.getBulletins(selectedVehicle);
      console.log('Loaded bulletins:', bulletinsData);
      setBulletins(bulletinsData);
    } catch (error) {
      console.error('Error loading vehicle data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      console.log('Loading all WIS data...');
      
      // Load all procedures
      const proceduresData = await WISService.getProcedures();
      console.log('All procedures:', proceduresData);
      setProcedures(proceduresData);
      setFilteredProcedures(proceduresData);

      // Load all parts
      const partsData = await WISService.getParts();
      console.log('All parts:', partsData);
      setParts(partsData);
      setFilteredParts(partsData);

      // Load all bulletins (no vehicle filter)
      const bulletinsData = await WISService.getBulletins();
      console.log('All bulletins:', bulletinsData);
      setBulletins(bulletinsData);
    } catch (error) {
      console.error('Error loading all data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentView = async (docType: string, docId: string, docTitle: string) => {
    // Log access
    await WISService.logAccess(docType, docId, docTitle);
    
    // Find the full document data
    let document = null;
    if (docType === 'procedure') {
      document = procedures.find(p => p.id === docId);
    } else if (docType === 'part') {
      document = parts.find(p => p.id === docId);
    } else if (docType === 'bulletin') {
      document = bulletins.find(b => b.id === docId);
    }
    
    if (document) {
      setActiveDocument(document);
      setDocumentType(docType);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Reset to show all data
      setFilteredProcedures(procedures);
      setFilteredParts(parts);
      return;
    }
    
    setLoading(true);
    try {
      const results = await WISService.searchContent(searchQuery, 'all', selectedVehicle);
      
      // Update filtered data with search results
      setFilteredProcedures(results.procedures || []);
      setFilteredParts(results.parts || []);
      setBulletins(results.bulletins || []);
      
      const totalResults = 
        (results.procedures?.length || 0) + 
        (results.parts?.length || 0) + 
        (results.bulletins?.length || 0);
      
      if (totalResults > 0) {
        toast({
          title: 'Search complete',
          description: `Found ${totalResults} results`,
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
          <Card>
            <CardHeader>
              <CardTitle>Search Workshop Database</CardTitle>
              {!selectedVehicle && (
                <p className="text-sm text-amber-600">
                  ⚠️ Select a vehicle model first for best results
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mud-black/50 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={selectedVehicle ? "Search part number or procedure..." : "Select a vehicle first..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && selectedVehicle && handleSearch()}
                    className="pl-10"
                    disabled={!selectedVehicle}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-military-green hover:bg-military-green/90 disabled:opacity-50"
                  disabled={!selectedVehicle}
                >
                  Search
                </Button>
              </div>
              {selectedVehicle && (
                <p className="text-xs text-gray-600 mt-2">
                  Searching within: {vehicles.find(v => v.id === selectedVehicle)?.model_name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Navigation */}
          <div className="col-span-3">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                  <Settings className="w-5 h-5" />
                  Select Your Vehicle
                </CardTitle>
                <p className="text-sm text-blue-700 mt-1">
                  Choose your model to filter all content
                </p>
              </CardHeader>
              <CardContent>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger className="w-full h-12 text-base bg-white border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Select a vehicle model..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-96 overflow-y-auto">
                    <SelectItem value="" className="text-gray-500 italic">
                      All models (not recommended)
                    </SelectItem>
                    
                    {/* Group vehicles by series */}
                    {(() => {
                      const groupedVehicles = vehicles.reduce((groups, vehicle) => {
                        let series = 'Other Models';
                        const modelCode = vehicle.model_code || '';
                        const modelName = vehicle.model_name || '';
                        
                        if (modelCode.startsWith('U1') || modelCode.startsWith('U2')) {
                          series = 'Unimog Light/Medium Series';
                        } else if (modelCode.startsWith('U3') || modelCode.startsWith('U4') || modelCode.startsWith('U5')) {
                          series = 'Unimog Heavy-Duty Series';
                        } else if (modelName.includes('U1700L') || modelName.includes('U1300L') || modelName.includes('435')) {
                          series = 'Unimog 435 Series';
                        } else if (modelCode.includes('U20') || modelCode.includes('U40')) {
                          series = 'Unimog Classic Series';
                        }
                        
                        if (!groups[series]) groups[series] = [];
                        groups[series].push(vehicle);
                        return groups;
                      }, {} as Record<string, typeof vehicles>);
                      
                      // Sort series names and render
                      const sortedSeries = Object.keys(groupedVehicles).sort();
                      
                      return sortedSeries.map(series => (
                        <div key={series}>
                          <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-50 border-b sticky top-0">
                            {series}
                          </div>
                          {groupedVehicles[series]
                            .sort((a, b) => (a.model_name || '').localeCompare(b.model_name || ''))
                            .map((vehicle) => (
                              <SelectItem 
                                key={vehicle.id} 
                                value={vehicle.id}
                                className="py-3 pl-6"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{vehicle.model_name}</span>
                                  <span className="text-xs text-gray-500">
                                    {vehicle.year_from && vehicle.year_to 
                                      ? `${vehicle.year_from}-${vehicle.year_to}`
                                      : vehicle.model_code || 'All years'}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </div>
                      ));
                    })()}
                  </SelectContent>
                </Select>
                
                {selectedVehicle && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-green-700">
                      ✓ Filtering content for:
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      {vehicles.find(v => v.id === selectedVehicle)?.model_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      All procedures, parts, and bulletins are now filtered
                    </p>
                  </div>
                )}
                
                {!selectedVehicle && vehicles.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700">
                      ⚠️ Select a vehicle model above to see relevant content
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">System Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedCategory(selectedCategory === 'Engine' ? '' : 'Engine')}
                    className={`w-full text-left p-2 rounded hover:bg-khaki-tan/20 flex items-center gap-2 ${
                      selectedCategory === 'Engine' ? 'bg-khaki-tan/30' : ''
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Engine</span>
                  </button>
                  <button 
                    onClick={() => setSelectedCategory(selectedCategory === 'Transmission' ? '' : 'Transmission')}
                    className={`w-full text-left p-2 rounded hover:bg-khaki-tan/20 flex items-center gap-2 ${
                      selectedCategory === 'Transmission' ? 'bg-khaki-tan/30' : ''
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span className="text-sm">Transmission</span>
                  </button>
                  <button 
                    onClick={() => setSelectedCategory(selectedCategory === 'Axles' ? '' : 'Axles')}
                    className={`w-full text-left p-2 rounded hover:bg-khaki-tan/20 flex items-center gap-2 ${
                      selectedCategory === 'Axles' ? 'bg-khaki-tan/30' : ''
                    }`}
                  >
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
                      ) : filteredProcedures.length > 0 ? (
                        filteredProcedures.map((proc) => (
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
                        <div className="text-center py-12">
                          {!selectedVehicle ? (
                            <>
                              <Settings className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Vehicle First</h3>
                              <p className="text-gray-600 mb-4">
                                Choose your vehicle model in the left panel<br />
                                to see procedures specific to your Unimog
                              </p>
                              <div className="inline-block p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                  👈 Use the dropdown on the left to select your model
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                              <p>No procedures available for this model</p>
                              <p className="text-sm mt-2">Try selecting a different vehicle</p>
                            </>
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
                    ) : filteredParts.length > 0 ? (
                      <div className="space-y-3">
                        {filteredParts.map((part) => (
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
                          {!selectedVehicle ? (
                            <>
                              <Settings className="w-16 h-16 text-green-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Vehicle First</h3>
                              <p className="text-gray-600 mb-4">
                                Choose your vehicle model to see parts<br />
                                specific to your Unimog model
                              </p>
                              <div className="inline-block p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700">
                                  👈 Use the dropdown on the left to select your model
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Book className="w-12 h-12 mx-auto mb-3 opacity-30" />
                              <p>No parts available for this model</p>
                              <p className="text-sm mt-2">Try selecting a different vehicle</p>
                            </>
                          )}
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

      {/* Document Viewer Modal */}
      <Dialog open={!!activeDocument} onOpenChange={() => {
        setActiveDocument(null);
        setDocumentType('');
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {documentType === 'procedure' && (
                <span>Procedure: {activeDocument?.title}</span>
              )}
              {documentType === 'part' && (
                <span>Part: {activeDocument?.part_number} - {activeDocument?.description}</span>
              )}
              {documentType === 'bulletin' && (
                <span>Bulletin: {activeDocument?.title}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {documentType === 'procedure' && activeDocument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Category:</span> {activeDocument.category}
                  </div>
                  <div>
                    <span className="font-semibold">Difficulty:</span> {activeDocument.difficulty_level}/5
                  </div>
                  <div>
                    <span className="font-semibold">Time Required:</span> {activeDocument.time_required_minutes || activeDocument.estimated_time_minutes} minutes
                  </div>
                  <div>
                    <span className="font-semibold">Procedure Code:</span> {activeDocument.procedure_code}
                  </div>
                </div>
                
                {activeDocument.tools_required && (
                  <div>
                    <h3 className="font-semibold mb-2">Tools Required:</h3>
                    <p className="text-sm whitespace-pre-wrap bg-sand-beige/20 p-3 rounded">
                      {Array.isArray(activeDocument.tools_required) 
                        ? activeDocument.tools_required.join(', ')
                        : activeDocument.tools_required}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold mb-2">Procedure Content:</h3>
                  <div className="bg-sand-beige/10 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-sans">
                      {activeDocument.content || activeDocument.description}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            
            {documentType === 'part' && activeDocument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Part Number:</span> {activeDocument.part_number}
                  </div>
                  <div>
                    <span className="font-semibold">Category:</span> {activeDocument.category}
                  </div>
                  {activeDocument.price_eur && (
                    <div>
                      <span className="font-semibold">Price:</span> €{activeDocument.price_eur}
                    </div>
                  )}
                  {activeDocument.quantity_in_stock !== undefined && (
                    <div>
                      <span className="font-semibold">Stock:</span> {activeDocument.quantity_in_stock}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description:</h3>
                  <p className="text-sm bg-sand-beige/20 p-3 rounded">
                    {activeDocument.description || activeDocument.part_name}
                  </p>
                </div>
                
                {activeDocument.superseded_by && (
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                    <p className="text-sm text-orange-800">
                      ⚠️ This part has been superseded by: <strong>{activeDocument.superseded_by}</strong>
                    </p>
                  </div>
                )}
                
                {activeDocument.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Additional Notes:</h3>
                    <p className="text-sm bg-sand-beige/20 p-3 rounded">
                      {activeDocument.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {documentType === 'bulletin' && activeDocument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Bulletin Number:</span> {activeDocument.bulletin_number}
                  </div>
                  <div>
                    <span className="font-semibold">Issue Date:</span> {new Date(activeDocument.issue_date || activeDocument.date_issued).toLocaleDateString()}
                  </div>
                  {activeDocument.priority_level && (
                    <div>
                      <span className="font-semibold">Priority:</span> 
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                        activeDocument.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        activeDocument.priority_level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        activeDocument.priority_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activeDocument.priority_level}
                      </span>
                    </div>
                  )}
                  {activeDocument.severity && (
                    <div>
                      <span className="font-semibold">Severity:</span> {activeDocument.severity}
                    </div>
                  )}
                </div>
                
                {activeDocument.affected_models && activeDocument.affected_models.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Affected Models:</h3>
                    <p className="text-sm bg-sand-beige/20 p-3 rounded">
                      {activeDocument.affected_models.join(', ')}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold mb-2">Description:</h3>
                  <p className="text-sm bg-sand-beige/20 p-3 rounded">
                    {activeDocument.description}
                  </p>
                </div>
                
                {activeDocument.content && (
                  <div>
                    <h3 className="font-semibold mb-2">Bulletin Content:</h3>
                    <div className="bg-sand-beige/10 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-sans">
                        {activeDocument.content}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setActiveDocument(null);
                  setDocumentType('');
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default WISSystemPage;