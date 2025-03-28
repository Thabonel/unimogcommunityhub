
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Wrench, Ruler, FileText } from 'lucide-react';

const UnimogU1700L = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const militarySpecs = [
    { label: "Engine", value: "OM352A 5.7L inline-6 diesel" },
    { label: "Power Output", value: "124-168 hp (92-125 kW)" },
    { label: "Transmission", value: "UG 3/40 - 8 forward, 8 reverse gears" },
    { label: "Gross Vehicle Weight", value: "7.5-8.5 tonnes" },
    { label: "Fording Depth", value: "Up to 1.2 meters (without preparation)" },
    { label: "Approach/Departure Angle", value: "44°/45°" },
    { label: "Ground Clearance", value: "450 mm" },
    { label: "Wheelbase", value: "3,250-3,850 mm" },
    { label: "Tires", value: "12.5R20 or 365/85R20" },
    { label: "Production Period", value: "1980s-1990s" },
  ];

  const commonIssues = [
    { title: "Portal Axle Maintenance", description: "Regular inspection of portal gears and oil levels is essential. Military models often have high mileage in extreme conditions." },
    { title: "Fuel System Issues", description: "Diesel injector pumps may require rebuilding after years of service, especially in ex-military vehicles that might have sat unused." },
    { title: "Brake System", description: "Air brake systems need special attention, particularly on models converted from military use to civilian applications." },
    { title: "Electrical System", description: "Military wiring harnesses can be complex and may have been modified. Complete documentation helps significantly with troubleshooting." },
    { title: "Transfer Case Leaks", description: "Common in older U1700L models, particularly those that have seen heavy off-road use." },
  ];

  const filterData = (data: any[], query: string) => {
    if (!query) return data;
    return data.filter(item => 
      Object.values(item).some(
        value => value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-100">Unimog U1700L Military Edition</h1>
            <p className="text-muted-foreground mt-2">Comprehensive information for owners of the ex-military U1700L Unimog</p>
          </div>
          <div className="w-full md:w-auto">
            <Input
              placeholder="Search specifications and issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80"
            />
          </div>
        </div>

        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="specifications" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">Specifications</span>
            </TabsTrigger>
            <TabsTrigger value="common-issues" className="flex items-center gap-2">
              <Wrench size={16} />
              <span className="hidden sm:inline">Common Issues</span>
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="flex items-center gap-2">
              <Ruler size={16} />
              <span className="hidden sm:inline">Dimensions</span>
            </TabsTrigger>
            <TabsTrigger value="manuals" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span className="hidden sm:inline">Manuals</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Detailed specifications for the Unimog U1700L military model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterData(militarySpecs, searchQuery).map((spec, index) => (
                    <div key={index} className="flex flex-col p-4 border rounded-md">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {filterData(militarySpecs, searchQuery).length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No specifications match your search criteria.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="common-issues">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
                <CardDescription>Frequently encountered problems with the ex-military U1700L Unimog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterData(commonIssues, searchQuery).map((issue, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <h3 className="font-medium text-lg mb-2">{issue.title}</h3>
                      <p className="text-muted-foreground">{issue.description}</p>
                    </div>
                  ))}
                </div>

                {filterData(commonIssues, searchQuery).length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No issues match your search criteria.</p>
                )}
                
                <div className="mt-6 flex justify-center">
                  <Button className="bg-primary text-primary-foreground">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Full Repair Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dimensions">
            <Card>
              <CardHeader>
                <CardTitle>Dimensions & Clearances</CardTitle>
                <CardDescription>Important measurements for trail planning with your U1700L</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-xl mb-6 bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Unimog U1700L Dimension Diagram</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium">Length</h3>
                    <p>5.35-5.90 meters (depending on configuration)</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium">Width</h3>
                    <p>2.30 meters (without mirrors)</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium">Height</h3>
                    <p>2.70-3.00 meters (standard configuration)</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium">Ground Clearance</h3>
                    <p>450 mm (center)</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium">Track Width</h3>
                    <p>1.63 meters</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium">Minimum Turning Radius</h3>
                    <p>7.5 meters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manuals">
            <Card>
              <CardHeader>
                <CardTitle>Technical Documentation</CardTitle>
                <CardDescription>Official manuals and technical documentation for the U1700L</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-md flex flex-col items-center text-center">
                    <BookOpen className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="font-medium text-lg mb-2">Owner's Manual</h3>
                    <p className="text-muted-foreground mb-4">Complete operator's guide for the U1700L military model</p>
                    <Button>Download PDF</Button>
                  </div>
                  
                  <div className="p-6 border rounded-md flex flex-col items-center text-center">
                    <Wrench className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="font-medium text-lg mb-2">Service Manual</h3>
                    <p className="text-muted-foreground mb-4">Detailed repair and maintenance procedures</p>
                    <Button>Download PDF</Button>
                  </div>
                  
                  <div className="p-6 border rounded-md flex flex-col items-center text-center">
                    <FileText className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="font-medium text-lg mb-2">Parts Catalog</h3>
                    <p className="text-muted-foreground mb-4">Complete parts listing with diagrams</p>
                    <Button>Download PDF</Button>
                  </div>
                  
                  <div className="p-6 border rounded-md flex flex-col items-center text-center">
                    <Ruler className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="font-medium text-lg mb-2">Military Conversion Guide</h3>
                    <p className="text-muted-foreground mb-4">Guide for converting ex-military models to civilian use</p>
                    <Button>Download PDF</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UnimogU1700L;
